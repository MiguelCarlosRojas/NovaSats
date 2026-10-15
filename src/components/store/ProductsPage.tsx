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
  ChevronDown,
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
import { CATEGORY_CATALOG } from '../../data/categories';

// Helper para texto completo de búsqueda
const getProductSearchableText = (p: Product): string => {
  return `${p.name} ${p.description} ${p.category || ''} ${p.suppliers?.company_name || ''} ${p.condition || ''}`.toLowerCase();
};

// 1. Marcas soportadas (Mejores marcas Falabella/Retail)
const ALL_KNOWN_BRANDS = [
  'Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Honor', 'ZTE', 'Oppo',
  'Infinix', 'Huawei', 'Redmi', 'Sony', 'Nintendo', 'ASUS', 'Logitech',
  'Nike', 'Adidas', 'HP', 'Lenovo', 'Dell', 'LG', 'Oster', 'Philips',
  'TCL', 'JVC', 'JBL', 'Under Armour', 'Paraíso', 'Rosen', 'Maybelline',
  'DeWalt', 'Bosch', 'NovaSats'
];

const matchesBrand = (p: Product, brand: string): boolean => {
  const text = getProductSearchableText(p);
  return text.includes(brand.toLowerCase());
};

// 2. Colores solicitados
const ALL_KNOWN_COLORS = [
  { id: 'amarillo', label: 'Amarillo', hex: '#EAB308', keywords: ['amarillo', 'yellow'] },
  { id: 'azul', label: 'Azul', hex: '#3B82F6', keywords: ['azul', 'blue', 'celeste'] },
  { id: 'beige', label: 'Beige', hex: '#F5F5DC', keywords: ['beige', 'crema'] },
  { id: 'blanco', label: 'Blanco', hex: '#FFFFFF', keywords: ['blanco', 'white'] },
  { id: 'burdeo', label: 'Burdeo', hex: '#800020', keywords: ['burdeo', 'vino', 'burgundy'] },
  { id: 'café', label: 'Café', hex: '#8B4513', keywords: ['café', 'cafe', 'marrón', 'marron', 'brown'] },
  { id: 'dorado', label: 'Dorado', hex: '#F59E0B', keywords: ['dorado', 'gold'] },
  { id: 'gris', label: 'Gris', hex: '#9CA3AF', keywords: ['gris', 'gray', 'grey'] },
  { id: 'morado', label: 'Morado', hex: '#8B5CF6', keywords: ['morado', 'purple', 'violeta'] },
  { id: 'naranjo', label: 'Naranjo', hex: '#F97316', keywords: ['naranjo', 'naranja', 'orange'] },
  { id: 'negro', label: 'Negro', hex: '#111827', keywords: ['negro', 'black'] },
  { id: 'plateado', label: 'Plateado', hex: '#E5E7EB', keywords: ['plateado', 'plata', 'silver'] },
  { id: 'rojo', label: 'Rojo', hex: '#EF4444', keywords: ['rojo', 'red'] },
  { id: 'rosado', label: 'Rosado', hex: '#EC4899', keywords: ['rosado', 'rosa', 'pink'] },
  { id: 'verde', label: 'Verde', hex: '#10B981', keywords: ['verde', 'green'] }
];

const matchesColor = (p: Product, colorId: string): boolean => {
  const text = getProductSearchableText(p);
  const colorDef = ALL_KNOWN_COLORS.find((c) => c.id === colorId);
  if (!colorDef) return false;
  return colorDef.keywords.some((k) => text.includes(k));
};

// 3. Condiciones de producto
const ALL_KNOWN_CONDITIONS = [
  { id: 'new', label: 'Nuevo', keywords: ['nuevo', 'new'] },
  { id: 'refurbished-a', label: 'Reacondicionado excelente (a)', keywords: ['reacondicionado', 'refurbished', 'grado a', 'excelente'] },
  { id: 'refurbished-b', label: 'Reacondicionado detalle estético (b)', keywords: ['detalle estético', 'detalle estetico', 'grado b'] },
  { id: 'open-box', label: 'Open box', keywords: ['open box', 'openbox', 'caja abierta'] }
];

const matchesCondition = (p: Product, condId: string): boolean => {
  const c = (p.condition || 'Nuevo').toLowerCase();
  const text = getProductSearchableText(p);
  const def = ALL_KNOWN_CONDITIONS.find((item) => item.id === condId);
  if (!def) return true;
  return def.keywords.some((k) => c.includes(k) || text.includes(k));
};

