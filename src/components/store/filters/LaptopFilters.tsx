import React, { useState } from 'react';
import { Check } from 'lucide-react';
import {
  LAPTOP_BRANDS,
  CELULAR_PRICE_RANGES,
  LAPTOP_SCREEN_SIZES,
  LAPTOP_PROCESSORS,
  LAPTOP_CORES,
  LAPTOP_CAPACITIES,
  LAPTOP_RAMS,
  LAPTOP_OS,
  LAPTOP_DISPLAY_FEATURES
} from '../../../data/categoryFiltersData';
import {
  DeliveryFilterSection,
  RatingFilterSection,
  SellerFilterSection
} from './CommonFilterSections';

export interface LaptopFiltersProps {
  deliveryTypeFilter: 'all' | 'domicilio' | 'retiro';
  setDeliveryTypeFilter: (val: 'all' | 'domicilio' | 'retiro') => void;

  selectedBrand: string;
  setSelectedBrand: (val: string) => void;

  minRating: number;
  setMinRating: (val: number) => void;

  priceRange: string;
  setPriceRange: (val: string) => void;

  soldByFilter: string;
  setSoldByFilter: (val: string) => void;

  laptopScreenSize: string;
  setLaptopScreenSize: (val: string) => void;

  processor: string;
  setProcessor: (val: string) => void;

  selectedCores: string;
  setSelectedCores: (val: string) => void;

  selectedCapacity: string;
  setSelectedCapacity: (val: string) => void;

  ram: string;
  setRam: (val: string) => void;

  operatingSystem: string;
  setOperatingSystem: (val: string) => void;

  screenFeature: string;
  setScreenFeature: (val: string) => void;
}

