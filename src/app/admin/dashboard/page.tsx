"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Loader2, ShieldCheck, LogOut, Eye, EyeOff, Trash2,
  Sparkles, Save, X, Check, Search, Cpu, Database, LayoutGrid
} from "lucide-react";
import { GithubIcon, ExternalLinkIcon } from "@/components/ui/Icons";
import { formatProjectTitle } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────── */
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github_url: string;
  language: string;
  created_at: string;
  visible: boolean;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon_name: string;
}

interface RepoData {
  name: string;
  description: string;
  main_language: string;
  html_url: string;
  readme: string;
}

/* ─── Dashboard ──────────────────────────────────────── */
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "skills">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms Visibility
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);

  // Project Form State
  const [githubUrl, setGithubUrl] = useState("");
  const [projectStep, setProjectStep] = useState<"input" | "loading" | "review">("input");
  const [editableProject, setEditableProject] = useState({
    title: "", description: "", category: "Full-Stack", tags: [] as string[], language: "", github_url: ""
  });

  // Skill Form State
  const [skillName, setSkillName] = useState("");
  const [skillLoading, setSkillLoading] = useState(false);
  const [editableSkill, setEditableSkill] = useState<Skill | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ─── Initialization ───────────────────────────────── */
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      await Promise.all([fetchProjects(), fetchSkills()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  const fetchSkills = async () => {
    const { data } = await supabase.from("skills").select("*").order("name");
    if (data) setSkills(data);
  };

  /* ─── Actions ──────────────────────────────────────── */
  const toggleVisibility = async (id: string, visible: boolean) => {
    await supabase.from("projects").update({ visible: !visible }).eq("id", id);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, visible: !visible } : p));
  };

  const deleteItem = async (table: "projects" | "skills", id: string) => {
    if (!confirm("Confirm deletion?")) return;
    await supabase.from(table).delete().eq("id", id);
    if (table === "projects") setProjects(prev => prev.filter(p => p.id !== id));
    else setSkills(prev => prev.filter(s => s.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  /* ─── AI Project Analysis ─────────────────────────── */
  const handleAnalyzeProject = async () => {
    setProjectStep("loading");
    setError(null);
    try {
      // 1. Fetch
      const res = await fetch("/api/github-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: githubUrl }),
      });
      if (!res.ok) throw new Error("Repo not found");
      const repo: RepoData = await res.json();

      // 2. Analyze
      const anaRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoData: repo }),
      });
      
      const ana = await anaRes.json();
      
      if (!anaRes.ok) {
        throw new Error(ana.details || ana.error || "Analysis failed");
      }

      setEditableProject({
        title: repo.name,
        description: ana.short_description,
        category: ana.category,
        tags: ana.tags,
        language: ana.languages || repo.main_language, // On utilise les langages de l'IA
        github_url: repo.html_url
      });
      setProjectStep("review");
    } catch (err: any) {
      console.error("Analysis Flow Error:", err);
      setError(err.message);
      setProjectStep("input");
    }
  };

  /* ─── AI Skill Analysis ───────────────────────────── */
  const handleAnalyzeSkill = async () => {
    setSkillLoading(true);
    try {
      const res = await fetch("/api/analyze-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillName }),
      });
      
      const ana = await res.json();
      
      if (!res.ok) throw new Error(ana.error || "Skill analysis failed");
      
      setEditableSkill({
        id: "",
        name: ana.name || skillName,
        category: ana.category || "General",
        proficiency: 80,
        icon_name: ana.icon || skillName.toLowerCase()
      });
    } catch (err: any) {
      console.error(err);
      setEditableSkill({ id: "", name: skillName, category: "Tools", proficiency: 80, icon_name: "" });
    }
    setSkillLoading(false);
  };

  const saveProject = async () => {
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("projects").insert({ ...editableProject, visible: true });
    
    if (!error) {
      // SYNC SKILLS: Automatically add discovered tags to skills table if they don't exist
      const tags = editableProject.tags || [];
      for (const tag of tags) {
        const cleanTag = tag.trim();
        if (!cleanTag) continue;

        const { data: existing } = await supabase
          .from("skills")
          .select("id")
          .ilike("name", cleanTag)
          .maybeSingle();

        if (!existing) {
          await supabase.from("skills").insert({
            name: cleanTag,
            category: "Project Stack",
            proficiency: 75,
            icon_name: cleanTag.toLowerCase().replace(/\s+/g, '')
          });
        }
      }

      setShowProjectForm(false);
      setProjectStep("input");
      setGithubUrl("");
      setEditableProject({
        title: "", description: "", category: "Full-Stack", tags: [] as string[], language: "", github_url: ""
      });
      fetchProjects();
      fetchSkills(); // Refresh skills list too
    } else setError(error.message);
    setSaving(false);
  };

  const saveSkill = async () => {
    if (!editableSkill) return;
    setSaving(true);
    setError(null);

    // Check for duplicates
    const { data: existing } = await supabase
      .from("skills")
      .select("id")
      .ilike("name", editableSkill.name.trim())
      .maybeSingle();

    if (existing) {
      setError(`The skill "${editableSkill.name}" is already in your arsenal!`);
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("skills").insert({
      name: editableSkill.name,
      category: editableSkill.category,
      proficiency: editableSkill.proficiency,
      icon_name: editableSkill.icon_name
    });

    if (!error) {
      setShowSkillForm(false);
      setSkillName("");
      setEditableSkill(null);
      fetchSkills();
    } else {
      setError(error.message);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-accent-cyan/30">
      
      {/* ─── Header ─────────────────────────────────── */}
      <header className="border-b border-white/5 px-8 py-4 flex items-center justify-between bg-[#0B0F19]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20">
            <ShieldCheck size={20} className="text-accent-cyan" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">System Admin</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <p className="text-[9px] font-mono uppercase tracking-widest text-white/40">Groq Cloud Online</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 hover:bg-white/5 text-white/40 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <Eye size={16} /> View Portfolio & Exit
          </button>
          <button onClick={handleLogout} className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-white/40 hover:text-white transition-all">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10 relative z-10">
        
        {/* ─── Tabs ───────────────────────────────────── */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2 p-1.5 bg-white/10 border border-white/10 rounded-2xl w-fit backdrop-blur-xl shadow-2xl">
            <button 
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "projects" ? "bg-accent-cyan text-[#0B0F19] shadow-[0_0_20px_rgba(34,211,238,0.3)]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              <LayoutGrid size={16} /> Projects
            </button>
            <button 
              onClick={() => setActiveTab("skills")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "skills" ? "bg-accent-indigo text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              <Cpu size={16} /> Skills
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold"
            >
              <X size={16} className="cursor-pointer" onClick={() => setError(null)} />
              {error}
            </motion.div>
          )}
        </div>

        {/* ─── PROJECTS SECTION ───────────────────────── */}
        {activeTab === "projects" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between relative">
              <div className="relative">
                <span className="absolute -top-6 -left-2 text-6xl font-black text-slate-900/5 dark:text-white/5 select-none pointer-events-none -z-10 uppercase tracking-tighter">
                  Projects
                </span>
                <h2 className="text-3xl font-black tracking-tighter relative z-10 text-slate-900 dark:text-white">
                  Project <span className="text-accent-cyan">Vault.</span>
                </h2>
              </div>
              <button 
                onClick={() => setShowProjectForm(!showProjectForm)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-cyan/50 hover:bg-accent-cyan/5 text-accent-cyan text-xs font-bold uppercase tracking-widest transition-all"
              >
                {showProjectForm ? <X size={16} /> : <Plus size={16} />}
                {showProjectForm ? "Cancel" : "Add Project"}
              </button>
            </div>

            {/* Integrated Form */}
            <AnimatePresence>
              {showProjectForm && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#161B22]/50 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl">
                    {projectStep === "input" && (
                      <div className="flex gap-4">
                        <div className="flex-1 relative">
                          <GithubIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                          <input 
                            type="text" 
                            placeholder="Enter GitHub Repository URL..."
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent-cyan/50 transition-all font-mono text-sm"
                          />
                        </div>
                        <button 
                          onClick={handleAnalyzeProject}
                          className="px-8 bg-accent-cyan text-[#0B0F19] font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                        >
                          <Search size={16} /> Analyze
                        </button>
                      </div>
                    )}

                    {projectStep === "loading" && (
                      <div className="flex flex-col items-center py-12 gap-4">
                        <div className="relative">
                          <Loader2 size={40} className="animate-spin text-accent-cyan" />
                          <Sparkles size={16} className="absolute -top-1 -right-1 text-accent-cyan animate-pulse" />
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Groq Cloud Analysis...</p>
                      </div>
                    )}

                    {projectStep === "review" && (
                      <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Title</label>
                            <input value={editableProject.title} onChange={e => setEditableProject({...editableProject, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-cyan/40 outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">AI Description</label>
                            <textarea rows={4} value={editableProject.description} onChange={e => setEditableProject({...editableProject, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-cyan/40 outline-none resize-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">🚀 Technologies & Stack</label>
                            <input value={editableProject.language} onChange={e => setEditableProject({...editableProject, language: e.target.value})} placeholder="e.g. Next.js, Tailwind, Supabase, Groq" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-cyan/40 outline-none" />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Category</label>
                            <div className="flex flex-col gap-2">
                              <input 
                                value={editableProject.category} 
                                onChange={e => setEditableProject({...editableProject, category: e.target.value})} 
                                placeholder="e.g. Full-Stack, AI, Security..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-cyan/40 outline-none"
                              />
                              <div className="flex flex-wrap gap-1.5">
                                {["Security", "Full-Stack", "AI", "Infrastructure", "Experiments"].map(cat => (
                                  <button 
                                    key={cat} 
                                    type="button"
                                    onClick={() => setEditableProject({...editableProject, category: cat})} 
                                    className={`px-3 py-1 text-[9px] font-bold uppercase tracking-tighter rounded-md border transition-all ${editableProject.category === cat ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan" : "border-white/5 text-white/30 hover:border-white/20"}`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Tags</label>
                            <input value={editableProject.tags?.join(", ")} onChange={e => setEditableProject({...editableProject, tags: e.target.value.split(",").map(t => t.trim())})} placeholder="e.g. Next.js, JWT Auth, TensorFlow" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-cyan/40 outline-none" />
                          </div>
                          <div className="flex items-center gap-4 pt-4 h-[56px]">
                            <button 
                              onClick={saveProject} 
                              disabled={saving} 
                              className="h-full flex-[3] bg-green-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-green-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                            >
                              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Commit to Supabase
                            </button>
                            <button 
                              onClick={() => setProjectStep("input")} 
                              className="h-full px-8 border border-white/10 text-white/40 uppercase font-bold text-[10px] rounded-2xl hover:bg-white/5 hover:text-white transition-all whitespace-nowrap"
                            >
                              Back
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-4 relative z-10">
              {projects.map(p => (
                <div key={p.id} className="group bg-[#161B22]/90 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-accent-cyan/30 transition-all flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                      <Database className="text-white/20" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold">{formatProjectTitle(p.title)}</h3>
                        <span className="px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan text-[9px] font-mono uppercase tracking-widest border border-accent-cyan/20 rounded">{p.category}</span>
                      </div>
                      <p className="text-sm text-white/40 max-w-xl line-clamp-1">{p.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => toggleVisibility(p.id, p.visible)} className={`p-3 rounded-xl border transition-all ${p.visible ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-white/20 border-white/10"}`}>
                      {p.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => deleteItem("projects", p.id)} className="p-3 rounded-xl border border-red-500/10 text-red-500/40 hover:bg-red-500/5 hover:text-red-500 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── SKILLS SECTION ─────────────────────────── */}
        {activeTab === "skills" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between relative">
              <div className="relative">
                <span className="absolute -top-6 -left-2 text-6xl font-black text-slate-900/5 dark:text-white/5 select-none pointer-events-none -z-10 uppercase tracking-tighter">
                  Arsenal
                </span>
                <h2 className="text-3xl font-black tracking-tighter relative z-10 text-slate-900 dark:text-white">
                  Technical <span className="text-accent-indigo">Arsenal.</span>
                </h2>
              </div>
              <button 
                onClick={() => setShowSkillForm(!showSkillForm)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-indigo/50 hover:bg-accent-indigo/5 text-accent-indigo text-xs font-bold uppercase tracking-widest transition-all"
              >
                {showSkillForm ? <X size={16} /> : <Plus size={16} />}
                {showSkillForm ? "Cancel" : "Add Skill"}
              </button>
            </div>

            <AnimatePresence>
              {showSkillForm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="bg-[#161B22]/50 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl">
                    {!editableSkill ? (
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          placeholder="Skill name (e.g. React, Docker, Python)..."
                          value={skillName}
                          onChange={(e) => setSkillName(e.target.value)}
                          className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-accent-indigo/50 transition-all font-mono text-sm"
                        />
                        <button 
                          onClick={handleAnalyzeSkill}
                          disabled={!skillName || skillLoading}
                          className="px-8 bg-accent-indigo text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-30"
                        >
                          {skillLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />} AI Classify
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-8 items-end">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Name</label>
                          <input value={editableSkill.name} onChange={e => setEditableSkill({...editableSkill, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Category</label>
                          <input 
                            value={editableSkill.category} 
                            onChange={e => setEditableSkill({...editableSkill, category: e.target.value})}
                            placeholder="e.g. Core, Frameworks, Tools, DevOps..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent-indigo/40"
                          />
                        </div>
                        <div className="flex items-center gap-3 h-[52px]">
                          <button 
                            onClick={saveSkill} 
                            disabled={saving} 
                            className="h-full flex-[2] bg-accent-indigo text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-opacity-80 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-indigo/20"
                          >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Component
                          </button>
                          <button 
                            onClick={() => setEditableSkill(null)} 
                            className="h-full px-6 border border-white/10 text-white/40 uppercase font-bold text-[10px] rounded-2xl hover:bg-white/5 hover:text-white transition-all whitespace-nowrap"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-3 gap-4 relative z-10">
              {skills.map(s => (
                <div key={s.id} className="group bg-[#161B22]/90 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-accent-indigo/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <Cpu size={20} className="text-accent-indigo" />
                    </div>
                    <div>
                      <h3 className="font-bold">{s.name}</h3>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">{s.category}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem("skills", s.id)} className="p-2.5 rounded-lg border border-red-500/10 text-red-500/20 group-hover:text-red-500/60 hover:bg-red-500/5 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Floating Background Shapes (Visual only) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-indigo/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

    </div>
  );
}
