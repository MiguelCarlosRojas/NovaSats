import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types/store';
import { useCart } from '../../context/CartContext';
import { CartDrawer } from '../shared/CartDrawer';
import { FloatingCartButton } from '../shared/FloatingCartButton';
import { StoreFooter } from './StoreFooter';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Bitcoin,
  Search,
  ChevronRight,
  Package,
  Star,
  RotateCcw,
  Filter,
  Home,
  X
} from 'lucide-react';

import { fetchAllStoreProducts, isFreeShippingProduct } from '../../data/productsData';
import { CATEGORY_CATALOG } from '../../data/categories';
import {
  getProductSearchableText,
  detectCategoryFamily,
  matchesBrand,
  matchesSeller,
  matchesPriceRange,
  matchesColor,
  matchesCondition,
  matchesCapacity,
  matchesGeneration,
  matchesTalla,
  matchesCores,
  matchesRefreshRate,
  matchesCamera,
  matchesBluetooth,
  matchesLaptopScreenSize,
  matchesProcessor,
  matchesRam,
  matchesOperatingSystem,
  matchesScreenFeature,
  matchesTvScreenSize,
  matchesUsbPorts,
  matchesHdmiPorts,
  matchesScreenResolution,
  matchesVoltage,
  matchesConnectivity,
  matchesEsrb,
  matchesGender,
  matchesAgeRange,
  matchesPetType,
  matchesVehicleType,
  matchesPowerType,
  matchesSkinType,
  matchesBedSize,
  matchesEnergyEfficiency,
  matchesDiscipline
} from '../../data/categoryFiltersData';

