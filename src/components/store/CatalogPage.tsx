import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types/store';
import { useCart } from '../../context/CartContext';
import { CartDrawer } from '../shared/CartDrawer';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Bitcoin,
  Search,
  ChevronRight,
  Package,
  Truck,
  Star,
  RotateCcw,
  SlidersHorizontal,
  Filter,
  Home,
  X,
  Store,
  Check
} from 'lucide-react';

import { fetchAllStoreProducts, isFreeShippingProduct } from '../../data/productsData';

// Listas de opciones de filtros solicitados por el usuario
const MARCAS_LIST = ['Apple', 'Samsung', 'Sony', 'Ledger', 'Trezor', 'Bitmain', 'Nintendo', 'ASUS', 'Xiaomi', 'Logitech', 'Nike', 'Adidas'];
const COLORES_LIST = [
  { id: 'negro', label: 'Negro', hex: '#111827' },
  { id: 'blanco', label: 'Blanco', hex: '#F9FAFB' },
  { id: 'plata', label: 'Plata / Gris', hex: '#9CA3AF' },
  { id: 'azul', label: 'Azul', hex: '#3B82F6' },
  { id: 'rojo', label: 'Rojo', hex: '#EF4444' },
  { id: 'verde', label: 'Verde', hex: '#10B981' },
  { id: 'dorado', label: 'Dorado', hex: '#F59E0B' }
];

