import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminContext, type AdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";

export const runtime = "nodejs";

const sections = ["projects", "journey", "skills", "certifications", "testimonials", "messages"] as const;
type Section = (typeof sections)[number];
type UntypedClient = SupabaseClient;

class ValidationError extends Error {}

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

function validSection(value: string): value is Section {
  return (sections as readonly string[]).includes(value);
}

function client(context: AdminContext): UntypedClient {
  return context.supabase as unknown as UntypedClient;
}

function text(value: unknown, min = 0, max = 5_000): string | null {
  if (typeof value !== "string") return null;
  const result = value.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  return result.length >= min && result.length <= max ? result : null;
}

function nullableText(value: unknown, max = 5_000): string | null {
  if (value === null || value === undefined || value === "") return null;
  return text(value, 1, max);
}

function number(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 10_000 ? value : null;
}

function date(value: unknown): string | null {
  const result = text(value, 10, 10);
  return result && /^\d{4}-\d{2}-\d{2}$/.test(result) && !Number.isNaN(Date.parse(`${result}T00:00:00Z`)) ? result : null;
}

function slugify(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "contenu";
}

async function uniqueSlug(db: UntypedClient, table: string, value: string, exceptId?: string): Promise<string> {
  const base = slugify(value);
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? base : `${base}-${suffix + 1}`;
    let query = db.from(table).select("id").eq("slug", candidate).limit(1);
    if (exceptId) query = query.neq("id", exceptId);
    const { data } = await query;
    if (!data?.length) return candidate;
  }
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

async function audit(context: AdminContext, action: "create" | "update" | "delete", entityType: string, entityId: string, fields: string[]) {
  await context.supabase.from("audit_logs").insert({ actor_id: context.userId, action, entity_type: entityType, entity_id: entityId, details: { fields } });
}

function revalidate(section: Section) {
  revalidatePath(`/admin/${section}`);
  revalidatePath("/admin/dashboard");
  if (["projects", "journey", "skills", "certifications", "testimonials"].includes(section)) {
    revalidateTag("portfolio");
    revalidateTag("projects");
  }
}