import { CelularFilters } from './filters/CelularFilters';
import { LaptopFilters } from './filters/LaptopFilters';
import { TvFilters } from './filters/TvFilters';
import { SpecializedCategoryFilters } from './filters/SpecializedCategoryFilters';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQ = searchParams.get('q') || searchParams.get('search') || '';
  const urlCategoria = searchParams.get('categoria') || searchParams.get('category') || 'Todas';
  const urlSubcat = searchParams.get('subcategoria') || searchParams.get('subcategory') || 'Todas';
  const urlMarca = searchParams.get('marca') || searchParams.get('brand') || 'Todas';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<'all' | 'domicilio' | 'retiro'>('all');
  const [selectedCategory, setSelectedCategory] = useState(urlCategoria);
  const [selectedSubcategory, setSelectedSubcategory] = useState(urlSubcat);
  const [selectedBrand, setSelectedBrand] = useState(urlMarca);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [soldByFilter, setSoldByFilter] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [selectedGeneracion, setSelectedGeneracion] = useState('all');
  const [selectedTalla, setSelectedTalla] = useState('all');
  const [selectedCores, setSelectedCores] = useState('all');
  const [selectedRefreshRate, setSelectedRefreshRate] = useState('all');
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [selectedBluetooth, setSelectedBluetooth] = useState<'all' | 'si' | 'no'>('all');

  // Filtros adicionales específicos
  const [laptopScreenSize, setLaptopScreenSize] = useState('all');
  const [processor, setProcessor] = useState('all');
  const [ram, setRam] = useState('all');
  const [operatingSystem, setOperatingSystem] = useState('all');
  const [screenFeature, setScreenFeature] = useState('all');

  const [tvScreenSize, setTvScreenSize] = useState('all');
  const [tvFeature, setTvFeature] = useState('all');
  const [tvUsbPorts, setTvUsbPorts] = useState('all');
  const [tvResolution, setTvResolution] = useState('all');
  const [selectedConnectivity, setSelectedConnectivity] = useState('all');
  const [tvHdmiPorts, setTvHdmiPorts] = useState('all');
  const [tvVoltage, setTvVoltage] = useState('all');

  const [selectedEsrb, setSelectedEsrb] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');
  const [selectedPetType, setSelectedPetType] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [selectedPowerType, setSelectedPowerType] = useState('all');
  const [selectedSkinType, setSelectedSkinType] = useState('all');
  const [selectedBedSize, setSelectedBedSize] = useState('all');
  const [selectedEnergyEfficiency, setSelectedEnergyEfficiency] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');

  const [sortBy, setSortBy] = useState<'featured' | 'discount' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const { addToCart } = useCart();

  // Detección automática y precisa de la familia de categoría
  const familyInfo = useMemo(() => {
    return detectCategoryFamily(selectedCategory, selectedSubcategory, searchQuery);
  }, [selectedCategory, selectedSubcategory, searchQuery]);

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
    const subcatParam = searchParams.get('subcategoria') || searchParams.get('subcategory') || 'Todas';
    const brandParam = searchParams.get('marca') || searchParams.get('brand') || 'Todas';

    if (qParam !== searchQuery) setSearchQuery(qParam);
    if (catParam !== selectedCategory) setSelectedCategory(catParam);
    if (subcatParam !== selectedSubcategory) setSelectedSubcategory(subcatParam);
    if (brandParam !== selectedBrand) setSelectedBrand(brandParam);
  }, [searchParams]);

  // Conteo de productos por categoría y subcategoría
  const productCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  const matchesSubcategoryHelper = (p: Product, subcat: string): boolean => {
    if (!subcat || subcat === 'Todas') return true;
    if (p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase()) return true;
    const searchable = `${p.name} ${p.description}`.toLowerCase();
    return searchable.includes(subcat.toLowerCase());
  };

  // Conteo de filtros activos aplicados
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (deliveryTypeFilter !== 'all') count++;
    if (selectedCategory !== 'Todas') count++;
    if (selectedSubcategory !== 'Todas') count++;
    if (selectedBrand !== 'Todas') count++;
    if (priceRange !== 'all') count++;
    if (minRating > 0) count++;
    if (soldByFilter !== 'all') count++;
    if (selectedColor !== 'all') count++;
    if (conditionFilter !== 'all') count++;
    if (selectedCapacity !== 'all') count++;
    if (selectedGeneracion !== 'all') count++;
    if (selectedTalla !== 'all') count++;
    if (selectedCores !== 'all') count++;
    if (selectedRefreshRate !== 'all') count++;
    if (selectedCamera !== 'all') count++;
    if (selectedBluetooth !== 'all') count++;

    if (laptopScreenSize !== 'all') count++;
    if (processor !== 'all') count++;
    if (ram !== 'all') count++;
    if (operatingSystem !== 'all') count++;
    if (screenFeature !== 'all') count++;

    if (tvScreenSize !== 'all') count++;
    if (tvFeature !== 'all') count++;
    if (tvUsbPorts !== 'all') count++;
    if (tvResolution !== 'all') count++;
    if (selectedConnectivity !== 'all') count++;
    if (tvHdmiPorts !== 'all') count++;
    if (tvVoltage !== 'all') count++;

    if (selectedEsrb !== 'all') count++;
    if (selectedMaterial !== 'all') count++;
    if (selectedGender !== 'all') count++;
    if (selectedAgeRange !== 'all') count++;
    if (selectedPetType !== 'all') count++;
    if (selectedVehicleType !== 'all') count++;
    if (selectedPowerType !== 'all') count++;
    if (selectedSkinType !== 'all') count++;
    if (selectedBedSize !== 'all') count++;
    if (selectedEnergyEfficiency !== 'all') count++;
    if (selectedDiscipline !== 'all') count++;

    return count;
  }, [
    searchQuery, deliveryTypeFilter, selectedCategory, selectedSubcategory, selectedBrand, priceRange,
    minRating, soldByFilter, selectedColor, conditionFilter, selectedCapacity,
    selectedGeneracion, selectedTalla, selectedCores, selectedRefreshRate,
    selectedCamera, selectedBluetooth, laptopScreenSize, processor, ram,
    operatingSystem, screenFeature, tvScreenSize, tvFeature, tvUsbPorts,
    tvResolution, selectedConnectivity, tvHdmiPorts, tvVoltage,
    selectedEsrb, selectedMaterial, selectedGender, selectedAgeRange,
    selectedPetType, selectedVehicleType, selectedPowerType, selectedSkinType,
    selectedBedSize, selectedEnergyEfficiency, selectedDiscipline
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setDeliveryTypeFilter('all');
    setSelectedCategory('Todas');
    setSelectedSubcategory('Todas');
    setSelectedBrand('Todas');
    setPriceRange('all');
    setMinRating(0);
    setSoldByFilter('all');
    setSelectedColor('all');
    setConditionFilter('all');
    setSelectedCapacity('all');
    setSelectedGeneracion('all');
    setSelectedTalla('all');
    setSelectedCores('all');
    setSelectedRefreshRate('all');
    setSelectedCamera('all');
    setSelectedBluetooth('all');

    setLaptopScreenSize('all');
    setProcessor('all');
    setRam('all');
    setOperatingSystem('all');
    setScreenFeature('all');

    setTvScreenSize('all');
    setTvFeature('all');
    setTvUsbPorts('all');
    setTvResolution('all');
    setSelectedConnectivity('all');
    setTvHdmiPorts('all');
    setTvVoltage('all');

    setSelectedEsrb('all');
    setSelectedMaterial('all');
    setSelectedGender('all');
    setSelectedAgeRange('all');
    setSelectedPetType('all');
    setSelectedVehicleType('all');
    setSelectedPowerType('all');
    setSelectedSkinType('all');
    setSelectedBedSize('all');
    setSelectedEnergyEfficiency('all');
    setSelectedDiscipline('all');

    setSortBy('featured');
    setSearchParams({}, { replace: true });
  };

  // Pipeline final de filtrado
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const textToSearch = getProductSearchableText(p);

        // 1. Buscador
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          if (!textToSearch.includes(q)) return false;
        }

        // 2. Tipo de Entrega
        if (deliveryTypeFilter === 'domicilio') {
          const isDomicilio = isFreeShippingProduct(p) || p.shipping_type === 'express' || p.shipping_type === 'free' || !p.shipping_type;
          if (!isDomicilio) return false;
        } else if (deliveryTypeFilter === 'retiro') {
          if (p.stock <= 0) return false;
        }

        // 3. Categoría
        if (selectedCategory !== 'Todas') {
          const cat = (p.category || '').toLowerCase();
          const target = selectedCategory.toLowerCase();
          if (!cat.includes(target) && !target.includes(cat) && !textToSearch.includes(target)) {
            return false;
          }
        }

        // 3.1 Subcategoría
        if (selectedSubcategory !== 'Todas' && !matchesSubcategoryHelper(p, selectedSubcategory)) {
          return false;
        }

        // 4. Marca
        if (selectedBrand !== 'Todas' && !matchesBrand(p, selectedBrand)) {
          return false;
        }

        // 5. Precio en PEN
        if (priceRange !== 'all' && !matchesPriceRange(p, priceRange)) {
          return false;
        }

        // 6. Calificación
        if (minRating > 0 && (p.rating || 0) < minRating) return false;

        // 7. Vendido por
        if (soldByFilter !== 'all' && !matchesSeller(p, soldByFilter)) {
          return false;
        }

        // 8. Color
        if (selectedColor !== 'all' && !matchesColor(p, selectedColor)) {
          return false;
        }

        // 9. Condición
        if (conditionFilter !== 'all' && !matchesCondition(p, conditionFilter)) {
          return false;
        }

        // 10. Capacidad
        if (selectedCapacity !== 'all' && !matchesCapacity(p, selectedCapacity)) {
          return false;
        }

        // 11. Generación
        if (selectedGeneracion !== 'all' && !matchesGeneration(p, selectedGeneracion)) {
          return false;
        }

        // 12. Talla
        if (selectedTalla !== 'all' && !matchesTalla(p, selectedTalla)) {
          return false;
        }

        // 13. Núcleos
        if (selectedCores !== 'all' && !matchesCores(p, selectedCores)) {
          return false;
        }

        // 14. Velocidad de imagen
        if (selectedRefreshRate !== 'all' && !matchesRefreshRate(p, selectedRefreshRate)) {
          return false;
        }

        // 15. Cámara principal
        if (selectedCamera !== 'all' && !matchesCamera(p, selectedCamera)) {
          return false;
        }

        // 16. Bluetooth
        if (selectedBluetooth !== 'all' && !matchesBluetooth(p, selectedBluetooth)) {
          return false;
        }

        // 17. Laptop filters
        if (laptopScreenSize !== 'all' && !matchesLaptopScreenSize(p, laptopScreenSize)) return false;
        if (processor !== 'all' && !matchesProcessor(p, processor)) return false;
        if (ram !== 'all' && !matchesRam(p, ram)) return false;
        if (operatingSystem !== 'all' && !matchesOperatingSystem(p, operatingSystem)) return false;
        if (screenFeature !== 'all' && !matchesScreenFeature(p, screenFeature)) return false;

        // 18. TV filters
        if (tvScreenSize !== 'all' && !matchesTvScreenSize(p, tvScreenSize)) return false;
        if (tvFeature !== 'all' && !matchesScreenFeature(p, tvFeature)) return false;
        if (tvUsbPorts !== 'all' && !matchesUsbPorts(p, tvUsbPorts)) return false;
        if (tvResolution !== 'all' && !matchesScreenResolution(p, tvResolution)) return false;
        if (selectedConnectivity !== 'all' && !matchesConnectivity(p, selectedConnectivity)) return false;
        if (tvHdmiPorts !== 'all' && !matchesHdmiPorts(p, tvHdmiPorts)) return false;
        if (tvVoltage !== 'all' && !matchesVoltage(p, tvVoltage)) return false;

        // 19. Specialized filters
        if (selectedEsrb !== 'all' && !matchesEsrb(p, selectedEsrb)) return false;
        if (selectedGender !== 'all' && !matchesGender(p, selectedGender)) return false;
        if (selectedAgeRange !== 'all' && !matchesAgeRange(p, selectedAgeRange)) return false;
        if (selectedPetType !== 'all' && !matchesPetType(p, selectedPetType)) return false;
        if (selectedVehicleType !== 'all' && !matchesVehicleType(p, selectedVehicleType)) return false;
        if (selectedPowerType !== 'all' && !matchesPowerType(p, selectedPowerType)) return false;
        if (selectedSkinType !== 'all' && !matchesSkinType(p, selectedSkinType)) return false;
        if (selectedBedSize !== 'all' && !matchesBedSize(p, selectedBedSize)) return false;
        if (selectedEnergyEfficiency !== 'all' && !matchesEnergyEfficiency(p, selectedEnergyEfficiency)) return false;
        if (selectedDiscipline !== 'all' && !matchesDiscipline(p, selectedDiscipline)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price_usd - b.price_usd;
        if (sortBy === 'price-desc') return b.price_usd - a.price_usd;
        if (sortBy === 'discount') return (b.discount_percent || 0) - (a.discount_percent || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        return 0;
      });
  }, [
    products, searchQuery, deliveryTypeFilter, selectedCategory, selectedSubcategory, selectedBrand,
    priceRange, minRating, soldByFilter, selectedColor, conditionFilter,
    selectedCapacity, selectedGeneracion, selectedTalla, selectedCores,
    selectedRefreshRate, selectedCamera, selectedBluetooth, laptopScreenSize,
    processor, ram, operatingSystem, screenFeature, tvScreenSize, tvFeature,
    tvUsbPorts, tvResolution, selectedConnectivity, tvHdmiPorts, tvVoltage,
    selectedEsrb, selectedMaterial, selectedGender, selectedAgeRange,
    selectedPetType, selectedVehicleType, selectedPowerType, selectedSkinType,
    selectedBedSize, selectedEnergyEfficiency, selectedDiscipline, sortBy
  ]);

  // Paginación: 10 productos por página
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery, deliveryTypeFilter, selectedCategory, selectedSubcategory, selectedBrand, priceRange,
    minRating, soldByFilter, selectedColor, conditionFilter, selectedCapacity,
    selectedConnectivity, selectedEsrb, sortBy
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

  // RENDERIZADO DEL SIDEBAR DE FILTROS (Exacto como pidió el usuario: Sin botones ni switchers)
  const renderSidebarContent = () => {
    return (
      <div className="space-y-6 text-xs">
        
        {/* ENCABEZADO EXACTO DEL USUARIO:
            [Categoría Principal]
            [Subcategoría]
            Resultados ({filteredProducts.length})
        */}
        <div className="space-y-1 pb-4 border-b border-white/[0.08]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            {familyInfo.categoryTitle}
          </div>
          <div className="text-lg font-black text-white font-heading">
            {familyInfo.subcategoryTitle}
          </div>
          <div className="text-xs font-mono font-bold text-amber-400">
            Resultados ({filteredProducts.length})
          </div>

          {/* Si se está viendo una categoría específica, permitir explorar todo el catálogo */}
          {selectedCategory !== 'Todas' && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Todas');
                  setSelectedSubcategory('Todas');
                }}
                className="text-[11px] text-slate-400 hover:text-amber-400 font-mono flex items-center gap-1 transition"
              >
                <span>‹ Ver todo el catálogo</span>
              </button>
            </div>
          )}
        </div>

        {/* Botón de limpiar filtros activos si hay alguno */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
            <span className="text-[11px] text-slate-400 font-mono">Filtros activos: {activeFiltersCount}</span>
            <button
              onClick={resetAllFilters}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar todos</span>
            </button>
          </div>
        )}

        {/* Navegador de Categorías del Catálogo si estamos en modo general */}
        {familyInfo.family === 'general' && (
          <div className="space-y-2 pb-4 border-b border-white/[0.06]">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Explorar Categorías
            </label>
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1 lateral-scrollbar">
              {CATEGORY_CATALOG.map((catDef) => (
                <button
                  key={catDef.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(catDef.name);
                    setSelectedSubcategory('Todas');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between text-slate-300 hover:bg-white/[0.05]"
                >
                  <span className="truncate pr-1">{catDef.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    ({productCountByCategory[catDef.name] || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1. CELULARES: Exacto como pidió el usuario */}
        {familyInfo.family === 'celulares' && (
          <CelularFilters
            deliveryTypeFilter={deliveryTypeFilter}
            setDeliveryTypeFilter={setDeliveryTypeFilter}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            soldByFilter={soldByFilter}
            setSoldByFilter={setSoldByFilter}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            conditionFilter={conditionFilter}
            setConditionFilter={setConditionFilter}
            selectedCapacity={selectedCapacity}
            setSelectedCapacity={setSelectedCapacity}
            selectedGeneracion={selectedGeneracion}
            setSelectedGeneracion={setSelectedGeneracion}
            selectedTalla={selectedTalla}
            setSelectedTalla={setSelectedTalla}
            selectedCores={selectedCores}
            setSelectedCores={setSelectedCores}
            selectedRefreshRate={selectedRefreshRate}
            setSelectedRefreshRate={setSelectedRefreshRate}
            selectedCamera={selectedCamera}
            setSelectedCamera={setSelectedCamera}
            selectedBluetooth={selectedBluetooth}
            setSelectedBluetooth={setSelectedBluetooth}
          />
        )}

        {/* 2. LAPTOPS: Exacto como pidió el usuario */}
        {familyInfo.family === 'laptops' && (
          <LaptopFilters
            deliveryTypeFilter={deliveryTypeFilter}
            setDeliveryTypeFilter={setDeliveryTypeFilter}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            minRating={minRating}
            setMinRating={setMinRating}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            soldByFilter={soldByFilter}
            setSoldByFilter={setSoldByFilter}
            laptopScreenSize={laptopScreenSize}
            setLaptopScreenSize={setLaptopScreenSize}
            processor={processor}
            setProcessor={setProcessor}
            selectedCores={selectedCores}
            setSelectedCores={setSelectedCores}
            selectedCapacity={selectedCapacity}
            setSelectedCapacity={setSelectedCapacity}
            ram={ram}
            setRam={setRam}
            operatingSystem={operatingSystem}
            setOperatingSystem={setOperatingSystem}
            screenFeature={screenFeature}
            setScreenFeature={setScreenFeature}
          />
        )}

        {/* 3. TELEVISORES SMART TV: Exacto como pidió el usuario */}
        {familyInfo.family === 'televisores' && (
          <TvFilters
            deliveryTypeFilter={deliveryTypeFilter}
            setDeliveryTypeFilter={setDeliveryTypeFilter}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            minRating={minRating}
            setMinRating={setMinRating}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            soldByFilter={soldByFilter}
            setSoldByFilter={setSoldByFilter}
            tvScreenSize={tvScreenSize}
            setTvScreenSize={setTvScreenSize}
            tvFeature={tvFeature}
            setTvFeature={setTvFeature}
            tvUsbPorts={tvUsbPorts}
            setTvUsbPorts={setTvUsbPorts}
            tvResolution={tvResolution}
            setTvResolution={setTvResolution}
            selectedRefreshRate={selectedRefreshRate}
            setSelectedRefreshRate={setSelectedRefreshRate}
            operatingSystem={operatingSystem}
            setOperatingSystem={setOperatingSystem}
            selectedConnectivity={selectedConnectivity}
            setSelectedConnectivity={setSelectedConnectivity}
            conditionFilter={conditionFilter}
            setConditionFilter={setConditionFilter}
            tvHdmiPorts={tvHdmiPorts}
            setTvHdmiPorts={setTvHdmiPorts}
            tvVoltage={tvVoltage}
            setTvVoltage={setTvVoltage}
          />
        )}

        {/* 4. RESTO DE TODAS LAS CATEGORÍAS DEL CATÁLOGO */}
        {familyInfo.family !== 'celulares' &&
          familyInfo.family !== 'laptops' &&
          familyInfo.family !== 'televisores' && (
            <SpecializedCategoryFilters
              family={familyInfo.family}
              deliveryTypeFilter={deliveryTypeFilter}
              setDeliveryTypeFilter={setDeliveryTypeFilter}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minRating={minRating}
              setMinRating={setMinRating}
              soldByFilter={soldByFilter}
              setSoldByFilter={setSoldByFilter}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              conditionFilter={conditionFilter}
              setConditionFilter={setConditionFilter}
              selectedCapacity={selectedCapacity}
              setSelectedCapacity={setSelectedCapacity}
              selectedTalla={selectedTalla}
              setSelectedTalla={setSelectedTalla}
              selectedBluetooth={selectedBluetooth}
              setSelectedBluetooth={setSelectedBluetooth}
              selectedEsrb={selectedEsrb}
              setSelectedEsrb={setSelectedEsrb}
              selectedMaterial={selectedMaterial}
              setSelectedMaterial={setSelectedMaterial}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              selectedAgeRange={selectedAgeRange}
              setSelectedAgeRange={setSelectedAgeRange}
              selectedPetType={selectedPetType}
              setSelectedPetType={setSelectedPetType}
              selectedVehicleType={selectedVehicleType}
              setSelectedVehicleType={setSelectedVehicleType}
              selectedPowerType={selectedPowerType}
              setSelectedPowerType={setSelectedPowerType}
              selectedSkinType={selectedSkinType}
              setSelectedSkinType={setSelectedSkinType}
              selectedBedSize={selectedBedSize}
              setSelectedBedSize={setSelectedBedSize}
              selectedEnergyEfficiency={selectedEnergyEfficiency}
              setSelectedEnergyEfficiency={setSelectedEnergyEfficiency}
              selectedDiscipline={selectedDiscipline}
              setSelectedDiscipline={setSelectedDiscipline}
            />
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* HEADER LIMPIO (Sin Portal Proveedores, sin botón de donar, con buscador) */}
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
      </header>

      {/* BREADCRUMB */}
      <div className="bg-[#04060c] border-b border-white/[0.06] py-3 px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="w-full flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-amber-400 transition flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>Inicio</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <Link to="/catalogo" className="hover:text-amber-400 transition">
              Catálogo & Categorías
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-slate-300 font-medium">
              {familyInfo.categoryTitle}
            </span>
            {familyInfo.subcategoryTitle && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-slate-300 font-medium">
                  {familyInfo.subcategoryTitle}
                </span>
              </>
            )}
            {selectedBrand !== 'Todas' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-amber-400 font-semibold">
                  {selectedBrand}
                </span>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-amber-400 font-bold">
              Resultados ({filteredProducts.length})
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
            {filteredProducts.length} productos disponibles
          </span>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: FILTROS LATERALES DINÁMICOS + PRODUCTOS (Ancho completo) */}
      <main className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full flex-1">
        
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

        {/* Barra superior de herramientas: Botón de filtro móvil, contador y ordenamiento */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06]">
          
          <div className="flex items-center justify-between sm:justify-start gap-2">
            {/* Botón Filtros móvil */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-[#0d1222] border border-white/[0.1] rounded-xl text-xs font-bold text-amber-400 active:scale-95 transition"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros ({activeFiltersCount})</span>
            </button>

            <span className="text-xs text-slate-400">
              Mostrando {filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length}
            </span>
          </div>

          {/* Ordenar por */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-slate-400 shrink-0">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto bg-[#0d1222] border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
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
                <button onClick={() => { setSelectedCategory('Todas'); setSelectedSubcategory('Todas'); }}>✕</button>
              </span>
            )}

            {selectedSubcategory !== 'Todas' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                Subcategoría: {selectedSubcategory}
                <button onClick={() => setSelectedSubcategory('Todas')}>✕</button>
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
          <aside className="hidden lg:block w-72 shrink-0 bg-[#090d19]/90 backdrop-blur-md border border-white/[0.08] rounded-3xl p-5 sticky top-24 shadow-xl max-h-[85vh] overflow-y-auto lateral-scrollbar">
            {renderSidebarContent()}
          </aside>

          {/* DRAWER DE FILTROS EN MÓVIL */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilters(false)}>
              <div className="relative w-full max-w-[320px] sm:max-w-xs bg-[#090d19] h-full overflow-y-auto p-4 sm:p-5 border-r border-white/[0.1] shadow-2xl flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Filter className="w-4 h-4 text-amber-400" />
                      <span>Filtros Adaptativos</span>
                    </h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg active:scale-95 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {renderSidebarContent()}
                </div>
                <div className="pt-4 mt-4 border-t border-white/[0.08] sticky bottom-0 bg-[#090d19] py-2">
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition"
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-64 sm:h-80 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
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
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-4">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group rounded-xl sm:rounded-2xl bg-[#0b101f] border border-white/[0.06] hover:border-amber-500/40 transition flex flex-col justify-between overflow-hidden shadow-lg"
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
                            <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold font-mono px-1.5 sm:px-2 py-0.5 rounded-full shadow-md">
                              -{product.discount_percent}%
                            </span>
                          ) : null}
                          <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 bg-black/75 backdrop-blur-md text-amber-400 text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-500/20 max-w-[80%] truncate">
                            {product.category || 'General'}{product.subcategory ? ` • ${product.subcategory}` : ''}
                          </span>
                        </Link>

                        {/* Detalles */}
                        <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-2">
                          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                            <span className="text-slate-500 font-mono truncate max-w-[70%]">
                              {product.suppliers?.company_name || 'NovaSats Store'}
                            </span>
                            {product.rating ? (
                              <div className="flex items-center gap-0.5 text-amber-400">
                                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400" />
                                <span className="font-bold text-[9px] sm:text-[10px]">{product.rating}</span>
                              </div>
                            ) : null}
                          </div>

                          <Link to={`/producto/${product.id}`} className="block">
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition line-clamp-2 leading-snug">
                              {product.name}
                            </h4>
                          </Link>

                          <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 hidden sm:block">
                            {product.description}
                          </p>

                          {/* Badges de entrega */}
                          <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-0.5 sm:pt-1">
                            {isFreeShippingProduct(product) && (
                              <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Gratis
                              </span>
                            )}
                            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              Rápido
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer de la tarjeta con precio y botón de compra */}
                      <div className="p-2.5 sm:p-4 pt-1.5 sm:pt-2 border-t border-white/[0.06] flex items-center justify-between mt-1 sm:mt-2">
                        <div className="min-w-0 pr-1">
                          <div className="text-xs sm:text-base font-black text-white truncate">
                            ${Number(product.price_usd).toFixed(2)}
                          </div>
                          <div className="text-[9px] sm:text-[11px] font-mono text-amber-400 font-bold truncate">
                            {Number(product.price_btc).toFixed(6)} ₿
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                          className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 transition active:scale-95 shrink-0"
                          title="Agregar al Carrito"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
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

      {/* PIE DE PÁGINA REUTILIZABLE */}
      <StoreFooter />

      {/* BOTÓN REUTILIZABLE DEL CARRITO */}
      <FloatingCartButton />

      {/* Cart Drawer */}
      <CartDrawer />

    </div>
  );
};
