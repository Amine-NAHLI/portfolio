import type { ReactNode } from "react";
import { Bell, Search, User, ChevronRight } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminAutoLogout } from "./AdminAutoLogout";

export type AdminShellProps = { children: ReactNode; email: string | null };

export function AdminShell({ children, email }: AdminShellProps) {
  return (
    <div className="bg-bg-page font-body text-text-primary min-h-screen flex">
      {/* Sidebar - Client Component for active path tracking & mobile toggle */}
      <AdminSidebar />
      <AdminAutoLogout />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-72 w-full">
        <header className="sticky top-0 h-16 bg-bg-page/80 backdrop-blur-xl z-40 border-b border-border flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2 text-text-secondary font-mono text-[10px] sm:text-xs uppercase tracking-widest">
            <span className="hidden sm:inline">Control Center</span>
            <ChevronRight aria-hidden="true" className="size-4 hidden sm:block" />
            <span className="text-text-primary">System Overview</span>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4 border-r border-border/50 pr-4 lg:pr-8">
              <button className="text-text-secondary hover:text-accent transition-colors">
                <Bell aria-hidden="true" className="size-5" />
              </button>
              <button className="text-text-secondary hover:text-accent transition-colors">
                <Search aria-hidden="true" className="size-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <div className="text-text-primary text-sm font-semibold">{email?.split('@')[0] || "Admin"}</div>
                <div className="text-[10px] text-text-secondary uppercase tracking-tighter">Master Architect</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <User aria-hidden="true" className="size-5 text-bg-page" />
              </div>
            </div>
          </div>
        </header>

        <main id="admin-content" className="flex-1 p-4 sm:p-6 lg:p-8" tabIndex={-1}>
          <div className="flex flex-col w-full gap-8 max-w-[90rem] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
