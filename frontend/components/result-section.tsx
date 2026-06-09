'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ResultSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ResultSection({ title, children, defaultOpen = false }: ResultSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white shadow-sm shadow-slate-100">
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50/40 hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-bold text-slate-800 tracking-wide">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-[#7d2ae8]' : ''}`}
        />
      </button>
      {open && (
        <div className="p-6 border-t border-slate-150 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}
export default ResultSection;
