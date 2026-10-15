import React, { useState } from 'react';
import { Check } from 'lucide-react';
import {
  TV_BRANDS,
  TV_PRICE_RANGES,
  TV_SCREEN_SIZES,
  TV_DISPLAY_FEATURES,
  TV_USB_PORTS,
  TV_RESOLUTIONS,
  TV_REFRESH_RATES,
  TV_OS,
  TV_CONNECTIVITIES,
  TV_HDMI_PORTS,
  TV_VOLTAGES
} from '../../../data/categoryFiltersData';
import {
  DeliveryFilterSection,
  RatingFilterSection,
  SellerFilterSection,
  ConditionFilterSection
} from './CommonFilterSections';

export interface TvFiltersProps {
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

  tvScreenSize: string;
  setTvScreenSize: (val: string) => void;

  tvFeature: string;
  setTvFeature: (val: string) => void;

  tvUsbPorts: string;
  setTvUsbPorts: (val: string) => void;

  tvResolution: string;
  setTvResolution: (val: string) => void;

  selectedRefreshRate: string;
  setSelectedRefreshRate: (val: string) => void;

  operatingSystem: string;
  setOperatingSystem: (val: string) => void;

  selectedConnectivity: string;
  setSelectedConnectivity: (val: string) => void;

  conditionFilter: string;
  setConditionFilter: (val: string) => void;

  tvHdmiPorts: string;
  setTvHdmiPorts: (val: string) => void;

  tvVoltage: string;
  setTvVoltage: (val: string) => void;
}

