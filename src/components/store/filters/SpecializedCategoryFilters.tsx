import React, { useState } from 'react';
import { Check } from 'lucide-react';
import {
  CategoryFamily,
  CELULAR_PRICE_RANGES,
  CONSOLAS_PLATFORMS,
  CONSOLAS_BRANDS,
  CONSOLAS_ESRB,
  CONSOLAS_CAPACITIES,
  AUDIO_CATEGORIES,
  AUDIO_BRANDS,
  AUDIO_TYPES,
  ELECTRO_CATEGORIES,
  ELECTRO_BRANDS,
  ELECTRO_EFFICIENCY,
  CALZADO_CATEGORIES,
  CALZADO_BRANDS,
  CALZADO_SIZES,
  CALZADO_GENDERS,
  MODA_CATEGORIES,
  MODA_BRANDS,
  MODA_SIZES,
  DORMITORIO_CATEGORIES,
  DORMITORIO_BRANDS,
  DORMITORIO_BED_SIZES,
  BELLEZA_CATEGORIES,
  BELLEZA_BRANDS,
  BELLEZA_SKIN_TYPES,
  ACCESORIOS_CATEGORIES,
  ACCESORIOS_BRANDS,
  ACCESORIOS_GENDERS,
  JUGUETES_CATEGORIES,
  JUGUETES_BRANDS,
  JUGUETES_AGE_RANGES,
  BEBES_CATEGORIES,
  BEBES_BRANDS,
  BEBES_STAGES,
  DEPORTES_CATEGORIES,
  DEPORTES_BRANDS,
  DEPORTES_DISCIPLINES,
  SALUD_CATEGORIES,
  SALUD_BRANDS,
  COCINA_CATEGORIES,
  COCINA_BRANDS,
  MUEBLES_CATEGORIES,
  MUEBLES_BRANDS,
  JARDIN_CATEGORIES,
  JARDIN_BRANDS,
  MASCOTAS_CATEGORIES,
  MASCOTAS_BRANDS,
  MASCOTAS_PET_TYPES,
  CONSTRUCCION_CATEGORIES,
  CONSTRUCCION_BRANDS,
  CONSTRUCCION_POWER_TYPES,
  AUTOMOTRIZ_CATEGORIES,
  AUTOMOTRIZ_BRANDS,
  AUTOMOTRIZ_VEHICLE_TYPES
} from '../../../data/categoryFiltersData';
import {
  DeliveryFilterSection,
  RatingFilterSection,
  SellerFilterSection,
  ColorFilterSection,
  ConditionFilterSection,
  BluetoothFilterSection
} from './CommonFilterSections';

export interface SpecializedCategoryFiltersProps {
  family: CategoryFamily;

  deliveryTypeFilter: 'all' | 'domicilio' | 'retiro';
  setDeliveryTypeFilter: (val: 'all' | 'domicilio' | 'retiro') => void;

  selectedSubcategory: string;
  setSelectedSubcategory: (val: string) => void;

  selectedBrand: string;
  setSelectedBrand: (val: string) => void;

  priceRange: string;
  setPriceRange: (val: string) => void;

  minRating: number;
  setMinRating: (val: number) => void;

  soldByFilter: string;
  setSoldByFilter: (val: string) => void;

  selectedColor: string;
  setSelectedColor: (val: string) => void;

  conditionFilter: string;
  setConditionFilter: (val: string) => void;

  selectedCapacity: string;
  setSelectedCapacity: (val: string) => void;

  selectedTalla: string;
  setSelectedTalla: (val: string) => void;

  selectedBluetooth: 'all' | 'si' | 'no';
  setSelectedBluetooth: (val: 'all' | 'si' | 'no') => void;

  // Filtros especializados adicionales
  selectedEsrb: string;
  setSelectedEsrb: (val: string) => void;

  selectedMaterial: string;
  setSelectedMaterial: (val: string) => void;

  selectedGender: string;
  setSelectedGender: (val: string) => void;

  selectedAgeRange: string;
  setSelectedAgeRange: (val: string) => void;

  selectedPetType: string;
  setSelectedPetType: (val: string) => void;

  selectedVehicleType: string;
  setSelectedVehicleType: (val: string) => void;