async function getRecords(db: UntypedClient, section: Section) {
  if (section === "projects") {
    const [{ data: projects, error }, { data: translations }, { data: relations }, { data: skills }] = await Promise.all([
      db.from("projects").select("id, github_url, sort_order, created_at").order("sort_order").order("created_at", { ascending: false }),
      db.from("project_translations").select("project_id, locale, title, summary"),
      db.from("project_skills").select("project_id, skill_id"),
      db.from("skills").select("id, name"),
    ]);
    if (error) throw error;
    const names = new Map((skills ?? []).map((item: { id: string; name: string }) => [item.id, item.name]));
    return (projects ?? []).map((project: { id: string; github_url: string | null; sort_order: number; created_at: string }) => {
      const values = (translations ?? []).filter((item: { project_id: string }) => item.project_id === project.id);
      const fr = values.find((item: { locale: string }) => item.locale === "fr");
      const en = values.find((item: { locale: string }) => item.locale === "en");
      return { ...project, title: fr?.title ?? en?.title ?? "Sans titre", description_fr: fr?.summary ?? "", description_en: en?.summary ?? "", technologies: (relations ?? []).filter((item: { project_id: string }) => item.project_id === project.id).map((item: { skill_id: string }) => names.get(item.skill_id)).filter(Boolean) };
    });
  }

  if (section === "journey") {
    const [{ data: experiences, error: experienceError }, { data: education, error: educationError }] = await Promise.all([
      db.from("experiences").select("id, title_fr, title_en, organization, summary_fr, summary_en, started_on, ended_on, sort_order, created_at").order("started_on", { ascending: false }),
      db.from("education").select("id, title_fr, title_en, institution, summary_fr, summary_en, started_on, ended_on, sort_order, created_at").order("started_on", { ascending: false }),
    ]);
    if (experienceError || educationError) throw experienceError ?? educationError;
    const records: Array<Record<string, unknown>> = [
      ...(experiences ?? []).map((item: Record<string, unknown>) => ({ ...item, kind: "experience", organization: item.organization })),
      ...(education ?? []).map((item: Record<string, unknown>) => ({ ...item, kind: "education", organization: item.institution })),
    ];
    return records.sort((left, right) => String(right.started_on).localeCompare(String(left.started_on)));
  }

  if (section === "skills") {
    const [{ data: skills, error }, { data: categories }] = await Promise.all([
      db.from("skills").select("id, name, category_id, level, sort_order, created_at").order("sort_order").order("name"),
      db.from("skill_categories").select("id, name_fr").order("sort_order").order("name_fr"),
    ]);
    if (error) throw error;
    const names = new Map((categories ?? []).map((item: { id: string; name_fr: string }) => [item.id, item.name_fr]));
    return { records: (skills ?? []).map((item: { category_id: string | null }) => ({ ...item, category: item.category_id ? names.get(item.category_id) ?? "Sans catégorie" : "Sans catégorie" })), categories: categories ?? [] };
  }

  if (section === "certifications") {
    const { data, error } = await db.from("certifications").select("id, name_fr, name_en, issuer, issued_on, description_fr, description_en, document_media_id, created_at").order("issued_on", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  if (section === "testimonials") {
    const { data, error } = await db.from("testimonials").select("id, first_name, last_name, job_title, organization, message, rating, locale, status, consent_to_publish, created_at").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  const { data, error } = await db.from("contact_messages").select("id, sender_name, sender_email, subject, message, created_at, status, read_at").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

async function findOrCreateCategory(db: UntypedClient, name: string) {
  const { data: existing, error: selectError } = await db.from("skill_categories").select("id").ilike("name_fr", name).limit(1).maybeSingle();
  if (selectError) throw selectError;
  if (existing) return existing.id as string;
  const slug = await uniqueSlug(db, "skill_categories", name);
  const { data, error } = await db.from("skill_categories").insert({ slug, name_fr: name, name_en: name, publication_status: "published", sort_order: 0 }).select("id").single();
  if (error || !data) throw error ?? new Error("Création de la catégorie impossible.");
  return data.id as string;
}

async function deleteUnusedCertificateDocument(db: UntypedClient, mediaId: string) {
  const { count, error: referenceError } = await db.from("certifications")
    .select("id", { count: "exact", head: true })
    .eq("document_media_id", mediaId);
  if (referenceError || (count ?? 0) > 0) return;

  const { data: media, error: mediaError } = await db.from("media_assets")
    .select("bucket_id, storage_path")
    .eq("id", mediaId)
    .maybeSingle();
  if (mediaError || !media) return;

  const { error: storageError } = await db.storage.from(media.bucket_id).remove([media.storage_path]);
  if (storageError) throw storageError;
  const { error: metadataError } = await db.from("media_assets").delete().eq("id", mediaId);
  if (metadataError) throw metadataError;
}

async function saveProject(db: UntypedClient, context: AdminContext, id: string | null, input: Record<string, unknown>) {
  const title = text(input.title, 1, 180);
  const descriptionFr = text(input.description_fr, 1, 1_200);
  const descriptionEn = nullableText(input.description_en, 1_200);
  const githubUrl = nullableText(input.github_url, 500);
  const sortOrder = number(input.sort_order);
  if (!title) throw new ValidationError("Le titre est obligatoire.");
  if (!descriptionFr) throw new ValidationError("La description française est obligatoire.");
  if (input.description_en !== undefined && input.description_en !== null && input.description_en !== "" && !descriptionEn) {
    throw new ValidationError("La description anglaise est invalide.");
  }
  if (githubUrl && !/^https:\/\/github\.com\//.test(githubUrl)) throw new ValidationError("Le lien GitHub est invalide.");
  if (sortOrder === null) throw new ValidationError("L’ordre d’affichage doit être un nombre valide.");
  if (!Array.isArray(input.technologies)) throw new ValidationError("Les technologies sont invalides.");
  const technologies = [...new Set(input.technologies.map((value) => text(value, 1, 120)).filter((value): value is string => Boolean(value)))].slice(0, 30);
  const technologyMatches = await Promise.all(technologies.map(async (technology) => {
    const { data, error } = await db.from("skills").select("id").ilike("name", technology).limit(1).maybeSingle();
    if (error) throw error;
    return { technology, id: data?.id as string | undefined };
  }));
  const unknownTechnologies = technologyMatches.filter((item) => !item.id).map((item) => item.technology);
  if (unknownTechnologies.length) throw new ValidationError(`Ajoutez d’abord ces compétences : ${unknownTechnologies.join(", ")}.`);
  const technologyIds = technologyMatches.flatMap((item) => item.id ? [item.id] : []);
  const slug = await uniqueSlug(db, "projects", title, id ?? undefined);
  // A project can only become public after both translations have been stored.
  // Create and update it as a draft first, then publish after the upsert below.
  const projectPayload = { slug, github_url: githubUrl, sort_order: sortOrder, source_kind: "personal", publication_status: "draft", featured: false, categories: [], updated_by: context.userId, ...(id ? {} : { created_by: context.userId, published_at: null }) };
  const result = id
    ? await db.from("projects").update(projectPayload).eq("id", id).select("id").single()
    : await db.from("projects").insert(projectPayload).select("id").single();
  if (result.error || !result.data) throw result.error ?? new Error("Projet impossible à enregistrer.");
  const projectId = result.data.id as string;
  /*
   { project_id: projectId, locale: "fr", title, summary: descriptionFr, problem: descriptionFr, solution: descriptionFr, objectives: [descriptionFr], architecture: ["À compléter"], results: ["À compléter"], review_status: "validated" },
   { project_id: projectId, locale: "en", title, summary: descriptionEn, problem: descriptionEn, solution: descriptionEn, objectives: [descriptionEn], architecture: ["To be completed"], results: ["To be completed"], review_status: "validated" },
 ];
  */
  const isComplete = Boolean(descriptionEn);
  const translationRows = [
    { project_id: projectId, locale: "fr", title, summary: descriptionFr, problem: descriptionFr, solution: descriptionFr, objectives: [descriptionFr], architecture: [descriptionFr], results: [descriptionFr], review_status: isComplete ? "validated" : "draft" },
    { project_id: projectId, locale: "en", title, summary: descriptionEn ?? "", problem: descriptionEn, solution: descriptionEn, objectives: descriptionEn ? [descriptionEn] : [], architecture: descriptionEn ? [descriptionEn] : [], results: descriptionEn ? [descriptionEn] : [], review_status: isComplete ? "validated" : "draft" },
  ];
  const { error: translationError } = await db.from("project_translations").upsert(translationRows, { onConflict: "project_id,locale" });
  if (translationError) throw translationError;
  /*
 if (publishError) throw publishError;
 const ids: string[] = [];
 const unknownTechnologies: string[] = [];
 for (const technology of technologies) {
   const { data: existing } = await db.from("skills").select("id").ilike("name", technology).limit(1).maybeSingle();
   if (existing?.id) ids.push(existing.id as string);
   else unknownTechnologies.push(technology);
 }
 if (unknownTechnologies.length) throw new Error(`Ajoutez d’abord ces compétences : ${unknownTechnologies.join(", ")}.`);
 await db.from("project_skills").delete().eq("project_id", projectId);
 if (ids.length) {
   const { error } = await db.from("project_skills").insert(ids.map((skillId) => ({ project_id: projectId, skill_id: skillId })));
  */
  if (isComplete) {
    const { error: publishError } = await db.from("projects").update({ publication_status: "published", published_at: new Date().toISOString() }).eq("id", projectId);
    if (publishError) throw publishError;
  }
  const { error: relationDeleteError } = await db.from("project_skills").delete().eq("project_id", projectId);
  if (relationDeleteError) throw relationDeleteError;
  if (technologyIds.length) {
    const { error } = await db.from("project_skills").insert(technologyIds.map((skillId) => ({ project_id: projectId, skill_id: skillId })));
    if (error) throw error;
  }
  await audit(context, id ? "update" : "create", "projects", projectId, ["title", "description_fr", "description_en", "github_url", "technologies", "sort_order"]);
  return projectId;
}

async function saveJourney(db: UntypedClient, context: AdminContext, id: string | null, input: Record<string, unknown>) {
  const kind = input.kind === "experience" || input.kind === "education" ? input.kind : null;
  const titleFr = text(input.title_fr, 1, 180);
  const titleEn = text(input.title_en, 1, 180);
  const organization = text(input.organization, 1, 180);
  const summaryFr = text(input.summary_fr, 1, 1_600);
  const summaryEn = text(input.summary_en, 1, 1_600);
  const startedOn = date(input.started_on);
  const endedOn = input.ended_on ? date(input.ended_on) : null;
  const sortOrder = number(input.sort_order);
  if (!kind || !titleFr || !titleEn || !organization || !summaryFr || !summaryEn || !startedOn || sortOrder === null || (input.ended_on && !endedOn) || (endedOn && endedOn < startedOn)) throw new Error("Vérifiez les champs du parcours.");
  const table = kind === "experience" ? "experiences" : "education";
  let previousTable: "experiences" | "education" | null = null;
  if (id) {
    const [{ data: experience }, { data: education }] = await Promise.all([
      db.from("experiences").select("id").eq("id", id).maybeSingle(),
      db.from("education").select("id").eq("id", id).maybeSingle(),
    ]);
    previousTable = experience ? "experiences" : education ? "education" : null;
    if (!previousTable) throw new Error("Parcours introuvable.");
  }
  const slug = await uniqueSlug(db, table, titleFr, previousTable === table ? id ?? undefined : undefined);
  const payload = kind === "experience"
    ? { slug, title_fr: titleFr, title_en: titleEn, organization, summary_fr: summaryFr, summary_en: summaryEn, details_fr: [summaryFr], details_en: [summaryEn], started_on: startedOn, ended_on: endedOn, publication_status: "published", sort_order: sortOrder }
    : { slug, title_fr: titleFr, title_en: titleEn, institution: organization, summary_fr: summaryFr, summary_en: summaryEn, started_on: startedOn, ended_on: endedOn, publication_status: "published", sort_order: sortOrder };
  const values = payload as Record<string, unknown>;
  const result = id && previousTable === table
    ? await db.from(table).update(values).eq("id", id).select("id").single()
    : await db.from(table).insert(values).select("id").single();
  if (result.error || !result.data) throw result.error ?? new Error("Parcours impossible à enregistrer.");
  const recordId = result.data.id as string;
  const timelinePayload = { entry_type: kind, title_fr: titleFr, title_en: titleEn, description_fr: summaryFr, description_en: summaryEn, event_date: startedOn, related_entity_type: table, related_entity_id: recordId, publication_status: "published", sort_order: sortOrder };
  const timelineOwnerId = id && previousTable !== table ? id : recordId;
  const { data: timeline } = await db.from("timeline_entries").select("id").eq("related_entity_id", timelineOwnerId).maybeSingle();
  const timelineResult = timeline ? await db.from("timeline_entries").update(timelinePayload).eq("id", timeline.id) : await db.from("timeline_entries").insert(timelinePayload);
  if (timelineResult.error) {
    if (id && previousTable !== table) await db.from(table).delete().eq("id", recordId);
    throw timelineResult.error;
  }
  if (id && previousTable && previousTable !== table) {
    const { error: deleteError } = await db.from(previousTable).delete().eq("id", id);
    if (deleteError) throw deleteError;
  }
  await audit(context, id ? "update" : "create", table, recordId, ["kind", "title_fr", "title_en", "organization", "summary_fr", "summary_en", "started_on", "ended_on", "sort_order"]);
  return recordId;
}

async function saveSkill(db: UntypedClient, context: AdminContext, id: string | null, input: Record<string, unknown>) {
  const name = text(input.name, 1, 120);
  const category = text(input.category, 1, 120);
  const level = input.level === "beginner" || input.level === "intermediate" || input.level === "advanced" ? input.level : null;
  const sortOrder = number(input.sort_order);
  if (!name || !category || !level || sortOrder === null) throw new Error("Vérifiez les champs de la compétence.");
  const categoryId = await findOrCreateCategory(db, category);
  const slug = await uniqueSlug(db, "skills", name, id ?? undefined);
  const payload = { slug, name, category_id: categoryId, group_key: slugify(category), level, learning_status: "active", publication_status: "published", sort_order: sortOrder };
  const result = id ? await db.from("skills").update(payload).eq("id", id).select("id").single() : await db.from("skills").insert(payload).select("id").single();
  if (result.error || !result.data) throw result.error ?? new Error("Compétence impossible à enregistrer.");
  const recordId = result.data.id as string;
  await audit(context, id ? "update" : "create", "skills", recordId, ["name", "category", "level", "sort_order"]);
  return recordId;
}

async function saveCertification(db: UntypedClient, context: AdminContext, id: string | null, input: Record<string, unknown>) {
  const title = text(input.title, 1, 180);
  const issuer = nullableText(input.issuer, 180);
  const issuedOn = date(input.issued_on);
  const descriptionFr = text(input.description_fr, 1, 1_600);
  const descriptionEn = nullableText(input.description_en, 1_600);
  const documentMediaId = nullableText(input.document_media_id, 64);
  if (!title || !issuedOn || !descriptionFr || (input.description_en !== undefined && input.description_en !== null && input.description_en !== "" && !descriptionEn) || (documentMediaId && !/^[0-9a-f-]{36}$/i.test(documentMediaId))) throw new ValidationError("Vérifiez les champs de la certification.");
  const previousDocument = id
    ? await db.from("certifications").select("document_media_id").eq("id", id).maybeSingle()
    : { data: null, error: null };
  if (previousDocument.error) throw previousDocument.error;
  const previousDocumentMediaId = previousDocument.data?.document_media_id as string | null | undefined;
  if (documentMediaId) {
    const { data: media, error: mediaError } = await db.from("media_assets")
      .select("id")
      .eq("id", documentMediaId)
      .eq("bucket_id", "portfolio-media")
      .eq("mime_type", "application/pdf")
      .maybeSingle();
    if (mediaError || !media) throw new Error("Le PDF sélectionné est introuvable.");
    const { error: publishError } = await db.from("media_assets").update({ publication_status: "published" }).eq("id", documentMediaId);
    if (publishError) throw publishError;
  }
  const slug = await uniqueSlug(db, "certifications", title, id ?? undefined);
  const payload = { slug, name_fr: title, name_en: title, issuer, issued_on: issuedOn, description_fr: descriptionFr, description_en: descriptionEn, document_media_id: documentMediaId, credential_status: "completed", publication_status: "published", skills: [], sort_order: 0 };
  const result = id ? await db.from("certifications").update(payload).eq("id", id).select("id").single() : await db.from("certifications").insert(payload).select("id").single();
  if (result.error || !result.data) {
    if (documentMediaId && documentMediaId !== previousDocumentMediaId) {
      try {
        await deleteUnusedCertificateDocument(db, documentMediaId);
      } catch (cleanupError) {
        console.error("Certification document rollback failed", { error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError) });
      }
    }
    throw result.error ?? new Error("Certification impossible à enregistrer.");
  }
  const recordId = result.data.id as string;
  if (previousDocumentMediaId && previousDocumentMediaId !== documentMediaId) {
    try {
      await deleteUnusedCertificateDocument(db, previousDocumentMediaId);
    } catch (cleanupError) {
      console.error("Certification document cleanup failed", { certificationId: recordId, error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError) });
    }
  }
  await audit(context, id ? "update" : "create", "certifications", recordId, ["title", "issuer", "issued_on", "description_fr", "description_en", "document_media_id"]);
  return recordId;
}

async function createRecord(context: AdminContext, section: Section, input: Record<string, unknown>) {
  const db = client(context);
  if (section === "projects") return saveProject(db, context, null, input);
  if (section === "journey") return saveJourney(db, context, null, input);
  if (section === "skills") return saveSkill(db, context, null, input);
  if (section === "certifications") return saveCertification(db, context, null, input);
  throw new Error("Cette section ne permet pas d’ajout.");
}

async function updateRecord(context: AdminContext, section: Section, id: string, input: Record<string, unknown>) {
  const db = client(context);
  if (section === "projects") return saveProject(db, context, id, input);
  if (section === "journey") return saveJourney(db, context, id, input);
  if (section === "skills") return saveSkill(db, context, id, input);
  if (section === "certifications") return saveCertification(db, context, id, input);
  if (section === "testimonials") {
    const status = input.status === "pending" || input.status === "approved" || input.status === "rejected" ? input.status : null;
    if (!status) throw new Error("Statut d’avis invalide.");
    
    const { data: testimonial, error: fetchError } = await db.from("testimonials").select("*").eq("id", id).maybeSingle();
    if (fetchError || !testimonial) throw fetchError ?? new Error("Avis introuvable.");

    if (status === "approved" && testimonial.status !== "approved") {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new Error("Clé API Groq manquante.");

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "You are a bilingual language classifier and translator. Analyze the following testimonial message. First, detect if it's in French ('fr') or English ('en'). Second, translate the message to the OTHER language. Return ONLY a valid JSON object strictly matching this format: {\"detected_lang\":\"fr\",\"translated_lang\":\"en\",\"translated_message\":\"...\"}. Do not wrap it in markdown." },
            { role: "user", content: testimonial.message },
          ],
        }),
        signal: AbortSignal.timeout(20_000),
      });

      if (!response.ok) throw new Error("Erreur de l'API de traduction.");
      const payload = await response.json();
      const content = payload.choices?.[0]?.message?.content;
      if (!content) throw new Error("Réponse de traduction invalide.");
      
      const parsed = JSON.parse(content) as { detected_lang: string; translated_lang: string; translated_message: string };
      
      const { error: updateError } = await db.from("testimonials").update({ 
        status, 
        consent_to_publish: true, 
        moderated_by: context.userId, 
        moderated_at: new Date().toISOString(),
        locale: parsed.detected_lang === "en" ? "en" : "fr"
      }).eq("id", id);
      if (updateError) throw updateError;

      const { error: insertError } = await db.from("testimonials").insert({
        first_name: testimonial.first_name,
        last_name: testimonial.last_name,
        job_title: testimonial.job_title,
        organization: testimonial.organization,
        message: parsed.translated_message,
        rating: testimonial.rating,
        locale: parsed.translated_lang === "fr" ? "fr" : "en",
        status: "approved",
        consent_to_publish: true,
        fingerprint_hash: testimonial.fingerprint_hash,
        moderated_by: context.userId,
        moderated_at: new Date().toISOString(),
        created_at: testimonial.created_at
      });
      if (insertError) throw insertError;
    } else {
      const { error } = await db.from("testimonials").update({ 
        status, 
        consent_to_publish: status === "approved", 
        moderated_by: context.userId, 
        moderated_at: new Date().toISOString() 
      }).eq("id", id);
      if (error) throw error;
    }

    await audit(context, "update", "testimonials", id, ["status"]);
    return id;
  }
  if (section === "messages") {
    const { error } = await db.from("contact_messages").update({ status: "read", read_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
    await audit(context, "update", "contact_messages", id, ["status"]);
    return id;
  }
  throw new Error("Modification indisponible.");
}

async function deleteRecord(context: AdminContext, section: Section, id: string) {
  const db = client(context);
  const table = section === "projects" ? "projects" : section === "skills" ? "skills" : section === "certifications" ? "certifications" : section === "testimonials" ? "testimonials" : section === "journey" ? null : null;
  if (!table && section !== "journey") throw new Error("Suppression indisponible pour cette section.");
  if (section === "journey") {
    const [{ data: experience }, { data: education }] = await Promise.all([db.from("experiences").select("id").eq("id", id).maybeSingle(), db.from("education").select("id").eq("id", id).maybeSingle()]);
    const journeyTable = experience ? "experiences" : education ? "education" : null;
    if (!journeyTable) throw new Error("Parcours introuvable.");
    const { error } = await db.from(journeyTable).delete().eq("id", id);
    if (error) throw error;
    await db.from("timeline_entries").delete().eq("related_entity_id", id);
    await audit(context, "delete", journeyTable, id, []);
    return;
  }
  if (section === "certifications") {
    const { data: certification, error: certificationError } = await db.from("certifications")
      .select("document_media_id")
      .eq("id", id)
      .maybeSingle();
    if (certificationError || !certification) throw certificationError ?? new Error("Certification introuvable.");
    const { error } = await db.from("certifications").delete().eq("id", id);
    if (error) throw error;
    if (certification.document_media_id) {
      try {
        await deleteUnusedCertificateDocument(db, certification.document_media_id);
      } catch (cleanupError) {
        console.error("Certification document cleanup failed", { certificationId: id, error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError) });
      }
    }
    await audit(context, "delete", "certifications", id, []);
    return;
  }
  const { error } = await db.from(table!).delete().eq("id", id);
  if (error) throw error;
  await audit(context, "delete", table!, id, []);
}

