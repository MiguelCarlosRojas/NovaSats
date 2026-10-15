import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface CollapsibleFilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  activeCount?: number;
  onClear?: () => void;
  children: React.ReactNode;
}

export const CollapsibleFilterSection: React.FC<CollapsibleFilterSectionProps> = ({
  title,
  defaultOpen = false,
  activeCount = 0,
  onClear,
  children
}) => {
  // Si tiene un filtro activo, forzar a estar abierto para comodidad del usuario
  const [isOpen, setIsOpen] = useState(defaultOpen || activeCount > 0);

  return (
    <div className="pt-3 border-t border-white/[0.06] first:pt-0 first:border-t-0">
      <div className="flex items-center justify-between py-1 group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center justify-between text-left pr-2 focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold group-hover:text-amber-400 transition">
              {title}
            </span>
            {activeCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Filtro activo" />
            )}
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-amber-400' : ''
            }`}
          />
        </button>

        {activeCount > 0 && onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="text-[10px] text-amber-400 hover:text-amber-300 hover:underline font-mono ml-2 shrink-0"
          >
            Limpiar
          </button>
        )}
      </div>

      {isOpen && (
        <div className="pt-2.5 pb-1 space-y-2 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};
