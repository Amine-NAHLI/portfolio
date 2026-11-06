import type { Metadata } from "next";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { requireAdminPage } from "@/lib/auth/admin";
import { CVManager } from "@/components/admin/CVManager";

export const metadata: Metadata = {
  title: "Gestion du CV (PDF) — Administration",
};

export default async function AdminCVPage() {
  await requireAdminPage();

  let cvInfo = {
    exists: false,
    size: 0,
    updatedAt: null as string | null,
    url: "/Amine_Nahli_CV.pdf",
    filename: "Amine_Nahli_CV.pdf",
  };
  try {
    const cvStat = await stat(resolve("public", "Amine_Nahli_CV.pdf"));
    cvInfo = {
      exists: true,
      size: cvStat.size,
      updatedAt: cvStat.mtime.toISOString(),
      url: "/Amine_Nahli_CV.pdf",
      filename: "Amine_Nahli_CV.pdf",
    };
  } catch {}

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end border-b border-white/10 pb-6 mb-10">
        <div>
          <p className="font-mono text-xs text-[#9A71FF] uppercase tracking-wider">{"// Document Professionnel"}</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-[#f3f1f7]">
            Curriculum Vitae (PDF)
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#797681]">
            Téléversez directement votre CV au format PDF. Le document remplace automatiquement la version publique accessible sur <code className="text-accent font-semibold">/cv</code> et sur tout le portfolio.
          </p>
        </div>
      </header>

      <div className="bg-surface rounded-sm border border-border/50 p-6 shadow-sm">
        <CVManager initialInfo={cvInfo} />
      </div>
    </div>
  );
}

