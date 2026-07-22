export type AdminFieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "date" | "datetime" | "url" | "json";

export type AdminFieldOption = { value: string; label: string };

export type AdminField = {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  nullable?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  options?: AdminFieldOption[];
  help?: string;
};

export type AdminResourceConfig = {
  key: string;
  table: string;
  primaryKey: string;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  searchFields: string[];
  listFields: string[];
  fields: AdminField[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  defaultValues?: Record<string, unknown>;
};

const workflowOptions: AdminFieldOption[] = [
  { value: "draft", label: "Brouillon" },
  { value: "review_required", label: "Relecture requise" },
  { value: "scheduled", label: "Programmé" },
  { value: "published", label: "Publié" },
  { value: "unpublished", label: "Dépublié" },
  { value: "archived", label: "Archivé" },
  { value: "error", label: "Erreur" },
];

const immediateWorkflowOptions = workflowOptions.filter((option) => option.value !== "scheduled");

const reviewOptions: AdminFieldOption[] = [
  { value: "draft", label: "Brouillon" },
  { value: "review_required", label: "Relecture requise" },
  { value: "validated", label: "Validé" },
];

const localeOptions: AdminFieldOption[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
];

const commonPublicationField: AdminField = {
  name: "publication_status",
  label: "Statut éditorial",
  type: "select",
  required: true,
  options: immediateWorkflowOptions,
};

const scheduledPublicationField: AdminField = {
  ...commonPublicationField,
  options: workflowOptions,
};

export const adminResources = {
  projects: {
    key: "projects",
    table: "projects",
    primaryKey: "id",
    label: "Projets",
    singular: "projet",
    description: "Métadonnées, publication et liens des projets.",
    titleField: "slug",
    searchFields: ["slug", "repository_full_name", "primary_language"],
    listFields: ["slug", "source_kind", "publication_status", "featured", "updated_at"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, maxLength: 100 },
      { name: "source_kind", label: "Origine", type: "select", required: true, options: [
        { value: "academic", label: "Académique" }, { value: "personal", label: "Personnel" },
        { value: "professional", label: "Professionnel" }, { value: "open_source", label: "Open source" },
      ] },
      scheduledPublicationField,
      { name: "featured", label: "Mis en avant", type: "checkbox" },
      { name: "categories", label: "Domaines (tableau JSON)", type: "json", required: true },
      { name: "sort_order", label: "Ordre", type: "number", required: true },
      { name: "github_url", label: "URL GitHub", type: "url", nullable: true, maxLength: 500 },
      { name: "demo_url", label: "URL de démonstration", type: "url", nullable: true, maxLength: 500 },
      { name: "repository_full_name", label: "Dépôt owner/name", type: "text", nullable: true, maxLength: 200 },
      { name: "primary_language", label: "Langage principal", type: "text", nullable: true, maxLength: 100 },
      { name: "published_at", label: "Date de publication", type: "datetime", nullable: true },
    ],
    canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { source_kind: "personal", publication_status: "draft", featured: false, categories: [], sort_order: 0 },
  },
  "project-translations": {
    key: "project-translations",
    table: "project_translations",
    primaryKey: "id",
    label: "Traductions projets",
    singular: "traduction de projet",
    description: "Contenu français et anglais, comparé et validé manuellement.",
    titleField: "title",
    searchFields: ["title", "summary", "locale"],
    listFields: ["title", "locale", "review_status", "updated_at"],
    fields: [
      { name: "project_id", label: "ID du projet", type: "text", required: true },
      { name: "locale", label: "Langue", type: "select", required: true, options: localeOptions },
      { name: "title", label: "Titre", type: "text", required: true, maxLength: 180 },
      { name: "subtitle", label: "Sous-titre", type: "text", nullable: true, maxLength: 240 },
      { name: "summary", label: "Résumé", type: "textarea", required: true, maxLength: 1200 },
      { name: "problem", label: "Problème traité", type: "textarea", nullable: true, maxLength: 3000 },
      { name: "objectives", label: "Objectifs (tableau JSON)", type: "json", required: true },
      { name: "solution", label: "Solution", type: "textarea", nullable: true, maxLength: 5000 },
      { name: "architecture", label: "Architecture (tableau JSON)", type: "json", required: true },
      { name: "results", label: "Résultats (tableau JSON)", type: "json", required: true },
      { name: "seo_title", label: "Titre SEO", type: "text", nullable: true, maxLength: 70 },
      { name: "seo_description", label: "Description SEO", type: "textarea", nullable: true, maxLength: 170 },
      { name: "review_status", label: "Validation", type: "select", required: true, options: reviewOptions },
    ],
    canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { locale: "fr", objectives: [], architecture: [], results: [], review_status: "draft" },
  },
  skills: {
    key: "skills", table: "skills", primaryKey: "id", label: "Compétences", singular: "compétence",
    description: "Compétences factuelles, regroupées sans pourcentage arbitraire.", titleField: "name",
    searchFields: ["name", "slug", "group_key"], listFields: ["name", "group_key", "learning_status", "publication_status"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, maxLength: 100 },
      { name: "name", label: "Nom", type: "text", required: true, maxLength: 120 },
      { name: "group_key", label: "Groupe", type: "text", required: true, maxLength: 100 },
      { name: "description_fr", label: "Description FR", type: "textarea", nullable: true, maxLength: 800 },
      { name: "description_en", label: "Description EN", type: "textarea", nullable: true, maxLength: 800 },
      { name: "learning_status", label: "Pratique", type: "select", required: true, options: [
        { value: "active", label: "Active" }, { value: "learning", label: "En apprentissage" }, { value: "historical", label: "Historique" },
      ] },
      commonPublicationField,
      { name: "sort_order", label: "Ordre", type: "number", required: true },
      { name: "last_used_on", label: "Dernière utilisation", type: "date", nullable: true },
    ], canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { learning_status: "active", publication_status: "draft", sort_order: 0 },
  },
  certifications: {
    key: "certifications", table: "certifications", primaryKey: "id", label: "Certifications", singular: "certification",
    description: "Certifications, formations et preuves vérifiables.", titleField: "name_fr",
    searchFields: ["name_fr", "name_en", "issuer", "slug"], listFields: ["name_fr", "issuer", "credential_status", "publication_status"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, maxLength: 100 },
      { name: "name_fr", label: "Nom FR", type: "text", required: true, maxLength: 180 },
      { name: "name_en", label: "Nom EN", type: "text", required: true, maxLength: 180 },
      { name: "issuer", label: "Organisme", type: "text", nullable: true, maxLength: 180 },
      { name: "credential_status", label: "État", type: "select", required: true, options: [
        { value: "completed", label: "Obtenue" }, { value: "in_progress", label: "En cours" }, { value: "expired", label: "Expirée" },
      ] },
      commonPublicationField,
      { name: "issued_on", label: "Date d'obtention", type: "date", nullable: true },
      { name: "expires_on", label: "Expiration", type: "date", nullable: true },
      { name: "verification_url", label: "Lien de vérification", type: "url", nullable: true, maxLength: 500 },
      { name: "skills", label: "Compétences (tableau JSON)", type: "json", required: true },
      { name: "sort_order", label: "Ordre", type: "number", required: true },
    ], canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { credential_status: "completed", publication_status: "draft", skills: [], sort_order: 0 },
  },
  experiences: {
    key: "experiences", table: "experiences", primaryKey: "id", label: "Expériences", singular: "expérience",
    description: "Expériences professionnelles et détails validés.", titleField: "title_fr",
    searchFields: ["title_fr", "title_en", "organization", "slug"], listFields: ["title_fr", "organization", "started_on", "publication_status"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, maxLength: 100 },
      { name: "title_fr", label: "Titre FR", type: "text", required: true, maxLength: 180 },
      { name: "title_en", label: "Titre EN", type: "text", required: true, maxLength: 180 },
      { name: "organization", label: "Organisation", type: "text", required: true, maxLength: 180 },
      { name: "location_fr", label: "Lieu FR", type: "text", nullable: true, maxLength: 180 },
      { name: "location_en", label: "Lieu EN", type: "text", nullable: true, maxLength: 180 },
      { name: "summary_fr", label: "Résumé FR", type: "textarea", required: true, maxLength: 1600 },
      { name: "summary_en", label: "Résumé EN", type: "textarea", required: true, maxLength: 1600 },
      { name: "details_fr", label: "Détails FR (tableau JSON)", type: "json", required: true },
      { name: "details_en", label: "Détails EN (tableau JSON)", type: "json", required: true },
      { name: "started_on", label: "Début", type: "date", required: true },
      { name: "ended_on", label: "Fin", type: "date", nullable: true },
      commonPublicationField,
      { name: "sort_order", label: "Ordre", type: "number", required: true },
    ], canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { details_fr: [], details_en: [], publication_status: "draft", sort_order: 0 },
  },
  education: {
    key: "education", table: "education", primaryKey: "id", label: "Formations", singular: "formation",
    description: "Cursus et diplômes validés.", titleField: "title_fr",
    searchFields: ["title_fr", "title_en", "institution", "slug"], listFields: ["title_fr", "institution", "started_on", "publication_status"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, maxLength: 100 },
      { name: "title_fr", label: "Titre FR", type: "text", required: true, maxLength: 180 },
      { name: "title_en", label: "Titre EN", type: "text", required: true, maxLength: 180 },
      { name: "institution", label: "Établissement", type: "text", required: true, maxLength: 180 },
      { name: "location_fr", label: "Lieu FR", type: "text", nullable: true, maxLength: 180 },
      { name: "location_en", label: "Lieu EN", type: "text", nullable: true, maxLength: 180 },
      { name: "summary_fr", label: "Résumé FR", type: "textarea", nullable: true, maxLength: 1600 },
      { name: "summary_en", label: "Résumé EN", type: "textarea", nullable: true, maxLength: 1600 },
      { name: "started_on", label: "Début", type: "date", required: true },
      { name: "ended_on", label: "Fin", type: "date", nullable: true },
      commonPublicationField,
      { name: "sort_order", label: "Ordre", type: "number", required: true },
    ], canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { publication_status: "draft", sort_order: 0 },
  },
  timeline: {
    key: "timeline", table: "timeline_entries", primaryKey: "id", label: "Timeline", singular: "entrée",
    description: "Événements chronologiques publics.", titleField: "title_fr",
    searchFields: ["title_fr", "title_en", "entry_type"], listFields: ["title_fr", "entry_type", "event_date", "publication_status"],
    fields: [
      { name: "entry_type", label: "Type", type: "select", required: true, options: [
        { value: "education", label: "Formation" }, { value: "experience", label: "Expérience" }, { value: "project", label: "Projet" },
        { value: "certification", label: "Certification" }, { value: "event", label: "Événement" }, { value: "responsibility", label: "Responsabilité" },
      ] },
      { name: "title_fr", label: "Titre FR", type: "text", required: true, maxLength: 180 },
      { name: "title_en", label: "Titre EN", type: "text", required: true, maxLength: 180 },
      { name: "description_fr", label: "Description FR", type: "textarea", required: true, maxLength: 2000 },
      { name: "description_en", label: "Description EN", type: "textarea", required: true, maxLength: 2000 },
      { name: "event_date", label: "Date", type: "date", required: true },
      { name: "related_entity_type", label: "Type lié", type: "text", nullable: true, maxLength: 80 },
      { name: "related_entity_id", label: "ID lié", type: "text", nullable: true },
      commonPublicationField,
      { name: "sort_order", label: "Ordre", type: "number", required: true },
    ], canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { entry_type: "event", publication_status: "draft", sort_order: 0 },
  },
  now: {
    key: "now", table: "now_entries", primaryKey: "id", label: "Maintenant", singular: "activité",
    description: "Activité actuelle et date de mise à jour.", titleField: "title_fr",
    searchFields: ["title_fr", "title_en", "entry_kind"], listFields: ["title_fr", "entry_kind", "effective_on", "publication_status"],
    fields: [
      { name: "title_fr", label: "Titre FR", type: "text", required: true, maxLength: 180 },
      { name: "title_en", label: "Titre EN", type: "text", required: true, maxLength: 180 },
      { name: "content_fr", label: "Contenu FR", type: "textarea", required: true, maxLength: 3000 },
      { name: "content_en", label: "Contenu EN", type: "textarea", required: true, maxLength: 3000 },
      { name: "entry_kind", label: "Type", type: "select", required: true, options: [
        { value: "project", label: "Projet" }, { value: "learning", label: "Apprentissage" },
        { value: "objective", label: "Objectif" }, { value: "activity", label: "Activité" },
      ] },
      { name: "effective_on", label: "Date de référence", type: "date", required: true },
      commonPublicationField,
      { name: "sort_order", label: "Ordre", type: "number", required: true },
    ], canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { entry_kind: "activity", publication_status: "draft", sort_order: 0 },
  },
  blog: {
    key: "blog", table: "blog_posts", primaryKey: "id", label: "Blog", singular: "article",
    description: "Workflow éditorial des articles. Le contenu traduit se gère séparément.", titleField: "slug",
    searchFields: ["slug"], listFields: ["slug", "publication_status", "featured", "published_at"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, maxLength: 120 },
      { name: "category_id", label: "ID catégorie", type: "text", nullable: true },
      scheduledPublicationField,
      { name: "featured", label: "Mis en avant", type: "checkbox" },
      { name: "published_at", label: "Publication", type: "datetime", nullable: true },
    ], canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { publication_status: "draft", featured: false },
  },
  "blog-translations": {
    key: "blog-translations", table: "blog_post_translations", primaryKey: "id", label: "Traductions blog", singular: "traduction d'article",
    description: "Markdown bilingue relu avant publication.", titleField: "title",
    searchFields: ["title", "excerpt", "locale"], listFields: ["title", "locale", "review_status", "updated_at"],
    fields: [
      { name: "blog_post_id", label: "ID de l'article", type: "text", required: true },
      { name: "locale", label: "Langue", type: "select", required: true, options: localeOptions },
      { name: "title", label: "Titre", type: "text", required: true, maxLength: 180 },
      { name: "excerpt", label: "Extrait", type: "textarea", required: true, maxLength: 400 },
      { name: "markdown", label: "Markdown", type: "textarea", required: true, maxLength: 100000 },
      { name: "seo_title", label: "Titre SEO", type: "text", nullable: true, maxLength: 70 },
      { name: "seo_description", label: "Description SEO", type: "textarea", nullable: true, maxLength: 170 },
      { name: "review_status", label: "Validation", type: "select", required: true, options: reviewOptions },
    ], canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { locale: "fr", review_status: "draft" },
  },
  categories: {
    key: "categories", table: "categories", primaryKey: "id", label: "Catégories", singular: "catégorie",
    description: "Taxonomie principale du blog.", titleField: "name_fr", searchFields: ["name_fr", "name_en", "slug"], listFields: ["name_fr", "name_en", "slug"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, maxLength: 100 },
      { name: "name_fr", label: "Nom FR", type: "text", required: true, maxLength: 100 },
      { name: "name_en", label: "Nom EN", type: "text", required: true, maxLength: 100 },
    ], canCreate: true, canUpdate: true, canDelete: true,
  },
  tags: {
    key: "tags", table: "tags", primaryKey: "id", label: "Tags", singular: "tag",
    description: "Mots-clés éditoriaux.", titleField: "name", searchFields: ["name", "slug"], listFields: ["name", "slug", "created_at"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, maxLength: 100 },
      { name: "name", label: "Nom", type: "text", required: true, maxLength: 100 },
    ], canCreate: true, canUpdate: true, canDelete: true,
  },
  messages: {
    key: "messages", table: "contact_messages", primaryKey: "id", label: "Messages", singular: "message",
    description: "Boîte de réception privée du formulaire de contact.", titleField: "subject",
    searchFields: ["sender_name", "sender_email", "subject", "message"], listFields: ["subject", "sender_name", "status", "created_at"],
    fields: [
      { name: "sender_name", label: "Nom", type: "text", readOnly: true },
      { name: "sender_email", label: "E-mail", type: "text", readOnly: true },
      { name: "subject", label: "Objet", type: "text", readOnly: true },
      { name: "message", label: "Message", type: "textarea", readOnly: true },
      { name: "status", label: "Statut", type: "select", required: true, options: [
        { value: "new", label: "Nouveau" }, { value: "read", label: "Lu" }, { value: "replied", label: "Répondu" },
        { value: "archived", label: "Archivé" }, { value: "spam", label: "Spam" },
      ] },
    ], canCreate: false, canUpdate: true, canDelete: true,
  },
  media: {
    key: "media", table: "media_assets", primaryKey: "id", label: "Médias", singular: "média",
    description: "Fichiers privés, métadonnées et publication.", titleField: "original_name",
    searchFields: ["original_name", "storage_path", "alt_fr", "alt_en"], listFields: ["original_name", "mime_type", "publication_status", "created_at"],
    fields: [
      { name: "original_name", label: "Nom original", type: "text", readOnly: true },
      { name: "storage_path", label: "Chemin", type: "text", readOnly: true },
      { name: "alt_fr", label: "Texte alternatif FR", type: "text", nullable: true, maxLength: 300 },
      { name: "alt_en", label: "Texte alternatif EN", type: "text", nullable: true, maxLength: 300 },
      { name: "credit", label: "Crédit", type: "text", nullable: true, maxLength: 300 },
      { name: "publication_status", label: "Statut", type: "select", required: true, options: [
        { value: "draft", label: "Brouillon" }, { value: "review_required", label: "Relecture requise" },
        { value: "published", label: "Publié" }, { value: "unpublished", label: "Dépublié" },
        { value: "archived", label: "Archivé" }, { value: "error", label: "Erreur" },
      ] },
    ], canCreate: false, canUpdate: true, canDelete: true,
  },
  settings: {
    key: "settings", table: "site_settings", primaryKey: "key", label: "Paramètres", singular: "paramètre",
    description: "Configuration éditoriale non secrète du site.", titleField: "key", searchFields: ["key", "description"], listFields: ["key", "is_public", "updated_at"],
    fields: [
      { name: "key", label: "Clé", type: "text", required: true, maxLength: 120 },
      { name: "value", label: "Valeur JSON", type: "json", required: true },
      { name: "is_public", label: "Lecture publique", type: "checkbox" },
      { name: "description", label: "Description", type: "textarea", nullable: true, maxLength: 500 },
    ], canCreate: true, canUpdate: true, canDelete: true,
    defaultValues: { value: {}, is_public: false },
  },
  "ai-jobs": {
    key: "ai-jobs", table: "ai_jobs", primaryKey: "id", label: "Brouillons assistés", singular: "brouillon",
    description: "File de brouillons manuels ou assistés. Aucune publication automatique.", titleField: "source_reference",
    searchFields: ["source_reference", "job_type", "provider", "status"], listFields: ["job_type", "provider", "status", "created_at"],
    fields: [
      { name: "status", label: "Statut", type: "select", required: true, options: [
        { value: "queued", label: "En attente" }, { value: "running", label: "En cours" },
        { value: "draft_ready", label: "Brouillon prêt" }, { value: "review_required", label: "Relecture requise" },
        { value: "validated", label: "Validé manuellement" }, { value: "error", label: "Erreur" }, { value: "cancelled", label: "Annulé" },
      ] },
      { name: "draft", label: "Brouillon JSON", type: "json", nullable: true },
      { name: "facts", label: "Faits JSON", type: "json", required: true },
      { name: "inferences", label: "Inférences JSON", type: "json", required: true },
      { name: "missing_information", label: "Informations manquantes JSON", type: "json", required: true },
    ], canCreate: false, canUpdate: true, canDelete: false,
  },
  "audit-logs": {
    key: "audit-logs", table: "audit_logs", primaryKey: "id", label: "Journal d'audit", singular: "événement",
    description: "Historique append-only des actions administratives.", titleField: "action",
    searchFields: ["action", "entity_type", "entity_id"], listFields: ["action", "entity_type", "entity_id", "created_at"],
    fields: [], canCreate: false, canUpdate: false, canDelete: false,
  },
} as const satisfies Record<string, AdminResourceConfig>;

export type AdminResourceKey = keyof typeof adminResources;

export function isAdminResourceKey(value: string): value is AdminResourceKey {
  return Object.prototype.hasOwnProperty.call(adminResources, value);
}
