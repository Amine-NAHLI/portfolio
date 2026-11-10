export const CV_STORAGE_BUCKET = "portfolio-media";
export const CV_MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MiB (matches Supabase bucket limit)
export const CV_MAX_REQUEST_BYTES = CV_MAX_FILE_BYTES + 256 * 1024;

export type CvLocale = "fr" | "en";

export type CvAssetInfo = {
  locale: CvLocale;
  filename: string;
  storagePath: string;
  previewUrl: string;
};

export function normalizeCvLocale(value: string | null | undefined): CvLocale {
  return value === "en" ? "en" : "fr";
}

export function getCvAssetInfo(localeInput: string | null | undefined): CvAssetInfo {
  const locale = normalizeCvLocale(localeInput);
  const filename = locale === "en" ? "Amine_Nahli_CV_EN.pdf" : "Amine_Nahli_CV.pdf";
  return {
    locale,
    filename,
    storagePath: `cv/${filename}`,
    previewUrl: `/cv?locale=${locale}&disposition=inline`,
  };
}

