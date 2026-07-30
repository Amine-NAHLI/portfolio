"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Milestone, Award, MessageSquare, Inbox, LogOut, Menu, ExternalLink, X, Settings, FileText } from "lucide-react";
import { signOutAdmin } from "@/app/admin/(protected)/actions";

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban },
  { href: "/admin/journey", label: "Parcours", icon: Milestone },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/testimonials", label: "Avis", icon: MessageSquare },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/general", label: "Infos Générales", icon: FileText },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="p-6 flex items-center gap-4 border-b border-border/50">
        <div className="w-10 h-10 bg-surface flex items-center justify-center font-display text-text-primary text-xl font-bold border border-border">
          AN
        </div>
        <div className="flex flex-col">
          <span className="font-display text-text-primary leading-none tracking-tight">Amine Nahli</span>
          <span className="text-[10px] text-accent uppercase tracking-widest mt-1 font-mono">Portfolio Admin</span>
        </div>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto">
        {navigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-6 py-3 transition-all group ${
                active 
                  ? "bg-accent/10 text-accent border-r-2 border-accent shadow-[0_0_15px_rgba(0,218,243,0.05)]" 
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-raised"
              }`}
            >
              <Icon className={`mr-4 size-5 ${active ? "text-accent" : "group-hover:text-accent"}`} />
              <span className="font-mono text-xs uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border/50 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-raised rounded-full border border-accent/20">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          <span className="font-mono text-[10px] text-accent uppercase tracking-tighter">Admin: Authorized</span>
        </div>
        
        <div className="grid gap-2">
          <Link href="/fr" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded border border-border text-xs text-text-secondary hover:text-text-primary hover:border-accent transition-colors">
            <ExternalLink className="size-3.5" /> Voir le site
          </Link>
          <form action={signOutAdmin}>
            <button className="flex items-center gap-2 px-4 py-2 rounded border border-border text-xs text-text-secondary hover:text-danger hover:border-danger transition-colors w-full" type="submit">
              <LogOut className="size-3.5" /> Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle button (positioned globally or within the header usually) */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-accent text-bg-page rounded-full shadow-lg"
      >
        <Menu className="size-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-subtle z-50 flex-col border-r border-border">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Dialog/Drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[80vw] bg-bg-page h-full flex flex-col shadow-2xl border-r border-border animate-in slide-in-from-left-full">
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary"
            >
              <X className="size-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
