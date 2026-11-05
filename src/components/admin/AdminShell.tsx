import type { ReactNode } from "react";
import { Bell, Search, ChevronRight } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminAutoLogout } from "./AdminAutoLogout";

export type AdminShellProps = { children: ReactNode; email: string | null };

export function AdminShell({ children, email }: AdminShellProps) {
  const username = email?.split('@')[0] || "Admin";

  return (
    <div className="relative min-h-screen bg-bg-page font-body text-text-primary selection:bg-accent selection:text-text-on-accent flex overflow-x-hidden">
      {/* Ambient Radial Spotlights (matching portfolio hero aesthetic) */}
      <div className="pointer-events-none fixed -top-40 -left-40 size-[500px] rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/3 -right-40 size-[450px] rounded-full bg-purple-500/10 blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-40 left-1/3 size-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />

      {/* Sidebar Navigation */}
      <AdminSidebar />
      <AdminAutoLogout />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-72 w-full relative z-10">
        {/* Sticky Glass Navbar */}
        <header className="sticky top-0 z-40 h-16 w-full border-b border-white/10 bg-bg-page/75 backdrop-blur-2xl shadow-lg transition-all">
          <div className="flex h-full w-full max-w-[92rem] items-center justify-between px-4 sm:px-6 lg:px-8 mx-auto">
            
            {/* Breadcrumb Path Indicator */}
            <div className="flex items-center gap-2.5 font-mono text-xs text-text-secondary uppercase tracking-wider">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-3 py-1 text-[0.7rem] font-bold text-accent shadow-xs">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Control Center
              </div>
              <ChevronRight aria-hidden="true" className="size-3.5 text-text-muted" />
              <span className="font-semibold text-text-primary">Console Admin</span>
            </div>

            {/* Quick Actions & Profile */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border-r border-white/10 pr-3">
                <button 
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-text-secondary transition-all hover:border-accent/40 hover:bg-surface hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" 
                  title="Notifications"
                >
                  <Bell aria-hidden="true" className="size-4" />
                </button>
                <button 
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-text-secondary transition-all hover:border-accent/40 hover:bg-surface hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" 
                  title="Recherche Rapide"
                >
                  <Search aria-hidden="true" className="size-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 pl-1">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold leading-tight text-text-primary capitalize">{username}</div>
                  <div className="text-[0.65rem] font-mono font-semibold uppercase tracking-widest text-accent">Master Architect</div>
                </div>
                <div className="size-9 rounded-full border border-accent/40 bg-accent/15 flex items-center justify-center text-accent font-bold text-xs shadow-md shadow-accent/15">
                  {username.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Content View */}
        <main id="admin-content" className="flex-1 p-4 sm:p-6 lg:p-8" tabIndex={-1}>
          <div className="flex flex-col w-full gap-8 max-w-[92rem] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
