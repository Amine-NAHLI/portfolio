import { notFound } from "next/navigation";
import { AdminWorkspace, type AdminWorkspaceSection } from "@/components/admin/AdminWorkspace";
import { requireAdminPage } from "@/lib/auth/admin";

type AdminResourcePageProps = { params: Promise<{ resource: string }> };
const sections = ["projects", "journey", "skills", "certifications", "testimonials", "messages"] as const;
function isSection(value: string): value is AdminWorkspaceSection { return (sections as readonly string[]).includes(value); }

export const dynamicParams = false;

export function generateStaticParams() {
  return sections.map((resource) => ({ resource }));
}

export async function generateMetadata({ params }: AdminResourcePageProps) {
  const { resource } = await params;
  return { title: isSection(resource) ? resource : "Ressource inconnue" };
}

export default async function AdminResourcePage({ params }: AdminResourcePageProps) {
  const { resource } = await params;
  if (!isSection(resource)) notFound();
  await requireAdminPage();
  return <AdminWorkspace section={resource} />;
}