const CAPACIDADES_LIST = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '2 TB'];
const CONECTIVIDAD_LIST = ['Wi-Fi', 'Bluetooth', 'USB-C', '5G', 'Ethernet', 'Lightning'];
const ESRB_LIST = [
  { id: 'E', label: 'Everyone (E)' },
  { id: 'E10+', label: 'Everyone 10+ (E10+)' },
  { id: 'T', label: 'Teen (T)' },
  { id: 'M', label: 'Mature 17+ (M)' },
  { id: 'AO', label: 'Adults Only 18+ (AO)' }
];
const PANTALLA_LIST = [
  { id: 'under-6', label: 'Menos de 6"' },
  { id: '6-7', label: '6" a 6.9"' },
  { id: '10-13', label: '10" a 12.9"' },
  { id: '13-14', label: '13" a 14"' },
  { id: '15-16', label: '15" a 16"' },
  { id: '24-27', label: '24" a 27"' },
  { id: '32-plus', label: '32" o más' }
];

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQ = searchParams.get('q') || searchParams.get('search') || '';
  const urlCategoria = searchParams.get('categoria') || searchParams.get('category') || 'Todas';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de los 12 filtros solicitados
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<'all' | 'domicilio' | 'retiro'>('all');
  const [selectedCategory, setSelectedCategory] = useState(urlCategoria);
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [priceRange, setPriceRange] = useState<'all' | 'under-50' | '50-150' | '150-500' | 'over-500'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [soldByFilter, setSoldByFilter] = useState<'all' | 'official' | 'verified'>('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [conditionFilter, setConditionFilter] = useState<'all' | 'new' | 'refurbished' | 'used'>('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [selectedConnectivity, setSelectedConnectivity] = useState('all');
  const [selectedEsrb, setSelectedEsrb] = useState('all');
  const [selectedScreenSize, setSelectedScreenSize] = useState('all');

  const [sortBy, setSortBy] = useState<'featured' | 'discount' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const { addToCart, itemCount, setIsCartOpen } = useCart();

  // Carga de productos
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchAllStoreProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching catalog products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sincronizar parámetros de URL
  useEffect(() => {
    const qParam = searchParams.get('q') || searchParams.get('search') || '';
    const catParam = searchParams.get('categoria') || searchParams.get('category') || 'Todas';

    if (qParam !== searchQuery) setSearchQuery(qParam);
    if (catParam !== selectedCategory) setSelectedCategory(catParam);
  }, [searchParams]);

  // Categorías disponibles
  const categories = useMemo(() => {
    return ['Todas', ...Array.from(new Set(products.map((p) => p.category || 'General')))];
  }, [products]);

  // Conteo de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (deliveryTypeFilter !== 'all') count++;
    if (selectedCategory !== 'Todas') count++;
    if (selectedBrand !== 'Todas') count++;
    if (priceRange !== 'all') count++;
    if (minRating > 0) count++;
    if (soldByFilter !== 'all') count++;
    if (selectedColor !== 'all') count++;
    if (conditionFilter !== 'all') count++;
    if (selectedCapacity !== 'all') count++;
    if (selectedConnectivity !== 'all') count++;
    if (selectedEsrb !== 'all') count++;
    if (selectedScreenSize !== 'all') count++;
    return count;
  }, [
    searchQuery, deliveryTypeFilter, selectedCategory, selectedBrand, priceRange,
    minRating, soldByFilter, selectedColor, conditionFilter, selectedCapacity,
    selectedConnectivity, selectedEsrb, selectedScreenSize
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setDeliveryTypeFilter('all');
    setSelectedCategory('Todas');
    setSelectedBrand('Todas');
    setPriceRange('all');
    setMinRating(0);
    setSoldByFilter('all');
    setSelectedColor('all');
    setConditionFilter('all');
    setSelectedCapacity('all');
    setSelectedConnectivity('all');
    setSelectedEsrb('all');
    setSelectedScreenSize('all');
    setSortBy('featured');
    setSearchParams({}, { replace: true });
  };

  // Pipeline de Filtrado y Ordenamiento
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const textToSearch = `${p.name} ${p.description} ${p.category || ''} ${p.suppliers?.company_name || ''}`.toLowerCase();

        // 1. Buscador
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          if (!textToSearch.includes(q)) return false;
        }

        // 2. Tipo de Entrega (Envío a domicilio / Retiro en un punto)
        if (deliveryTypeFilter === 'domicilio') {
          // Coincide con envío gratis o express o domicilio
          const isDomicilio = isFreeShippingProduct(p) || p.shipping_type === 'express' || p.shipping_type === 'free' || !p.shipping_type;
          if (!isDomicilio) return false;
        } else if (deliveryTypeFilter === 'retiro') {
          // Productos disponibles para retiro local o estándar
          const isRetiro = p.stock > 0;
          if (!isRetiro) return false;
        }

        // 3. Categoría
        if (selectedCategory !== 'Todas' && (p.category || 'General') !== selectedCategory) {
          return false;
        }

        // 4. Marca
        if (selectedBrand !== 'Todas') {
          const brandMatch = textToSearch.includes(selectedBrand.toLowerCase());
          if (!brandMatch) return false;
        }

        // 5. Precio
        if (priceRange === 'under-50' && p.price_usd >= 50) return false;
        if (priceRange === '50-150' && (p.price_usd < 50 || p.price_usd > 150)) return false;
        if (priceRange === '150-500' && (p.price_usd <= 150 || p.price_usd > 500)) return false;
        if (priceRange === 'over-500' && p.price_usd <= 500) return false;

        // 6. Calificación del producto
        if (minRating > 0 && (p.rating || 0) < minRating) return false;

        // 7. Vendido por
        if (soldByFilter === 'official') {
          const isOfficial = (p.suppliers?.company_name || '').toLowerCase().includes('novasats') || (p.suppliers?.company_name || '').toLowerCase().includes('oficial');
          if (!isOfficial) return false;
        } else if (soldByFilter === 'verified') {
          const isVerified = Boolean(p.suppliers?.wallet_address && p.suppliers?.company_name);
          if (!isVerified) return false;
        }

        // 8. Color
        if (selectedColor !== 'all') {
          const colorMatch = textToSearch.includes(selectedColor) || 
            (selectedColor === 'negro' && textToSearch.includes('black')) ||
            (selectedColor === 'blanco' && textToSearch.includes('white')) ||
            (selectedColor === 'plata' && (textToSearch.includes('silver') || textToSearch.includes('gris'))) ||
            (selectedColor === 'azul' && textToSearch.includes('blue')) ||
            (selectedColor === 'rojo' && textToSearch.includes('red')) ||
            (selectedColor === 'verde' && textToSearch.includes('green')) ||
            (selectedColor === 'dorado' && textToSearch.includes('gold'));
          if (!colorMatch) return false;
        }

        // 9. Condición del producto
        if (conditionFilter === 'new') {
          const isNew = !p.condition || p.condition.toLowerCase().includes('nuevo') || p.condition.toLowerCase().includes('new');
          if (!isNew) return false;
        } else if (conditionFilter === 'refurbished') {
          const isRefurb = Boolean(p.condition && (p.condition.toLowerCase().includes('reacon') || p.condition.toLowerCase().includes('refurb')));
          if (!isRefurb) return false;
        } else if (conditionFilter === 'used') {
          const isUsed = Boolean(p.condition && (p.condition.toLowerCase().includes('usado') || p.condition.toLowerCase().includes('used')));
          if (!isUsed) return false;
        }

        // 10. Capacidad
        if (selectedCapacity !== 'all') {
          const capMatch = textToSearch.includes(selectedCapacity.toLowerCase()) || 
            textToSearch.includes(selectedCapacity.replace(' ', '').toLowerCase());
          if (!capMatch) return false;
        }

        // 11. Conectividad
        if (selectedConnectivity !== 'all') {
          const conMatch = textToSearch.includes(selectedConnectivity.toLowerCase()) ||
            (selectedConnectivity === 'Wi-Fi' && textToSearch.includes('wifi')) ||
            (selectedConnectivity === 'USB-C' && (textToSearch.includes('usbc') || textToSearch.includes('tipo c')));
          if (!conMatch) return false;
        }

        // 12. ESRB (Para juegos/entretenimiento o mención en texto)
        if (selectedEsrb !== 'all') {
          const esrbMatch = textToSearch.includes(selectedEsrb.toLowerCase()) || textToSearch.includes('esrb');
          if (!esrbMatch) return false;
        }

        // 13. Tamaño de pantalla
        if (selectedScreenSize !== 'all') {
          if (selectedScreenSize === 'under-6' && !textToSearch.includes('5.') && !textToSearch.includes('4.')) return false;
          if (selectedScreenSize === '6-7' && !textToSearch.includes('6.') && !textToSearch.includes('6"')) return false;
          if (selectedScreenSize === '10-13' && !textToSearch.includes('10.') && !textToSearch.includes('11.') && !textToSearch.includes('12.')) return false;
          if (selectedScreenSize === '13-14' && !textToSearch.includes('13.') && !textToSearch.includes('14.')) return false;
          if (selectedScreenSize === '15-16' && !textToSearch.includes('15.') && !textToSearch.includes('16.')) return false;
          if (selectedScreenSize === '24-27' && !textToSearch.includes('24.') && !textToSearch.includes('27.')) return false;
          if (selectedScreenSize === '32-plus' && !textToSearch.includes('32.') && !textToSearch.includes('40.') && !textToSearch.includes('50.')) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price_usd - b.price_usd;
        if (sortBy === 'price-desc') return b.price_usd - a.price_usd;
        if (sortBy === 'discount') return (b.discount_percent || 0) - (a.discount_percent || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        return 0; // default featured
      });
  }, [
    products, searchQuery, deliveryTypeFilter, selectedCategory, selectedBrand,
    priceRange, minRating, soldByFilter, selectedColor, conditionFilter,
    selectedCapacity, selectedConnectivity, selectedEsrb, selectedScreenSize, sortBy
  ]);

  // Paginación: 10 productos por página
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery, deliveryTypeFilter, selectedCategory, selectedBrand, priceRange,
    minRating, soldByFilter, selectedColor, conditionFilter, selectedCapacity,
    selectedConnectivity, selectedEsrb, selectedScreenSize, sortBy
  ]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // RENDERIZADO DEL SIDEBAR DE FILTROS COMPLETOS
  const renderSidebarContent = () => (
    <div className="space-y-6 text-xs">
      
      {/* Encabezado del filtro */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider font-mono">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Filtros ({activeFiltersCount})</span>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetAllFilters}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* 1. TIPO DE ENTREGA */}
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
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-xs text-white">Envío a domicilio</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                ⚡ Llega mañana
              </span>
            </div>
            {deliveryTypeFilter === 'domicilio' && <Check className="w-4 h-4 text-amber-400" />}
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
              <div className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-xs text-white">Retiro en un punto</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono block mt-0.5">
                📍 Retira mañana
              </span>
            </div>
            {deliveryTypeFilter === 'retiro' && <Check className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* 2. CATEGORÍA */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          Categoría
        </label>
        <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-black" />}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MARCA */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          Marca
        </label>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
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
          {MARCAS_LIST.map((marca) => (
            <button
              key={marca}
              type="button"
              onClick={() => setSelectedBrand(selectedBrand === marca ? 'Todas' : marca)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                selectedBrand === marca
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              <span>{marca}</span>
              {selectedBrand === marca && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* 4. PRECIO */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          Precio
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'Cualquier precio' },
            { id: 'under-50', label: 'Menos de $50 USD' },
            { id: '50-150', label: '$50 a $150 USD' },
            { id: '150-500', label: '$150 a $500 USD' },
            { id: 'over-500', label: 'Más de $500 USD' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPriceRange(p.id as any)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                priceRange === p.id
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              <span>{p.label}</span>
              {priceRange === p.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* 5. CALIFICACIÓN DEL PRODUCTO */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          Calificación del producto
        </label>
        <div className="space-y-1">
          {[
            { val: 0, label: 'Cualquier calificación' },
            { val: 4.5, label: '4.5+ Estrellas' },
            { val: 4.0, label: '4.0+ Estrellas' },
            { val: 3.0, label: '3.0+ Estrellas' },
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

      {/* 6. VENDIDO POR */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          Vendido por
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'Todos los vendedores' },
            { id: 'official', label: 'NovaSats Oficial' },
            { id: 'verified', label: 'Proveedores Verificados' },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSoldByFilter(v.id as any)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                soldByFilter === v.id
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              <span>{v.label}</span>
              {soldByFilter === v.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* 7. COLOR */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          Color
        </label>
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
          {COLORES_LIST.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedColor(selectedColor === c.id ? 'all' : c.id)}
              className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition ${
                selectedColor === c.id
                  ? 'border-amber-500 bg-amber-500/10 text-white font-semibold'
                  : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              <span className="truncate text-[11px]">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 8. CONDICIÓN DEL PRODUCTO */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          Condición del producto
        </label>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'new', label: 'Nuevo' },
            { id: 'refurbished', label: 'Reacond.' },
          ].map((cond) => (
            <button
              key={cond.id}
              type="button"
              onClick={() => setConditionFilter(cond.id as any)}
              className={`py-1.5 px-2 rounded-lg text-center text-[11px] font-semibold transition ${
                conditionFilter === cond.id
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* 9. CAPACIDAD */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          Capacidad
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCapacity('all')}
            className={`col-span-3 text-left px-2 py-1 rounded-lg text-xs transition ${
              selectedCapacity === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Cualquier capacidad
          </button>
          {CAPACIDADES_LIST.map((cap) => (
            <button
              key={cap}
              type="button"
              onClick={() => setSelectedCapacity(selectedCapacity === cap ? 'all' : cap)}
              className={`p-1.5 rounded-lg text-center text-[11px] font-mono font-semibold transition border ${
                selectedCapacity === cap
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                  : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {/* 10. CONECTIVIDAD / CONEXIÓN */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          Conectividad/conexión
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedConnectivity('all')}
            className={`col-span-2 text-left px-2 py-1 rounded-lg text-xs transition ${
              selectedConnectivity === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas las conexiones
          </button>
          {CONECTIVIDAD_LIST.map((con) => (
            <button
              key={con}
              type="button"
              onClick={() => setSelectedConnectivity(selectedConnectivity === con ? 'all' : con)}
              className={`p-1.5 rounded-lg text-left text-[11px] font-semibold transition border truncate ${
                selectedConnectivity === con
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                  : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              {con}
            </button>
          ))}
        </div>
      </div>

      {/* 11. ESRB */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          ESRB
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedEsrb('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              selectedEsrb === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas las clasificaciones
          </button>
          {ESRB_LIST.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setSelectedEsrb(selectedEsrb === e.id ? 'all' : e.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                selectedEsrb === e.id
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              <span>{e.label}</span>
              {selectedEsrb === e.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* 12. TAMAÑO DE LA PANTALLA */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
          Tamaño de la pantalla
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedScreenSize('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              selectedScreenSize === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Cualquier tamaño
          </button>
          {PANTALLA_LIST.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedScreenSize(selectedScreenSize === s.id ? 'all' : s.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                selectedScreenSize === s.id
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              <span>{s.label}</span>
              {selectedScreenSize === s.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* HEADER LIMPIO (Sin Portal Proveedores, con enlaces directos y buscador) */}
      <header className="sticky top-0 z-40 bg-[#060911]/90 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Logo */}
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
                Catálogo Oficial
              </span>
            </div>
          </Link>
        </div>

        {/* Buscador superior central */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar en el catálogo por nombre, marca o modelo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1222] border border-white/[0.1] rounded-xl pl-10 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Acciones de la cabecera (Sin botón de donar) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Inicio</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:from-amber-400 hover:to-orange-400 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Carrito ({itemCount})</span>
          </button>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="bg-[#04060c] border-b border-white/[0.06] py-3 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-amber-400 transition flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>Inicio</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-amber-400 font-bold">Catálogo de Productos</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            {filteredProducts.length} productos encontrados
          </span>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: FILTROS LATERALES + CATÁLOGO DE PRODUCTOS */}
      <main className="py-6 sm:py-8 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full flex-1">
        
        {/* Buscador móvil */}
        <div className="md:hidden mb-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar en el catálogo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1222] border border-white/[0.1] rounded-xl pl-10 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Barra superior de herramientas: Botón de filtro móvil, chips activos y ordenamiento */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06]">
          
          <div className="flex items-center gap-2">
            {/* Botón Filtros móvil */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d1222] border border-white/[0.1] rounded-xl text-xs font-bold text-amber-400"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros ({activeFiltersCount})</span>
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Mostrando {filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
            </span>
          </div>

          {/* Ordenar por */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0d1222] border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="discount">Mayor descuento</option>
              <option value="rating">Mejor calificación</option>
              <option value="newest">Más recientes</option>
            </select>
          </div>
        </div>

        {/* Chips de filtros activos */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-6 text-xs">
            <span className="text-slate-500 text-[11px] font-mono mr-1">Filtros aplicados:</span>
            
            {deliveryTypeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                Entrega: {deliveryTypeFilter === 'domicilio' ? 'Envío a domicilio' : 'Retiro en punto'}
                <button onClick={() => setDeliveryTypeFilter('all')}>✕</button>
              </span>
            )}

            {selectedCategory !== 'Todas' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                Categoría: {selectedCategory}
                <button onClick={() => setSelectedCategory('Todas')}>✕</button>
              </span>
            )}

            {selectedBrand !== 'Todas' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                Marca: {selectedBrand}
                <button onClick={() => setSelectedBrand('Todas')}>✕</button>
              </span>
            )}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                Precio activo
                <button onClick={() => setPriceRange('all')}>✕</button>
              </span>
            )}

            {selectedColor !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                Color: {selectedColor}
                <button onClick={() => setSelectedColor('all')}>✕</button>
              </span>
            )}

            {conditionFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                Condición: {conditionFilter}
                <button onClick={() => setConditionFilter('all')}>✕</button>
              </span>
            )}

            {selectedCapacity !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                Capacidad: {selectedCapacity}
                <button onClick={() => setSelectedCapacity('all')}>✕</button>
              </span>
            )}

            {selectedConnectivity !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                Conexión: {selectedConnectivity}
                <button onClick={() => setSelectedConnectivity('all')}>✕</button>
              </span>
            )}

            {selectedEsrb !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                ESRB: {selectedEsrb}
                <button onClick={() => setSelectedEsrb('all')}>✕</button>
              </span>
            )}

            {selectedScreenSize !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                Pantalla activa
                <button onClick={() => setSelectedScreenSize('all')}>✕</button>
              </span>
            )}

            <button
              onClick={resetAllFilters}
              className="text-[11px] text-rose-400 hover:underline font-bold ml-1"
            >
              Borrar todos
            </button>
          </div>
        )}

        {/* Layout 2 Columnas: Filtros a la izquierda + Productos a la derecha */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SIDEBAR DE FILTROS EN DESKTOP */}
          <aside className="hidden lg:block w-72 shrink-0 bg-[#090d19]/90 backdrop-blur-md border border-white/[0.08] rounded-3xl p-5 sticky top-24 shadow-xl max-h-[85vh] overflow-y-auto">
            {renderSidebarContent()}
          </aside>

          {/* DRAWER DE FILTROS EN MÓVIL */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm lg:hidden">
              <div className="relative w-full max-w-xs bg-[#090d19] h-full overflow-y-auto p-5 border-r border-white/[0.1] shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Filter className="w-4 h-4 text-amber-400" />
                      <span>Filtros de Búsqueda</span>
                    </h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {renderSidebarContent()}
                </div>
                <div className="pt-4 mt-4 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                  >
                    Ver {filteredProducts.length} Resultados
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CUADRÍCULA DE PRODUCTOS */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#090d19]/60 border border-white/[0.06] rounded-3xl space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">No se encontraron productos</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No hay productos que coincidan con la combinación de filtros seleccionada. Prueba a restablecer los filtros para ver más resultados.
                </p>
                <div className="pt-2">
                  <button
                    onClick={resetAllFilters}
                    className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition"
                  >
                    Restablecer todos los filtros
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group rounded-2xl bg-[#0b101f] border border-white/[0.06] hover:border-amber-500/40 transition flex flex-col justify-between overflow-hidden shadow-lg"
                    >
                      <div>
                        {/* Imagen del producto */}
                        <Link to={`/producto/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-900">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          {product.discount_percent && product.discount_percent > 0 ? (
                            <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-full shadow-md">
                              -{product.discount_percent}%
                            </span>
                          ) : null}
                          <span className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                            {product.category || 'General'}
                          </span>
                        </Link>

                        {/* Detalles */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="text-slate-500 font-mono truncate">
                              {product.suppliers?.company_name || 'NovaSats Store'}
                            </span>
                            {product.rating ? (
                              <div className="flex items-center gap-1 text-amber-400">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span className="font-bold text-[10px]">{product.rating}</span>
                              </div>
                            ) : null}
                          </div>

                          <Link to={`/producto/${product.id}`} className="block">
                            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition line-clamp-2">
                              {product.name}
                            </h4>
                          </Link>

                          <p className="text-xs text-slate-400 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Badges de entrega rápida */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {isFreeShippingProduct(product) && (
                              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Envío gratis
                              </span>
                            )}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              Llega mañana
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer de la tarjeta con precio y botón de compra */}
                      <div className="p-4 pt-2 border-t border-white/[0.06] flex items-center justify-between mt-2">
                        <div>
                          <div className="text-base font-black text-white">
                            ${Number(product.price_usd).toFixed(2)} USD
                          </div>
                          <div className="text-[11px] font-mono text-amber-400 font-bold">
                            {Number(product.price_btc).toFixed(8)} ₿
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                          className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 transition active:scale-95"
                          title="Agregar al Carrito"
                        >
                          <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                {/* PAGINACIÓN (10 productos por página) */}
                {totalPages > 1 && (
                  <div className="pt-8 pb-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-xl bg-[#0d1222] border border-white/[0.1] text-xs font-semibold text-slate-300 disabled:opacity-40 hover:bg-white/[0.05] transition"
                    >
                      Anterior
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                        <button
                          key={pg}
                          onClick={() => handlePageChange(pg)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                            currentPage === pg
                              ? 'bg-amber-500 text-black shadow-md'
                              : 'bg-[#0d1222] border border-white/[0.08] text-slate-400 hover:text-white'
                          }`}
                        >
                          {pg}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-xl bg-[#0d1222] border border-white/[0.1] text-xs font-semibold text-slate-300 disabled:opacity-40 hover:bg-white/[0.05] transition"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </main>

      {/* PIE DE PÁGINA (Footer) */}
      <footer className="mt-auto bg-[#030508] border-t border-white/[0.08] text-slate-400 pt-12 pb-8 px-4 sm:px-8 lg:px-12 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <Bitcoin className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <span className="text-base font-black text-white">Nova<span className="text-amber-500">Sats</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Catálogo completo de hardware y mercancía con liquidación directa en Bitcoin on-chain.
            </p>
            <div className="pt-1">
              <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                100% Non-Custodial P2P
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Navegación
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/" className="hover:text-amber-400 transition block">
                  Página de Inicio
                </Link>
              </li>
              <li>
                <Link to="/donaciones" className="hover:text-amber-400 transition block">
                  Donaciones (PayPal & Yape)
                </Link>
              </li>
              <li>
                <Link to="/promociones" className="hover:text-amber-400 transition block">
                  Promociones
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Servicio al Cliente
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/ayuda" className="hover:text-amber-400 transition block">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/servicio-al-cliente" className="hover:text-amber-400 transition block">
                  Servicio al Cliente
                </Link>
              </li>
              <li>
                <Link to="/reclamos" className="hover:text-amber-400 transition block">
                  Reclamos
                </Link>
              </li>
              <li>
                <Link to="/libro-de-reclamaciones" className="hover:text-amber-400 transition font-bold text-amber-400 block">
                  Libro de Reclamaciones
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Legales y Políticas
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/terminos-y-condiciones" className="hover:text-amber-400 transition block">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/como-cuidamos-tu-privacidad" className="hover:text-amber-400 transition block">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link to="/accesibilidad" className="hover:text-amber-400 transition block">
                  Accesibilidad
                </Link>
              </li>
              <li>
                <Link to="/politica-cookies" className="hover:text-amber-400 transition block">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© Todos los derechos reservados • NovaSats Technologies S.A.C.</p>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[10px]">
            <span>Bitcoin Network Verified</span>
            <span>•</span>
            <span>NovaSats.sol • On-Chain</span>
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DEL CARRITO */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center shadow-2xl shadow-amber-500/35 border border-amber-300/40 hover:scale-110 active:scale-95 transition-all duration-300 group"
        title="Ver bolsa de compras"
        aria-label="Ver bolsa de compras"
      >
        <ShoppingBag className="w-6 h-6 text-black stroke-[2.2] group-hover:rotate-6 transition-transform" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1.5 bg-black text-amber-400 font-black text-xs font-mono rounded-full border-2 border-amber-400 flex items-center justify-center shadow-lg animate-bounce">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <CartDrawer />

    </div>
  );
};
