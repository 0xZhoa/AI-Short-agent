'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { Sparkles, Loader2, Target, Languages, Clock, Tv, Settings2, FileText, AlertCircle } from 'lucide-react';

export function ProjectForm() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('General');
  const [language, setLanguage] = useState('Indonesian');
  const [platform, setPlatform] = useState('YouTube Shorts');
  const [duration, setDuration] = useState('45-60 seconds');
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Topic is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const project = await api.createProject({
        topic: topic.trim(),
        niche,
        language,
        platform,
        duration,
        style: style.trim() || undefined,
      });

      router.push(`/projects/${project.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto relative shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7d2ae8] fill-[#7d2ae8]/10" />
          Buat Proyek Baru
        </h2>
        <p className="text-xs text-slate-500">
          Masukkan detail topik dan konsep untuk mulai menghasilkan naskah dan storyboard dengan AI.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-650 text-xs rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="topic" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Topik Konten <span className="text-[#7d2ae8] font-bold">*</span>
          </label>
          <input
            id="topic"
            type="text"
            required
            placeholder="Contoh: perbaiki postur dengan latihan 5 menit sehari"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
            maxLength={2000}
            className="w-full bg-white border border-slate-200 focus:border-[#7d2ae8] text-slate-800 rounded-xl px-3.5 py-3 text-sm placeholder-slate-400 outline-none transition-colors shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="niche" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              Niche / Kategori
            </label>
            <select
              id="niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              disabled={loading}
              className="w-full bg-white border border-slate-200 focus:border-[#7d2ae8] text-slate-800 rounded-xl px-3.5 py-3 text-sm outline-none transition-colors cursor-pointer shadow-sm"
            >
              <option value="General">Umum (General)</option>
              <option value="Fitness / Health">Fitness / Health</option>
              <option value="Posture / Mobility">Posture / Mobility</option>
              <option value="Football">Sepak Bola (Football)</option>
              <option value="Tech">Teknologi (Tech)</option>
              <option value="History">Sejarah (History)</option>
              <option value="Animal Story">Animal Story</option>
              <option value="ASMR">ASMR</option>
              <option value="Education">Edukasi (Education)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="language" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              Bahasa Konten
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={loading}
              className="w-full bg-white border border-slate-200 focus:border-[#7d2ae8] text-slate-800 rounded-xl px-3.5 py-3 text-sm outline-none transition-colors cursor-pointer shadow-sm"
            >
              <option value="Indonesian">Bahasa Indonesia</option>
              <option value="English">Bahasa Inggris (English)</option>
              <option value="Malay">Bahasa Melayu</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="platform" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-slate-400" />
              Platform Utama
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={loading}
              className="w-full bg-white border border-slate-200 focus:border-[#7d2ae8] text-slate-800 rounded-xl px-3.5 py-3 text-sm outline-none transition-colors cursor-pointer shadow-sm"
            >
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram Reels">Instagram Reels</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Durasi Konten
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={loading}
              className="w-full bg-white border border-slate-200 focus:border-[#7d2ae8] text-slate-800 rounded-xl px-3.5 py-3 text-sm outline-none transition-colors cursor-pointer shadow-sm"
            >
              <option value="15-30 seconds">15 - 30 detik</option>
              <option value="30-45 seconds">30 - 45 detik</option>
              <option value="45-60 seconds">45 - 60 detik</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="style" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            Gaya Konten &amp; Instruksi Tambahan (Opsional)
          </label>
          <textarea
            id="style"
            rows={3}
            placeholder="Contoh: cepat, penuh hype, edukatif, sarankan visual kartun, fokus fakta sejarah menarik..."
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            disabled={loading}
            className="w-full bg-white border border-slate-200 focus:border-[#7d2ae8] text-slate-800 rounded-xl px-3.5 py-3 text-sm placeholder-slate-400 outline-none resize-none transition-colors shadow-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full gradient-btn rounded-xl py-3 flex items-center justify-center gap-2 text-sm transition-colors animate-all"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 text-white" />
            <span>Memproses Ide Anda...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-white fill-white/20" />
            <span>Mulai Generate Konten</span>
          </>
        )}
      </button>
    </form>
  );
}

export default ProjectForm;