// 4. Capacidades solicitadas
const ALL_KNOWN_CAPACITIES = [
  { id: '1tb', label: '1 TB', keywords: ['1tb', '1 tb'] },
  { id: '512gb', label: '512 GB', keywords: ['512gb', '512 gb'] },
  { id: '256gb', label: '256 GB', keywords: ['256gb', '256 gb'] },
  { id: '250gb', label: '250 GB', keywords: ['250gb', '250 gb'] },
  { id: '240gb', label: '240 GB', keywords: ['240gb', '240 gb'] },
  { id: '128gb', label: '128 GB', keywords: ['128gb', '128 gb'] },
  { id: '120gb', label: '120 GB', keywords: ['120gb', '120 gb'] },
  { id: '64gb', label: '64 GB', keywords: ['64gb', '64 gb'] },
  { id: '50gb', label: '50 GB', keywords: ['50gb', '50 gb'] },
  { id: '32gb', label: '32 GB', keywords: ['32gb', '32 gb'] },
  { id: '16gb', label: '16 GB', keywords: ['16gb', '16 gb'] },
  { id: '8gb', label: '8 GB', keywords: ['8gb', '8 gb'] },
  { id: '4gb', label: '4 GB', keywords: ['4gb', '4 gb'] },
  { id: '2gb', label: '2 GB', keywords: ['2gb', '2 gb'] },
  { id: 'no-aplica', label: 'No aplica', keywords: ['no aplica'] }
];

const matchesCapacity = (p: Product, capId: string): boolean => {
  const text = getProductSearchableText(p);
  const capDef = ALL_KNOWN_CAPACITIES.find((c) => c.id === capId);
  if (!capDef) return false;
  return capDef.keywords.some((k) => text.includes(k));
};

// 5. Generación / Red móvil
const ALL_KNOWN_GENERATIONS = [
  { id: '5g', label: '5G', keywords: ['5g'] },
  { id: '4g-lte', label: '4G LTE', keywords: ['4g lte', 'lte'] },
  { id: '4g', label: '4G', keywords: ['4g'] },
  { id: '3g', label: '3G', keywords: ['3g'] },
  { id: '2g', label: '2G', keywords: ['2g'] },
  { id: '2025', label: '2025', keywords: ['2025'] }
];

const matchesGeneration = (p: Product, genId: string): boolean => {
  const text = getProductSearchableText(p);
  const genDef = ALL_KNOWN_GENERATIONS.find((g) => g.id === genId);
  if (!genDef) return false;
  return genDef.keywords.some((k) => text.includes(k));
};

// 6. Núcleos del procesador
const ALL_KNOWN_CORES = [
  { id: 'octa-core', label: 'Octa core', keywords: ['octa core', 'octa-core', '8 núcleos', '8 nucleos'] },
  { id: 'hexa-core', label: 'Hexa core', keywords: ['hexa core', 'hexa-core', '6 núcleos'] },
  { id: 'quad-core', label: 'Quad core', keywords: ['quad core', 'quad-core', '4 núcleos'] },
  { id: 'dual-core', label: 'Dual core', keywords: ['dual core', 'dual-core', '2 núcleos'] },
  { id: 'deca-core', label: 'Deca core', keywords: ['deca core', '10 núcleos'] },
  { id: '16-core', label: '16 core', keywords: ['16 core', '16 núcleos'] },
  { id: '12-core', label: '12 core', keywords: ['12 core', '12 núcleos'] },
  { id: '11-core', label: '11 core', keywords: ['11 core', '11 núcleos'] },
  { id: '8', label: '8', keywords: ['8 core', '8 núcleos'] },
  { id: '6', label: '6', keywords: ['6 core', '6 núcleos'] },
  { id: 'single-core', label: 'Single core', keywords: ['single core'] },
  { id: 'no-aplica', label: 'No aplica', keywords: ['no aplica'] }
];

const matchesCores = (p: Product, coreId: string): boolean => {
  const text = getProductSearchableText(p);
  const coreDef = ALL_KNOWN_CORES.find((c) => c.id === coreId);
  if (!coreDef) return false;
  return coreDef.keywords.some((k) => text.includes(k));
};

// 7. Velocidad de imagen (Tasa de refresco)
const ALL_KNOWN_REFRESH_RATES = [
  { id: '240hz', label: '240 Hz', keywords: ['240hz', '240 hz'] },
  { id: '165hz', label: '165 Hz', keywords: ['165hz', '165 hz'] },
  { id: '144hz', label: '144 Hz', keywords: ['144hz', '144 hz'] },
  { id: '120hz', label: '120 Hz', keywords: ['120hz', '120 hz'] },
  { id: '100hz', label: '100 Hz', keywords: ['100hz', '100 hz'] },
  { id: '90hz', label: '90 Hz', keywords: ['90hz', '90 hz'] },
  { id: '75hz', label: '75 Hz', keywords: ['75hz', '75 hz'] },
  { id: '60hz', label: '60 Hz', keywords: ['60hz', '60 hz'] },
  { id: '30hz', label: '30 Hz', keywords: ['30hz', '30 hz'] }
];

