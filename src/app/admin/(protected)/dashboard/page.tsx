import Link from "next/link";
import { ArrowRight, Award, FolderKanban, Inbox, MessageSquare, Milestone, Wrench } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const context = await requireAdminPage();
  const results = await Promise.all([
    context.supabase.from("projects").select("id", { count: "exact", head: true }),
    context.supabase.from("experiences").select("id", { count: "exact", head: true }),
    context.supabase.from("education").select("id", { count: "exact", head: true }),
    context.supabase.from("skills").select("id", { count: "exact", head: true }),
    context.supabase.from("certifications").select("id", { count: "exact", head: true }),
    context.supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("status", "pending"),
    context.supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("status", "approved"),
    context.supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  const journeyResult = {
    count: (results[1].count ?? 0) + (results[2].count ?? 0),
    error: results[1].error ?? results[2].error,
  };
  const cards = [
    { label: "Projets", href: "/admin/projects", icon: FolderKanban, result: results[0] },
    { label: "Parcours", href: "/admin/journey", icon: Milestone, result: journeyResult },
    { label: "Compétences", href: "/admin/skills", icon: Wrench, result: results[3] },
    { label: "Certifications", href: "/admin/certifications", icon: Award, result: results[4] },
    { label: "Avis en attente", href: "/admin/testimonials", icon: MessageSquare, result: results[5] },
    { label: "Avis approuvés", href: "/admin/testimonials", icon: MessageSquare, result: results[6] },
    { label: "Messages non lus", href: "/admin/messages", icon: Inbox, result: results[7] },
  ];

  return <div>
    <header className="max-w-3xl border-b border-border pb-8"><p className="system-label">{"// Administration"}</p><h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Dashboard</h1><p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">Accédez directement aux sept sections de gestion du portfolio.</p></header>
    <section aria-labelledby="content-overview" className="mt-10"><h2 id="content-overview" className="system-label text-text-muted">Vue d’ensemble</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ label, href, icon: Icon, result }, index) => <Link key={label} href={href} className="technical-frame group min-h-36 p-5 transition-colors hover:border-border-strong"><div className="flex items-start justify-between gap-4"><span className="font-mono text-xs text-text-muted">{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" className="size-5 text-accent" /><ArrowRight aria-hidden="true" className="size-4 text-text-muted transition-transform group-hover:translate-x-1" /></div><p className="mt-6 font-display text-3xl font-semibold text-text-primary">{result.error ? "—" : result.count ?? 0}</p><p className="mt-1 text-sm text-text-secondary">{label}</p></Link>)}</div></section>
  </div>;
}
