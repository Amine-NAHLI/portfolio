import { notFound } from "next/navigation";
import { AdminResourceManager } from "@/components/admin/AdminResourceManager";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { adminResources, isAdminResourceKey } from "@/features/admin/resources";
import { listAdminRecords } from "@/lib/admin/content-repository";
import { requireAdminPage } from "@/lib/auth/admin";

type AdminResourcePageProps = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: AdminResourcePageProps) {
  const { resource } = await params;
  return { title: isAdminResourceKey(resource) ? adminResources[resource].label : "Ressource inconnue" };
}

export default async function AdminResourcePage({ params }: AdminResourcePageProps) {
  const { resource } = await params;
  if (!isAdminResourceKey(resource)) notFound();
  const context = await requireAdminPage();
  const config = adminResources[resource];
  const result = await listAdminRecords(context, config);
  const resultKey = result.records.map((record) => String(record[config.primaryKey] ?? "")).join(":");
  return (
    <AdminResourceManager
      key={`${resource}:${resultKey}`}
      config={config}
      initialRecords={result.records}
      loadError={result.error}
      toolbar={resource === "media" ? <MediaUpload /> : undefined}
    />
  );
}
