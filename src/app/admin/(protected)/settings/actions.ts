"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateAccountDetails(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email && !password) {
    return { error: "Veuillez renseigner un email ou un mot de passe à modifier." };
  }

  const updates: { email?: string; password?: string } = {};
  if (email) updates.email = email;
  if (password) updates.password = password;

  const { error } = await supabase.auth.updateUser(updates);

  if (error) {
    return { error: error.message };
  }

  const message = email 
    ? "Paramètres mis à jour. Si vous avez modifié l'email, un lien de confirmation a été envoyé à la fois à votre ancienne et nouvelle adresse."
    : "Votre mot de passe a été mis à jour avec succès.";

  return { success: true, message };
}
