import { requireAdminPage } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import {
  FeaturedCertificationsManager,
  type AdminCertOption,
} from "@/components/admin/FeaturedCertificationsManager";
import { Award } from "lucide-react";

export const metadata = {
  title: "Certifications Accueil (3) — Administration",
};

export default async function FeaturedCertificationsPage() {
  await requireAdminPage();
  const supabase = await createClient();

  // 1. Fetch current featured IDs from site_settings
  const { data: settingsData } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "featured_home_certifications")
    .single();

  let initialFeaturedIds: string[] = [];
  if (settingsData?.value && Array.isArray(settingsData.value)) {
    initialFeaturedIds = settingsData.value as string[];
  }

  // 2. Query all certifications from Supabase
  const { data: certsData } = await supabase
    .from("certifications")
    .select("id, name_fr, name_en, issuer, credential_status, skills, issued_on, verification_url, document_media_id, featured, sort_order")
    .order("sort_order", { ascending: true })
    .order("issued_on", { ascending: false });

  const allCertifications: AdminCertOption[] = (certsData ?? []).map((c) => ({
    id: c.id,
    nameFr: c.name_fr || "Certification sans titre",
    nameEn: c.name_en || c.name_fr || "Untitled Certification",
    issuer: c.issuer,
    issuedOn: c.issued_on,
    credentialStatus: c.credential_status || "completed",
    skills: Array.isArray(c.skills) ? c.skills : [],
    hasDocument: Boolean(c.document_media_id),
    verificationUrl: c.verification_url,
  }));

  // If no featured IDs are configured yet, default to the first 3
  if (initialFeaturedIds.length === 0 && allCertifications.length > 0) {
    initialFeaturedIds = allCertifications.slice(0, 3).map((c) => c.id);
  }

  return (
    <div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 pb-6">
        <div className="p-3 bg-surface border border-border/50 rounded-xl">
          <Award className="size-6 text-accent" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
            Sélection des 3 Certifications de l&apos;Accueil
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Définissez les 3 certifications officielles affichées dans la vitrine de la page d&apos;accueil.
          </p>
        </div>
      </div>

      <FeaturedCertificationsManager
        allCertifications={allCertifications}
        initialFeaturedIds={initialFeaturedIds}
      />
    </div>
  );
}

