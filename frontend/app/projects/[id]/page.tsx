'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { ProjectDetail, Angle, Script, StoryboardScene, MetadataOutput } from '../../../lib/types';
import AngleCard from '../../../components/angle-card';
import { 
  ArrowLeft, Sparkles, Loader2, CheckCircle2, Lock,
  Target, FileText, Image as ImageIcon, Search, Copy, Check,
  Video, Calendar, AlertCircle, RefreshCw, HelpCircle, Edit3, Eye, Check as SaveIcon
} from 'lucide-react';

// Clipboard Copy Helper Component
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold shadow-sm"
      title="Salin ke papan klip"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-600">Tersalin</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-450" />
          <span>Salin</span>
        </>
      )}
    </button>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = ({ message }: { message: string }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-5 shadow-md animate-pulse">
    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
      <Loader2 className="animate-spin h-5 w-5 text-blue-600 shrink-0" />
      <div className="space-y-0.5">
        <h4 className="text-xs font-bold text-slate-800">{message}</h4>
        <p className="text-[10px] text-slate-400 font-medium">Gemini AI sedang memproses detail konten...</p>
      </div>
    </div>
    <div className="space-y-3 pt-2">
      <div className="h-3 bg-slate-100 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-5/6" />
      <div className="h-3 bg-slate-50 rounded w-2/3" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
    </div>
  </div>
);

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedAngleId, setSelectedAngleId] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number | undefined>(undefined);
  const [imageReference, setImageReference] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'angles' | 'script' | 'storyboard' | 'metadata'>('angles');

  // Script Edit State variables
  const [editedScript, setEditedScript] = useState<string>('');
  const [isEditingScript, setIsEditingScript] = useState(false);

  useEffect(() => {
    if (project) {
      if (project.status === 'created' || project.status === 'angles_generated') {
        setActiveTab('angles');
      } else if (project.status === 'angle_selected') {
        setActiveTab('script');
      } else if (project.status === 'script_generated') {
        setActiveTab('storyboard');
      } else {
        setActiveTab('metadata');
      }
    }
  }, [project?.status]);

  // Sync edited script state when project script changes
  useEffect(() => {
    if (project?.scripts && project.scripts.length > 0) {
      setEditedScript(project.scripts[0].content);
    }
  }, [project?.scripts]);

  const fetchProject = useCallback(async () => {
    try {
      const data = await api.getProject(projectId);
      setProject(data);
      if (data.selected_angle_id) {
        setSelectedAngleId(data.selected_angle_id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleGenerateAngles = async () => {
    setActionLoading('angles');
    setError(null);
    try {
      await api.generateAngles(projectId);
      await fetchProject();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate angles');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSelectAngle = async () => {
    if (!selectedAngleId) return;
    setActionLoading('select');
    setError(null);
    try {
      await api.selectAngle(projectId, selectedAngleId);
      await fetchProject();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to select angle');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateScript = async () => {
    setActionLoading('script');
    setError(null);
    try {
      await api.generateScript(projectId, wordCount);
      await fetchProject();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateStoryboard = async () => {
    setActionLoading('storyboard');
    setError(null);
    try {
      await api.generateStoryboard(projectId, imageReference || undefined);
      await fetchProject();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate storyboard');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateMetadata = async () => {
    setActionLoading('metadata');
    setError(null);
    try {
      await api.generateMetadata(projectId);
      await fetchProject();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate metadata');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleEditScript = async () => {
    if (isEditingScript) {
      setActionLoading('save_script');
      setError(null);
      try {
        await api.updateScript(projectId, editedScript);
        await fetchProject();
        setIsEditingScript(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to save script');
      } finally {
        setActionLoading(null);
      }
    } else {
      setIsEditingScript(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4">
        <Loader2 className="animate-spin h-7 w-7 text-[#7d2ae8] mx-auto" />
        <p className="text-slate-500 text-xs font-semibold">Memuat detail proyek...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <p className="text-red-650 font-bold text-sm">Proyek tidak ditemukan.</p>
        <button onClick={() => router.push('/projects')} className="text-xs text-slate-500 hover:text-slate-800 underline">
          Kembali ke Proyek Saya
        </button>
      </div>
    );
  }

  const statusSteps = ['created', 'angles_generated', 'angle_selected', 'script_generated', 'storyboard_generated', 'completed'];
  const currentStep = statusSteps.indexOf(project.status);

  // Steps metadata
  const stepItems = [
    { key: 'angles', name: 'Content Angles', stepIndex: 1, icon: Target, desc: 'Tentukan sudut pandang konten' },
    { key: 'script', name: 'Naskah Video', stepIndex: 2, icon: FileText, desc: 'Tulis narasi & naskah VO' },
    { key: 'storyboard', name: 'Storyboard Visual', stepIndex: 3, icon: ImageIcon, desc: 'Rencanakan visual per scene' },
    { key: 'metadata', name: 'Metadata & SEO', stepIndex: 4, icon: Search, desc: 'Optimalkan judul, tags & deskripsi' },
  ];

  const ActionButton = ({ onClick, loading: isLoading, label, icon: Icon }: { onClick: () => void; loading: boolean; label: string; icon?: any }) => (
    <button
      onClick={onClick}
      disabled={isLoading || actionLoading !== null}
      className="w-full bg-[#7d2ae8] hover:bg-[#681ebb] text-white font-semibold shadow-md shadow-[#7d2ae8]/10 active:scale-[0.98] transition-all duration-150 rounded-xl py-3 flex items-center justify-center gap-2 text-xs"
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin h-4 w-4 text-white" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 text-white" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100 text-slate-800 font-sans">
      
      {/* 1. Top Header Bar */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/projects')}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Kembali ke Proyek Saya"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold hover:underline cursor-pointer" onClick={() => router.push('/projects')}>Library</span>
            <span className="text-slate-350 text-xs">/</span>
            <h1 className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[200px] md:max-w-md">{project.topic}</h1>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 ml-4">
            <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-550 px-2 py-0.5 rounded font-semibold">
              {project.niche || 'General'}
            </span>
            <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-550 px-2 py-0.5 rounded font-semibold">
              {project.platform}
            </span>
            <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-550 px-2 py-0.5 rounded font-semibold">
              {project.duration}
            </span>
          </div>
        </div>

        {/* Header Progress & Status Badge */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Progress</span>
              <span className="text-[#7d2ae8]">{Math.round((currentStep / (statusSteps.length - 1)) * 100)}%</span>
            </div>
            <div className="w-20 h-1 bg-slate-250 rounded-full overflow-hidden flex gap-0.5">
              {statusSteps.map((s, i) => (
                <div 
                  key={s} 
                  className={`h-full flex-1 transition-all duration-300 ${
                    i <= currentStep ? 'bg-[#7d2ae8]' : 'bg-slate-300'
                  }`} 
                />
              ))}
            </div>
          </div>
          
          <div className="h-4 w-[1px] bg-slate-250" />

          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            project.status === 'completed' 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-violet-50 text-[#7d2ae8] border-violet-100/60'
          }`}>
            {project.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5" />}
            {project.status.replace(/_/g, ' ')}
          </span>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Pane 1: Left Steps Nav Deck */}
        <nav className="w-52 bg-white border-r border-slate-200 flex flex-col py-6 px-4 gap-1.5 shrink-0 shadow-sm">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-3 mb-2">Workspace Pipeline</span>
          {stepItems.map((step) => {
            const isCompleted = currentStep > step.stepIndex || (step.stepIndex === 1 && currentStep >= 2);
            const isCurrent = currentStep === step.stepIndex || (step.stepIndex === 1 && currentStep === 0);
            const isUnlocked = step.key === 'angles' || 
              (step.key === 'script' && currentStep >= 2) || 
              (step.key === 'storyboard' && currentStep >= 3) || 
              (step.key === 'metadata' && currentStep >= 4);

            const isActiveTab = activeTab === step.key;

            return (
              <button
                key={step.key}
                disabled={!isUnlocked}
                onClick={() => setActiveTab(step.key as any)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-xs font-bold transition-all ${
                  isActiveTab 
                    ? 'bg-[#7d2ae8]/8 text-[#7d2ae8] border border-[#7d2ae8]/20 shadow-sm'
                    : isUnlocked
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    : 'text-slate-300 opacity-50 cursor-not-allowed'
                }`}
                title={step.name}
              >
                <div className="flex items-center gap-2.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#7d2ae8] shrink-0 animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-250 shrink-0" />
                  )}
                  <span>{step.name}</span>
                </div>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-350" />}
              </button>
            );
          })}
        </nav>

        {/* Pane 2: Middle Control Sidebar */}
        <aside className="w-72 bg-slate-50/65 border-r border-slate-200 p-5 flex flex-col justify-between shrink-0 overflow-y-auto shadow-sm">
          <div className="space-y-5">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Langkah {stepItems.find(s => s.key === activeTab)?.stepIndex || 1}
              </span>
              <h2 className="text-sm font-bold text-slate-800 mt-1">
                {stepItems.find(s => s.key === activeTab)?.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {stepItems.find(s => s.key === activeTab)?.desc}
              </p>
            </div>

            <div className="h-[1px] bg-slate-200" />

            {/* Step-specific generation options */}
            <div className="space-y-4">
              {activeTab === 'angles' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    AI akan menghasilkan 5 sudut pandang konten (angles) alternatif berdasarkan deskripsi proyek Anda.
                  </p>
                  {currentStep < 1 && (
                    <ActionButton 
                      onClick={handleGenerateAngles} 
                      loading={actionLoading === 'angles'} 
                      label="Generate Angles" 
                      icon={Sparkles} 
                    />
                  )}
                  {currentStep >= 1 && (
                    <div className="p-3 bg-white border border-emerald-100 rounded-xl space-y-1.5 shadow-sm shadow-emerald-500/5">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Angles Terkunci
                      </span>
                      <p className="text-[10px] text-slate-550 leading-relaxed">
                        Sudut pandang konten telah dikunci. Lanjutkan ke langkah berikutnya di menu kiri untuk menyusun naskah.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'script' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="word-count" className="text-xs font-bold text-slate-650">Target Jumlah Kata:</label>
                    <select
                      id="word-count"
                      value={wordCount || ''}
                      onChange={(e: any) => setWordCount(e.target.value ? Number(e.target.value) : undefined)}
                      disabled={actionLoading !== null || currentStep > 2}
                      className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer focus:border-[#7d2ae8] focus:ring-4 focus:ring-[#7d2ae8]/10 transition-colors shadow-sm"
                    >
                      <option value="">Jumlah Kata: Otomatis</option>
                      <option value="50">~50 kata (15-30 detik)</option>
                      <option value="100">~100 kata (30-45 detik)</option>
                      <option value="150">~150 kata (45-60 detik)</option>
                      <option value="200">~200 kata (60+ detik)</option>
                    </select>
                  </div>
                  {currentStep === 2 && (
                    <ActionButton 
                      onClick={handleGenerateScript} 
                      loading={actionLoading === 'script'} 
                      label="Generate Script" 
                      icon={Sparkles} 
                    />
                  )}
                  {currentStep > 2 && (
                    <div className="p-3 bg-white border border-emerald-100 rounded-xl space-y-1 shadow-sm shadow-emerald-500/5">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Naskah Selesai
                      </span>
                      <p className="text-[10px] text-slate-550">
                        Naskah VO berhasil di-generate dan dikunci.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'storyboard' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="image-reference" className="text-xs font-bold text-slate-650">Referensi Gaya Visual:</label>
                    <input
                      id="image-reference"
                      type="text"
                      placeholder="Contoh: 3D render, studio ghibli style..."
                      value={imageReference}
                      onChange={(e: any) => setImageReference(e.target.value)}
                      disabled={actionLoading !== null || currentStep > 3}
                      className="w-full bg-white border border-slate-200 focus:border-[#7d2ae8] focus:ring-4 focus:ring-[#7d2ae8]/10 text-slate-800 rounded-xl px-3 py-2 text-xs placeholder-slate-400 outline-none transition-colors shadow-sm"
                    />
                  </div>
                  {currentStep === 3 && (
                    <ActionButton 
                      onClick={handleGenerateStoryboard} 
                      loading={actionLoading === 'storyboard'} 
                      label="Generate Storyboard" 
                      icon={Sparkles} 
                    />
                  )}
                  {currentStep > 3 && (
                    <div className="p-3 bg-white border border-emerald-100 rounded-xl space-y-1 shadow-sm shadow-emerald-500/5">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Storyboard Selesai
                      </span>
                      <p className="text-[10px] text-slate-550">
                        Storyboard visual per adegan berhasil dikunci.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    AI akan menganalisis naskah untuk menghasilkan tags, deskripsi lengkap, rekomendasi judul SEO, serta pinned comments.
                  </p>
                  {currentStep === 4 && (
                    <ActionButton 
                      onClick={handleGenerateMetadata} 
                      loading={actionLoading === 'metadata'} 
                      label="Generate SEO Metadata" 
                      icon={Sparkles} 
                    />
                  )}
                  {project.status === 'completed' && (
                    <div className="p-3 bg-white border border-emerald-100 rounded-xl space-y-1 shadow-sm shadow-emerald-500/5">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Proyek Selesai!
                      </span>
                      <p className="text-[10px] text-slate-550">
                        Semua aset promosi viral siap digunakan.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Panel Footer Diagnostic Alert */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-650 text-[11px] rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-100 border border-slate-200/50 rounded-xl p-3 text-[10px] text-slate-500 flex gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
            <p className="leading-normal">Tip: Data disimpan otomatis ke database lokal. Gunakan pintasan salin cepat untuk mempermudah transfer aset.</p>
          </div>
        </aside>

        {/* Pane 3: Right Focus Workspace Area */}
        <main className="flex-1 bg-slate-100/40 overflow-y-auto p-6 md:p-8 flex justify-center items-start">
          <div className="max-w-4xl w-full">
            
            {/* The Document Artboard / Workspace Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-md shadow-slate-200/50 min-h-[500px] relative">
              
              {/* Angles Page Canvas */}
              {activeTab === 'angles' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Daftar Sudut Pandang (Angles)</h3>
                    {project.angles.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-bold">{project.angles.length} opsi tersedia</span>
                    )}
                  </div>

                  {actionLoading === 'angles' ? (
                    <LoadingSkeleton message="Gemini AI sedang merumuskan 5 sudut pandang konten kreatif..." />
                  ) : project.angles.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        {project.angles.map((angle: Angle) => (
                          <AngleCard
                            key={angle.id}
                            angle={angle}
                            selected={selectedAngleId === angle.id}
                            onSelect={(id) => setSelectedAngleId(id)}
                            disabled={currentStep >= 2}
                          />
                        ))}
                      </div>
                      
                      {currentStep === 1 && selectedAngleId && (
                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={handleSelectAngle}
                            disabled={actionLoading !== null}
                            className="bg-[#7d2ae8] hover:bg-[#681ebb] text-white font-semibold border border-[#7d2ae8]/10 shadow-md active:scale-[0.98] transition-all duration-150 rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Kunci & Gunakan Angle Ini</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-400 text-xs font-semibold">
                      Belum ada angles yang di-generate. Silakan gunakan panel kontrol tengah untuk memicu.
                    </div>
                  )}
                </div>
              )}

              {/* Script Page Canvas */}
              {activeTab === 'script' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Hasil Naskah Video / VO</h3>
                    
                    <div className="flex items-center gap-2">
                      {project.scripts.length > 0 && (
                        <>
                          <button
                            onClick={handleToggleEditScript}
                            disabled={actionLoading !== null}
                            type="button"
                            className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-850 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === 'save_script' ? (
                              <>
                                <Loader2 className="animate-spin h-3.5 w-3.5 text-slate-500" />
                                <span>Menyimpan...</span>
                              </>
                            ) : isEditingScript ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-slate-550" />
                                <span>Preview & Simpan</span>
                              </>
                            ) : (
                              <>
                                <Edit3 className="w-3.5 h-3.5 text-slate-550" />
                                <span>Edit Naskah</span>
                              </>
                            )}
                          </button>
                          <CopyButton text={editedScript || (project.scripts[0]?.content ?? '')} />
                        </>
                      )}
                    </div>
                  </div>

                  {actionLoading === 'script' ? (
                    <LoadingSkeleton message="Gemini AI sedang menulis narasi dan naskah Voice Over..." />
                  ) : project.scripts.length > 0 ? (
                    <div className="space-y-5">
                      
                      {/* Paper Document Layout */}
                      <div className="bg-slate-50/85 border border-slate-200 rounded-xl p-6 min-h-[350px] shadow-inner relative flex flex-col justify-between">
                        
                        {isEditingScript ? (
                          <textarea
                            value={editedScript}
                            onChange={(e: any) => setEditedScript(e.target.value)}
                            className="w-full flex-1 bg-slate-50/10 text-slate-800 text-xs font-mono outline-none resize-none leading-relaxed min-h-[300px] border-none p-0"
                            placeholder="Tulis naskah video Anda di sini..."
                          />
                        ) : (
                          <div className="text-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed flex-1">
                            {editedScript || project.scripts[0].content}
                          </div>
                        )}

                        {/* Text metrics */}
                        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                          <span>Word Count: {(editedScript || project.scripts[0].content).split(/\s+/).filter(Boolean).length}</span>
                          <span>•</span>
                          <span>Character Count: {(editedScript || project.scripts[0].content).length}</span>
                          <span>•</span>
                          <span>Est. Read Time: {Math.max(1, Math.round(((editedScript || project.scripts[0].content).split(/\s+/).filter(Boolean).length / 130) * 60))}s</span>
                        </div>
                      </div>
                      
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-400 text-xs font-semibold">
                      Belum ada naskah yang di-generate. Silakan gunakan panel kontrol tengah untuk memicu.
                    </div>
                  )}
                </div>
              )}

              {/* Storyboard Page Canvas */}
              {activeTab === 'storyboard' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Storyboard Visual & Petunjuk Adegan</h3>
                    {project.storyboards.length > 0 && (
                      <span className="text-[10px] text-slate-450 font-semibold">{project.storyboards.length} scene terencana</span>
                    )}
                  </div>

                  {actionLoading === 'storyboard' ? (
                    <LoadingSkeleton message="Gemini AI sedang menyusun storyboard scene-by-scene..." />
                  ) : project.storyboards.length > 0 ? (
                    <div className="space-y-4">
                      
                      {/* Shot Timeline strip */}
                      <div className="grid grid-cols-1 gap-4">
                        {project.storyboards
                          .sort((a: StoryboardScene, b: StoryboardScene) => a.scene_number - b.scene_number)
                          .map((scene: StoryboardScene) => (
                            <div key={scene.id} className="bg-white border border-slate-200/80 hover:border-slate-350 rounded-xl p-4 space-y-4 transition-colors shadow-sm shadow-slate-100">
                              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-[#7d2ae8] bg-[#7d2ae8]/5 border border-[#7d2ae8]/15 px-2.5 py-0.5 rounded">
                                    Scene {scene.scene_number}
                                  </span>
                                  {scene.duration && (
                                    <span className="text-[10px] font-semibold text-slate-500">
                                      ⏱️ {scene.duration}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Voice Over Text block */}
                                <div className="space-y-1 bg-slate-50 border border-slate-100 p-3 rounded-lg shadow-inner">
                                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Audio / Voice-Over</span>
                                  <p className="text-xs text-slate-800 leading-relaxed font-mono pl-2 border-l border-[#7d2ae8]">
                                    {scene.voice_over || 'No voice-over script'}
                                  </p>
                                </div>

                                {/* Visual description block */}
                                <div className="space-y-1 bg-slate-50 border border-slate-100 p-3 rounded-lg shadow-inner">
                                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Visual Cue Description</span>
                                  <p className="text-xs text-slate-600 leading-relaxed pl-2 border-l border-slate-350">
                                    {scene.visual || 'No visual description'}
                                  </p>
                                </div>
                              </div>

                              {/* AI generation parameter prompt block */}
                              {(scene.image_prompt || scene.video_prompt) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                  {scene.image_prompt && (
                                    <div className="bg-slate-50/50 border border-slate-150 p-3 rounded-lg space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                                          <ImageIcon className="w-3.5 h-3.5 text-[#7d2ae8]" /> Image Prompt
                                        </span>
                                        <CopyButton text={`${scene.image_prompt} --ar 9:16 --v 6.0 --stylize 250`} />
                                      </div>
                                      <p className="text-[10px] text-slate-700 leading-relaxed font-mono line-clamp-3 select-all bg-white p-2 rounded border border-slate-200">
                                        {scene.image_prompt} --ar 9:16 --v 6.0
                                      </p>
                                    </div>
                                  )}
                                  {scene.video_prompt && (
                                    <div className="bg-slate-50/50 border border-slate-150 p-3 rounded-lg space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                                          <Video className="w-3.5 h-3.5 text-[#7d2ae8]" /> Video Prompt
                                        </span>
                                        <CopyButton text={scene.video_prompt} />
                                      </div>
                                      <p className="text-[10px] text-slate-700 leading-relaxed font-mono line-clamp-3 select-all bg-white p-2 rounded border border-slate-200">
                                        {scene.video_prompt}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-400 text-xs font-semibold">
                      Belum ada storyboard yang di-generate. Silakan gunakan panel kontrol tengah untuk memicu.
                    </div>
                  )}
                </div>
              )}

              {/* Metadata & SEO Posting Page */}
              {activeTab === 'metadata' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">SEO & Posting Metadata</h3>
                  </div>

                  {actionLoading === 'metadata' ? (
                    <LoadingSkeleton message="Gemini AI sedang merumuskan tags, judul, deskripsi & komentar tersemat..." />
                  ) : project.metadata_outputs.length > 0 ? (
                    
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                      
                      {/* Social Media Mobile Preview Mockup */}
                      <div className="w-72 bg-slate-900 border-4 border-slate-750 rounded-[32px] p-3 shadow-2xl relative shrink-0 aspect-[9/16] overflow-hidden select-none">
                        
                        {/* Notch bar */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-20" />
                        
                        {/* Video Simulated screen wrapper */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-blue-950/20 to-slate-950 flex flex-col justify-end p-4 text-xs">
                          
                          {/* Post texts overlay */}
                          <div className="space-y-2 z-10 text-slate-200 pr-10">
                            
                            {/* Profile Tag */}
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-[#7d2ae8] flex items-center justify-center text-white font-bold text-[9px]">
                                VO
                              </div>
                              <span className="font-bold text-zinc-250">@viral_creator</span>
                            </div>

                            {/* Simulated caption text */}
                            <p className="line-clamp-3 leading-relaxed text-[10px] text-zinc-300 font-medium">
                              {project.metadata_outputs[0].titles[0]}
                              <br />
                              {project.metadata_outputs[0].tags.slice(0, 3).map((tag: string) => `#${tag} `)}
                            </p>
                            
                            {/* Soundtrack bar */}
                            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400">
                              <Video className="w-3 h-3 text-zinc-550 animate-pulse" />
                              <span>Original Audio - @viral_creator</span>
                            </div>
                          </div>

                          {/* Post right interaction controls */}
                          <div className="absolute right-3.5 bottom-12 flex flex-col items-center gap-4 text-[9px] text-zinc-400 z-10">
                            <div className="flex flex-col items-center gap-0.5">
                              <div className="w-8 h-8 rounded-full bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-center text-sm shadow-md">
                                ❤️
                              </div>
                              <span className="font-bold">1.2K</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <div className="w-8 h-8 rounded-full bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-center text-sm shadow-md">
                                💬
                              </div>
                              <span className="font-bold">38</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <div className="w-8 h-8 rounded-full bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-center text-sm shadow-md">
                                ↗️
                              </div>
                              <span className="font-bold">94</span>
                            </div>
                            <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center animate-spin">
                              💿
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SEO Fields Deck */}
                      <div className="flex-1 space-y-5 w-full">
                        
                        {/* Recommended Titles */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Rekomendasi Judul Konten</h4>
                            <CopyButton text={project.metadata_outputs[0].titles.join('\n')} />
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {project.metadata_outputs[0].titles.map((titleText: string, idx: number) => (
                              <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-xs text-slate-800 shadow-sm">
                                <span>{idx + 1}. <strong>{titleText}</strong></span>
                                <CopyButton text={titleText} />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Deskripsi Lengkap</h4>
                            <CopyButton text={project.metadata_outputs[0].description || ''} />
                          </div>
                          <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-mono max-h-[160px] overflow-y-auto shadow-sm">
                            {project.metadata_outputs[0].description}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Hashtags</h4>
                            <CopyButton text={project.metadata_outputs[0].tags.join(', ')} />
                          </div>
                          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-wrap gap-2 shadow-sm">
                            {project.metadata_outputs[0].tags.map((tagText: string, idx: number) => (
                              <span key={idx} className="text-[10px] bg-white border border-slate-200 text-slate-650 px-2.5 py-1 rounded-md font-semibold">
                                #{tagText}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Pinned Comments */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Komentar Tersemat (Pinned Comments)</h4>
                            <CopyButton text={project.metadata_outputs[0].pinned_comments.join('\n')} />
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {project.metadata_outputs[0].pinned_comments.map((commentText: string, idx: number) => (
                              <div key={idx} className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-xs text-slate-700 flex items-start justify-between gap-3 font-mono shadow-sm">
                                <p className="leading-relaxed">💬 &ldquo;{commentText}&rdquo;</p>
                                <CopyButton text={commentText} />
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-400 text-xs font-semibold">
                      Belum ada SEO metadata yang di-generate. Silakan gunakan panel kontrol tengah untuk memicu.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
