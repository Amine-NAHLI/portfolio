import { FolderKanban, MessageSquare, Inbox, ExternalLink, Activity, Clock, Server } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BentoCard from "@/components/ui/BentoCard";
import CountUp from "@/components/ui/CountUp";

export const metadata = { title: "Dashboard" };

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
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-700 perspective-[1000px]">
      
      {/* Bento Grid Layout */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
        
        {/* Projects (Large) */}
        <BentoCard className="md:col-span-2 md:row-span-2 justify-between">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--color-accent)]"></span>
              <span className="font-mono text-xs text-accent uppercase tracking-widest font-semibold">Projets Publics</span>
            </div>
            <FolderKanban className="size-8 text-text-primary/20" />
          </div>
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-7xl font-bold text-text-primary tracking-tighter">
                <CountUp to={projectsCount} />
              </span>
            </div>
            <Link href="/admin/projects" className="mt-6 flex items-center justify-between font-mono text-[10px] text-text-secondary uppercase tracking-wider hover:text-accent transition-colors">
              Gérer la base de données <ExternalLink className="size-3" />
            </Link>
          </div>
        </BentoCard>

        {/* Messages */}
        <BentoCard className="md:col-span-2 group/msg cursor-pointer">
          <Link href="/admin/messages" className="absolute inset-0 z-20"></Link>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              {newMessagesCount > 0 && <span className="w-2 h-2 rounded-full bg-warning animate-ping absolute"></span>}
              {newMessagesCount > 0 && <span className="w-2 h-2 rounded-full bg-warning shadow-[0_0_10px_var(--color-warning)]"></span>}
              <span className="font-mono text-xs text-warning uppercase tracking-widest font-semibold ml-1">Messages</span>
            </div>
            <Inbox className="size-6 text-text-primary/20 group-hover/msg:text-warning transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl font-bold text-text-primary">
              <CountUp to={newMessagesCount} />
            </span>
            <span className="font-mono text-[10px] text-text-secondary uppercase">Nouveaux</span>
          </div>
        </BentoCard>

        {/* Testimonials */}
        <BentoCard className="md:col-span-2 group/testi cursor-pointer">
          <Link href="/admin/testimonials" className="absolute inset-0 z-20"></Link>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              {pendingTestimonialsCount > 0 && <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_var(--color-success)]"></span>}
              <span className="font-mono text-xs text-success uppercase tracking-widest font-semibold">Avis Clients</span>
            </div>
            <MessageSquare className="size-6 text-text-primary/20 group-hover/testi:text-success transition-colors" />
          </div>
          <div className="flex items-baseline gap-2 justify-between w-full">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-text-primary">
                <CountUp to={pendingTestimonialsCount} />
              </span>
              <span className="font-mono text-[10px] text-text-secondary uppercase">En attente</span>
            </div>
            <span className="font-mono text-[10px] text-text-secondary uppercase">Total: {testimonialsCount}</span>
          </div>
        </BentoCard>

      </section>

      {/* Row 2: Recent Messages and System Status */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Messages (2 columns) */}
        <BentoCard className="lg:col-span-2 p-0 overflow-hidden bg-bg-page/20">
          <div className="p-6 border-b border-border/50 flex items-center gap-3">
            <Activity className="size-4 text-accent" />
            <h2 className="font-display text-lg font-bold text-text-primary uppercase tracking-tight">Activité Récente</h2>
          </div>
          <div className="flex flex-col flex-1 bg-surface-subtle/50">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <Link key={msg.id} href={`/admin/messages/${msg.id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border/50 hover:bg-surface-raised transition-colors relative">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs font-bold text-text-primary group-hover:text-accent transition-colors">{msg.sender_name}</span>
                    <span className="font-body text-sm text-text-secondary line-clamp-1 max-w-md">{msg.subject}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-[10px] text-text-muted">{format(new Date(msg.created_at), "dd MMM, HH:mm", { locale: fr })}</span>
                    {msg.status === "new" && (
                      <span className="px-2 py-1 bg-warning/10 text-warning font-mono text-[9px] uppercase font-bold rounded-sm border border-warning/20">
                        Nouveau
                      </span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="font-mono text-sm text-text-muted">Aucune activité.</p>
              </div>
            )}
          </div>
        </BentoCard>

        {/* System Widgets */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Status */}
          <BentoCard className="h-full justify-center items-center text-center p-8 bg-gradient-to-br from-surface to-bg-page">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-success/20 blur-xl rounded-full"></div>
              <Server className="size-12 text-success relative z-10" />
            </div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-text-primary font-bold mb-2">Systems Operational</h3>
            <p className="text-xs text-text-secondary font-mono">DB, CDN, Edge nodes</p>
          </BentoCard>

          {/* Time/Clock */}
          <BentoCard className="h-full justify-center items-center text-center p-8">
            <Clock className="size-8 text-accent/50 mb-4" />
            <div className="font-display text-3xl font-bold tracking-tighter text-text-primary">
              Control Center
            </div>
            <div className="font-mono text-[10px] uppercase text-text-secondary mt-2 tracking-widest">
              Master Architect Mode
            </div>
          </BentoCard>
        </div>

      </section>
    </div>
  );
}
