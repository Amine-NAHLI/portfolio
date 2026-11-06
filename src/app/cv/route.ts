import { redirect } from "next/navigation";

export function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale");
    if (locale === "en") {
      redirect("/Amine_Nahli_CV_EN.pdf");
    }
  } catch {
    // Ignore URL parse error and fallback
  }
  redirect("/Amine_Nahli_CV.pdf");
}
