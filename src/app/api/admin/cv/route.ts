import { NextResponse } from "next/server";
import { stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminContext } from "@/lib/auth/admin";

const CV_FILENAME = "Amine_Nahli_CV.pdf";
const CV_PATH = resolve("public", CV_FILENAME);
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export async function GET() {
  try {
    const fileStat = await stat(CV_PATH);
    return NextResponse.json({
      exists: true,
      size: fileStat.size,
      updatedAt: fileStat.mtime.toISOString(),
      url: `/${CV_FILENAME}`,
      filename: CV_FILENAME,
    });
  } catch {
    return NextResponse.json({
      exists: false,
      size: 0,
      updatedAt: null,
      url: `/${CV_FILENAME}`,
      filename: CV_FILENAME,
    });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminContext();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé. Accès administrateur requis." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Aucun fichier PDF fourni." }, { status: 400 });
    }

    const blob = file as File;

    if (!blob.name.toLowerCase().endsWith(".pdf") && blob.type !== "application/pdf") {
      return NextResponse.json({ error: "Format non valide. Seuls les fichiers PDF (.pdf) sont acceptés." }, { status: 400 });
    }

    if (blob.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Le fichier dépasse la taille maximale autorisée (15 Mo)." }, { status: 400 });
    }

    const bytes = await blob.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(CV_PATH, buffer);

    // Revalidate paths & tags
    try {
      revalidatePath("/cv");
      revalidatePath("/");
      revalidatePath("/fr");
      revalidatePath("/en");
      revalidateTag("portfolio");
      revalidateTag("settings");
    } catch (e) {
      console.warn("Revalidation error after CV upload:", e);
    }

    return NextResponse.json({
      success: true,
      size: blob.size,
      updatedAt: new Date().toISOString(),
      url: `/${CV_FILENAME}`,
      message: "Curriculum Vitae (PDF) mis à jour avec succès !",
    });
  } catch (error) {
    console.error("CV upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur interne lors du téléchargement du CV." },
      { status: 500 }
    );
  }
}