export const LaptopFilters: React.FC<LaptopFiltersProps> = ({
  deliveryTypeFilter,
  setDeliveryTypeFilter,
  selectedBrand,
  setSelectedBrand,
  minRating,
  setMinRating,
  priceRange,
  setPriceRange,
  soldByFilter,
  setSoldByFilter,
  laptopScreenSize,
  setLaptopScreenSize,
  processor,
  setProcessor,
  selectedCores,
  setSelectedCores,
  selectedCapacity,
  setSelectedCapacity,
  ram,
  setRam,
  operatingSystem,
  setOperatingSystem,
  screenFeature,
  setScreenFeature
}) => {
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [showMoreScreenSizes, setShowMoreScreenSizes] = useState(false);
  const [showMoreProcessors, setShowMoreProcessors] = useState(false);
  const [showMoreCores, setShowMoreCores] = useState(false);
  const [showMoreCapacities, setShowMoreCapacities] = useState(false);
  const [showMoreRams, setShowMoreRams] = useState(false);
  const [showMoreOs, setShowMoreOs] = useState(false);
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. Tipo de Entrega */}
      <DeliveryFilterSection
        deliveryTypeFilter={deliveryTypeFilter}
        setDeliveryTypeFilter={setDeliveryTypeFilter}
      />

      {/* 2. Marca • Mejores marcas */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Marca • Mejores marcas
          </label>
          {selectedBrand !== 'Todas' && (
            <button
              type="button"
              onClick={() => setSelectedBrand('Todas')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedBrand('Todas')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
              selectedBrand === 'Todas'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <span>Todas las marcas</span>
          </button>
          {(showMoreBrands ? LAPTOP_BRANDS : LAPTOP_BRANDS.slice(0, 10)).map((marca) => {
            const isActive = selectedBrand.toLowerCase() === marca.toLowerCase();
            return (
              <button
                key={marca}
                type="button"
                onClick={() => setSelectedBrand(isActive ? 'Todas' : marca)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{marca}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreBrands(!showMoreBrands)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreBrands ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 3. Calificación del producto */}
      <RatingFilterSection minRating={minRating} setMinRating={setMinRating} />

      {/* 4. Precio */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Precio
          </label>
          {priceRange !== 'all' && (
            <button
              type="button"
              onClick={() => setPriceRange('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          {CELULAR_PRICE_RANGES.map((r) => {
            const isActive = priceRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setPriceRange(r.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{r.label}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Vendido por */}
      <SellerFilterSection soldByFilter={soldByFilter} setSoldByFilter={setSoldByFilter} />

      {/* 6. Tamaño de la pantalla */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Tamaño de la pantalla
          </label>
          {laptopScreenSize !== 'all' && (
            <button
              type="button"
              onClick={() => setLaptopScreenSize('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setLaptopScreenSize('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              laptopScreenSize === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todos
          </button>
          {(showMoreScreenSizes ? LAPTOP_SCREEN_SIZES : LAPTOP_SCREEN_SIZES.slice(0, 10)).map((sz) => {
            const isActive = laptopScreenSize === sz;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => setLaptopScreenSize(isActive ? 'all' : sz)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{sz}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreScreenSizes(!showMoreScreenSizes)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreScreenSizes ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 7. Procesador */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Procesador
          </label>
          {processor !== 'all' && (
            <button
              type="button"
              onClick={() => setProcessor('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setProcessor('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              processor === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todos
          </button>
          {(showMoreProcessors ? LAPTOP_PROCESSORS : LAPTOP_PROCESSORS.slice(0, 10)).map((proc) => {
            const isActive = processor.toLowerCase() === proc.toLowerCase();
            return (
              <button
                key={proc}
                type="button"
                onClick={() => setProcessor(isActive ? 'all' : proc)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs capitalize transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{proc}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreProcessors(!showMoreProcessors)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreProcessors ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 8. Núcleos del procesador */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Núcleos del procesador
          </label>
          {selectedCores !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCores('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedCores('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              selectedCores === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todos
          </button>
          {(showMoreCores ? LAPTOP_CORES : LAPTOP_CORES.slice(0, 8)).map((c) => {
            const isActive = selectedCores.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCores(isActive ? 'all' : c)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs capitalize transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{c}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreCores(!showMoreCores)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreCores ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 9. Capacidad */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Capacidad
          </label>
          {selectedCapacity !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCapacity('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedCapacity('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              selectedCapacity === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas
          </button>
          {(showMoreCapacities ? LAPTOP_CAPACITIES : LAPTOP_CAPACITIES.slice(0, 10)).map((cap) => {
            const isActive = selectedCapacity.toLowerCase() === cap.toLowerCase();
            return (
              <button
                key={cap}
                type="button"
                onClick={() => setSelectedCapacity(isActive ? 'all' : cap)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{cap}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreCapacities(!showMoreCapacities)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreCapacities ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 10. Memoria RAM */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Memoria RAM
          </label>
          {ram !== 'all' && (
            <button
              type="button"
              onClick={() => setRam('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setRam('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              ram === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas
          </button>
          {(showMoreRams ? LAPTOP_RAMS : LAPTOP_RAMS.slice(0, 8)).map((r) => {
            const isActive = ram.toLowerCase() === r.toLowerCase();
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRam(isActive ? 'all' : r)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{r}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreRams(!showMoreRams)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreRams ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 11. Sistema operativo */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Sistema operativo
          </label>
          {operatingSystem !== 'all' && (
            <button
              type="button"
              onClick={() => setOperatingSystem('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setOperatingSystem('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              operatingSystem === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todos
          </button>
          {(showMoreOs ? LAPTOP_OS : LAPTOP_OS.slice(0, 8)).map((osItem) => {
            const isActive = operatingSystem.toLowerCase() === osItem.toLowerCase();
            return (
              <button
                key={osItem}
                type="button"
                onClick={() => setOperatingSystem(isActive ? 'all' : osItem)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs capitalize transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{osItem}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreOs(!showMoreOs)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreOs ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 12. Características de la pantalla */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Características de la pantalla
          </label>
          {screenFeature !== 'all' && (
            <button
              type="button"
              onClick={() => setScreenFeature('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setScreenFeature('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              screenFeature === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas
          </button>
          {(showMoreFeatures ? LAPTOP_DISPLAY_FEATURES : LAPTOP_DISPLAY_FEATURES.slice(0, 8)).map((feat) => {
            const isActive = screenFeature.toLowerCase() === feat.toLowerCase();
            return (
              <button
                key={feat}
                type="button"
                onClick={() => setScreenFeature(isActive ? 'all' : feat)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs capitalize truncate transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span className="truncate pr-1">{feat}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreFeatures(!showMoreFeatures)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreFeatures ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>
    </div>
  );
};
