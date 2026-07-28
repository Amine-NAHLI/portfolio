import { FolderKanban, MessageSquare, Inbox, ExternalLink } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const context = await requireAdminPage();
  
  // Fetch real counts
  const results = await Promise.all([
    context.supabase.from("projects").select("id", { count: "exact", head: true }),
    context.supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    context.supabase.from("testimonials").select("id", { count: "exact", head: true }),
    context.supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("approved", false),
    // Fetch latest 5 messages
    context.supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5)
  ]);
  
  const projectsCount = results[0].count ?? 0;
  const newMessagesCount = results[1].count ?? 0;
  const testimonialsCount = results[2].count ?? 0;
  const pendingTestimonialsCount = results[3].count ?? 0;
  const recentMessages = results[4].data || [];

  return (
    <div className="flex flex-col w-full gap-8 animate-in fade-in duration-500">
      
      {/* Top Stats: 3-Column Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="bg-surface p-6 border-l-2 border-accent relative overflow-hidden group hover:bg-surface-raised transition-colors rounded-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FolderKanban className="size-16 text-text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-[10px] text-accent uppercase tracking-widest">Projets</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-text-primary tabular-nums">{projectsCount}</span>
            </div>
            <Link href="/admin/projects" className="mt-4 inline-block font-mono text-[10px] text-accent uppercase tracking-wider hover:underline">
              Gérer les projets →
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-surface p-6 border-l-2 border-warning relative overflow-hidden group hover:bg-surface-raised transition-colors rounded-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Inbox className="size-16 text-text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              {newMessagesCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-warning animate-ping"></span>}
              <span className="font-mono text-[10px] text-warning uppercase tracking-widest">Messages</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-text-primary tabular-nums">{newMessagesCount}</span>
              <span className="font-mono text-[10px] text-warning uppercase">Nouveaux</span>
            </div>
            <Link href="/admin/messages" className="mt-4 inline-block font-mono text-[10px] text-warning uppercase tracking-wider hover:underline">
              Voir les messages →
            </Link>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-surface p-6 border-l-2 border-success relative overflow-hidden group hover:bg-surface-raised transition-colors rounded-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MessageSquare className="size-16 text-text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              {pendingTestimonialsCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping"></span>}
              <span className="font-mono text-[10px] text-success uppercase tracking-widest">Avis Clients</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-text-primary tabular-nums">{pendingTestimonialsCount}</span>
              <span className="font-mono text-[10px] text-success uppercase">En attente</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[10px] text-text-secondary uppercase tracking-tighter">Total: {testimonialsCount}</span>
              <Link href="/admin/testimonials" className="font-mono text-[10px] text-success uppercase tracking-wider hover:underline">
                Gérer les avis →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Messages */}
        <div className="bg-surface rounded-sm p-6 flex flex-col border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <Inbox className="size-5 text-accent" />
              <h2 className="font-display text-xl font-bold text-text-primary uppercase tracking-tight">Derniers Messages</h2>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <Link key={msg.id} href={`/admin/messages/${msg.id}`} className="flex flex-col gap-1 p-4 bg-surface-subtle hover:bg-surface-raised transition-colors rounded-sm border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-text-primary">{msg.name}</span>
                    <span className="font-mono text-[10px] text-text-secondary">{format(new Date(msg.created_at), "dd MMM yyyy, HH:mm", { locale: fr })}</span>
                  </div>
                  <span className="font-body text-sm text-text-secondary truncate">{msg.subject}</span>
                  {msg.status === "new" && (
                    <span className="inline-block mt-2 self-start px-2 py-0.5 bg-warning/10 text-warning font-mono text-[10px] uppercase font-bold rounded-sm border border-warning/20">
                      Nouveau
                    </span>
                  )}
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="font-mono text-sm text-text-secondary">Aucun message pour le moment.</p>
              </div>
            )}
          </div>
          
          <Link href="/admin/messages" className="mt-6 flex items-center justify-center w-full py-2 border border-border/50 font-mono text-[10px] font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all uppercase tracking-widest">
            Voir tous les messages
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface rounded-sm p-6 flex flex-col border border-border/50 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
            <h2 className="font-display text-xl font-bold text-text-primary uppercase tracking-tight">Actions Rapides</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <Link href="/admin/projects" className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-subtle border border-border/50 hover:bg-surface-raised hover:border-accent transition-all rounded-sm text-center">
               <FolderKanban className="size-6 text-accent" />
               <span className="font-mono text-xs uppercase tracking-wider font-bold">Gérer Projets</span>
             </Link>
             <Link href="/admin/settings" className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-subtle border border-border/50 hover:bg-surface-raised hover:border-accent transition-all rounded-sm text-center">
               <ExternalLink className="size-6 text-accent" />
               <span className="font-mono text-xs uppercase tracking-wider font-bold">Paramètres Compte</span>
             </Link>
          </div>
        </div>

      </section>
    </div>
  );
}