export const TvFilters: React.FC<TvFiltersProps> = ({
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
  tvScreenSize,
  setTvScreenSize,
  tvFeature,
  setTvFeature,
  tvUsbPorts,
  setTvUsbPorts,
  tvResolution,
  setTvResolution,
  selectedRefreshRate,
  setSelectedRefreshRate,
  operatingSystem,
  setOperatingSystem,
  selectedConnectivity,
  setSelectedConnectivity,
  conditionFilter,
  setConditionFilter,
  tvHdmiPorts,
  setTvHdmiPorts,
  tvVoltage,
  setTvVoltage
}) => {
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);
  const [showMoreResolutions, setShowMoreResolutions] = useState(false);
  const [showMoreOs, setShowMoreOs] = useState(false);
  const [showMoreConn, setShowMoreConn] = useState(false);
  const [showMoreHdmi, setShowMoreHdmi] = useState(false);
  const [showMoreVolt, setShowMoreVolt] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. Tipo de Entrega */}
      <DeliveryFilterSection
        deliveryTypeFilter={deliveryTypeFilter}
        setDeliveryTypeFilter={setDeliveryTypeFilter}
      />

      {/* 2. Marca */}
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
          {(showMoreBrands ? TV_BRANDS : TV_BRANDS.slice(0, 10)).map((marca) => {
            const isActive = selectedBrand.toLowerCase() === marca.toLowerCase();
            return (
              <button
                key={marca}
                type="button"
                onClick={() => setSelectedBrand(isActive ? 'Todas' : marca)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs uppercase transition flex items-center justify-between ${
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
          {TV_PRICE_RANGES.map((r) => {
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

      {/* 6. Tamaño de la pantalla (42" o menos, etc.) */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Tamaño de la pantalla
          </label>
          {tvScreenSize !== 'all' && (
            <button
              type="button"
              onClick={() => setTvScreenSize('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setTvScreenSize('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              tvScreenSize === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todos
          </button>
          {TV_SCREEN_SIZES.map((sz) => {
            const isActive = tvScreenSize === sz.id;
            return (
              <button
                key={sz.id}
                type="button"
                onClick={() => setTvScreenSize(isActive ? 'all' : sz.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{sz.label}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Características de la pantalla */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Características de la pantalla
          </label>
          {tvFeature !== 'all' && (
            <button
              type="button"
              onClick={() => setTvFeature('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setTvFeature('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              tvFeature === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas
          </button>
          {(showMoreFeatures ? TV_DISPLAY_FEATURES : TV_DISPLAY_FEATURES.slice(0, 10)).map((f) => {
            const isActive = tvFeature.toLowerCase() === f.toLowerCase();
            return (
              <button
                key={f}
                type="button"
                onClick={() => setTvFeature(isActive ? 'all' : f)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs uppercase truncate transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span className="truncate pr-1">{f}</span>
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

      {/* 8. Puertos USB */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Puertos USB
          </label>
          {tvUsbPorts !== 'all' && (
            <button
              type="button"
              onClick={() => setTvUsbPorts('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => setTvUsbPorts('all')}
            className={`col-span-4 text-left px-2 py-1 rounded-lg text-xs transition ${
              tvUsbPorts === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todos
          </button>
          {TV_USB_PORTS.map((usb) => {
            const isActive = tvUsbPorts === usb;
            return (
              <button
                key={usb}
                type="button"
                onClick={() => setTvUsbPorts(isActive ? 'all' : usb)}
                className={`p-1.5 rounded-lg text-center text-[10px] font-semibold transition border ${
                  isActive
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                {usb}
              </button>
            );
          })}
        </div>
      </div>

      {/* 9. Resolución de la pantalla */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Resolución de la pantalla
          </label>
          {tvResolution !== 'all' && (
            <button
              type="button"
              onClick={() => setTvResolution('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setTvResolution('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              tvResolution === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas
          </button>
          {(showMoreResolutions ? TV_RESOLUTIONS : TV_RESOLUTIONS.slice(0, 8)).map((res) => {
            const isActive = tvResolution.toLowerCase() === res.toLowerCase();
            return (
              <button
                key={res}
                type="button"
                onClick={() => setTvResolution(isActive ? 'all' : res)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs uppercase truncate transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span className="truncate pr-1">{res}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreResolutions(!showMoreResolutions)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreResolutions ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 10. Velocidad de imagen */}
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
          {TV_REFRESH_RATES.map((hz) => {
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
          {(showMoreOs ? TV_OS : TV_OS.slice(0, 8)).map((osItem) => {
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

      {/* 12. Conectividad */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Conectividad
          </label>
          {selectedConnectivity !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedConnectivity('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedConnectivity('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              selectedConnectivity === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas
          </button>
          {(showMoreConn ? TV_CONNECTIVITIES : TV_CONNECTIVITIES.slice(0, 10)).map((c) => {
            const isActive = selectedConnectivity.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedConnectivity(isActive ? 'all' : c)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs capitalize truncate transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span className="truncate pr-1">{c}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreConn(!showMoreConn)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreConn ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 13. Condición del producto */}
      <ConditionFilterSection conditionFilter={conditionFilter} setConditionFilter={setConditionFilter} />

      {/* 14. Puertos HDMI */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Puertos HDMI
          </label>
          {tvHdmiPorts !== 'all' && (
            <button
              type="button"
              onClick={() => setTvHdmiPorts('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setTvHdmiPorts('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              tvHdmiPorts === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todos
          </button>
          {(showMoreHdmi ? TV_HDMI_PORTS : TV_HDMI_PORTS.slice(0, 6)).map((h) => {
            const isActive = tvHdmiPorts === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setTvHdmiPorts(isActive ? 'all' : h)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span className="truncate pr-1">{h}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreHdmi(!showMoreHdmi)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreHdmi ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>

      {/* 15. Voltaje */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Voltaje
          </label>
          {tvVoltage !== 'all' && (
            <button
              type="button"
              onClick={() => setTvVoltage('all')}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setTvVoltage('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              tvVoltage === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todos
          </button>
          {(showMoreVolt ? TV_VOLTAGES : TV_VOLTAGES.slice(0, 8)).map((v) => {
            const isActive = tvVoltage === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setTvVoltage(isActive ? 'all' : v)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{v}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowMoreVolt(!showMoreVolt)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {showMoreVolt ? '- Ver menos' : '+ Ver más'}
          </button>
        </div>
      </div>
    </div>
  );
};
