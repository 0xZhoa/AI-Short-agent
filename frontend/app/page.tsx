'use client';

import React, { useEffect, useState } from 'react';
import ProjectForm from '../components/project-form';
import ProjectCard from '../components/project-card';
import api from '../lib/api';
import { Project } from '../lib/types';
import { Sparkles, Video, FolderKanban, Plus, Loader2, ArrowRight } from 'lucide-react';

export default function Home() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await api.getProjects();
        // Take only the 4 most recent projects
        setRecentProjects(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load recent projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-12">
      {/* Sleek Minimal Header */}
      <div className="flex flex-col items-start space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7d2ae8]/5 border border-[#7d2ae8]/15 text-[10px] font-bold uppercase tracking-wider text-[#7d2ae8]">
          <Sparkles className="w-3.5 h-3.5 fill-[#7d2ae8]/10 text-[#7d2ae8] animate-pulse" />
          <span>Automated Video Content Engine</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Ubah Ide Menjadi <span className="bg-gradient-to-r from-[#7d2ae8] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">Konten Video Viral</span>
        </h1>
        <p className="text-sm text-slate-650 leading-relaxed">
          Buat video pendek untuk YouTube Shorts, TikTok, dan Instagram Reels secara instan.
          Rancang naskah, storyboard visual, hingga SEO metadata otomatis dengan kecerdasan buatan.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Column (Create Form) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workspace Brief</h3>
          </div>
          <ProjectForm />
        </div>

        {/* Right Library Column (Recent Projects) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-550 uppercase tracking-wider flex items-center gap-1.5">
              <FolderKanban className="w-4 h-4 text-slate-400" />
              Proyek Terbaru
            </h3>
            {recentProjects.length > 0 && (
              <a
                href="/projects"
                className="text-xs font-bold text-[#7d2ae8] hover:text-[#681ebb] flex items-center gap-1 transition-colors"
              >
                Lihat Semua
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {loading ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 flex flex-col items-center justify-center gap-2 shadow-sm shadow-slate-100/50">
              <Loader2 className="animate-spin h-6 w-6 text-slate-400" />
              <p className="text-xs text-slate-400 font-medium">Memuat proyek...</p>
            </div>
          ) : recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 border border-dashed border-slate-200 rounded-2xl space-y-4 bg-white/40 shadow-sm shadow-slate-100/20">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Video className="w-5 h-5 text-slate-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-slate-700 text-sm font-bold">Belum Ada Proyek</h4>
                <p className="text-slate-500 text-xs max-w-[240px] mx-auto leading-normal">
                  Rancang proyek pertama Anda menggunakan formulir di sebelah kiri.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