  selectedPowerType: string;
  setSelectedPowerType: (val: string) => void;

  selectedSkinType: string;
  setSelectedSkinType: (val: string) => void;

  selectedBedSize: string;
  setSelectedBedSize: (val: string) => void;

  selectedEnergyEfficiency: string;
  setSelectedEnergyEfficiency: (val: string) => void;

  selectedDiscipline: string;
  setSelectedDiscipline: (val: string) => void;
}

export const SpecializedCategoryFilters: React.FC<SpecializedCategoryFiltersProps> = ({
  family,
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
  selectedTalla,
  setSelectedTalla,
  selectedBluetooth,
  setSelectedBluetooth,
  selectedEsrb,
  setSelectedEsrb,
  selectedGender,
  setSelectedGender,
  selectedAgeRange,
  setSelectedAgeRange,
  selectedPetType,
  setSelectedPetType,
  selectedVehicleType,
  setSelectedVehicleType,
  selectedPowerType,
  setSelectedPowerType,
  selectedSkinType,
  setSelectedSkinType,
  selectedBedSize,
  setSelectedBedSize,
  selectedEnergyEfficiency,
  setSelectedEnergyEfficiency,
  selectedDiscipline,
  setSelectedDiscipline
}) => {
  const [showMoreBrands, setShowMoreBrands] = useState(false);

  // Determinar subcategorías y marcas para esta familia
  let categoryList: string[] = [];
  let brandList: string[] = [];

  switch (family) {
    case 'consolas':
      categoryList = CONSOLAS_PLATFORMS;
      brandList = CONSOLAS_BRANDS;
      break;
    case 'audio':
      categoryList = AUDIO_CATEGORIES;
      brandList = AUDIO_BRANDS;
      break;
    case 'electrohogar':
      categoryList = ELECTRO_CATEGORIES;
      brandList = ELECTRO_BRANDS;
      break;
    case 'calzado':
      categoryList = CALZADO_CATEGORIES;
      brandList = CALZADO_BRANDS;
      break;
    case 'mujer':
    case 'hombre':
      categoryList = MODA_CATEGORIES;
      brandList = MODA_BRANDS;
      break;
    case 'dormitorio':
      categoryList = DORMITORIO_CATEGORIES;
      brandList = DORMITORIO_BRANDS;
      break;
    case 'belleza':
      categoryList = BELLEZA_CATEGORIES;
      brandList = BELLEZA_BRANDS;
      break;
    case 'accesorios':
      categoryList = ACCESORIOS_CATEGORIES;
      brandList = ACCESORIOS_BRANDS;
      break;
    case 'juguetes':
      categoryList = JUGUETES_CATEGORIES;
      brandList = JUGUETES_BRANDS;
      break;
    case 'bebes':
      categoryList = BEBES_CATEGORIES;
      brandList = BEBES_BRANDS;
      break;
    case 'deportes':
      categoryList = DEPORTES_CATEGORIES;
      brandList = DEPORTES_BRANDS;
      break;
    case 'salud':
      categoryList = SALUD_CATEGORIES;
      brandList = SALUD_BRANDS;
      break;
    case 'cocina':
      categoryList = COCINA_CATEGORIES;
      brandList = COCINA_BRANDS;
      break;
    case 'muebles':
      categoryList = MUEBLES_CATEGORIES;
      brandList = MUEBLES_BRANDS;
      break;
    case 'jardin':
      categoryList = JARDIN_CATEGORIES;
      brandList = JARDIN_BRANDS;
      break;
    case 'mascotas':
      categoryList = MASCOTAS_CATEGORIES;
      brandList = MASCOTAS_BRANDS;
      break;
    case 'construccion':
      categoryList = CONSTRUCCION_CATEGORIES;
      brandList = CONSTRUCCION_BRANDS;
      break;
    case 'automotriz':
      categoryList = AUTOMOTRIZ_CATEGORIES;
      brandList = AUTOMOTRIZ_BRANDS;
      break;
    default:
      categoryList = [];
      brandList = [];
  }

  return (
    <div className="space-y-6">
      {/* 1. Tipo de Entrega */}
      <DeliveryFilterSection
        deliveryTypeFilter={deliveryTypeFilter}
        setDeliveryTypeFilter={setDeliveryTypeFilter}
      />

      {/* 2. Subcategorías especializadas */}
      {categoryList.length > 0 && (
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
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                selectedSubcategory === 'Todas' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              Todas
            </button>
            {categoryList.map((cat) => {
              const isActive = selectedSubcategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedSubcategory(isActive ? 'Todas' : cat)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition flex items-center justify-between ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="truncate pr-1">{cat}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Marcas de la categoría */}
      {brandList.length > 0 && (
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
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                selectedBrand === 'Todas' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              Todas las marcas
            </button>
            {(showMoreBrands ? brandList : brandList.slice(0, 10)).map((marca) => {
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
            {brandList.length > 10 && (
              <button
                type="button"
                onClick={() => setShowMoreBrands(!showMoreBrands)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
              >
                {showMoreBrands ? '- Ver menos' : '+ Ver más'}
              </button>
            )}
          </div>
        </div>
      )}

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

      {/* 7. Color (para casi todas las categorías físicas) */}
      <ColorFilterSection selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

      {/* 8. Condición */}
      <ConditionFilterSection conditionFilter={conditionFilter} setConditionFilter={setConditionFilter} />

      {/* FACETS ESPECÍFICOS SEGÚN FAMILIA */}
      {/* CONSOLAS: Clasificación ESRB & Capacidad */}
      {family === 'consolas' && (
        <>
          <div className="space-y-2 pt-3 border-t border-white/[0.06]">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Clasificación ESRB
            </label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedEsrb('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                  selectedEsrb === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                Todas
              </button>
              {CONSOLAS_ESRB.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setSelectedEsrb(selectedEsrb === e ? 'all' : e)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                    selectedEsrb === e
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{e}</span>
                  {selectedEsrb === e && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/[0.06]">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Capacidad de almacenamiento
            </label>
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
              {CONSOLAS_CAPACITIES.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setSelectedCapacity(selectedCapacity === cap ? 'all' : cap)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase transition flex items-center justify-between ${
                    selectedCapacity === cap
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{cap}</span>
                  {selectedCapacity === cap && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* AUDIO: Bluetooth y Tipo */}
      {family === 'audio' && (
        <>
          <BluetoothFilterSection
            selectedBluetooth={selectedBluetooth}
            setSelectedBluetooth={setSelectedBluetooth}
          />
          <div className="space-y-2 pt-3 border-t border-white/[0.06]">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Tipo de Dispositivo
            </label>
            <div className="space-y-1">
              {AUDIO_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedSubcategory(selectedSubcategory === t ? 'Todas' : t)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                    selectedSubcategory === t
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{t}</span>
                  {selectedSubcategory === t && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ELECTROHOGAR: Eficiencia energética */}
      {family === 'electrohogar' && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Eficiencia Energética
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedEnergyEfficiency('all')}
              className={`col-span-3 text-left px-2 py-1 rounded-lg text-xs transition ${
                selectedEnergyEfficiency === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              Todas
            </button>
            {ELECTRO_EFFICIENCY.map((eff) => (
              <button
                key={eff}
                type="button"
                onClick={() => setSelectedEnergyEfficiency(selectedEnergyEfficiency === eff ? 'all' : eff)}
                className={`p-1.5 rounded-lg text-center text-[10px] font-mono font-bold transition border ${
                  selectedEnergyEfficiency === eff
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                {eff}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CALZADO: Tallas y Género */}
      {family === 'calzado' && (
        <>
          <div className="space-y-2 pt-3 border-t border-white/[0.06]">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Género
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedGender('all')}
                className={`col-span-2 text-left px-2 py-1 rounded-lg text-xs transition ${
                  selectedGender === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                Todos
              </button>
              {CALZADO_GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGender(selectedGender === g ? 'all' : g)}
                  className={`p-1.5 rounded-lg text-center text-xs transition border ${
                    selectedGender === g
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/[0.06]">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Talla de Calzado (US)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {CALZADO_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedTalla(selectedTalla === sz ? 'all' : sz)}
                  className={`p-1.5 rounded-lg text-center text-[10px] font-mono transition border ${
                    selectedTalla === sz
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MODA (Mujer / Hombre): Tallas */}
      {(family === 'mujer' || family === 'hombre') && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Talla
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedTalla('all')}
              className={`col-span-4 text-left px-2 py-1 rounded-lg text-xs transition ${
                selectedTalla === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              Todas
            </button>
            {MODA_SIZES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTalla(selectedTalla === t ? 'all' : t)}
                className={`p-1.5 rounded-lg text-center text-xs font-semibold transition border ${
                  selectedTalla === t
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DORMITORIO: Tamaño de cama */}
      {family === 'dormitorio' && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Tamaño de Cama / Colchón
          </label>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setSelectedBedSize('all')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                selectedBedSize === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              Todos
            </button>
            {DORMITORIO_BED_SIZES.map((bs) => (
              <button
                key={bs}
                type="button"
                onClick={() => setSelectedBedSize(selectedBedSize === bs ? 'all' : bs)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  selectedBedSize === bs
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{bs}</span>
                {selectedBedSize === bs && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BELLEZA: Tipo de piel */}
      {family === 'belleza' && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Tipo de Piel
          </label>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setSelectedSkinType('all')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                selectedSkinType === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              Todos
            </button>
            {BELLEZA_SKIN_TYPES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedSkinType(selectedSkinType === st ? 'all' : st)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  selectedSkinType === st
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{st}</span>
                {selectedSkinType === st && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ACCESORIOS: Género */}
      {family === 'accesorios' && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Género
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {ACCESORIOS_GENDERS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGender(selectedGender === g ? 'all' : g)}
                className={`p-1.5 rounded-lg text-center text-xs transition border ${
                  selectedGender === g
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                    : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* JUGUETES: Rango de edad */}
      {family === 'juguetes' && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Rango de Edad
          </label>
          <div className="space-y-1">
            {JUGUETES_AGE_RANGES.map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => setSelectedAgeRange(selectedAgeRange === age ? 'all' : age)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  selectedAgeRange === age
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{age}</span>
                {selectedAgeRange === age && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BEBES: Etapa */}
      {family === 'bebes' && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Etapa de Crecimiento
          </label>
          <div className="space-y-1">
            {BEBES_STAGES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedAgeRange(selectedAgeRange === st ? 'all' : st)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  selectedAgeRange === st
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{st}</span>
                {selectedAgeRange === st && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DEPORTES: Disciplina */}
      {family === 'deportes' && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Disciplina Deportiva
          </label>
          <div className="space-y-1">
            {DEPORTES_DISCIPLINES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDiscipline(selectedDiscipline === d ? 'all' : d)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  selectedDiscipline === d
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{d}</span>
                {selectedDiscipline === d && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MASCOTAS: Tipo de mascota */}
      {family === 'mascotas' && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Tipo de Mascota
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {MASCOTAS_PET_TYPES.map((pt) => (
              <button
                key={pt}
                type="button"
                onClick={() => setSelectedPetType(selectedPetType === pt ? 'all' : pt)}
                className={`p-1.5 rounded-lg text-center text-xs transition border ${
                  selectedPetType === pt
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                    : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CONSTRUCCIÓN: Tipo de alimentación */}
      {family === 'construccion' && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Tipo de Alimentación
          </label>
          <div className="space-y-1">
            {CONSTRUCCION_POWER_TYPES.map((pwr) => (
              <button
                key={pwr}
                type="button"
                onClick={() => setSelectedPowerType(selectedPowerType === pwr ? 'all' : pwr)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  selectedPowerType === pwr
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{pwr}</span>
                {selectedPowerType === pwr && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AUTOMOTRIZ: Tipo de vehículo */}
      {family === 'automotriz' && (
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Tipo de Vehículo
          </label>
          <div className="space-y-1">
            {AUTOMOTRIZ_VEHICLE_TYPES.map((veh) => (
              <button
                key={veh}
                type="button"
                onClick={() => setSelectedVehicleType(selectedVehicleType === veh ? 'all' : veh)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  selectedVehicleType === veh
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{veh}</span>
                {selectedVehicleType === veh && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
