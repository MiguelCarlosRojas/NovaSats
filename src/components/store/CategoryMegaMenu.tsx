import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  X,
  Search,
  ChevronRight,
  ArrowRight,
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
  Package,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { MEGA_CATALOG_TREE, MegaCategory, MegaCategoryItem } from '../../data/categoryCatalogTree';

// Helper de iconos dinámicos
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

interface CategoryMegaMenuProps {
  buttonText?: string;
  buttonClassName?: string;
  variant?: 'navbar' | 'compact' | 'pill' | 'cta';
}

export const CategoryMegaMenu: React.FC<CategoryMegaMenuProps> = ({
  buttonText = 'Catálogo y Categorías',
  buttonClassName,
  variant = 'cta'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(MEGA_CATALOG_TREE[0]?.id || 'tecnologia');
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileActiveCategory, setMobileActiveCategory] = useState<MegaCategory | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
    setMobileActiveCategory(null);
  }, [location.pathname, location.search]);

  // Manejar tecla ESC y bloqueo de scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Categoría activa actualmente en desktop
  const activeCategory = useMemo(() => {
    return MEGA_CATALOG_TREE.find((c) => c.id === activeCategoryId) || MEGA_CATALOG_TREE[0];
  }, [activeCategoryId]);

  // Filtro de búsqueda rápida en todo el árbol del mega menú
  const filteredTree = useMemo(() => {
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

  // Navegación hacia el catálogo con parámetros precisos
  const handleItemClick = (categoryName: string, item: MegaCategoryItem, subcategoryName?: string) => {
    setIsOpen(false);
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
    navigate(`/catalogo${queryString ? `?${queryString}` : ''}`);
  };

  const handleCategoryViewAll = (category: MegaCategory) => {
    setIsOpen(false);
    navigate(`/catalogo?categoria=${encodeURIComponent(category.name)}`);
  };

  return (
    <>
      {/* BOTÓN DISPARADOR CON EL DISEÑO DE CATÁLOGO COMPLETO (CTA) */}
      {variant === 'cta' && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={
            buttonClassName ||
            'inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-black text-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-md shadow-amber-500/20 transition active:scale-95'
          }
          title="Abrir Catálogo y Categorías"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          <span>{buttonText}</span>
        </button>
      )}

      {/* BOTÓN DISPARADOR / TRIGGER NAVBAR SECUNDARIO */}
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={
            buttonClassName ||
            'group inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-[#0e1424] hover:bg-[#16203a] border border-white/[0.08] hover:border-amber-500/40 rounded-xl transition shadow-sm'
          }
          title="Abrir Catálogo y Categorías"
        >
          <div className="w-5 h-5 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span className="hidden xs:inline">{buttonText}</span>
          <span className="xs:hidden">Catálogo</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
        </button>
      )}

      {/* BOTÓN PÍLDORA */}
      {variant === 'pill' && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={
            buttonClassName ||
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-bold transition shadow-lg shadow-amber-500/10 active:scale-95'
          }
        >
          <LayoutGrid className="w-4 h-4 text-amber-400" />
          <span>{buttonText}</span>
        </button>
      )}

      {/* BOTÓN COMPACTO */}
      {variant === 'compact' && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={
            buttonClassName ||
            'p-2 text-slate-300 hover:text-white bg-[#0e1424] hover:bg-[#16203a] border border-white/[0.08] rounded-xl transition'
          }
          title="Ver Catálogo y Categorías"
        >
          <LayoutGrid className="w-4 h-4 text-amber-400" />
        </button>
      )}

      {/* OVERLAY & MODAL MEGA MENÚ PERFECTAMENTE ALINEADO DEBAJO DE LA BARRA SUPERIOR */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Fondo difuminado */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Contenedor Principal del Mega Menú: Alineado justo debajo del header */}
          <div className="fixed inset-x-0 top-16 sm:top-20 bottom-2 sm:bottom-4 z-10 flex justify-center px-2 sm:px-4 md:px-6 pointer-events-none">
            <div
              ref={modalRef}
              className="pointer-events-auto relative w-full max-w-7xl h-full bg-[#070b14] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans selection:bg-amber-500 selection:text-black"
            >
              {/* BARRA SUPERIOR DEL MEGA MENÚ */}
              <div className="bg-[#05080f] border-b border-white/[0.08] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                    <Layers className="w-5 h-5 text-black stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
                      <span>Catálogo & Categorías</span>
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                        NovaSats Store
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400 hidden sm:block">
                      Haz clic en cualquier categoría para ir directo al Catálogo
                    </p>
                  </div>
                </div>

                {/* Buscador dentro del mega menú */}
                <div className="flex-1 max-w-xs sm:max-w-md hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Filtrar categorías o marcas..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full bg-[#0d1222] border border-white/[0.1] rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition"
                    />
                    {searchFilter && (
                      <button
                        type="button"
                        onClick={() => setSearchFilter('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Acciones de Cabecera */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/catalogo');
                    }}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition"
                  >
                    <span>Ver todo el catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center transition"
                    title="Cerrar (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CONTENIDO INTERNO: DOS COLUMNAS EN DESKTOP / VISTA DRILLDOWN EN MÓVIL */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* ========================================================= */}
                {/* VISTA DESKTOP (MD+) */}
                {/* ========================================================= */}
                <div className="hidden md:flex flex-1 w-full overflow-hidden">
                  {/* Columna Izquierda: Lista de Categorías Principales */}
                  {/* AL HACER CLIC EN CUALQUIER CATEGORÍA REDIRIGE AL CATÁLOGO */}
                  <div className="w-72 lg:w-80 bg-[#060912] border-r border-white/[0.08] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                    <div className="p-2 space-y-1">
                      {filteredTree.map((cat) => {
                        const isActive = cat.id === activeCategoryId;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onMouseEnter={() => setActiveCategoryId(cat.id)}
                            onClick={() => {
                              setIsOpen(false);
                              navigate(`/catalogo?categoria=${encodeURIComponent(cat.name)}`);
                            }}
                            className={`w-full text-left flex items-center justify-between p-3 rounded-xl text-xs font-medium transition ${
                              isActive
                                ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500 text-white font-bold pl-2.5'
                                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                            }`}
                            title={`Ir al catálogo de ${cat.name}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                                  isActive
                                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                                    : 'bg-white/[0.05] text-slate-400'
                                }`}
                              >
                                {getCategoryIcon(cat.iconName, 'w-4 h-4')}
                              </div>
                              <div className="truncate">
                                <span className="block truncate">{cat.name}</span>
                                {cat.featuredBadge && (
                                  <span className="text-[9px] text-amber-400 font-mono font-bold block -mt-0.5">
                                    {cat.featuredBadge}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight
                              className={`w-4 h-4 shrink-0 transition-transform ${
                                isActive ? 'text-amber-400 translate-x-1' : 'text-slate-600'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Columna Derecha: Subcategorías, Marcas y Microcategorías */}
                  <div className="flex-1 bg-[#070b14] flex flex-col overflow-y-auto custom-scrollbar p-6 lg:p-8">
                    {activeCategory ? (
                      <div className="space-y-6">
                        {/* Cabecera de Categoría Activa */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                              {getCategoryIcon(activeCategory.iconName, 'w-6 h-6')}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black text-white tracking-tight">
                                  {activeCategory.name}
                                </h3>
                                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                  {activeCategory.groups.length} Secciones
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {activeCategory.description}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCategoryViewAll(activeCategory)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 transition self-start sm:self-auto shrink-0"
                          >
                            <span>Ver todo en {activeCategory.name}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Grilla de Subcategorías y Marcas */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {activeCategory.groups.map((group) => (
                            <div
                              key={group.id}
                              className="p-4 rounded-xl bg-[#0b101f]/70 border border-white/[0.05] hover:border-amber-500/30 transition flex flex-col space-y-3"
                            >
                              {/* Título de la subcategoría: clic navega a la subcategoría */}
                              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsOpen(false);
                                    navigate(`/catalogo?categoria=${encodeURIComponent(activeCategory.name)}&subcategoria=${encodeURIComponent(group.name)}`);
                                  }}
                                  className="text-sm font-bold text-white hover:text-amber-400 tracking-tight flex items-center gap-1.5 transition text-left"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                  <span>{group.name}</span>
                                </button>
                              </div>

                              {/* Lista de Ítems (Ver todo, Marcas, Tipos) */}
                              <ul className="space-y-1.5 text-xs">
                                {group.items.map((item, idx) => (
                                  <li key={idx}>
                                    <button
                                      type="button"
                                      onClick={() => handleItemClick(activeCategory.name, item, group.name)}
                                      className={`w-full text-left transition py-0.5 flex items-center justify-between group/link ${
                                        item.isViewAll
                                          ? 'text-amber-400 hover:text-amber-300 font-bold mb-1'
                                          : 'text-slate-300 hover:text-amber-400'
                                      }`}
                                    >
                                      <span className="truncate group-hover/link:translate-x-1 transition-transform">
                                        {item.label}
                                      </span>
                                      {item.isViewAll && (
                                        <ArrowRight className="w-3 h-3 text-amber-400 opacity-80 group-hover/link:translate-x-0.5 transition-transform shrink-0" />
                                      )}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-20 text-slate-500">
                        Selecciona una categoría para ver sus opciones
                      </div>
                    )}
                  </div>
                </div>

                {/* ========================================================= */}
                {/* VISTA MÓVIL (< MD): DRILLDOWN FLUIDO */}
                {/* ========================================================= */}
                <div className="flex md:hidden flex-1 w-full overflow-hidden flex-col">
                  {mobileActiveCategory ? (
                    // Vista de Subcategorías en Móvil
                    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
                      <button
                        type="button"
                        onClick={() => setMobileActiveCategory(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 pb-2 border-b border-white/[0.08]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Volver a todas las categorías</span>
                      </button>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <h3 className="text-lg font-black text-white">
                            {mobileActiveCategory.name}
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            {mobileActiveCategory.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCategoryViewAll(mobileActiveCategory)}
                          className="px-3 py-1.5 bg-amber-500 text-black text-xs font-black rounded-lg shrink-0"
                        >
                          Ver todo
                        </button>
                      </div>

                      <div className="space-y-4 pt-2">
                        {mobileActiveCategory.groups.map((group) => (
                          <div
                            key={group.id}
                            className="p-3.5 rounded-xl bg-[#0b101f] border border-white/[0.06] space-y-2.5"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                navigate(`/catalogo?categoria=${encodeURIComponent(mobileActiveCategory.name)}&subcategoria=${encodeURIComponent(group.name)}`);
                              }}
                              className="text-xs font-bold text-amber-400 uppercase tracking-wider text-left block w-full"
                            >
                              {group.name}
                            </button>
                            <ul className="space-y-2 pl-2 text-xs">
                              {group.items.map((item, idx) => (
                                <li key={idx}>
                                  <button
                                    type="button"
                                    onClick={() => handleItemClick(mobileActiveCategory.name, item, group.name)}
                                    className={`w-full text-left py-1 flex items-center justify-between ${
                                      item.isViewAll ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'
                                    }`}
                                  >
                                    <span>{item.label}</span>
                                    <ChevronRight className="w-3 h-3 text-slate-600" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Lista de Categorías Principales en Móvil
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                      <div className="px-2 py-2 mb-1">
                        <input
                          type="text"
                          placeholder="Buscar categorías o productos..."
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          className="w-full bg-[#0d1222] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      {filteredTree.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/catalogo?categoria=${encodeURIComponent(cat.name)}`);
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0b101f]/50 hover:bg-[#121a2d] border border-white/[0.04] text-xs text-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                              {getCategoryIcon(cat.iconName, 'w-4 h-4')}
                            </div>
                            <span className="font-bold text-white">{cat.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* BARRA INFERIOR DE PIE EN EL MODAL PERFECTAMENTE ALINEADA */}
              <div className="bg-[#05080f] border-t border-white/[0.08] px-4 sm:px-6 py-2.5 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/catalogo');
                  }}
                  className="flex items-center gap-2 hover:text-amber-400 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold">NovaSats Marketplace • Catálogo descentralizado</span>
                </button>
                <div className="hidden sm:flex items-center gap-3 text-slate-500">
                  <span>Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-mono text-[10px]">Esc</kbd> para salir</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