async function requireContext() {
  const context = await getAdminContext();
  return context;
}

export async function GET(_: NextRequest, routeContext: { params: Promise<{ section: string }> }) {
  const context = await requireContext();
  if (!context) return fail("Non autorisé.", 401);
  const { section } = await routeContext.params;
  if (!validSection(section)) return fail("Section inconnue.", 404);
  try {
    return NextResponse.json(await getRecords(client(context), section), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin workspace loading failed", { section, error: error instanceof Error ? error.message : String(error) });
    return fail("Les données ne peuvent pas être chargées.", 500);
  }
}

async function mutate(request: NextRequest, routeContext: { params: Promise<{ section: string }> }, mode: "create" | "update" | "delete") {
  if (!acceptsSameOriginMutation(request)) return fail("Requête refusée.", 403);
  const context = await requireContext();
  if (!context) return fail("Non autorisé.", 401);
  const { section } = await routeContext.params;
  if (!validSection(section)) return fail("Section inconnue.", 404);
  const body = await readJsonObject(request);
  const id = text(body?.id, 36, 36);
  const values = body?.values && typeof body.values === "object" && !Array.isArray(body.values) ? body.values as Record<string, unknown> : {};
  try {
    if (mode === "create") await createRecord(context, section, values);
    else if (mode === "update" && id) await updateRecord(context, section, id, values);
    else if (mode === "delete" && id) await deleteRecord(context, section, id);
    else return fail("Requête invalide.", 422);
    revalidate(section);
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin workspace mutation failed", { section, mode, error: error instanceof Error ? error.message : String(error) });
    return fail(error instanceof ValidationError ? error.message : "L’opération n’a pas pu être enregistrée.", error instanceof ValidationError ? 422 : 500);
  }
}

export async function POST(request: NextRequest, routeContext: { params: Promise<{ section: string }> }) { return mutate(request, routeContext, "create"); }
export async function PATCH(request: NextRequest, routeContext: { params: Promise<{ section: string }> }) { return mutate(request, routeContext, "update"); }
export async function DELETE(request: NextRequest, routeContext: { params: Promise<{ section: string }> }) { return mutate(request, routeContext, "delete"); }
