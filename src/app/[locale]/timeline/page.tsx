import { redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";

type TimelinePageProps = { params: Promise<{ locale: string }> };

export default async function TimelinePage({ params }: TimelinePageProps) {
  const { locale } = await params;
  redirect(`/${isLocale(locale) ? locale : "fr"}/journey`);
}