const matchesRefreshRate = (p: Product, rateId: string): boolean => {
  const text = getProductSearchableText(p);
  const rateDef = ALL_KNOWN_REFRESH_RATES.find((r) => r.id === rateId);
  if (!rateDef) return false;
  return rateDef.keywords.some((k) => text.includes(k));
};

// 8. Cámara principal
const ALL_KNOWN_CAMERAS = [
  { id: '200mp', label: '200 MP', keywords: ['200 mp', '200mp'] },
  { id: '108mp', label: '108 MP', keywords: ['108 mp', '108mp'] },
  { id: '64mp', label: '64 MP', keywords: ['64 mp', '64mp'] },
  { id: '50mp', label: '50 MP', keywords: ['50 mp', '50mp'] },
  { id: '48mp', label: '48 MP', keywords: ['48 mp', '48mp'] },
  { id: '32mp', label: '32 MP', keywords: ['32 mp', '32mp'] },
  { id: '20mp', label: '20 MP', keywords: ['20 mp', '20mp'] },
  { id: '16mp', label: '16 MP', keywords: ['16 mp', '16mp'] },
  { id: '13mp', label: '13 MP', keywords: ['13 mp', '13mp'] },
  { id: '12mp', label: '12 MP', keywords: ['12 mp', '12mp'] },
  { id: 'doble', label: 'Doble 48 mp / Dual', keywords: ['doble', 'dual'] },
  { id: 'triple', label: 'Triple cámara', keywords: ['triple'] },
  { id: 'no-aplica', label: 'No aplica', keywords: ['no aplica'] }
];

const matchesCamera = (p: Product, camId: string): boolean => {
  const text = getProductSearchableText(p);
  const camDef = ALL_KNOWN_CAMERAS.find((c) => c.id === camId);
  if (!camDef) return false;
  return camDef.keywords.some((k) => text.includes(k));
};

// 9. Conectividad / Bluetooth
const matchesBluetooth = (p: Product, val: 'si' | 'no'): boolean => {
  const text = getProductSearchableText(p);
  const hasBt = text.includes('bluetooth') || text.includes('bt ') || text.includes('inalámbrico') || text.includes('wireless');
  return val === 'si' ? hasBt : !hasBt;
};

// 10. Vendido por
const ALL_KNOWN_SELLERS = [
  { id: 'falabella', label: 'FALABELLA', keywords: ['falabella'] },
  { id: 'tottus', label: 'TOTTUS', keywords: ['tottus'] },
  { id: 'sodimac', label: 'SODIMAC', keywords: ['sodimac'] },
  { id: 'official', label: 'NovaSats Oficial', keywords: ['novasats', 'oficial'] },
  { id: 'verified', label: 'Proveedores Verificados', keywords: ['verificado', 'verified'] },
  { id: 'otros', label: 'OTROS VENDEDORES', keywords: ['otros', 'p2p'] }
];

const matchesSeller = (p: Product, sellerId: string): boolean => {
  const company = (p.suppliers?.company_name || '').toLowerCase();
  const text = getProductSearchableText(p);
  const sDef = ALL_KNOWN_SELLERS.find((s) => s.id === sellerId);
  if (!sDef) return true;
  return sDef.keywords.some((k) => company.includes(k) || text.includes(k));
};

// Rangos de Precio en Soles (PEN)
const PEN_RATE = 3.75;
const ALL_PRICE_RANGES_PEN = [
  { id: 'all', label: 'Cualquier precio', min: 0, max: Infinity },
  { id: 'hasta-50', label: 'HASTA S/ 50', min: 0, max: 50 },
  { id: '50-100', label: 'S/ 50 - S/ 100', min: 50, max: 100 },
  { id: '100-250', label: 'S/ 100 - S/ 250', min: 100, max: 250 },
  { id: '250-500', label: 'S/ 250 - S/ 500', min: 250, max: 500 },
  { id: '500-1000', label: 'S/ 500 - S/ 1.000', min: 500, max: 1000 },
  { id: '1000-2000', label: 'S/ 1.000 - S/ 2.000', min: 1000, max: 2000 },
  { id: '2000-5000', label: 'S/ 2.000 - S/ 5.000', min: 2000, max: 5000 },
  { id: 'desde-5000', label: 'DESDE S/ 5.000', min: 5000, max: Infinity }
];

