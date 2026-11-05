import { FolderKanban, MessageSquare, Inbox, ExternalLink, Activity, Server, ArrowUpRight, Sparkles } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BentoCard from "@/components/ui/BentoCard";
import CountUp from "@/components/ui/CountUp";

export const metadata = { title: "Dashboard — Admin" };

export default async function AdminDashboardPage() {
  const context = await requireAdminPage();
  
  // Fetch real counts
  const results = await Promise.all([
    context.supabase.from("projects").select("id", { count: "exact", head: true }),
    context.supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    context.supabase.from("testimonials").select("id", { count: "exact", head: true }),
    context.supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("status", "pending"),
    context.supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5)
  ]);
  
  const projectsCount = results[0].count ?? 0;
  const newMessagesCount = results[1].count ?? 0;
  const testimonialsCount = results[2].count ?? 0;
  const pendingTestimonialsCount = results[3].count ?? 0;
  const recentMessages = results[4].data || [];

  return (
    <div className="flex flex-col w-full gap-8 animate-in fade-in duration-700">
      
      {/* Executive Welcome Hero Banner */}
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-surface/70 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-purple-500/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-400 shadow-sm mb-3">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Système Opérationnel · v2.4
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-text-primary">
              Console d&apos;Administration<span className="text-accent">.</span>
            </h1>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-xl">
              Bienvenue Amine. Voici le centre de contrôle en temps réel pour gérer vos projets, vos parcours, vos messages et la visibilité de votre portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/fr" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-surface-raised px-4 py-2.5 font-sans text-xs font-semibold text-text-primary hover:border-accent/40 hover:bg-surface hover:text-accent transition-all shadow-md"
            >
              <ExternalLink className="size-4" /> Voir le Portfolio
            </Link>
          </div>
        </div>
      </section>
      
      {/* Primary Metrics Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Projects Card (5 columns) */}
        <BentoCard className="md:col-span-5 justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--color-accent)]" />
              <span className="font-mono text-xs text-accent uppercase tracking-wider font-semibold">Projets Publiés</span>
            </div>
            <div className="grid size-11 place-items-center rounded-2xl border border-accent/30 bg-accent/15 text-accent shadow-md shadow-accent/10">
              <FolderKanban className="size-5" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-6xl font-bold tracking-tight text-text-primary">
                <CountUp to={projectsCount} />
              </span>
              <span className="font-mono text-xs text-text-muted uppercase">Projets en ligne</span>
            </div>

            <Link href="/admin/projects" className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent hover:text-accent-hover transition-colors">
              Gérer la base de projets <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </BentoCard>

        {/* Messages Card (4 columns) */}
        <BentoCard className="md:col-span-4 justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {newMessagesCount > 0 && <span className="size-2 rounded-full bg-amber-400 animate-ping" />}
              <span className="size-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              <span className="font-mono text-xs text-amber-400 uppercase tracking-wider font-semibold">Messages Contact</span>
            </div>
            <div className="grid size-11 place-items-center rounded-2xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-md shadow-amber-500/10">
              <Inbox className="size-5" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-6xl font-bold tracking-tight text-text-primary">
                <CountUp to={newMessagesCount} />
              </span>
              <span className="font-mono text-xs text-amber-400 font-semibold uppercase">Nouveaux</span>
            </div>

            <Link href="/admin/messages" className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-text-secondary hover:text-amber-400 transition-colors">
              Ouvrir la boîte de réception <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </BentoCard>

        {/* Testimonials Card (3 columns) */}
        <BentoCard className="md:col-span-3 justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">Avis Clients</span>
            </div>
            <div className="grid size-11 place-items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-md shadow-emerald-500/10">
              <MessageSquare className="size-5" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold tracking-tight text-text-primary">
                <CountUp to={pendingTestimonialsCount} />
              </span>
              <span className="font-mono text-xs text-text-muted uppercase">En attente</span>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/5 font-mono text-[0.7rem] text-text-muted">
              <span>Total soumis: {testimonialsCount}</span>
              <Link href="/admin/testimonials" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
                Modérer →
              </Link>
            </div>
          </div>
        </BentoCard>

      </section>

      {/* Activity Timeline and Infrastructure Widgets */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Messages Activity Feed (8 columns) */}
        <BentoCard className="lg:col-span-8 p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 bg-surface-raised/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-8 place-items-center rounded-xl border border-accent/30 bg-accent/15 text-accent">
                <Activity className="size-4" />
              </div>
              <h2 className="font-display text-base font-bold text-text-primary">Activité Récente & Messages</h2>
            </div>
            <Link href="/admin/messages" className="font-mono text-xs text-accent hover:text-accent-hover transition-colors font-semibold">
              Tout afficher →
            </Link>
          </div>

          <div className="divide-y divide-white/5 bg-surface-subtle/40">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <Link 
                  key={msg.id} 
                  href="/admin/messages" 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-white/5 transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                      {msg.sender_name} <span className="text-text-muted font-normal">({msg.sender_email})</span>
                    </span>
                    <span className="font-body text-sm text-text-secondary line-clamp-1">
                      {msg.subject || "Message sans sujet"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[0.7rem] text-text-muted">
                      {format(new Date(msg.created_at), "dd MMM, HH:mm", { locale: fr })}
                    </span>
                    {msg.status === "new" ? (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-amber-400">
                        Nouveau
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[0.65rem] text-text-muted">
                        Lu
                      </span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 text-sm text-text-muted font-mono">
                Aucune activité récente disponible.
              </div>
            )}
          </div>
        </BentoCard>

        {/* Infrastructure & Status Side Stack (4 columns) */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          
          {/* Status Widget */}
          <BentoCard className="justify-center items-center text-center p-6 bg-gradient-to-br from-surface to-bg-page">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
              <div className="grid size-12 place-items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 relative z-10 shadow-lg shadow-emerald-500/10">
                <Server className="size-6" />
              </div>
            </div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary mb-1">
              Infrastructures Actives
            </h3>
            <p className="text-xs text-text-muted font-mono">
              Database Supabase · Edge CDN · Vercel Nodes
            </p>
          </BentoCard>

          {/* Quick Access Card */}
          <BentoCard className="justify-center items-center text-center p-6">
            <div className="grid size-10 place-items-center rounded-2xl border border-accent/30 bg-accent/15 text-accent mb-3">
              <Sparkles className="size-5" />
            </div>
            <div className="font-display text-lg font-bold text-text-primary">
              Control Center v2.4
            </div>
            <div className="font-mono text-[0.7rem] uppercase text-accent mt-1 tracking-widest font-semibold">
              Mode Ingénieur · Super Admin
            </div>
          </BentoCard>

        </div>

      </section>
    </div>
  );
}
