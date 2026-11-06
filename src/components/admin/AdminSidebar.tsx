"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FolderKanban, Milestone, Award, MessageSquare, 
  Inbox, LogOut, Menu, ExternalLink, X, Settings, FileText, 
  RefreshCw, Orbit, Languages, ShieldCheck, ChevronRight, Layers
} from "lucide-react";
import { signOutAdmin } from "@/app/admin/(protected)/actions";

const navGroups = [
  {
    title: "Vue d'ensemble",
    items: [
      { href: "/admin/dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    ]
  },
  {
    title: "Gestion Contenu",
    items: [
      { href: "/admin/projects", label: "Tous les Projets", icon: FolderKanban },
      { href: "/admin/featured-projects", label: "Projets Accueil (4)", icon: Layers },
      { href: "/admin/journey", label: "Parcours", icon: Milestone },
      { href: "/admin/certifications", label: "Toutes les Certifications", icon: Award },
      { href: "/admin/featured-certifications", label: "Certifications Accueil (3)", icon: Award },
      { href: "/admin/testimonials", label: "Avis Clients", icon: MessageSquare },
      { href: "/admin/messages", label: "Messages Contact", icon: Inbox },
    ]
  },
  {
    title: "Configuration",
    items: [
      { href: "/admin/general", label: "Infos Générales", icon: FileText },
      { href: "/admin/hero-tech", label: "Technologies", icon: Orbit },
      { href: "/admin/translations", label: "Traductions", icon: Languages },
      { href: "/admin/settings", label: "Paramètres", icon: Settings },
    ]
  }
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  async function syncPortfolio() {
    setSyncing(true);
    try {
      await fetch("/api/admin/sync", { method: "POST" });
    } finally {
      setTimeout(() => setSyncing(false), 500);
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface-subtle/80 backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-border/50">
        <div className="size-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center font-display text-accent font-bold shadow-md shadow-accent/10">
          AN
        </div>
        <div className="flex flex-col">
          <span className="font-display text-sm font-bold text-text-primary tracking-tight">Amine Nahli</span>
          <span className="text-[0.65rem] font-mono font-semibold text-accent uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Control Center
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 text-[0.65rem] font-mono font-bold uppercase tracking-wider text-text-muted/70 mb-2">
              {group.title}
            </div>
            {group.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-sans text-xs font-medium transition-all group ${
                    active 
                      ? "bg-accent/15 border border-accent/30 text-accent font-semibold shadow-md shadow-accent/10" 
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-raised/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4 transition-colors ${active ? "text-accent" : "text-text-muted group-hover:text-text-primary"}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="size-3.5 text-accent" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-border/50 space-y-3 bg-surface/30">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[0.7rem] font-mono font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Accès Autorisé
          </span>
          <span className="text-[0.65rem] opacity-70">v2.4</span>
        </div>
        
        <div className="space-y-1.5 pt-1">
          <button 
            onClick={syncPortfolio} 
            disabled={syncing} 
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-accent/10 border border-accent/25 text-xs font-semibold text-accent hover:bg-accent hover:text-bg-page transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`size-3.5 ${syncing ? "animate-spin" : ""}`} /> 
            {syncing ? "Synchronisation..." : "Synchroniser Cache"}
          </button>

          <Link 
            href="/fr" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl border border-border/60 bg-surface-subtle text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent/40 hover:bg-surface-raised transition-all"
          >
            <ExternalLink className="size-3.5" /> Voir le Portfolio
          </Link>

          <form action={signOutAdmin}>
            <button 
              className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl border border-danger/20 bg-danger/5 text-xs font-medium text-danger hover:bg-danger hover:text-white transition-all" 
              type="submit"
            >
              <LogOut className="size-3.5" /> Se Déconnecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3.5 bg-accent text-bg-page rounded-full shadow-2xl border border-white/20"
        aria-label="Ouvrir le menu admin"
      >
        <Menu className="size-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 z-50 flex-col border-r border-border/60">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md animate-in fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] h-full flex flex-col shadow-2xl border-r border-border animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-white/10"
              aria-label="Fermer le menu"
            >
              <X className="size-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
