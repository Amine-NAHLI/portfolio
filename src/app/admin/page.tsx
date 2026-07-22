import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const context = await getAdminContext();
  redirect(context ? "/admin/dashboard" : "/admin/login");
}

