import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST() {
  if (!await getAdminContext()) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  
  revalidatePath("/", "layout");
  revalidateTag("portfolio");
  revalidateTag("projects");
  
  return NextResponse.json({ success: true });
}
