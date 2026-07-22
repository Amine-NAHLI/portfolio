import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAdminContext } from "@/lib/auth/admin";
import { hasSupabasePublicConfig } from "@/lib/env/supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const context = await getAdminContext();
  if (context) redirect("/admin/dashboard");

  return (
    <main className="grid min-h-screen place-items-center px-5 py-16">
      <AdminLoginForm configured={hasSupabasePublicConfig()} />
    </main>
  );
}
