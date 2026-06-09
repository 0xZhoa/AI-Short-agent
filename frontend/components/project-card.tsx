'use client';

import React from 'react';
import { Project } from '../lib/types';
import { Calendar, Target, Tv, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Setup high-quality professional status tags
  const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    created: { 
      label: 'Draf', 
      bg: 'bg-slate-100 border-slate-200/50', 
      text: 'text-slate-600', 
      dot: 'bg-slate-400' 
    },
    angles_generated: { 
      label: 'Sudut Terbuat', 
      bg: 'bg-violet-50 border-violet-100/60', 
      text: 'text-[#7d2ae8]', 
      dot: 'bg-[#7d2ae8]' 
    },
    angle_selected: { 
      label: 'Sudut Terpilih', 
      bg: 'bg-violet-50 border-violet-100/60', 
      text: 'text-[#7d2ae8]', 
      dot: 'bg-[#7d2ae8]' 
    },
    script_generated: { 
      label: 'Naskah Siap', 
      bg: 'bg-teal-50 border-teal-100/60', 
      text: 'text-teal-650', 
      dot: 'bg-teal-500' 
    },
    storyboard_generated: { 
      label: 'Storyboard Siap', 
      bg: 'bg-rose-50 border-rose-100/60', 
      text: 'text-rose-600', 
      dot: 'bg-rose-500' 
    },
    completed: { 
      label: 'Selesai', 
      bg: 'bg-emerald-50 border-emerald-100/60', 
      text: 'text-emerald-650', 
      dot: 'bg-emerald-500' 
    },
  };

  const status = statusConfig[project.status] || { 
    label: project.status, 
    bg: 'bg-slate-100 border-slate-200/50', 
    text: 'text-slate-600', 
    dot: 'bg-slate-400' 
  };

  return (
    <a
      href={`/projects/${project.id}`}
      className="bg-white border border-slate-100 hover:border-slate-200 rounded-xl p-5 block transition-all duration-150 relative group active:scale-[0.99] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-slate-900 font-bold text-sm leading-snug group-hover:text-[#7d2ae8] transition-colors line-clamp-2 flex-1">
          {project.topic}
        </h3>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.bg} ${status.text} shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-slate-400" />
          <span>{project.niche || 'General'}</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1.5">
          <Tv className="w-3.5 h-3.5 text-slate-400" />
          <span>{project.platform || 'YouTube Shorts'}</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{new Date(project.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      {/* Sleek action indicator on hover */}
      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 text-[#7d2ae8] pointer-events-none">
        <ArrowRight className="w-4 h-4" />
      </div>
    </a>
  );
}
export default ProjectCard;
