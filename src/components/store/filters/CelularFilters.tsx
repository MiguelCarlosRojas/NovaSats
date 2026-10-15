import React, { useState } from 'react';
import { Check } from 'lucide-react';
import {
  CELULAR_CATEGORIES,
  CELULAR_BRANDS,
  CELULAR_PRICE_RANGES,
  CELULAR_CAPACITIES,
  CELULAR_GENERATIONS,
  CELULAR_TALLAS,
  CELULAR_CORES,
  CELULAR_REFRESH_RATES,
  CELULAR_CAMERAS
} from '../../../data/categoryFiltersData';
import {
  DeliveryFilterSection,
  RatingFilterSection,
  SellerFilterSection,
  ColorFilterSection,
  ConditionFilterSection,
  BluetoothFilterSection
} from './CommonFilterSections';

export interface CelularFiltersProps {
  // Entrega
  deliveryTypeFilter: 'all' | 'domicilio' | 'retiro';
  setDeliveryTypeFilter: (val: 'all' | 'domicilio' | 'retiro') => void;

  // Subcategoría
  selectedSubcategory: string;
  setSelectedSubcategory: (val: string) => void;

  // Marca
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;

  // Precio
  priceRange: string;
  setPriceRange: (val: string) => void;

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

  // Capacidad
  selectedCapacity: string;
  setSelectedCapacity: (val: string) => void;

  // Generación
  selectedGeneracion: string;
  setSelectedGeneracion: (val: string) => void;

  // Talla
  selectedTalla: string;
  setSelectedTalla: (val: string) => void;

  // Núcleos
  selectedCores: string;
  setSelectedCores: (val: string) => void;

  // Velocidad de imagen
  selectedRefreshRate: string;
  setSelectedRefreshRate: (val: string) => void;

  // Cámara principal
  selectedCamera: string;
  setSelectedCamera: (val: string) => void;

  // Bluetooth
  selectedBluetooth: 'all' | 'si' | 'no';
  setSelectedBluetooth: (val: 'all' | 'si' | 'no') => void;
}

export const CelularFilters: React.FC<CelularFiltersProps> = ({
  deliveryTypeFilter,
  setDeliveryTypeFilter,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  soldByFilter,
  setSoldByFilter,
  selectedColor,
  setSelectedColor,
  conditionFilter,
  setConditionFilter,
  selectedCapacity,
  setSelectedCapacity,
  selectedGeneracion,
  setSelectedGeneracion,
  selectedTalla,
  setSelectedTalla,
  selectedCores,
  setSelectedCores,
  selectedRefreshRate,
  setSelectedRefreshRate,
  selectedCamera,
  setSelectedCamera,
  selectedBluetooth,
  setSelectedBluetooth
}) => {
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [showMoreCapacities, setShowMoreCapacities] = useState(false);
  const [showMoreCores, setShowMoreCores] = useState(false);
  const [showMoreCameras, setShowMoreCameras] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. Tipo de Entrega */}
      <DeliveryFilterSection
        deliveryTypeFilter={deliveryTypeFilter}
        setDeliveryTypeFilter={setDeliveryTypeFilter}
      />

      {/* 2. Categoría específica de Telefonía */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Categoría
          </label>
          {selectedSubcategory !== 'Todas' && (
            <button
              type="button"
              onClick={() => setSelectedSubcategory('Todas')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedSubcategory('Todas')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
              selectedSubcategory === 'Todas'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <span>Todas</span>
          </button>
          {CELULAR_CATEGORIES.map((cat) => {
            const isActive = selectedSubcategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedSubcategory(isActive ? 'Todas' : cat)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{cat}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Marca / Mejores marcas */}
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
          {(showMoreBrands ? CELULAR_BRANDS : CELULAR_BRANDS.slice(0, 10)).map((marca) => {
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

      {/* 5. Calificación */}
      <RatingFilterSection minRating={minRating} setMinRating={setMinRating} />

      {/* 6. Vendido por */}
      <SellerFilterSection soldByFilter={soldByFilter} setSoldByFilter={setSoldByFilter} />

      {/* 7. Color */}
      <ColorFilterSection selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

      {/* 8. Condición */}
      <ConditionFilterSection conditionFilter={conditionFilter} setConditionFilter={setConditionFilter} />

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
          {(showMoreCapacities ? CELULAR_CAPACITIES : CELULAR_CAPACITIES.slice(0, 10)).map((cap) => {
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

      {/* 10. Generación */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Generación
          </label>
          {selectedGeneracion !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedGeneracion('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedGeneracion('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              selectedGeneracion === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas
          </button>
          {CELULAR_GENERATIONS.map((gen) => {
            const isActive = selectedGeneracion.toLowerCase() === gen.toLowerCase();
            return (
              <button
                key={gen}
                type="button"
                onClick={() => setSelectedGeneracion(isActive ? 'all' : gen)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs uppercase transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{gen}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 11. Talla */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Talla
          </label>
          {selectedTalla !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedTalla('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedTalla('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              selectedTalla === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas
          </button>
          {CELULAR_TALLAS.map((t) => {
            const isActive = selectedTalla.toLowerCase() === t.toLowerCase();
            return (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTalla(isActive ? 'all' : t)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{t}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 12. Núcleos del procesador */}
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
          {(showMoreCores ? CELULAR_CORES : CELULAR_CORES.slice(0, 8)).map((c) => {
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

      {/* 13. Velocidad de imagen */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Velocidad de imagen
          </label>
          {selectedRefreshRate !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedRefreshRate('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedRefreshRate('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              selectedRefreshRate === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas
          </button>
          {CELULAR_REFRESH_RATES.map((hz) => {
            const isActive = selectedRefreshRate.toLowerCase() === hz.toLowerCase();
            return (
              <button
                key={hz}
                type="button"
                onClick={() => setSelectedRefreshRate(isActive ? 'all' : hz)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs uppercase font-mono transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{hz}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 14. Cámara principal */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Cámara principal
          </label>
          {selectedCamera !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCamera('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedCamera('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              selectedCamera === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas
          </button>
          {(showMoreCameras ? CELULAR_CAMERAS : CELULAR_CAMERAS.slice(0, 8)).map((cam) => {
            const isActive = selectedCamera.toLowerCase() === cam.toLowerCase();
            return (
              <button
                key={cam}
                type="button"
                onClick={() => setSelectedCamera(isActive ? 'all' : cam)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span className="truncate pr-1">{cam}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreCameras(!showMoreCameras)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreCameras ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 15. Cuenta con bluetooth */}
      <BluetoothFilterSection
        selectedBluetooth={selectedBluetooth}
        setSelectedBluetooth={setSelectedBluetooth}
      />
    </div>
  );
};
