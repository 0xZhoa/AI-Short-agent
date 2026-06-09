'use client';

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Project } from '../../lib/types';
import ProjectCard from '../../components/project-card';
import { Plus, FolderKanban, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-[#7d2ae8]" />
            Creator Library
          </h1>
          <p className="text-xs text-slate-550 font-medium">Daftar semua proyek konten video pendek yang Anda buat</p>
        </div>
        <a
          href="/"
          className="gradient-btn flex items-center justify-center gap-2 text-xs font-semibold rounded-xl px-4 py-2.5 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4 text-white" />
          Buat Proyek Baru
        </a>
      </div>

      {loading && (
        <div className="text-center py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin h-6 w-6 text-[#7d2ae8]" />
          <p className="text-slate-500 text-xs font-medium">Memuat daftar proyek Anda...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-650 text-xs rounded-xl flex items-center gap-2.5 max-w-xl mx-auto shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl max-w-xl mx-auto space-y-4 bg-white/40 shadow-sm shadow-slate-100/20">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Sparkles className="w-5 h-5 text-slate-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-slate-800 text-sm font-bold">Belum Ada Proyek</h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto leading-normal">Mulai hasilkan naskah dan storyboard dengan membuat proyek baru.</p>
          </div>
          <a
            href="/"
            className="inline-flex gradient-btn text-xs font-semibold rounded-xl px-4 py-2.5"
          >
            Mulai Sekarang
          </a>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

