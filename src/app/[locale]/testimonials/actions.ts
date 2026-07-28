"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Locale } from "@/i18n/config";

export async function submitTestimonial(prevState: unknown, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const role = formData.get("role") as string;
  const company = formData.get("company") as string;
  const message = formData.get("message") as string;
  const locale = formData.get("locale") as Locale;
  const rating = 5; // Default rating for now

  if (!firstName || !lastName || !message) {
    return { error: "Veuillez remplir les champs obligatoires (Prénom, Nom, Message).", success: false };
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from("testimonials").insert({
    name: `${firstName} ${lastName}`.trim(),
    first_name: firstName,
    last_name: lastName,
    role: role || null,
    company: company || null,
    message: message,
    rating: rating,
    locale: locale || "fr",
    status: "pending",
    consent_to_publish: true,
  });

  if (error) {
    console.error("Testimonial submission failed:", error);
    return { error: "Une erreur est survenue lors de l'envoi de votre avis. Veuillez réessayer.", success: false };
  }

  return { success: true, message: "Merci ! Votre avis a été envoyé et sera examiné prochainement." };
}
