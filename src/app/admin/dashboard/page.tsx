"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Loader2, ShieldCheck, LogOut, Eye, EyeOff, Trash2,
  ExternalLink, Github, Sparkles, Save, X, Check, Search
} from "lucide-react";

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

interface RepoData {
  name: string;
  full_name: string;
  description: string;
  topics: string[];
  languages: string[];
  main_language: string;
  stars: number;
  html_url: string;
  created_at: string;
  readme: string;
}

interface AnalysisResult {
  category: string;
  short_description: string;
  tags: string[];
}

/* ─── Dashboard ──────────────────────────────────────── */
export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Add project flow
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [step, setStep] = useState<"input" | "fetching" | "analyzing" | "review">("input");
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [editableProject, setEditableProject] = useState({
    title: "",
    description: "",
    category: "",
    tags: [] as string[],
    language: "",
    github_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ─── Auth Check ───────────────────────────────────── */
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      fetchProjects();
    };
    checkAuth();
  }, []);

  /* ─── Fetch Projects ───────────────────────────────── */
  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setProjects(data);
    setLoading(false);
  };

  /* ─── Toggle Visibility ────────────────────────────── */
  const toggleVisibility = async (id: string, visible: boolean) => {
    await supabase.from("projects").update({ visible: !visible }).eq("id", id);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, visible: !visible } : p));
  };

  /* ─── Delete Project ───────────────────────────────── */
  const deleteProject = async (id: string) => {
    if (!confirm("Supprimer ce projet définitivement ?")) return;
    await supabase.from("projects").delete().eq("id", id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  /* ─── Logout ───────────────────────────────────────── */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  /* ─── Step 1: Fetch GitHub Repo ────────────────────── */
  const handleFetchRepo = async () => {
    setError(null);
    setStep("fetching");

    try {
      const res = await fetch("/api/github-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: githubUrl }),
      });

      if (!res.ok) throw new Error("Repository not found");

      const data: RepoData = await res.json();
      setRepoData(data);
      setStep("analyzing");

      // Step 2: Send to Ollama
      const analysisRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoData: data }),
      });

      if (!analysisRes.ok) throw new Error("Ollama analysis failed");

      const result: AnalysisResult = await analysisRes.json();
      setAnalysis(result);

      // Pre-fill editable form
      setEditableProject({
        title: data.name,
        description: result.short_description,
        category: result.category,
        tags: result.tags,
        language: data.main_language,
        github_url: data.html_url,
      });

      setStep("review");
    } catch (err: any) {
      setError(err.message);
      setStep("input");
    }
  };

  /* ─── Step 3: Save to Supabase ─────────────────────── */
  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("projects").insert({
      title: editableProject.title,
      description: editableProject.description,
      category: editableProject.category,
      tags: editableProject.tags,
      github_url: editableProject.github_url,
      language: editableProject.language,
      visible: true,
    });

    if (error) {
      setError(error.message);
    } else {
      // Reset and refresh
      setShowAddPanel(false);
      setStep("input");
      setGithubUrl("");
      setRepoData(null);
      setAnalysis(null);
      fetchProjects();
    }
    setSaving(false);
  };

  /* ─── Reset Panel ──────────────────────────────────── */
  const resetPanel = () => {
    setShowAddPanel(false);
    setStep("input");
    setGithubUrl("");
    setRepoData(null);
    setAnalysis(null);
    setError(null);
  };

  /* ─── Categories ───────────────────────────────────── */
  const CATEGORIES = ["Security", "Full-Stack", "AI", "Experiments"];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans">

      {/* ─── Header ─────────────────────────────────── */}
      <header className="border-b border-white/5 px-8 py-5 flex items-center justify-between bg-[#0B0F19]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
            <ShieldCheck size={20} className="text-accent-cyan" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Project Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddPanel(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-cyan text-[#0B0F19] font-bold text-xs uppercase tracking-widest hover:bg-accent-cyan/80 transition-all"
          >
            <Plus size={16} />
            Add Project
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-xs uppercase tracking-widest hover:text-white hover:border-white/20 transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* ─── Projects Table ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight">Selected Works</h2>
          <span className="font-mono text-xs text-white/40">{projects.length} projects</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-accent-cyan" size={32} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <Github size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/40 font-mono text-sm">No projects yet. Click "Add Project" to start.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-bold">{project.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-md bg-accent-cyan/10 text-accent-cyan text-[10px] font-mono uppercase tracking-widest">
                        {project.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-white/50 text-[10px] font-mono">
                        {project.language}
                      </span>
                    </div>
                    <p className="text-sm text-white/50 mb-3 max-w-2xl">{project.description}</p>
                    <div className="flex items-center gap-2">
                      {project.tags?.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-white/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
                    >
                      <ExternalLink size={14} className="text-white/60" />
                    </a>
                    <button
                      onClick={() => toggleVisibility(project.id, project.visible)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        project.visible ? "border-green-500/30 text-green-500" : "border-white/10 text-white/30"
                      } hover:bg-white/5`}
                    >
                      {project.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2.5 rounded-xl border border-red-500/20 text-red-500/60 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Add Project Panel (Slide-over) ─────────── */}
      <AnimatePresence>
        {showAddPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetPanel}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#0f1420] border-l border-white/5 z-50 overflow-y-auto"
            >
              <div className="p-8">
                {/* Panel Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">Add Project</h2>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mt-1">GitHub → Ollama → Supabase</p>
                  </div>
                  <button onClick={resetPanel} className="p-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                    <X size={16} className="text-white/60" />
                  </button>
                </div>

                {/* Step: Input URL */}
                {step === "input" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">GitHub Repository URL</label>
                      <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                          type="url"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://github.com/username/repo"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-accent-cyan/50 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleFetchRepo}
                      disabled={!githubUrl.includes("github.com")}
                      className="w-full py-4 rounded-xl bg-accent-cyan text-[#0B0F19] font-bold text-xs uppercase tracking-widest hover:bg-accent-cyan/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Search size={16} />
                      Analyze Repository
                    </button>
                  </div>
                )}

                {/* Step: Fetching */}
                {step === "fetching" && (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="animate-spin text-accent-cyan" size={32} />
                    <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Fetching repository data...</p>
                  </div>
                )}

                {/* Step: Analyzing with Ollama */}
                {step === "analyzing" && (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Sparkles className="animate-pulse text-accent-cyan" size={32} />
                    <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Ollama is analyzing...</p>
                    <p className="text-[10px] text-white/20 font-mono">Model: mistral</p>
                  </div>
                )}

                {/* Step: Review & Edit */}
                {step === "review" && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                      <Check size={16} className="text-green-500" />
                      <span className="text-green-400 text-xs font-mono uppercase tracking-widest">Analysis complete — Review below</span>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Project Title</label>
                      <input
                        value={editableProject.title}
                        onChange={(e) => setEditableProject(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-accent-cyan/50 outline-none"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Description (by Ollama)</label>
                      <textarea
                        value={editableProject.description}
                        onChange={(e) => setEditableProject(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-accent-cyan/50 outline-none resize-none"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Category</label>
                      <div className="grid grid-cols-4 gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setEditableProject(prev => ({ ...prev, category: cat }))}
                            className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                              editableProject.category === cat
                                ? "bg-accent-cyan/10 border-accent-cyan/50 text-accent-cyan"
                                : "bg-white/[0.02] border-white/10 text-white/40 hover:text-white/60"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {editableProject.tags.map((tag, i) => (
                          <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs font-mono text-white/60">
                            {tag}
                            <button
                              onClick={() => setEditableProject(prev => ({
                                ...prev,
                                tags: prev.tags.filter((_, idx) => idx !== i)
                              }))}
                              className="text-white/30 hover:text-red-400"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Language</label>
                      <input
                        value={editableProject.language}
                        onChange={(e) => setEditableProject(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-accent-cyan/50 outline-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-4 rounded-xl bg-accent-cyan text-[#0B0F19] font-bold text-xs uppercase tracking-widest hover:bg-accent-cyan/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save to Database
                      </button>
                      <button
                        onClick={resetPanel}
                        className="px-6 py-4 rounded-xl border border-white/10 text-white/60 text-xs uppercase tracking-widest hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
