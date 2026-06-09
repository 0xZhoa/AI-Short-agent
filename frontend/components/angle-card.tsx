'use client';

import React from 'react';
import { Angle } from '../lib/types';
import { Check } from 'lucide-react';

interface AngleCardProps {
  angle: Angle;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function AngleCard({ angle, selected, onSelect, disabled }: AngleCardProps) {
  return (
    <button
      onClick={() => onSelect(angle.id)}
      disabled={disabled}
      type="button"
      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 relative group flex items-start gap-3.5 ${
        selected
          ? 'border-[#7d2ae8] bg-[#7d2ae8]/5 shadow-sm shadow-[#7d2ae8]/5'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}`}
    >
      <div className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-all ${
        selected
          ? 'border-[#7d2ae8] bg-[#7d2ae8] text-white'
          : 'border-slate-300 bg-slate-50 group-hover:border-slate-400'
      }`}>
        {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
      </div>

      <div className="space-y-1.5 flex-1 pr-4">
        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#7d2ae8] transition-colors leading-snug">
          {angle.title}
        </h4>
        {angle.hook && (
          <p className="text-[10px] text-[#7d2ae8] font-semibold italic bg-[#7d2ae8]/5 border border-[#7d2ae8]/15 px-2 py-0.5 rounded-md inline-block">
            Hook: &ldquo;{angle.hook}&rdquo;
          </p>
        )}
        {angle.description && (
          <p className="text-xs text-slate-500 leading-relaxed">
            {angle.description}
          </p>
        )}
      </div>
    </button>
  );
}
export default AngleCard;
