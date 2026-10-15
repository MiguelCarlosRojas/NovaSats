import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Bitcoin,
  Search,
  X,
  ChevronRight,
  ArrowRight,
  Store,
  ShoppingBag,
  Sparkles,
  Cpu,
  Home,
  Armchair,
  Bed,
  Shirt,
  Footprints,
  Gem,
  Bike,
  Gamepad2,
  PawPrint,
  Hammer,
  Car,
  Package
} from 'lucide-react';

import { StoreFooter } from './StoreFooter';
import { MEGA_CATALOG_TREE, MegaCategory, MegaCategoryItem } from '../../data/categoryCatalogTree';

const BTC_PRICE_USD = 65000;

// Dynamic icon helper
const getCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Armchair':
      return <Armchair className={className} />;
    case 'Bed':
      return <Bed className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Shirt':
      return <Shirt className={className} />;
    case 'Footprints':
      return <Footprints className={className} />;
    case 'Gem':
      return <Gem className={className} />;
    case 'Bike':
      return <Bike className={className} />;
    case 'Gamepad2':
      return <Gamepad2 className={className} />;
    case 'PawPrint':
      return <PawPrint className={className} />;
    case 'Hammer':
      return <Hammer className={className} />;
    case 'Car':
      return <Car className={className} />;
    default:
      return <Package className={className} />;
  }
};

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active Category State
  const initialCategoryParam = searchParams.get('categoria') || searchParams.get('category');
  const [activeCategoryId, setActiveCategoryId] = useState<string>(() => {
    if (initialCategoryParam) {
      const found = MEGA_CATALOG_TREE.find(
        (c) => c.name.toLowerCase() === initialCategoryParam.toLowerCase() || c.slug === initialCategoryParam.toLowerCase()
      );
      if (found) return found.id;
    }
    return MEGA_CATALOG_TREE[0]?.id || 'tecnologia';
  });

  // Search Filter State
  const [searchFilter, setSearchFilter] = useState('');

  // Sincronizar parámetro URL si cambia externamente
  useEffect(() => {
    const cat = searchParams.get('categoria') || searchParams.get('category');
    if (cat) {
      const match = MEGA_CATALOG_TREE.find(
        (c) => c.name.toLowerCase() === cat.toLowerCase() || c.slug === cat.toLowerCase()
      );
      if (match) {
        setActiveCategoryId(match.id);
      }
    }
  }, [searchParams]);

  // Categorías filtradas por buscador rápido
  const filteredCategories = useMemo(() => {
    if (!searchFilter.trim()) return MEGA_CATALOG_TREE;
    const query = searchFilter.toLowerCase().trim();

    return MEGA_CATALOG_TREE.filter((cat) => {
      const matchCat = cat.name.toLowerCase().includes(query) || cat.description.toLowerCase().includes(query);
      if (matchCat) return true;

      return cat.groups.some((group) => {
        if (group.name.toLowerCase().includes(query)) return true;
        return group.items.some((item) => item.label.toLowerCase().includes(query));
      });
    });
  }, [searchFilter]);

  // Categoría seleccionada actualmente
  const activeCategory = useMemo(() => {
    return (
      MEGA_CATALOG_TREE.find((c) => c.id === activeCategoryId) ||
      filteredCategories[0] ||
      MEGA_CATALOG_TREE[0]
    );
  }, [activeCategoryId, filteredCategories]);

  // Manejar navegación a la página de productos con filtros
  const handleItemClick = (categoryName: string, item: MegaCategoryItem, subcategoryName?: string) => {
    const params = new URLSearchParams();

    // 1. Categoría
    const cat = item.filterParam?.categoria || categoryName;
    if (cat && cat !== 'Todas') {
      params.set('categoria', cat);
    }

    // 2. Subcategoría
    const subcat = item.filterParam?.subcategoria || subcategoryName;
    if (subcat && subcat !== 'Todas') {
      params.set('subcategoria', subcat);
    }

    // 3. Marca
    if (item.filterParam?.marca) {
      params.set('marca', item.filterParam.marca);
    }

    // 4. Parámetro de búsqueda
    if (item.filterParam?.q) {
      params.set('q', item.filterParam.q);
    }

    const queryString = params.toString();
    navigate(`/productos${queryString ? `?${queryString}` : ''}`);
  };

  const handleSubcategoryViewAll = (categoryName: string, subcategoryName: string) => {
    const params = new URLSearchParams();
    params.set('categoria', categoryName);
    params.set('subcategoria', subcategoryName);
    navigate(`/productos?${params.toString()}`);
  };

  const handleCategoryViewAll = (category: MegaCategory) => {
    navigate(`/productos?categoria=${encodeURIComponent(category.name)}`);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* 1. TICKER SUPERIOR OFICIAL */}
      <div className="bg-[#04060c] border-b border-white/[0.06] text-[10px] sm:text-[11px] font-mono text-slate-400 py-2 px-3 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 truncate">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xs:inline">Red Bitcoin: Bloque Verificado</span>
            <span className="xs:hidden">Bitcoin L1</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">1 BTC = ${BTC_PRICE_USD.toLocaleString()} USD</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="hidden md:inline text-slate-400">Smart Contract: NovaSats.sol v2.0</span>
        </div>
      </div>

      {/* 2. ENCABEZADO DE NAVEGACIÓN */}
      <header className="sticky top-0 z-40 bg-[#060911]/90 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <Bitcoin className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1 font-heading">
                Nova<span className="text-amber-500">Sats</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-400/90 font-bold uppercase tracking-widest block -mt-1 font-mono">
                Store Marketplace
              </span>
            </div>
          </Link>

        </div>

        {/* Buscador dentro del catálogo */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar categoría, subcategoría o marca (ej: Apple, Laptops, TV)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#0d1222] border border-white/[0.1] rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition shadow-inner"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. BARRA DE BREADCRUMB */}
      <div className="bg-[#04060c] border-b border-white/[0.06] py-2.5 sm:py-3 px-3 sm:px-8 lg:px-12">
        <div className="w-full flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 font-medium truncate">
            <Link to="/" className="hover:text-amber-400 transition flex items-center gap-1 shrink-0">
              <Store className="w-3.5 h-3.5 text-slate-500" />
              <span>Inicio</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-white font-bold shrink-0">Catálogo</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-amber-400 font-semibold truncate">{activeCategory.name}</span>
          </div>

          <div className="hidden sm:block text-[11px] text-slate-500 font-mono shrink-0">
            {MEGA_CATALOG_TREE.length} Categorías • {MEGA_CATALOG_TREE.reduce((acc, c) => acc + c.groups.length, 0)} Secciones
          </div>
        </div>
      </div>

      {/* Buscador visible solo en móviles */}
      <div className="p-3 sm:p-4 md:hidden bg-[#060911] border-b border-white/[0.06]">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar categorías, subcategorías o marcas..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#0d1222] border border-white/[0.1] rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          {searchFilter && (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4. CONTENIDO PRINCIPAL: ÁRBOL COMPLETO DE CATÁLOGO & CATEGORÍAS */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 py-5 sm:py-8">
        
        {/* TÍTULO Y PRESENTACIÓN */}
        <div className="mb-5 sm:mb-8">
          <div className="w-full pb-3 sm:pb-4 border-b border-white/[0.08]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Explorador Estructurado por Familias y Marcas</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-heading">
              Catálogo & Categorías en{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                NovaSats
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 w-full mt-1.5 sm:mt-2 leading-relaxed">
              Selecciona cualquier categoría principal para explorar sus subcategorías, líneas de productos y marcas líderes con navegación directa a la tienda.
            </p>
          </div>
        </div>

        {/* TABS HORIZONTALES PARA PANTALLAS MÓVILES */}
        <div className="md:hidden mb-5 -mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto pb-2 scrollbar-none flex gap-2 touch-pan-x">
          {filteredCategories.map((category) => {
            const isSelected = category.id === activeCategory.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 min-h-[38px] ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-[#0e1424] text-slate-300 border border-white/[0.08] active:bg-white/[0.05]'
                }`}
              >
                {getCategoryIcon(category.iconName, 'w-4 h-4')}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* LAYOUT DE 2 COLUMNAS: LATERAL CATEGORÍAS + PANEL DE SUBCATEGORÍAS & MARCAS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: LISTA DE CATEGORÍAS PRINCIPALES */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3 bg-[#090d18] rounded-2xl border border-white/[0.08] p-3 space-y-1.5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold border-b border-white/[0.06] flex items-center justify-between mb-1">
              <span>Categorías Principales</span>
              <span className="text-amber-400">{filteredCategories.length}</span>
            </div>

            {filteredCategories.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No se encontraron categorías que coincidan con "{searchFilter}".
              </div>
            ) : (
              filteredCategories.map((category) => {
                const isSelected = category.id === activeCategory.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategoryId(category.id)}
                    className={`w-full group text-left px-3.5 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent text-white border-l-4 border-amber-500 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                            : 'bg-white/[0.05] text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-500/10'
                        }`}
                      >
                        {getCategoryIcon(category.iconName, 'w-4 h-4')}
                      </div>
                      <div className="truncate">
                        <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                          {category.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                          {category.groups.length} subcategorías
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {category.featuredBadge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-mono">
                          {category.featuredBadge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-amber-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-300'
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </aside>

          {/* COLUMNA DERECHA: SUBCATEGORÍAS, MARCAS Y CATÁLOGO DETALLADO */}
          <section className="md:col-span-8 lg:col-span-9 space-y-5 sm:space-y-6">
            
            {/* BANNER DE LA CATEGORÍA ACTIVA */}
            <div className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-[#0c1324] via-[#0f172e] to-[#0a0f1d] border border-amber-500/20 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/20 shrink-0 mt-0.5 sm:mt-0">
                    {getCategoryIcon(activeCategory.iconName, 'w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg sm:text-2xl font-black text-white font-heading">
                        {activeCategory.name}
                      </h2>
                      {activeCategory.featuredBadge && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {activeCategory.featuredBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                      {activeCategory.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCategoryViewAll(activeCategory)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 min-h-[40px]"
                >
                  <span>Ver todo en {activeCategory.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* GRILLA DE SUBCATEGORÍAS Y MARCAS (3 O 4 COLUMNAS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-5">
              {activeCategory.groups.map((group) => {
                return (
                  <div
                    key={group.id}
                    className="p-5 rounded-2xl bg-[#090e1a]/90 border border-white/[0.08] hover:border-amber-500/30 transition-all duration-200 flex flex-col justify-between group/card shadow-sm hover:shadow-lg hover:shadow-black/40"
                  >
                    <div>
                      {/* ENCABEZADO DE LA SUBCATEGORÍA */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                        <h3 className="text-sm font-extrabold text-white group-hover/card:text-amber-400 transition-colors flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{group.name}</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleSubcategoryViewAll(activeCategory.name, group.name)}
                          className="text-[11px] font-bold text-amber-400/90 hover:text-amber-300 hover:underline transition flex items-center gap-0.5"
                        >
                          <span>Ver todo</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* LISTA DE MARCAS Y VARIANTES (NIVEL 3) */}
                      <ul className="space-y-1">
                        {group.items.map((item, idx) => {
                          return (
                            <li key={idx}>
                              <button
                                type="button"
                                onClick={() => handleItemClick(activeCategory.name, item, group.name)}
                                className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                                  item.isViewAll
                                    ? 'text-amber-400 font-bold bg-amber-500/5 hover:bg-amber-500/10'
                                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                                }`}
                              >
                                <span className="truncate">{item.label}</span>
                                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 shrink-0 ml-1 transition-colors" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* PIE DE TARJETA CON ACCESO RÁPIDO */}
                    <div className="pt-4 mt-4 border-t border-white/[0.04]">
                      <button
                        type="button"
                        onClick={() => handleSubcategoryViewAll(activeCategory.name, group.name)}
                        className="w-full py-2 px-3 rounded-xl bg-white/[0.02] hover:bg-amber-500/10 border border-white/[0.04] hover:border-amber-500/30 text-[11px] font-bold text-slate-400 hover:text-amber-300 transition flex items-center justify-center gap-1.5"
                      >
                        <span>Explorar {group.name}</span>
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SECCIÓN INFORMATIVA / BANNER INFERIOR */}
            <div className="p-6 rounded-2xl bg-[#090d18] border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bitcoin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    ¿Buscas un producto específico o deseas filtrar por precio, condición o marca?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Visita el catálogo completo con filtros avanzados de entrega, precio en Soles (S/), color, condición y especificaciones técnicas.
                  </p>
                </div>
              </div>

              <Link
                to="/productos"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 shrink-0 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>Ir al Catálogo de Productos</span>
              </Link>
            </div>

          </section>
        </div>
      </main>

      {/* 5. PIE DE PÁGINA EXCLUSIVO */}
      <StoreFooter />
    </div>
  );
};
