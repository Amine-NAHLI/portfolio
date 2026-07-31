import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from("certifications").select("id, name_fr, name_en, description_fr, description_en, issuer, credential_status, skills, issued_on, verification_url, document_media_id, media_assets ( mime_type ), featured");
  console.log("Error:", error);
  console.log("Data:", data);
}
test();
