import Link from "next/link";
import { Activity, Cpu, Terminal, Search, Edit2, Eye, Trash2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const context = await requireAdminPage();
  const results = await Promise.all([
    context.supabase.from("projects").select("id", { count: "exact", head: true }),
    context.supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  
  const projectsCount = results[0].count ?? 0;
  const newMessagesCount = results[1].count ?? 0;

  return (
    <div className="flex flex-col w-full gap-8 animate-in fade-in duration-500">
      
      {/* Top Stats: 3-Column Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Transmissions (Projects) */}
        <div className="bg-surface p-6 border-l-2 border-accent relative overflow-hidden group hover:bg-surface-raised transition-colors cursor-default rounded-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="size-16 text-text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></span>
              <span className="font-mono text-[10px] text-accent uppercase tracking-widest">Active Transmissions</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-text-primary tabular-nums" id="stat-transmissions">{projectsCount}</span>
              <span className="font-mono text-[10px] text-accent uppercase">Live</span>
            </div>
            <div className="mt-4 w-full h-1 bg-surface-deep overflow-hidden">
              <div className="h-full bg-accent transition-all duration-1000 ease-out" style={{ width: "65%" }}></div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-surface p-6 border-l-2 border-success relative overflow-hidden group hover:bg-surface-raised transition-colors cursor-default rounded-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu className="size-16 text-text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              <span className="font-mono text-[10px] text-success uppercase tracking-widest">System Health</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-text-primary tabular-nums">99.98</span>
              <span className="font-mono text-[10px] text-success">%</span>
            </div>
            <div className="mt-4 flex gap-1">
              <div className="h-1 flex-1 bg-success"></div>
              <div className="h-1 flex-1 bg-success"></div>
              <div className="h-1 flex-1 bg-success"></div>
              <div className="h-1 flex-1 bg-success"></div>
              <div className="h-1 flex-1 bg-success/20"></div>
            </div>
          </div>
        </div>

        {/* New Inquiries (Messages) */}
        <div className="bg-surface p-6 border-l-2 border-warning relative overflow-hidden group hover:bg-surface-raised transition-colors cursor-default rounded-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Terminal className="size-16 text-text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
              <span className="font-mono text-[10px] text-warning uppercase tracking-widest">Inbound Packets</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-text-primary tabular-nums">{newMessagesCount}</span>
              <span className="font-mono text-[10px] text-warning">New</span>
            </div>
            <div className="mt-4 flex items-center gap-1">
              <span className="font-mono text-[10px] text-text-secondary uppercase tracking-tighter">Queue depth: stable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Chart and Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Project Performance Chart */}
        <div className="lg:col-span-8 bg-surface rounded-sm p-6 flex flex-col border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary uppercase tracking-tight">Project Performance</h2>
              <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mt-1">Global engagement metrics / last 30 cycles</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 font-mono text-[10px] font-semibold border border-border/50 text-text-primary hover:bg-surface-raised transition-all">REAL-TIME</button>
              <button className="px-4 py-1.5 font-mono text-[10px] font-semibold bg-accent text-bg-page hover:brightness-110 transition-all">EXPORT.CSV</button>
            </div>
          </div>
          
          <div className="flex-1 min-h-[320px] relative flex items-end justify-between group">
            {/* SVG Chart Mockup */}
            <svg className="w-full h-full preserve-3d" preserveAspectRatio="none" viewBox="0 0 800 300">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line stroke="currentColor" className="text-border" strokeOpacity="0.5" x1="0" x2="800" y1="0" y2="0"></line>
              <line stroke="currentColor" className="text-border" strokeOpacity="0.5" x1="0" x2="800" y1="75" y2="75"></line>
              <line stroke="currentColor" className="text-border" strokeOpacity="0.5" x1="0" x2="800" y1="150" y2="150"></line>
              <line stroke="currentColor" className="text-border" strokeOpacity="0.5" x1="0" x2="800" y1="225" y2="225"></line>
              <line stroke="currentColor" className="text-border" strokeOpacity="0.5" x1="0" x2="800" y1="300" y2="300"></line>
              
              {/* Area */}
              <path d="M0 300 L0 250 Q 100 180 200 220 T 400 100 T 600 150 T 800 50 L 800 300 Z" fill="url(#chartGradient)"></path>
              
              {/* Line */}
              <path d="M0 250 Q 100 180 200 220 T 400 100 T 600 150 T 800 50" fill="none" stroke="var(--accent)" strokeWidth="2"></path>
              
              {/* Hover Marker (Animated) */}
              <circle className="animate-pulse" cx="400" cy="100" fill="var(--accent)" r="4"></circle>
            </svg>
            
            {/* Chart Labels */}
            <div className="absolute -left-2 top-0 h-full flex flex-col justify-between font-mono text-text-muted/60 [writing-mode:vertical-rl] text-[10px]">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between font-mono text-[10px] text-text-secondary uppercase tracking-widest border-t border-border/50 pt-4">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>23:59</span>
          </div>
        </div>

        {/* Recent Activity: Engineering Logs */}
        <div className="lg:col-span-4 bg-surface rounded-sm p-6 flex flex-col border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
            <Terminal className="size-5 text-accent" />
            <h2 className="font-display text-xl font-bold text-text-primary uppercase tracking-tight">System Logs</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[400px] no-scrollbar">
            <div className="flex gap-4 group">
              <span className="font-mono text-[10px] text-text-secondary whitespace-nowrap mt-1">14:22:04</span>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold text-success uppercase tracking-wider">Auth Success</span>
                <span className="font-body text-[13px] text-text-secondary leading-snug">User root accessed secure/projects-api</span>
              </div>
            </div>
            
            <div className="flex gap-4 group">
              <span className="font-mono text-[10px] text-text-secondary whitespace-nowrap mt-1">14:15:10</span>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold text-accent uppercase tracking-wider">Project Synced</span>
                <span className="font-body text-[13px] text-text-secondary leading-snug">'Quantum-Redesign-24' deployed to production edge nodes.</span>
              </div>
            </div>
            
            <div className="flex gap-4 group">
              <span className="font-mono text-[10px] text-text-secondary whitespace-nowrap mt-1">13:45:00</span>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold text-danger uppercase tracking-wider">Cache Purge</span>
                <span className="font-body text-[13px] text-text-secondary leading-snug">Global CDN cache invalidated by manual trigger.</span>
              </div>
            </div>
            
            <div className="flex gap-4 group">
              <span className="font-mono text-[10px] text-text-secondary whitespace-nowrap mt-1">12:30:12</span>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold text-warning uppercase tracking-wider">New Lead</span>
                <span className="font-body text-[13px] text-text-secondary leading-snug">Transmission received from: sarah.j@techcorp.io</span>
              </div>
            </div>
            
            <div className="flex gap-4 group">
              <span className="font-mono text-[10px] text-text-secondary whitespace-nowrap mt-1">10:12:44</span>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold text-text-secondary uppercase tracking-wider">Node Check</span>
                <span className="font-body text-[13px] text-text-secondary leading-snug">All 14 peripheral nodes reporting optimal latency.</span>
              </div>
            </div>
          </div>
          
          <button className="mt-6 w-full py-2 border border-border/50 font-mono text-[10px] font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all uppercase tracking-widest">
            View Full Archive
          </button>
        </div>
      </section>

      {/* Top Projects Management Table */}
      <section className="bg-surface rounded-sm overflow-hidden border border-border/50 shadow-sm">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-surface-raised/30">
          <div>
            <h2 className="font-display text-xl font-bold text-text-primary uppercase tracking-tight">Active Repositories</h2>
            <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mt-1">Manage core project portfolio visibility</p>
          </div>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary size-4" />
            <input className="bg-surface-subtle border border-border/50 rounded-sm px-10 py-1.5 font-mono text-[10px] text-text-primary focus:outline-none focus:border-accent transition-all w-64" placeholder="FILTER BY ID..." type="text" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="font-mono text-[10px] text-text-secondary uppercase tracking-widest border-b border-border/50 bg-surface-subtle/50">
                <th className="px-6 py-4 font-semibold">Identifier</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Engagement</th>
                <th className="px-6 py-4 font-semibold">Last Modified</th>
                <th className="px-6 py-4 font-semibold text-right">Control</th>
              </tr>
            </thead>
            <tbody className="font-body text-text-primary divide-y divide-border/30">
              
              <tr className="hover:bg-accent/5 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-display text-base font-bold text-text-primary group-hover:text-accent transition-colors">PROJECT_KRONOS_V4</span>
                    <span className="font-mono text-text-secondary text-[10px] tracking-tighter">HASH: 0x7719B2...</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono uppercase text-[10px] font-bold tracking-widest">Live</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-surface-deep overflow-hidden">
                      <div className="h-full bg-accent w-[88%]"></div>
                    </div>
                    <span className="font-mono text-xs font-bold tabular-nums">88%</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-text-secondary">2024.05.12 14:02</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-raised rounded-sm text-text-secondary hover:text-accent transition-all" title="Edit Metadata">
                      <Edit2 className="size-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-raised rounded-sm text-text-secondary hover:text-success transition-all" title="Visibility Toggle">
                      <Eye className="size-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-raised rounded-sm text-text-secondary hover:text-danger transition-all" title="Archive Repository">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-accent/5 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-display text-base font-bold text-text-primary group-hover:text-accent transition-colors">NEBULA_DESIGN_SYSTEM</span>
                    <span className="font-mono text-text-secondary text-[10px] tracking-tighter">HASH: 0x9921C4...</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning font-mono uppercase text-[10px] font-bold tracking-widest">Draft</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-surface-deep overflow-hidden">
                      <div className="h-full bg-warning w-[42%]"></div>
                    </div>
                    <span className="font-mono text-xs font-bold tabular-nums">42%</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-text-secondary">2024.05.10 09:44</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-raised rounded-sm text-text-secondary hover:text-accent transition-all">
                      <Edit2 className="size-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-raised rounded-sm text-text-secondary hover:text-success transition-all">
                      <Eye className="size-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-raised rounded-sm text-text-secondary hover:text-danger transition-all">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-accent/5 transition-colors group cursor-pointer opacity-60 grayscale hover:grayscale-0 hover:opacity-100">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-display text-base font-bold text-text-primary group-hover:text-accent transition-colors">LEGACY_PORTFOLIO_V1</span>
                    <span className="font-mono text-text-secondary text-[10px] tracking-tighter">HASH: 0xA110DE...</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-surface-deep border border-border/50 text-text-secondary font-mono uppercase text-[10px] font-bold tracking-widest">Archived</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-surface-deep overflow-hidden">
                      <div className="h-full bg-border w-[12%]"></div>
                    </div>
                    <span className="font-mono text-xs font-bold tabular-nums">12%</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-text-secondary">2023.11.20 18:15</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-raised rounded-sm text-text-secondary hover:text-accent transition-all">
                      <Edit2 className="size-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-raised rounded-sm text-text-secondary hover:text-success transition-all">
                      <RotateCcw className="size-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-raised rounded-sm text-text-secondary hover:text-danger transition-all">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
        
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between border-t border-border/50 gap-4">
          <span className="font-mono text-[10px] text-text-secondary uppercase tracking-tighter">Showing 3 of {projectsCount > 0 ? projectsCount : 42} records</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center border border-border/50 text-text-primary hover:bg-surface-raised transition-all rounded-sm">
              <ChevronLeft className="size-4" />
            </button>
            <button className="px-3 h-8 flex items-center justify-center border border-accent/40 text-accent bg-accent/10 font-mono text-xs font-bold rounded-sm">1</button>
            <button className="px-3 h-8 flex items-center justify-center border border-border/50 text-text-primary hover:bg-surface-raised font-mono text-xs font-bold rounded-sm">2</button>
            <button className="px-3 h-8 flex items-center justify-center border border-border/50 text-text-primary hover:bg-surface-raised font-mono text-xs font-bold rounded-sm">3</button>
            <button className="w-8 h-8 flex items-center justify-center border border-border/50 text-text-primary hover:bg-surface-raised transition-all rounded-sm">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