const matchesPriceRangePEN = (p: Product, rangeId: string): boolean => {
  if (rangeId === 'all') return true;
  const pen = (p.price_usd || 0) * PEN_RATE;
  const def = ALL_PRICE_RANGES_PEN.find((r) => r.id === rangeId);
  if (!def) return true;
  return pen >= def.min && pen <= def.max;
};

// Conectividad
const ALL_KNOWN_CONNECTIVITIES = [
  { id: 'Wi-Fi', keywords: ['wi-fi', 'wifi', 'inalámbrico', 'wireless'] },
  { id: 'Bluetooth', keywords: ['bluetooth', 'bt '] },
  { id: 'USB-C', keywords: ['usb-c', 'usbc', 'tipo c', 'type-c'] },
  { id: '5G', keywords: ['5g', 'celular', 'lte', 'sim'] },
  { id: 'Ethernet', keywords: ['ethernet', 'rj45', 'lan'] },
  { id: 'Lightning', keywords: ['lightning'] }
];

const matchesConnectivity = (p: Product, connId: string): boolean => {
  const text = getProductSearchableText(p);
  const connDef = ALL_KNOWN_CONNECTIVITIES.find((c) => c.id === connId);
  if (!connDef) return false;
  return connDef.keywords.some((k) => text.includes(k));
};

// ESRB
const ALL_KNOWN_ESRB = [
  { id: 'E', label: 'Everyone (E)', keywords: ['esrb e', 'everyone (e)', 'para todos', 'clasificación e'] },
  { id: 'E10+', label: 'Everyone 10+ (E10+)', keywords: ['e10+', 'everyone 10+'] },
  { id: 'T', label: 'Teen (T)', keywords: ['esrb t', 'teen (t)', 'adolescentes'] },
  { id: 'M', label: 'Mature 17+ (M)', keywords: ['esrb m', 'mature', 'adultos 17', 'clasificación m'] },
  { id: 'AO', label: 'Adults Only 18+ (AO)', keywords: ['adults only', 'ao 18'] }
];

const isVideoGameProduct = (p: Product): boolean => {
  const text = getProductSearchableText(p);
  return (
    text.includes('juego') ||
    text.includes('game') ||
    text.includes('videojuego') ||
    text.includes('esrb') ||
    (p.category || '').toLowerCase().includes('juego') ||
    (p.category || '').toLowerCase().includes('gaming')
  );
};

const matchesEsrb = (p: Product, esrbId: string): boolean => {
  if (!isVideoGameProduct(p)) return false;
  const text = getProductSearchableText(p);
  const esrbDef = ALL_KNOWN_ESRB.find((e) => e.id === esrbId);
  if (!esrbDef) return false;
  return esrbDef.keywords.some((k) => text.includes(k));
};

