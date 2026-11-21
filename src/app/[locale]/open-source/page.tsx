import { redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";

type OpenSourcePageProps = { params: Promise<{ locale: string }> };

export default async function OpenSourcePage({ params }: OpenSourcePageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  redirect(`/${locale}/contributions`);
}
