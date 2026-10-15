import React from 'react';
import { Check, Star } from 'lucide-react';
import { COMMON_SELLERS, COMMON_COLORS, COMMON_CONDITIONS } from '../../../data/categoryFiltersData';

export interface BaseFilterProps {
  // Entrega
  deliveryTypeFilter: 'all' | 'domicilio' | 'retiro';
  setDeliveryTypeFilter: (val: 'all' | 'domicilio' | 'retiro') => void;

  // Calificación
  minRating: number;
  setMinRating: (val: number) => void;

  // Vendido por
  soldByFilter: string;
  setSoldByFilter: (val: string) => void;

  // Color
  selectedColor: string;
  setSelectedColor: (val: string) => void;

  // Condición
  conditionFilter: string;
  setConditionFilter: (val: string) => void;

  // Bluetooth
  selectedBluetooth: 'all' | 'si' | 'no';
  setSelectedBluetooth: (val: 'all' | 'si' | 'no') => void;
}

export const DeliveryFilterSection: React.FC<{
  deliveryTypeFilter: 'all' | 'domicilio' | 'retiro';
  setDeliveryTypeFilter: (val: 'all' | 'domicilio' | 'retiro') => void;
}> = ({ deliveryTypeFilter, setDeliveryTypeFilter }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
      Tipo de Entrega
    </label>
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => setDeliveryTypeFilter(deliveryTypeFilter === 'domicilio' ? 'all' : 'domicilio')}
        className={`w-full text-left p-2.5 rounded-xl border transition flex items-start justify-between ${
          deliveryTypeFilter === 'domicilio'
            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold'
            : 'border-white/[0.06] bg-[#0c1222] text-slate-300 hover:border-white/[0.2]'
        }`}
      >
        <div>
          <span className="font-bold text-xs text-white block">Envío a domicilio</span>
          <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">Llega mañana</span>
        </div>
        {deliveryTypeFilter === 'domicilio' && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
      </button>

      <button
        type="button"
        onClick={() => setDeliveryTypeFilter(deliveryTypeFilter === 'retiro' ? 'all' : 'retiro')}
        className={`w-full text-left p-2.5 rounded-xl border transition flex items-start justify-between ${
          deliveryTypeFilter === 'retiro'
            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold'
            : 'border-white/[0.06] bg-[#0c1222] text-slate-300 hover:border-white/[0.2]'
        }`}
      >
        <div>
          <span className="font-bold text-xs text-white block">Retiro en un punto</span>
          <span className="text-[10px] text-cyan-400 font-mono block mt-0.5">Retira mañana</span>
        </div>
        {deliveryTypeFilter === 'retiro' && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
      </button>
    </div>
  </div>
);

export const RatingFilterSection: React.FC<{
  minRating: number;
  setMinRating: (val: number) => void;
}> = ({ minRating, setMinRating }) => (
  <div className="space-y-2 pt-3 border-t border-white/[0.06]">
    <div className="flex items-center justify-between">
      <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
        Calificación del producto
      </label>
      {minRating > 0 && (
        <button
          type="button"
          onClick={() => setMinRating(0)}
          className="text-[10px] text-amber-400 hover:underline"
        >
          Limpiar
        </button>
      )}
    </div>
    <div className="space-y-1">
      {[
        { val: 0, label: 'Todas las calificaciones' },
        { val: 5.0, label: '5' },
        { val: 4.0, label: '4 y más' },
        { val: 3.0, label: '3 y más' },
        { val: 2.0, label: '2 y más' },
        { val: 1.0, label: '1 y más' }
      ].map((r) => (
        <button
          key={r.val}
          type="button"
          onClick={() => setMinRating(r.val)}
          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
            minRating === r.val
              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
              : 'text-slate-300 hover:bg-white/[0.05]'
          }`}
        >
          <span>{r.label}</span>
          {r.val > 0 && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
        </button>
      ))}
    </div>
  </div>
);

export const SellerFilterSection: React.FC<{
  soldByFilter: string;
  setSoldByFilter: (val: string) => void;
}> = ({ soldByFilter, setSoldByFilter }) => (
  <div className="space-y-2 pt-3 border-t border-white/[0.06]">
    <div className="flex items-center justify-between">
      <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
        Vendido por
      </label>
      {soldByFilter !== 'all' && (
        <button
          type="button"
          onClick={() => setSoldByFilter('all')}
          className="text-[10px] text-amber-400 hover:underline"
        >
          Limpiar
        </button>
      )}
    </div>
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setSoldByFilter('all')}
        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
          soldByFilter === 'all'
            ? 'bg-amber-500 text-black font-bold'
            : 'text-slate-300 hover:bg-white/[0.05]'
        }`}
      >
        <span>Todos</span>
      </button>
      {COMMON_SELLERS.map((s) => {
        const isActive = soldByFilter === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => setSoldByFilter(isActive ? 'all' : s.id)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between uppercase ${
              isActive
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <span>{s.label}</span>
            {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        );
      })}
    </div>
  </div>
);

export const ColorFilterSection: React.FC<{
  selectedColor: string;
  setSelectedColor: (val: string) => void;
}> = ({ selectedColor, setSelectedColor }) => (
  <div className="space-y-2 pt-3 border-t border-white/[0.06]">
    <div className="flex items-center justify-between">
      <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
        Color
      </label>
      {selectedColor !== 'all' && (
        <button
          type="button"
          onClick={() => setSelectedColor('all')}
          className="text-[10px] text-amber-400 hover:underline"
        >
          Limpiar
        </button>
      )}
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      <button
        type="button"
        onClick={() => setSelectedColor('all')}
        className={`col-span-2 text-left px-2 py-1 rounded-lg text-xs transition flex items-center justify-between ${
          selectedColor === 'all'
            ? 'bg-amber-500 text-black font-bold'
            : 'text-slate-300 hover:bg-white/[0.05]'
        }`}
      >
        <span>Todos los colores</span>
      </button>
      {COMMON_COLORS.map((c) => {
        const isActive = selectedColor === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedColor(isActive ? 'all' : c.id)}
            className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition ${
              isActive
                ? 'border-amber-500 bg-amber-500/10 text-white font-semibold'
                : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
              style={{ backgroundColor: c.hex }}
            />
            <span className="truncate text-[11px] capitalize">{c.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export const ConditionFilterSection: React.FC<{
  conditionFilter: string;
  setConditionFilter: (val: string) => void;
}> = ({ conditionFilter, setConditionFilter }) => (
  <div className="space-y-2 pt-3 border-t border-white/[0.06]">
    <div className="flex items-center justify-between">
      <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
        Condición del producto
      </label>
      {conditionFilter !== 'all' && (
        <button
          type="button"
          onClick={() => setConditionFilter('all')}
          className="text-[10px] text-amber-400 hover:underline"
        >
          Limpiar
        </button>
      )}
    </div>
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setConditionFilter('all')}
        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
          conditionFilter === 'all'
            ? 'bg-amber-500 text-black font-bold'
            : 'text-slate-300 hover:bg-white/[0.05]'
        }`}
      >
        <span>Todas</span>
      </button>
      {COMMON_CONDITIONS.map((cond) => {
        const isActive = conditionFilter === cond.id;
        return (
          <button
            key={cond.id}
            type="button"
            onClick={() => setConditionFilter(isActive ? 'all' : cond.id)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
              isActive
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <span>{cond.label}</span>
            {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        );
      })}
    </div>
  </div>
);

export const BluetoothFilterSection: React.FC<{
  selectedBluetooth: 'all' | 'si' | 'no';
  setSelectedBluetooth: (val: 'all' | 'si' | 'no') => void;
}> = ({ selectedBluetooth, setSelectedBluetooth }) => (
  <div className="space-y-2 pt-3 border-t border-white/[0.06]">
    <div className="flex items-center justify-between">
      <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
        Cuenta con bluetooth
      </label>
      {selectedBluetooth !== 'all' && (
        <button
          type="button"
          onClick={() => setSelectedBluetooth('all')}
          className="text-[10px] text-amber-400 hover:underline"
        >
          Limpiar
        </button>
      )}
    </div>
    <div className="grid grid-cols-3 gap-1.5">
      <button
        type="button"
        onClick={() => setSelectedBluetooth('all')}
        className={`p-1.5 rounded-lg text-center text-xs font-semibold transition border ${
          selectedBluetooth === 'all'
            ? 'bg-amber-500 text-black font-bold'
            : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
        }`}
      >
        Todos
      </button>
      <button
        type="button"
        onClick={() => setSelectedBluetooth(selectedBluetooth === 'no' ? 'all' : 'no')}
        className={`p-1.5 rounded-lg text-center text-xs font-semibold transition border ${
          selectedBluetooth === 'no'
            ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
            : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
        }`}
      >
        No
      </button>
      <button
        type="button"
        onClick={() => setSelectedBluetooth(selectedBluetooth === 'si' ? 'all' : 'si')}
        className={`p-1.5 rounded-lg text-center text-xs font-semibold transition border ${
          selectedBluetooth === 'si'
            ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
            : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
        }`}
      >
        Si
      </button>
    </div>
  </div>
);