// Tamaños de Pantalla
const ALL_KNOWN_SCREEN_SIZES = [
  { id: 'under-6', label: 'Menos de 6"', test: (t: string) => /5\.[0-9]|4\.[0-9]|5"|4"/.test(t) },
  { id: '6-7', label: '6" a 6.9"', test: (t: string) => /6\.[0-9]|6"/.test(t) },
  { id: '10-13', label: '10" a 12.9"', test: (t: string) => /10\.[0-9]|11\.[0-9]|12\.[0-9]|10"|11"|12"/.test(t) },
  { id: '13-14', label: '13" a 14"', test: (t: string) => /13\.[0-9]|14\.[0-9]|13"|14"/.test(t) },
  { id: '15-16', label: '15" a 16"', test: (t: string) => /15\.[0-9]|16\.[0-9]|15"|16"/.test(t) },
  { id: '24-27', label: '24" a 27"', test: (t: string) => /24\.[0-9]|27\.[0-9]|24"|27"/.test(t) },
  { id: '32-plus', label: '32" o más', test: (t: string) => /32\.[0-9]|4[0-9]\.[0-9]|5[0-9]\.[0-9]|32"|40"|43"|50"|55"|65"/.test(t) }
];

const hasScreen = (p: Product): boolean => {
  const text = getProductSearchableText(p);
  return (
    text.includes('pantalla') ||
    text.includes('display') ||
    text.includes('monitor') ||
    text.includes('oled') ||
    text.includes('amoled') ||
    text.includes('lcd') ||
    text.includes('pulgada') ||
    text.includes('"') ||
    (p.category || '').toLowerCase().includes('celular') ||
    (p.category || '').toLowerCase().includes('laptop') ||
    (p.category || '').toLowerCase().includes('tv')
  );
};

const matchesScreenSize = (p: Product, sizeId: string): boolean => {
  if (!hasScreen(p)) return false;
  const text = getProductSearchableText(p);
  const sizeDef = ALL_KNOWN_SCREEN_SIZES.find((s) => s.id === sizeId);
  if (!sizeDef) return false;
  return sizeDef.test(text);
};

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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    marcas: false,
    capacidades: false,
    camaras: false,
    cores: false,
    colores: false,
    tallas: false
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [selectedConnectivity, setSelectedConnectivity] = useState('all');
  const [selectedEsrb, setSelectedEsrb] = useState('all');
  const [selectedScreenSize, setSelectedScreenSize] = useState('all');

  const [sortBy, setSortBy] = useState<'featured' | 'discount' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const { addToCart } = useCart();

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

  const productCountBySubcategory = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      if (p.subcategory) {
        counts[p.subcategory] = (counts[p.subcategory] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  const matchesSubcategory = (p: Product, subcat: string): boolean => {
    if (!subcat || subcat === 'Todas') return true;
    if (p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase()) return true;
    const searchable = `${p.name} ${p.description}`.toLowerCase();
    return searchable.includes(subcat.toLowerCase());
  };

  // Conjunto de productos en el ámbito actual (filtrado por categoría, subcategoría y búsqueda básica)
  // para determinar qué filtros realmente aplican y deben visualizarse
  const productsInScope = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'Todas' && (p.category || 'General') !== selectedCategory) {
        return false;
      }
      if (selectedSubcategory !== 'Todas' && !matchesSubcategory(p, selectedSubcategory)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = getProductSearchableText(p);
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery]);

  // =========================================================================
  // DETECCIÓN DINÁMICA: Si un filtro no existe en los productos, NO SE MUESTRA
  // =========================================================================

  // 1. Marcas realmente existentes en los productos disponibles
  const availableBrands = useMemo(() => {
    return ALL_KNOWN_BRANDS.filter((brand) =>
      productsInScope.some((p) => matchesBrand(p, brand))
    );
  }, [productsInScope]);

  // 2. Colores realmente existentes
  const availableColors = useMemo(() => {
    return ALL_KNOWN_COLORS.filter((color) =>
      productsInScope.some((p) => matchesColor(p, color.id))
    );
  }, [productsInScope]);

  // 3. Capacidades realmente existentes
  const availableCapacities = useMemo(() => {
    return ALL_KNOWN_CAPACITIES.filter((cap) =>
      productsInScope.some((p) => matchesCapacity(p, cap.id))
    );
  }, [productsInScope]);

  // 4. Conectividades realmente existentes
  const availableConnectivities = useMemo(() => {
    return ALL_KNOWN_CONNECTIVITIES.filter((conn) =>
      productsInScope.some((p) => matchesConnectivity(p, conn.id))
    );
  }, [productsInScope]);

  // 5. ESRB (solo si hay videojuegos o productos con clasificación ESRB)
  const availableEsrb = useMemo(() => {
    return ALL_KNOWN_ESRB.filter((esrb) =>
      productsInScope.some((p) => matchesEsrb(p, esrb.id))
    );
  }, [productsInScope]);

  // 6. Pantallas (solo si hay productos con pantalla/monitor/display)
  const availableScreenSizes = useMemo(() => {
    return ALL_KNOWN_SCREEN_SIZES.filter((screen) =>
      productsInScope.some((p) => matchesScreenSize(p, screen.id))
    );
  }, [productsInScope]);

  // 7. Calificación (solo si hay productos con rating > 0)
  const hasRatingProducts = useMemo(() => {
    return productsInScope.some((p) => (p.rating || 0) > 0);
  }, [productsInScope]);

  // 8. Condiciones existentes
  const availableConditions = useMemo(() => {
    const list: Array<'new' | 'refurbished' | 'used'> = [];
    if (productsInScope.some((p) => matchesCondition(p, 'new'))) list.push('new');
    if (productsInScope.some((p) => matchesCondition(p, 'refurbished'))) list.push('refurbished');
    if (productsInScope.some((p) => matchesCondition(p, 'used'))) list.push('used');
    return list;
  }, [productsInScope]);

  // Resetear filtros activos si ya no están disponibles en la categoría o búsqueda actual
  useEffect(() => {
    if (selectedBrand !== 'Todas' && !availableBrands.includes(selectedBrand)) {
      setSelectedBrand('Todas');
    }
    if (selectedColor !== 'all' && !availableColors.some((c) => c.id === selectedColor)) {
      setSelectedColor('all');
    }
    if (selectedCapacity !== 'all' && !availableCapacities.some((c) => c.id === selectedCapacity)) {
      setSelectedCapacity('all');
    }
    if (selectedConnectivity !== 'all' && !availableConnectivities.some((c) => c.id === selectedConnectivity)) {
      setSelectedConnectivity('all');
    }
    if (selectedEsrb !== 'all' && !availableEsrb.some((e) => e.id === selectedEsrb)) {
      setSelectedEsrb('all');
    }
    if (selectedScreenSize !== 'all' && !availableScreenSizes.some((s) => s.id === selectedScreenSize)) {
      setSelectedScreenSize('all');
    }
    if (!hasRatingProducts && minRating > 0) {
      setMinRating(0);
    }
    if (availableConditions.length <= 1 && conditionFilter !== 'all') {
      setConditionFilter('all');
    }
  }, [
    availableBrands, availableColors, availableCapacities, availableConnectivities,
    availableEsrb, availableScreenSizes, hasRatingProducts, availableConditions,
    selectedBrand, selectedColor, selectedCapacity, selectedConnectivity,
    selectedEsrb, selectedScreenSize, minRating, conditionFilter
  ]);

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
    if (selectedConnectivity !== 'all') count++;
    if (selectedEsrb !== 'all') count++;
    if (selectedScreenSize !== 'all') count++;
    return count;
  }, [
    searchQuery, deliveryTypeFilter, selectedCategory, selectedSubcategory, selectedBrand, priceRange,
    minRating, soldByFilter, selectedColor, conditionFilter, selectedCapacity,
    selectedGeneracion, selectedTalla, selectedCores, selectedRefreshRate,
    selectedCamera, selectedBluetooth, selectedConnectivity, selectedEsrb, selectedScreenSize
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
    setSelectedConnectivity('all');
    setSelectedEsrb('all');
    setSelectedScreenSize('all');
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
        if (selectedCategory !== 'Todas' && (p.category || 'General') !== selectedCategory) {
          return false;
        }

        // 3.1 Subcategoría
        if (selectedSubcategory !== 'Todas' && !matchesSubcategory(p, selectedSubcategory)) {
          return false;
        }

        // 4. Marca
        if (selectedBrand !== 'Todas') {
          if (!matchesBrand(p, selectedBrand)) return false;
        }

        // 5. Precio en PEN
        if (priceRange !== 'all') {
          if (!matchesPriceRangePEN(p, priceRange)) return false;
        }

        // 6. Calificación
        if (minRating > 0 && (p.rating || 0) < minRating) return false;

        // 7. Vendido por
        if (soldByFilter !== 'all') {
          if (!matchesSeller(p, soldByFilter)) return false;
        }

        // 8. Color
        if (selectedColor !== 'all') {
          if (!matchesColor(p, selectedColor)) return false;
        }

        // 9. Condición
        if (conditionFilter !== 'all') {
          if (!matchesCondition(p, conditionFilter)) return false;
        }

        // 10. Capacidad
        if (selectedCapacity !== 'all') {
          if (!matchesCapacity(p, selectedCapacity)) return false;
        }

        // 11. Generación
        if (selectedGeneracion !== 'all') {
          if (!matchesGeneration(p, selectedGeneracion)) return false;
        }

        // 12. Talla
        if (selectedTalla !== 'all') {
          if (!textToSearch.includes(selectedTalla.toLowerCase())) return false;
        }

        // 13. Núcleos
        if (selectedCores !== 'all') {
          if (!matchesCores(p, selectedCores)) return false;
        }

        // 14. Velocidad de imagen
        if (selectedRefreshRate !== 'all') {
          if (!matchesRefreshRate(p, selectedRefreshRate)) return false;
        }

        // 15. Cámara principal
        if (selectedCamera !== 'all') {
          if (!matchesCamera(p, selectedCamera)) return false;
        }

        // 16. Bluetooth
        if (selectedBluetooth !== 'all') {
          if (!matchesBluetooth(p, selectedBluetooth)) return false;
        }

        // 17. Conectividad
        if (selectedConnectivity !== 'all') {
          if (!matchesConnectivity(p, selectedConnectivity)) return false;
        }

        // 18. ESRB
        if (selectedEsrb !== 'all') {
          if (!matchesEsrb(p, selectedEsrb)) return false;
        }

        // 19. Tamaño de pantalla
        if (selectedScreenSize !== 'all') {
          if (!matchesScreenSize(p, selectedScreenSize)) return false;
        }

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
    selectedRefreshRate, selectedCamera, selectedBluetooth,
    selectedConnectivity, selectedEsrb, selectedScreenSize, sortBy
  ]);

  // Paginación: 10 productos por página
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery, deliveryTypeFilter, selectedCategory, selectedSubcategory, selectedBrand, priceRange,
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

  // RENDERIZADO DEL SIDEBAR DE FILTROS DINÁMICOS
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

      {/* 2. CATEGORÍA & SUBCATEGORÍAS */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Categoría
          </label>
          {(selectedCategory !== 'Todas' || selectedSubcategory !== 'Todas') && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todas');
                setSelectedSubcategory('Todas');
              }}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="space-y-1 max-h-56 overflow-y-auto pr-1 lateral-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Todas');
              setSelectedSubcategory('Todas');
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
              selectedCategory === 'Todas'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <span>Todas las categorías</span>
            <span className="text-[10px] font-mono opacity-70">({products.length})</span>
          </button>

          {CATEGORY_CATALOG.map((catDef) => {
            const isSelected = selectedCategory === catDef.name;
            const count = productCountByCategory[catDef.name] || 0;

            return (
              <div key={catDef.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setSelectedCategory('Todas');
                      setSelectedSubcategory('Todas');
                    } else {
                      setSelectedCategory(catDef.name);
                      setSelectedSubcategory('Todas');
                    }
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500 text-black font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="truncate pr-1">{catDef.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {count > 0 && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isSelected ? 'bg-black/20 text-black' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {count}
                      </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSelected ? 'rotate-180 text-black' : 'text-slate-500'
                    }`} />
                  </div>
                </button>

                {isSelected && catDef.subcategories.length > 0 && (
                  <div className="pl-3 pr-1 py-1 space-y-0.5 border-l-2 border-amber-500/40 ml-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategory('Todas')}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] transition flex items-center justify-between ${
                        selectedSubcategory === 'Todas'
                          ? 'text-amber-400 font-bold bg-amber-500/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>Ver todas</span>
                      {selectedSubcategory === 'Todas' && <Check className="w-3 h-3 text-amber-400" />}
                    </button>
                    {catDef.subcategories.map((sub) => {
                      const isSubSelected = selectedSubcategory === sub;
                      const subCount = productCountBySubcategory[sub] || 0;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setSelectedSubcategory(isSubSelected ? 'Todas' : sub)}
                          className={`w-full text-left px-2 py-1 rounded text-[11px] transition flex items-center justify-between ${
                            isSubSelected
                              ? 'text-amber-400 font-bold bg-amber-500/10'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                          }`}
                        >
                          <span className="truncate pr-1">› {sub}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {subCount > 0 && (
                              <span className="text-[9px] font-mono text-slate-400">({subCount})</span>
                            )}
                            {isSubSelected && <Check className="w-3 h-3 text-amber-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MARCA / MEJORES MARCAS */}
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
          {(expandedSections.marcas ? ALL_KNOWN_BRANDS : ALL_KNOWN_BRANDS.slice(0, 10)).map((marca) => {
            const isBrandActive = selectedBrand.toLowerCase() === marca.toLowerCase();
            return (
              <button
                key={marca}
                type="button"
                onClick={() => setSelectedBrand(isBrandActive ? 'Todas' : marca)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isBrandActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{marca}</span>
                {isBrandActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => toggleSection('marcas')}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {expandedSections.marcas ? '- Ver menos marcas' : '+ Ver más marcas'}
          </button>
        </div>
      </div>

      {/* 4. PRECIO EN SOLES (PEN) */}
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
          {ALL_PRICE_RANGES_PEN.map((p) => {
            const isPriceActive = priceRange === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriceRange(p.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isPriceActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{p.label}</span>
                {isPriceActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. CALIFICACIÓN DEL PRODUCTO */}
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

      {/* 6. VENDIDO POR */}
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
            <span>Todos los vendedores</span>
          </button>
          {ALL_KNOWN_SELLERS.map((seller) => {
            const isSellerActive = soldByFilter === seller.id;
            return (
              <button
                key={seller.id}
                type="button"
                onClick={() => setSoldByFilter(isSellerActive ? 'all' : seller.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isSellerActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{seller.label}</span>
                {isSellerActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. COLOR */}
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
          {ALL_KNOWN_COLORS.map((c) => {
            const isColorActive = selectedColor === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedColor(isColorActive ? 'all' : c.id)}
                className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition ${
                  isColorActive
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
            );
          })}
        </div>
      </div>

      {/* 8. CONDICIÓN DEL PRODUCTO */}
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
          {ALL_KNOWN_CONDITIONS.map((cond) => {
            const isCondActive = conditionFilter === cond.id;
            return (
              <button
                key={cond.id}
                type="button"
                onClick={() => setConditionFilter(isCondActive ? 'all' : cond.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isCondActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{cond.label}</span>
                {isCondActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 9. CAPACIDAD */}
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
          {(expandedSections.capacidades ? ALL_KNOWN_CAPACITIES : ALL_KNOWN_CAPACITIES.slice(0, 9)).map((cap) => {
            const isCapActive = selectedCapacity === cap.id;
            return (
              <button
                key={cap.id}
                type="button"
                onClick={() => setSelectedCapacity(isCapActive ? 'all' : cap.id)}
                className={`p-1.5 rounded-lg text-center text-[10px] font-mono font-semibold transition border truncate ${
                  isCapActive
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                {cap.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => toggleSection('capacidades')}
          className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
        >
          {expandedSections.capacidades ? '- Ver menos capacidades' : '+ Ver más capacidades'}
        </button>
      </div>

      {/* 10. GENERACIÓN / RED MÓVIL */}
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
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedGeneracion('all')}
            className={`col-span-3 text-left px-2 py-1 rounded-lg text-xs transition ${
              selectedGeneracion === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Todas las redes
          </button>
          {ALL_KNOWN_GENERATIONS.map((gen) => {
            const isGenActive = selectedGeneracion === gen.id;
            return (
              <button
                key={gen.id}
                type="button"
                onClick={() => setSelectedGeneracion(isGenActive ? 'all' : gen.id)}
                className={`p-1.5 rounded-lg text-center text-[11px] font-semibold transition border ${
                  isGenActive
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                {gen.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 11. TALLA / MEMORIA */}
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
          {['1 tb', '512 gb', '256 gb', '128 gb', '64 gb', '32 gb', '16 gb', '8 gb', 'S', 'M', 'L', 'XL'].map((talla) => {
            const isTallaActive = selectedTalla === talla;
            return (
              <button
                key={talla}
                type="button"
                onClick={() => setSelectedTalla(isTallaActive ? 'all' : talla)}
                className={`p-1.5 rounded-lg text-center text-[10px] font-semibold transition border ${
                  isTallaActive
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                {talla}
              </button>
            );
          })}
        </div>
      </div>

      {/* 12. NÚCLEOS DEL PROCESADOR */}
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
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
              selectedCores === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <span>Todos los procesadores</span>
          </button>
          {(expandedSections.cores ? ALL_KNOWN_CORES : ALL_KNOWN_CORES.slice(0, 6)).map((c) => {
            const isCoreActive = selectedCores === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCores(isCoreActive ? 'all' : c.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isCoreActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{c.label}</span>
                {isCoreActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => toggleSection('cores')}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {expandedSections.cores ? '- Ver menos' : '+ Ver más núcleos'}
          </button>
        </div>
      </div>

      {/* 13. VELOCIDAD DE IMAGEN (TASA DE REFRESCO) */}
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
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedRefreshRate('all')}
            className={`col-span-3 text-left px-2 py-1 rounded-lg text-xs transition ${
              selectedRefreshRate === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Cualquier tasa
          </button>
          {ALL_KNOWN_REFRESH_RATES.map((hz) => {
            const isHzActive = selectedRefreshRate === hz.id;
            return (
              <button
                key={hz.id}
                type="button"
                onClick={() => setSelectedRefreshRate(isHzActive ? 'all' : hz.id)}
                className={`p-1.5 rounded-lg text-center text-[10px] font-semibold transition border ${
                  isHzActive
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                {hz.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 14. CÁMARA PRINCIPAL */}
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
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
              selectedCamera === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <span>Todas las cámaras</span>
          </button>
          {(expandedSections.camaras ? ALL_KNOWN_CAMERAS : ALL_KNOWN_CAMERAS.slice(0, 6)).map((cam) => {
            const isCamActive = selectedCamera === cam.id;
            return (
              <button
                key={cam.id}
                type="button"
                onClick={() => setSelectedCamera(isCamActive ? 'all' : cam.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  isCamActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span>{cam.label}</span>
                {isCamActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => toggleSection('camaras')}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold pt-1 block"
          >
            {expandedSections.camaras ? '- Ver menos' : '+ Ver más cámaras'}
          </button>
        </div>
      </div>

      {/* 15. CUENTA CON BLUETOOTH */}
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
            onClick={() => setSelectedBluetooth(selectedBluetooth === 'si' ? 'all' : 'si')}
            className={`p-1.5 rounded-lg text-center text-xs font-semibold transition border ${
              selectedBluetooth === 'si'
                ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                : 'border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            Sí
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
        </div>
      </div>

    </div>
  );

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
              {selectedCategory !== 'Todas' ? selectedCategory : 'Todos los Productos'}
            </span>
            {selectedSubcategory !== 'Todas' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-slate-300 font-medium">
                  {selectedSubcategory}
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
                Catálogo: {selectedCategory}
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
