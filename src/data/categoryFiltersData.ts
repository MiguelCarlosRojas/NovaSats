import { Product } from '../types/store';

export const getProductSearchableText = (p: Product): string => {
  return `${p.name} ${p.description} ${p.category || ''} ${p.subcategory || ''} ${p.suppliers?.company_name || ''} ${p.condition || ''}`.toLowerCase();
};

export const PEN_RATE = 3.75;

// ============================================================================
// VALORES COMUNES (Vendedores, Colores, Condiciones, Precios)
// ============================================================================
export const COMMON_SELLERS = [
  { id: 'otros', label: 'OTROS VENDEDORES', keywords: ['otros', 'p2p', 'novasats'] },
  { id: 'falabella', label: 'FALABELLA', keywords: ['falabella'] },
  { id: 'tottus', label: 'TOTTUS', keywords: ['tottus'] },
  { id: 'sodimac', label: 'SODIMAC', keywords: ['sodimac'] }
];

export const COMMON_COLORS = [
  { id: 'amarillo', label: 'amarillo', hex: '#EAB308', keywords: ['amarillo', 'yellow'] },
  { id: 'azul', label: 'azul', hex: '#3B82F6', keywords: ['azul', 'blue', 'celeste'] },
  { id: 'beige', label: 'beige', hex: '#F5F5DC', keywords: ['beige', 'crema'] },
  { id: 'blanco', label: 'blanco', hex: '#FFFFFF', keywords: ['blanco', 'white'] },
  { id: 'burdeo', label: 'burdeo', hex: '#800020', keywords: ['burdeo', 'vino', 'burgundy'] },
  { id: 'café', label: 'café', hex: '#8B4513', keywords: ['café', 'cafe', 'marrón', 'marron', 'brown'] },
  { id: 'dorado', label: 'dorado', hex: '#F59E0B', keywords: ['dorado', 'gold'] },
  { id: 'gris', label: 'gris', hex: '#9CA3AF', keywords: ['gris', 'gray', 'grey'] },
  { id: 'morado', label: 'morado', hex: '#8B5CF6', keywords: ['morado', 'purple', 'violeta'] },
  { id: 'naranjo', label: 'naranjo', hex: '#F97316', keywords: ['naranjo', 'naranja', 'orange'] },
  { id: 'negro', label: 'negro', hex: '#111827', keywords: ['negro', 'black'] },
  { id: 'plateado', label: 'plateado', hex: '#E5E7EB', keywords: ['plateado', 'plata', 'silver'] },
  { id: 'rojo', label: 'rojo', hex: '#EF4444', keywords: ['rojo', 'red'] },
  { id: 'rosado', label: 'rosado', hex: '#EC4899', keywords: ['rosado', 'rosa', 'pink'] },
  { id: 'verde', label: 'verde', hex: '#10B981', keywords: ['verde', 'green'] }
];

export const COMMON_CONDITIONS = [
  { id: 'new', label: 'Nuevo', keywords: ['nuevo', 'new'] },
  { id: 'refurbished-a', label: 'Reacondicionado excelente (a)', keywords: ['reacondicionado', 'refurbished', 'grado a', 'excelente'] },
  { id: 'refurbished-b', label: 'Reacondicionado detalle estético (b)', keywords: ['detalle estético', 'detalle estetico', 'grado b'] },
  { id: 'open-box', label: 'Open box', keywords: ['open box', 'openbox', 'caja abierta'] }
];

export const CELULAR_PRICE_RANGES = [
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

// ============================================================================
// 1. CELULARES & TELÉFONOS (Exacto solicitado por el usuario)
// ============================================================================
export const CELULAR_CATEGORIES = [
  'Smartphones',
  'Celulares básicos',
  'Repuestos de celulares'
];

export const CELULAR_BRANDS = [
  'Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Honor', 'Zte', 'Oppo',
  'Infinix', 'Huawei', 'Redmi', 'Sony', 'Google Pixel', 'Realme', 'Vivo', 'Poco', 'Nokia'
];

export const CELULAR_CAPACITIES = [
  '1tb', '2gb', '4gb', '8gb', '16gb', '32gb', '50gb', '64gb', '120gb',
  '128 gb emmc', '128gb', '240gb', '250gb', '250gb ssd', '256 gb', '256 mb',
  '256gb', '256gb ssd', '500gb', '512 gb', '512 mb', '512gb', 'No aplica'
];

export const CELULAR_GENERATIONS = [
  '2025', '2g', '3g', '4g', '4g lte', '5g'
];

export const CELULAR_TALLAS = [
  '1 tb', '128 gb', '16 gb', '2 tb', '256', '256 gb', '32 gb', '512', '512 gb', '64 gb', '8 gb', 'Tu'
];

export const CELULAR_CORES = [
  '11 core', '12 core', '16 core', '6', '8', 'Deca core', 'Dual core', 'Hexa core', 'No aplica', 'Octa core', 'Quad core', 'Single core'
];

export const CELULAR_REFRESH_RATES = [
  '100hz', '120 hz', '1200hz', '120hz', '144hz', '165hz', '240hz', '30hz', '60hz', '75hz', '90hz'
];

export const CELULAR_CAMERAS = [
  '0.3 mp', '0.8 mp', '10 mp', '108 mp', '108m+2m+ai camera', '12 mp', '12.2 mp', '13 mp', '16 mp', '18 mp',
  '2 mp', '200 mp', '200 mp + 12 mp', '200mp + 50mp + 12mp', '24 mp', '3 mp', '32 mp', '33 mp', '40 mp', '48 mp',
  '5 mp', '50 mp', '50 mp + flicker', '50.0 mp + 2.0 mp', '50m af + 2m ff', '50m+0.08mp', '50m+2m', '50m+2m+0.08m',
  '50mp', '50mp +qvga 0.08mp', '50mp ia + 0.08mp + 0.08mp', '50mp ois + 50mp w/m', '50mp ois + 50mp w/m/d + 50mp 3x tele',
  '50mp+0.08mp', '64 mp', '72 mp', '8 mp', '8.7 mp', '8mp af', 'Doble 48 mp', 'Dual,108mp+5mp', 'No aplica',
  'Principal: 50 mp telefoto: 200 mp ultra wide: 50 m...', 'Principal: 50 mp telephoto: 50 mp ultra wide: 12 m...', 'Triple 48 mp'
];

// ============================================================================
// 2. COMPUTADORAS & LAPTOPS (Exacto solicitado por el usuario)
// ============================================================================
export const LAPTOP_BRANDS = [
  'Lenovo', 'Asus', 'Hp', 'Apple', 'Acer', 'Dell', 'Msi', 'Advance', 'Kuzler', 'Hyundai',
  'Razer', 'Microsoft', 'Gigabyte', 'Huawei', 'Samsung', 'Toshiba'
];

export const LAPTOP_SCREEN_SIZES = [
  '1', '1.3', '1.56', '10', '10.1', '10.5', '11', '11.3', '12', '12.6', '13', '13.1', '13.2', '13.3',
  '13.4', '13.5', '13.6', '13.9', '14', '14"', '14.0', '14.1', '14.14', '14.2', '14.3', '14.5', '14.6',
  '141', '15', '15.1', '15.2', '15.3', '15.4', '15.5', '15.6', '15.6"', '156', '16', '16"', '16.0',
  '16.1', '16.2', '16.3', '16.6', '17', '17.0', '17.3', '17.4', '18', '18.0', '21.5', '23.8', '24', '27',
  '8', '9', '9.1'
];

export const LAPTOP_PROCESSORS = [
  'Amd athlon', 'Amd epyc', 'Amd ryzen', 'Amd ryzen 3', 'Amd ryzen 5', 'Amd ryzen 7', 'Amd ryzen 9',
  'Amd ryzen ai5', 'Amd ryzen ai7', 'Amd ryzen ai9', 'Apple a20 pro', 'Apple chip a19', 'Apple chip a19 pro',
  'Apple m1', 'Apple m2', 'Apple m3', 'Apple m4', 'Intel celeron', 'Intel core', 'Intel core 5',
  'Intel core i3', 'Intel core i5', 'Intel core i7', 'Intel core i9', 'Intel core ultra 5',
  'Intel core ultra 7', 'Intel core ultra 9', 'Intel pentium', 'Mediatek', 'No aplica', 'Qualcomm', 'Qualcomm snapdragon'
];

export const LAPTOP_CORES = [
  '10', '11 core', '12 core', '14 core', '16 core', '24 core', 'Deca core', 'Dual core', 'Hexa core', 'No aplica', 'Octa core', 'Quad core', 'Single core'
];

export const LAPTOP_CAPACITIES = [
  '1tb', '1.5tb', '2tb', '3gb', '8gb', '16gb', '24gb', '64gb', '120gb', '128 gb emmc', '128gb', '128mb',
  '240gb', '250gb', '250gb ssd', '256 gb', '256 mb', '256gb', '256gb ssd', '500gb', '500gb ssd', '512 gb', '512 mb', '512gb', 'No aplica'
];

export const LAPTOP_RAMS = [
  '4 gb', '6 gb', '8 gb', '12 gb', '16 gb', '18 gb', '24 gb', '32 gb', '36 gb', '40 gb', '48 gb', '64 gb', '512 gb', 'No aplica'
];

export const LAPTOP_OS = [
  'Chrome os', 'Free dos', 'Ios', 'Mac os', 'Sin sistema operativo', 'Ubuntu', 'Windows', 'Windows 10', 'Windows 11', 'Windows 11 home', 'Windows 11 home en español', 'Zepp os'
];

export const LAPTOP_DISPLAY_FEATURES = [
  'Ips', 'Fhd', 'Wuxga', 'Anti glare', 'Hd', 'Oled', 'Táctil', 'Fhd+', 'Led', 'Retina', 'Liquid retina',
  'Liquid retina hd', 'Alta tasa de refresco', 'Qhd', 'Súper retina xdr', 'Brillante', 'Touch', '4k uhd',
  'Wxga', 'Hdr', 'Mini-led', 'Liquid retina xdr', 'Plana', 'Hd+', 'Corning gorilla glass', 'Amoled', 'Tft', 'Lcd',
  'Fhd,ips', 'Variable refresh rate (vrr)', 'Fhd,ips,anti glare', 'Táctil,wuxga', '8k uhd', 'Fhd,alta tasa de refresco',
  'Alta tasa de refresco,fhd', 'Anti glare,ips,wuxga', 'Ips,anti glare,wuxga', 'Sin biseles', 'Alta tasa de refresco,wuxga',
  'Anti glare,fhd', 'Fhd,ips,alta tasa de refresco', 'Fhd,ips,táctil', 'Ips,anti glare', 'Mate', 'Oled,alta tasa de refresco',
  'Oled,táctil', 'Oled,wuxga', 'Twisted nematic', 'Táctil,fhd', 'always-on display', 'brillante', 'Alta tasa de refresco,hdr,ips',
  'Alta tasa de refresco,ips,qhd', 'Alta tasa de refresco,oled,qhd', 'Anti glare,alta tasa de refresco,ips', 'Anti glare,fhd,ips',
  'Anti glare,ips', 'Curva', 'E-ink', 'Fhd+,ips', 'Fhd,anti glare', 'Fhd,anti glare,sin biseles', 'Fhd,ips,led',
  'Fhd,lcd', 'Fhd,led', 'Fhd,plana', 'Fhd,táctil', 'Full hd, comfyview (mate)', 'Hdr,ips,alta tasa de refresco', 'Ips,fhd',
  'Ips,fhd,alta tasa de refresco', 'Ips,hdr', 'Ips,táctil', 'Ips,wuxga', 'Ips,wuxga,táctil', 'Microled', 'Oled,hdr,fhd',
  'Pantalla 14" wuxga (1920x1200) oled 400nits glossy...', 'Pantalla táctil fhd, ips, antirreflejante, de 39,6...', 'Plana,táctil',
  'Tn', 'Uled', 'Va', 'Wqxga', 'Wuxga,alta tasa de refresco', 'Wuxga,ips,anti glare', 'Wuxga,ips,táctil', 'Wuxga,led,anti glare', 'Wuxga,táctil'
];

// ============================================================================
// 3. TV TELEVISORES & SMART TV (Exacto solicitado por el usuario)
// ============================================================================
export const TV_BRANDS = [
  'Lg', 'Samsung', 'Jvc', 'Tcl', 'Hisense', 'Xiaomi', 'Caixun', 'Hyundai', 'Blackline', 'Sony',
  'Philips', 'Panasonic', 'Daewoo', 'AOC'
];

export const TV_PRICE_RANGES = [
  { id: 'all', label: 'Cualquier precio', min: 0, max: Infinity },
  { id: '100-250', label: 'S/ 100 - S/ 250', min: 100, max: 250 },
  { id: '250-500', label: 'S/ 250 - S/ 500', min: 250, max: 500 },
  { id: '500-1000', label: 'S/ 500 - S/ 1.000', min: 500, max: 1000 },
  { id: '1000-2000', label: 'S/ 1.000 - S/ 2.000', min: 1000, max: 2000 },
  { id: '2000-5000', label: 'S/ 2.000 - S/ 5.000', min: 2000, max: 5000 },
  { id: 'desde-5000', label: 'DESDE S/ 5.000', min: 5000, max: Infinity }
];

export const TV_SCREEN_SIZES = [
  { id: '42-or-less', label: '42" o menos' },
  { id: '43-49', label: '43" a 49"' },
  { id: '50-58', label: '50" a 58"' },
  { id: '60-65', label: '60" a 65"' },
  { id: '70-or-more', label: '70" o más' }
];

export const TV_DISPLAY_FEATURES = [
  '4k uhd', 'Qled', 'Led', 'Fhd', 'Mini-led', 'Nanocell', 'Hd', 'Crystal uhd', 'Qned', 'Hdr', 'Plana',
  'Qd miniled', 'Oled', 'Fhd+', 'Sin biseles', 'Neo qled', 'Hd+', 'Uled', 'Lcd', 'Brillante',
  'Alta tasa de refresco', 'Micro rgb', 'Va', 'Variable refresh rate (vrr)', 'Ips', 'Dynamic amoled 2x', '8k uhd',
  'Amoled', 'Fhd,led', 'Mate', 'Retina', '4k qned miniled', '4k uhd,crystal uhd', '4k uhd,hdr,led',
  '4k uhd,hdr,sin biseles', '4k uhd,led,hdr', '4k uhd,led,plana', '4k uhd,oled,sin biseles', '4k uhd,qled,hdr',
  '4k uhd,sin biseles', 'Anti glare', 'Oled,4k uhd', 'Qled,4k uhd'
];

export const TV_USB_PORTS = [
  '1', '12', '1ea (v 2.0)', '2', '2 usb', '2ea (v 2.0)', '3', '31', '3ea (v 2.0)', '4', '6'
];

export const TV_RESOLUTIONS = [
  '1280 x 720', '1366 x 768', '260.4cm', '3840 x 2160', '3842 x 2160', '3843 x 2160', '3844 x 2160', '3845 x 2160',
  '480 x 320', '4k (2.304 x 4.096)', '4k hdr', '4k uhd', '4k ultra hd (3,840 x 2,160)', '5k', '8k uhd', 'Fhd',
  'Fhd (1.920 x 1.080)', 'Fhd+', 'Hd', 'Hd (1.280 x 720)', 'Hd 1.080p', 'Hd+', 'Qhd', 'Retina 5k', 'Super retina hd',
  'Super retina xdr', 'Vga', 'Wxga'
];

export const TV_REFRESH_RATES = [
  '1200hz', '120hz', '144hz', '165hz', '240hz', '30hz', '60hz', '60hz nativo', '75 hz', '75hz'
];

export const TV_OS = [
  'Android', 'Android tv', 'Androidone', 'Chrome os', 'Fire tv', 'Google tv', 'Linux', 'Miui', 'No aplica',
  'Roku os', 'Threadx', 'Tizen', 'Vidaa', 'Webos', 'Webos 26', 'Zepp os'
];

export const TV_CONNECTIVITIES = [
  '3g', '4g', '5g', 'Alámbrico', 'Analógico uhf', 'Android auto', 'Apple carplay', 'Auxiliar 3.5mm', 'Bluetooth',
  'Bluetooth 5.0', 'Bluetooth 5.0,ethernet,hdmi', 'Bluetooth 5.2', 'Bluetooth 5.3', 'Bluetooth,hdmi,wifi', 'Cableado',
  'Cableado digital', 'Ethernet', 'Hdmi', 'Hdmi,usb', 'Hdmi,usb,ethernet', 'Hdmi,usb,wifi', 'Hdmi,wifi,bluetooth',
  'Inalámbrico', 'Infrarrojo', 'Micro usb', 'No aplica', 'Otro', 'Pared', 'Radiofrecuencia (rf)', 'Rca', 'Solar',
  'Tdt', 'Uhf digital', 'Usb', 'Usb-c', 'Wf wireless', 'Wifi', 'Wifi 6', 'Wifi,ethernet', 'Wifi,hdmi,ethernet', 'Óptico (toslink)'
];

export const TV_HDMI_PORTS = [
  '3', '2', '4', '1', '3 entradas (soporta earc, allm)', '4entradas (soporta 4k 120hz, earc, vrr, allm, qms,...',
  'Earc (hdmi 2)', '3 entradas (soporta earc)', '32', '3entradas (soporta earc, allm)', '4 hdmi',
  '4 entradas (soporta 4k 120hz, earc, vrr, allm, qms...', '4entradas (soporta earc, allm)', '5'
];

export const TV_VOLTAGES = [
  '100-240v', '220v', '220 v- 240 v', '220 v', '120v - 220v', '100 ac - 240 v', '220-240 v', 'Ac100-240v 50-60hz',
  '100–240 v', '220', '120-220v', '240v', '100 ac-240 v', '240 voltios', '240 v', 'Ac 110-240v 50-60hz',
  '110-220v', '110-220 v', '240', '220v -240v', '100~240v', '120–220 v', '60 hz', '100-240 v', '120v', '110v'
];

// ============================================================================
// 4. CONSOLAS & VIDEOJUEGOS
// ============================================================================
export const CONSOLAS_PLATFORMS = [
  'PlayStation 5', 'Nintendo Switch', 'Xbox Series X/S', 'PlayStation 4', 'Xbox One', 'PC Gaming', 'Retro Arcade'
];

export const CONSOLAS_BRANDS = [
  'Sony PlayStation', 'Nintendo', 'Microsoft Xbox', 'Logitech', 'Razer', 'Asus ROG', 'SteelSeries', 'HyperX', 'Corsair', 'Turtle Beach'
];

export const CONSOLAS_ESRB = [
  'Everyone (E)', 'Everyone 10+ (E10+)', 'Teen (T)', 'Mature 17+ (M)', 'Adults Only 18+ (AO)'
];

export const CONSOLAS_CAPACITIES = [
  '512gb', '825gb', '1tb', '2tb', 'No aplica'
];

// ============================================================================
// AUDIO & PARLANTES
// ============================================================================
export const AUDIO_CATEGORIES = [
  'Audífonos Inalámbricos', 'Audífonos Bluetooth', 'Audífonos Gamer', 'Parlantes Portátiles',
  'Barras de Sonido', 'Equipos de Sonido', 'Micrófonos y Auriculares'
];

export const AUDIO_BRANDS = [
  'Sony', 'JBL', 'Bose', 'Apple', 'Xiaomi', 'Sennheiser', 'Audio-Technica', 'Logitech', 'Razer', 'Skullcandy', 'Anker'
];

export const AUDIO_TYPES: string[] = [
  'In-ear', 'Over-ear', 'On-ear', 'True Wireless', 'Parlante Bluetooth', 'Soundbar'
];

// Alias para ELECTRO
export const ELECTRO_CATEGORIES = [
  'Refrigeración', 'Lavado y Secado', 'Climatización y Aire', 'Microondas y Hornos',
  'Aspiradoras y Limpieza', 'Licuadoras y Batidoras', 'Cafeteras y Teteras', 'Freidoras de Aire y Parrillas Eléctricas'
];

export const ELECTRO_BRANDS = [
  'Samsung', 'LG', 'Oster', 'Bosch', 'Philips', 'Electrolux', 'Midea', 'Indurama', 'Mabe', 'Sole', 'Thomas', 'Imaco', 'Taurus', 'Kärcher'
];

export const ELECTRO_EFFICIENCY: string[] = [
  'A+++', 'A++', 'A+', 'A', 'B', 'C'
];

// Alias para MODA
export const MODA_CATEGORIES = [
  'Polos y Camisas', 'Pantalones y Jeans', 'Casacas y Chompas', 'Vestidos y Faldas', 'Ropa Deportiva', 'Ropa Interior', 'Sweaters'
];

export const MODA_BRANDS = [
  'Zara', 'Mango', 'Nike', 'Adidas', "Levi's", 'Tommy Hilfiger', 'Calvin Klein', 'Puma', 'H&M', 'Columbia'
];

export const MODA_SIZES: string[] = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'
];

// ============================================================================
// 5. ELECTROHOGAR
// ============================================================================
export const ELECTROHOGAR_CATEGORIES = [
  'Refrigeración', 'Lavado y Secado', 'Climatización y Aire', 'Microondas y Hornos',
  'Aspiradoras y Limpieza', 'Licuadoras y Batidoras', 'Cafeteras y Teteras', 'Freidoras de Aire y Parrillas Eléctricas'
];

export const ELECTROHOGAR_BRANDS = [
  'Samsung', 'LG', 'Oster', 'Bosch', 'Philips', 'Electrolux', 'Midea', 'Indurama', 'Mabe', 'Sole', 'Thomas', 'Imaco', 'Taurus', 'Kärcher'
];

export const ELECTROHOGAR_EFFICIENCIES = [
  'A+++', 'A++', 'A+', 'A', 'B', 'C'
];

export const ELECTROHOGAR_VOLTAGES = [
  '220v', '110v', '100-240v'
];

// ============================================================================
// 6. CALZADO
// ============================================================================
export const CALZADO_CATEGORIES = [
  'Zapatillas Urbanas', 'Zapatillas Deportivas', 'Zapatos Formales', 'Botas y Botines', 'Sandalias y Pantuflas', 'Calzado Confort y Ortopédico'
];

export const CALZADO_BRANDS = [
  'Nike', 'Adidas', 'Puma', 'Skechers', 'Vans', 'Converse', 'Under Armour', 'Reebok', 'New Balance', 'Timberland', 'Asics', 'Fila', 'Crocs', 'Cat'
];

export const CALZADO_SIZES = [
  '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'
];

export const CALZADO_GENDERS = [
  'Hombre', 'Mujer', 'Unisex', 'Niños'
];

export const CALZADO_MATERIALS = [
  'Cuero', 'Textil', 'Sintético', 'Lona', 'Malla', 'Gamuza'
];

// ============================================================================
// 7. MODA HOMBRE
// ============================================================================
export const HOMBRE_CATEGORIES = [
  'Polos y Camisas', 'Pantalones y Jeans', 'Casacas y Chompas', 'Ropa Deportiva Hombre', 'Trajes y Sacos Formales', 'Ropa Interior y Medias', 'Shorts y Bermudas'
];

export const HOMBRE_BRANDS = [
  'Nike', 'Adidas', "Levi's", 'Tommy Hilfiger', 'Calvin Klein', 'Zara', 'Puma', 'Columbia', 'Lacoste', 'Dockers', 'H&M', 'Mango Man', 'Under Armour'
];

export const HOMBRE_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'
];

export const HOMBRE_MATERIALS = [
  'Algodón', 'Poliéster', 'Denim / Jean', 'Lana', 'Lino', 'Cuero', 'Spandex'
];

// ============================================================================
// 8. MODA MUJER
// ============================================================================
export const MUJER_CATEGORIES = [
  'Blusas y Polos', 'Vestidos y Faldas', 'Pantalones y Jeans', 'Casacas y Abrigos', 'Ropa Deportiva Mujer', 'Lencería y Pijamas', 'Trajes de Baño', 'Sweaters y Chompas'
];

export const MUJER_BRANDS = [
  'Zara', 'Mango', 'H&M', 'Forever 21', 'Tommy Hilfiger', "Levi's", 'Calvin Klein', 'Adidas', 'Nike', 'Guess', 'Sybilla', 'Marquis'
];

export const MUJER_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34'
];

export const MUJER_MATERIALS = [
  'Algodón', 'Seda', 'Denim / Jean', 'Lino', 'Poliéster', 'Viscosa', 'Encaje', 'Cuero'
];

// ============================================================================
// 9. MUEBLES Y ORGANIZACIÓN
// ============================================================================
export const MUEBLES_CATEGORIES = [
  'Muebles de Sala', 'Muebles de Comedor', 'Escritorios y Sillas Ergonómicas', 'Estantes y Libreros', 'Roperos y Clósets', 'Zapateras y Cómodas', 'Organizadores y Cajas'
];

export const MUEBLES_BRANDS = [
  'Rosen', 'Mica', 'Basement Home', 'IKEA', 'Innova', 'Tvilum', 'Forli', 'Orange', 'Casa Joven', 'TuHome'
];

export const MUEBLES_MATERIALS = [
  'Madera maciza', 'Melamina', 'Metal', 'Vidrio', 'Cuero sintético', 'Tela', 'MDF'
];

// ============================================================================
// 10. DORMITORIO Y BAÑO
// ============================================================================
export const DORMITORIO_CATEGORIES = [
  'Colchones y Box Tarimas', 'Sábanas y Fundas', 'Edredones y Cubrecamas', 'Almohadas y Cobertores', 'Toallas de Baño', 'Cortinas y Accesorios de Baño', 'Muebles de Baño'
];

export const DORMITORIO_BRANDS = [
  'Paraíso', 'Rosen', 'Forli', 'Drimer', 'Cannon', 'Mica', 'Basement Home', 'Casa Joven', 'Komfort'
];

export const DORMITORIO_BED_SIZES = [
  '1 Plaza', '1.5 Plazas', '2 Plazas', 'Queen', 'King'
];

export const DORMITORIO_MATERIALS = [
  '100% Algodón', 'Microfibra', 'Espuma viscoelástica', 'Resortes Pocket', 'Lino', 'Plumas'
];

// ============================================================================
// 11. BELLEZA
// ============================================================================
export const BELLEZA_CATEGORIES = [
  'Cuidado Facial y Sérums', 'Maquillaje', 'Perfumes y Colonias', 'Cuidado del Cabello', 'Cuidado Corporal', 'Bloqueadores y Protectores Solares', 'Manicure y Pedicure'
];

export const BELLEZA_BRANDS = [
  'La Roche-Posay', 'Cerave', "L'Oréal", 'Maybelline', 'MAC', 'Carolina Herrera', 'Dior', 'Chanel', 'Clinique', 'Neutrogena', 'Isdin', 'Vichy', 'Nivea', 'Eucerin'
];

export const BELLEZA_SKIN_TYPES = [
  'Todo tipo de piel', 'Grasa', 'Seca', 'Mixta', 'Sensible'
];

export const BELLEZA_FORMATS = [
  'Crema', 'Gel', 'Sérum', 'Spray', 'Loción', 'Polvo', 'Barra'
];

// ============================================================================
// 12. ACCESORIOS MODA
// ============================================================================
export const ACCESORIOS_CATEGORIES = [
  'Relojes', 'Carteras y Bolsos', 'Mochilas y Billeteras', 'Lentes de Sol', 'Joyería y Bisutería', 'Gorros, Sombreros y Bufandas', 'Cinturones y Billeteras'
];

export const ACCESORIOS_BRANDS = [
  'Casio', 'Fossil', 'Michael Kors', 'Ray-Ban', 'Oakley', 'Tommy Hilfiger', 'Guess', 'Tous', 'Pandora', 'Swatch', 'Tissot', 'Victorinox'
];

export const ACCESORIOS_GENDERS = [
  'Hombre', 'Mujer', 'Unisex'
];

export const ACCESORIOS_MATERIALS = [
  'Cuero genuino', 'Acero inoxidable', 'Cuero sintético', 'Oro', 'Plata', 'Titanio', 'Silicona'
];

// ============================================================================
// 13. NIÑOS Y JUGUETES
// ============================================================================
export const JUGUETES_CATEGORIES = [
  'Figuras de Acción y Muñecos', 'Juegos de Mesa y Puzzles', 'Bloques de Construcción', 'Juguetes Educativos y Didácticos', 'Scooters, Patines y Triciclos', 'Muñecas y Peluches', 'Pistas y Autos a Escala'
];

export const JUGUETES_BRANDS = [
  'Lego', 'Hasbro', 'Mattel', 'Hot Wheels', 'Barbie', 'Fisher-Price', 'Funko', 'Nerf', 'Play-Doh', 'Marvel', 'Bandai'
];

export const JUGUETES_AGE_RANGES = [
  '0 a 2 años', '3 a 5 años', '6 a 8 años', '9 a 11 años', '12 años a más', 'Coleccionistas'
];

export const JUGUETES_FRANCHISES = [
  'Star Wars', 'Marvel / Avengers', 'Pokémon', 'Disney', 'Harry Potter', 'Batman', 'Super Mario', 'Transformers', 'Barbie'
];

// ============================================================================
// 14. BEBÉS
// ============================================================================
export const BEBES_CATEGORIES = [
  'Coches y Sillas para Auto', 'Cunas, Moisés y Corrales', 'Biberones y Lactancia', 'Pañales y Toallitas Húmedas', 'Ropa para Bebé', 'Juguetes de Estimulación Temprana', 'Higiene y Baño del Bebé'
];

export const BEBES_BRANDS = [
  'Chicco', 'Graco', 'Fisher-Price', 'Philips Avent', 'Pampers', 'Huggies', 'Baby Kits', 'Infanti', 'Pigeon', 'Evenflo'
];

export const BEBES_STAGES = [
  'Recién nacido (0-3m)', '3-6 meses', '6-12 meses', '1-2 años', '2-4 años'
];

// ============================================================================
// 15. DEPORTES Y AIRE LIBRE
// ============================================================================
export const DEPORTES_CATEGORIES = [
  'Ciclismo y Bicicletas', 'Fitness y Máquinas de Ejercicio', 'Mancuernas y Pesas', 'Camping y Senderismo', 'Fútbol y Deportes de Pelota', 'Natación y Deportes Acuáticos', 'Accesorios de Entrenamiento'
];

export const DEPORTES_BRANDS = [
  'Nike', 'Adidas', 'Oxford', 'Monark', 'Trek', 'Coleman', 'Best', 'Everlast', 'Wilson', 'Speedo', 'Puma', 'Spalding', 'Under Armour'
];

export const DEPORTES_DISCIPLINES = [
  'Ciclismo', 'Running', 'Fitness & Gym', 'Fútbol', 'Natación', 'Trekking & Camping', 'Tenis / Pádel', 'Yoga y Pilates'
];

// ============================================================================
// 16. SALUD Y BIENESTAR
// ============================================================================
export const SALUD_CATEGORIES = [
  'Suplementos y Vitaminas', 'Tensiómetros y Termómetros', 'Masajeadores y Relajación', 'Cuidado Bucal', 'Ortopedia y Soporte Muscular', 'Purificadores de Aire y Difusores'
];

export const SALUD_BRANDS = [
  'Omron', 'Optimum Nutrition', 'Herbalife', 'Dymatize', 'Philips Sonicare', 'Oral-B', 'Beurer', 'Mason Natural', 'Centrum', 'Microlife'
];

export const SALUD_FORMATS = [
  'Cápsulas', 'Polvo', 'Tabletas', 'Gomitas', 'Líquido', 'Dispositivo digital'
];

// ============================================================================
// 17. COCINA Y MENAJE
// ============================================================================
export const COCINA_CATEGORIES = [
  'Ollas y Sartenes', 'Vajilla y Platos', 'Vasos, Copas y Tazas', 'Cubiertos y Cuchillos de Cocina', 'Utensilios y Repostería', 'Herméticos y Almacenamiento de Alimentos', 'Botellas y Termos'
];

export const COCINA_BRANDS = [
  'Tramontina', 'Oster', 'Record', 'Tefal', 'Ilko', 'Pyrex', 'Luminarc', 'Stanley', 'Thermos', 'Cuisinart'
];

export const COCINA_MATERIALS = [
  'Acero inoxidable', 'Teflón antiadherente', 'Cerámica', 'Hierro fundido', 'Vidrio templado', 'Granito', 'Silicona', 'Aluminio'
];

// ============================================================================
// 18. DECORACIÓN E ILUMINACIÓN
// ============================================================================
export const DECORACION_CATEGORIES = [
  'Lámparas y Focos LED', 'Cuadros y Espejos', 'Cortinas y Persianas', 'Alfombras y Tapetes', 'Cojines Decorativos y Mantas', 'Floreros, Velas y Aromatizadores'
];

export const DECORACION_BRANDS = [
  'Philips Hue', 'Xiaomi Smart', 'Casa Joven', 'Mica', 'Basement Home', 'Eglo', 'Osram', 'Orange', 'TuHome'
];

export const DECORACION_LIGHT_TYPES = [
  'Luz cálida', 'Luz fría / blanca', 'Luz neutra', 'RGB Multicolor', 'Dimmable / Regulable'
];

// ============================================================================
// 19. JARDÍN Y TERRAZA
// ============================================================================
export const JARDIN_CATEGORIES = [
  'Muebles de Terraza', 'Parrillas y Asadores', 'Macetas y Plantas', 'Mangueras y Riego', 'Herramientas de Jardinería', 'Toldos y Sombrillas de Terraza', 'Piscinas y Accesorios'
];

export const JARDIN_BRANDS = [
  'Weber', 'Char-Broil', 'Tramontina', 'Gardena', 'Bestway', 'Intex', 'Orange', 'Keter', 'Truper'
];

export const JARDIN_FUEL_TYPES = [
  'Carbón', 'Gas', 'Eléctrico', 'Leña', 'Solar'
];

// ============================================================================
// 20. MASCOTAS
// ============================================================================
export const MASCOTAS_CATEGORIES = [
  'Alimento para Perros', 'Alimento para Gatos', 'Camas y Casas', 'Juguetes para Mascotas', 'Correas, Arneses y Collares', 'Higiene, Areneros y Baño', 'Rascadores y Transportadores'
];

export const MASCOTAS_PET_TYPES = [
  'Perros', 'Gatos', 'Aves', 'Peces', 'Roedores'
];

export const MASCOTAS_BRANDS = [
  'Royal Canin', "Hill's Science Diet", 'Pro Plan', 'Ricocan', 'Ricocat', 'Brit Care', 'Cat Chow', 'Dog Chow', 'Kong', 'Felix', 'Whiskas'
];

export const MASCOTAS_LIFE_STAGES = [
  'Cachorro / Kitten', 'Adulto', 'Senior / Adulto Mayor'
];

// ============================================================================
// 21. MEJORAMIENTO DEL HOGAR Y CONSTRUCCIÓN
// ============================================================================
export const CONSTRUCCION_CATEGORIES = [
  'Herramientas Eléctricas', 'Herramientas Manuales', 'Pinturas y Brochas', 'Electricidad y Domótica', 'Grifería y Sanitarios', 'Cerraduras y Seguridad Hogar', 'Pisos y Revestimientos'
];

export const CONSTRUCCION_BRANDS = [
  'Bosch', 'DeWalt', 'Makita', 'Stanley', 'Black+Decker', 'Vainsa', 'Trebol', 'Yale', 'Kolor', 'Schneider Electric', 'Truper', 'Kärcher'
];

export const CONSTRUCCION_POWER_TYPES = [
  'Inalámbrico a batería', 'Con cable eléctrico 220V', 'Manual / Sin motor', 'Neumático'
];

export const CONSTRUCCION_VOLTAGES = [
  '220v', '18V / 20V Max', '12V Max', '110v'
];

// ============================================================================
// 22. AUTOMOTRIZ
// ============================================================================
export const AUTOMOTRIZ_CATEGORIES = [
  'Llantas y Neumáticos', 'Baterías y Mantenimiento', 'Audio y Electrónica para Autos', 'Accesorios de Interior y Exterior', 'Limpieza y Cuidado Automotriz', 'Cascos y Equipamiento para Motos', 'Soportes y Cargadores de Auto'
];

export const AUTOMOTRIZ_BRANDS = [
  'Michelin', 'Goodyear', 'Bridgestone', 'Pioneer', 'Sony', 'Bosch', 'Etna', 'Mobil', 'Castrol', "Meguiar's", 'Baseus', 'Pirelli', 'Hankook'
];

export const AUTOMOTRIZ_VEHICLE_TYPES = [
  'Auto / Sedán', 'Camioneta / SUV', 'Moto / Scooter', 'Camión / Utilitario'
];

// ============================================================================
// 23. OTRAS CATEGORÍAS
// ============================================================================
export const OTRAS_CATEGORIES = [
  'Libros y Criptoeducación', 'Papelería y Útiles de Oficina', 'Instrumentos Musicales', 'Maletas, Mochilas de Viaje y Equipaje', 'Arte y Coleccionables', 'Regalos y Ocasiones Especiales'
];

export const OTRAS_BRANDS = [
  'Samsonite', 'Faber-Castell', 'Yamaha', 'Casio', 'Moleskine', 'Planeta', 'Penguin Random House', 'Fender', 'Roland', 'Porta'
];

// ============================================================================
// FUNCIONES MATCHERS GENÉRICAS Y ESPECIALIZADAS
// ============================================================================

export const matchesBrand = (p: Product, brand: string): boolean => {
  if (!brand || brand === 'Todas') return true;
  const text = getProductSearchableText(p);
  return text.includes(brand.toLowerCase());
};

export const matchesSeller = (p: Product, sellerId: string): boolean => {
  if (sellerId === 'all') return true;
  const text = getProductSearchableText(p);
  const company = (p.suppliers?.company_name || '').toLowerCase();
  const def = COMMON_SELLERS.find((s) => s.id === sellerId);
  if (!def) return true;
  return def.keywords.some((k) => company.includes(k) || text.includes(k));
};

export const matchesPriceRange = (p: Product, rangeId: string, rangesList = CELULAR_PRICE_RANGES): boolean => {
  if (rangeId === 'all') return true;
  const pen = (p.price_usd || 0) * PEN_RATE;
  const def = rangesList.find((r) => r.id === rangeId);
  if (!def) return true;
  return pen >= def.min && pen <= def.max;
};

export const matchesColor = (p: Product, colorId: string): boolean => {
  if (colorId === 'all') return true;
  const text = getProductSearchableText(p);
  const colorDef = COMMON_COLORS.find((c) => c.id === colorId);
  if (!colorDef) return text.includes(colorId.toLowerCase());
  return colorDef.keywords.some((k) => text.includes(k));
};

export const matchesCondition = (p: Product, condId: string): boolean => {
  if (condId === 'all') return true;
  const c = (p.condition || 'Nuevo').toLowerCase();
  const text = getProductSearchableText(p);
  const def = COMMON_CONDITIONS.find((item) => item.id === condId);
  if (!def) return c.includes(condId.toLowerCase()) || text.includes(condId.toLowerCase());
  return def.keywords.some((k) => c.includes(k) || text.includes(k));
};

export const matchesCapacity = (p: Product, cap: string): boolean => {
  if (cap === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = cap.toLowerCase().trim();
  if (clean === 'no aplica') return !text.includes('gb') && !text.includes('tb');
  return text.includes(clean);
};

export const matchesGeneration = (p: Product, gen: string): boolean => {
  if (gen === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = gen.toLowerCase().trim();
  return text.includes(clean);
};

export const matchesTalla = (p: Product, talla: string): boolean => {
  if (talla === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = talla.toLowerCase().trim();
  return text.includes(clean);
};

export const matchesCores = (p: Product, cores: string): boolean => {
  if (cores === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = cores.toLowerCase().trim();
  if (clean === 'octa core') return text.includes('octa') || text.includes('8 núcleo') || text.includes('8 nucleo');
  if (clean === 'hexa core') return text.includes('hexa') || text.includes('6 núcleo');
  if (clean === 'quad core') return text.includes('quad') || text.includes('4 núcleo');
  if (clean === 'dual core') return text.includes('dual') || text.includes('2 núcleo');
  if (clean === 'deca core') return text.includes('deca') || text.includes('10 núcleo');
  return text.includes(clean);
};

export const matchesRefreshRate = (p: Product, rate: string): boolean => {
  if (rate === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = rate.toLowerCase().trim();
  const hzNum = clean.replace(/[^0-9]/g, '');
  if (!hzNum) return text.includes(clean);
  return text.includes(`${hzNum}hz`) || text.includes(`${hzNum} hz`);
};

export const matchesCamera = (p: Product, cam: string): boolean => {
  if (cam === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = cam.toLowerCase().trim();
  if (clean === 'no aplica') return !text.includes('mp') && !text.includes('cámara');
  if (clean.includes('doble') || clean.includes('dual')) return text.includes('doble') || text.includes('dual');
  if (clean.includes('triple')) return text.includes('triple');
  const mpNum = clean.replace(/[^0-9]/g, '');
  if (!mpNum) return text.includes(clean);
  return text.includes(`${mpNum} mp`) || text.includes(`${mpNum}mp`);
};

export const matchesBluetooth = (p: Product, val: 'si' | 'no' | 'all'): boolean => {
  if (val === 'all') return true;
  const text = getProductSearchableText(p);
  const hasBt = text.includes('bluetooth') || text.includes('bt ') || text.includes('inalámbrico') || text.includes('wireless');
  return val === 'si' ? hasBt : !hasBt;
};

export const matchesLaptopScreenSize = (p: Product, sizeStr: string): boolean => {
  if (sizeStr === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = sizeStr.toLowerCase().replace(/["\s]/g, '');
  return text.includes(clean) || text.includes(`${clean}"`) || text.includes(`${clean} pulg`);
};

export const matchesProcessor = (p: Product, proc: string): boolean => {
  if (proc === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = proc.toLowerCase().trim();
  return text.includes(clean);
};

export const matchesRam = (p: Product, ram: string): boolean => {
  if (ram === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = ram.toLowerCase().trim();
  const ramNum = clean.replace(/[^0-9]/g, '');
  if (!ramNum) return text.includes(clean);
  return (
    text.includes(`${ramNum}gb ram`) ||
    text.includes(`${ramNum} gb ram`) ||
    text.includes(`ram ${ramNum}gb`) ||
    text.includes(`ram ${ramNum} gb`) ||
    text.includes(`${ramNum}gb`) ||
    text.includes(`${ramNum} gb`)
  );
};

export const matchesOperatingSystem = (p: Product, os: string): boolean => {
  if (os === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = os.toLowerCase().trim();
  if (clean.includes('windows 11')) return text.includes('windows 11') || text.includes('win 11') || text.includes('w11');
  if (clean.includes('windows 10')) return text.includes('windows 10') || text.includes('win 10');
  if (clean.includes('windows')) return text.includes('windows');
  if (clean.includes('mac')) return text.includes('mac os') || text.includes('macos') || text.includes('apple');
  if (clean.includes('chrome')) return text.includes('chrome os') || text.includes('chromebook');
  if (clean.includes('android')) return text.includes('android');
  if (clean.includes('google tv')) return text.includes('google tv');
  if (clean.includes('webos')) return text.includes('webos');
  if (clean.includes('tizen')) return text.includes('tizen');
  if (clean.includes('roku')) return text.includes('roku');
  return text.includes(clean);
};

export const matchesScreenFeature = (p: Product, feat: string): boolean => {
  if (feat === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = feat.toLowerCase().trim();
  return text.includes(clean);
};

export const matchesTvScreenSize = (p: Product, sizeId: string): boolean => {
  if (sizeId === 'all') return true;
  const text = getProductSearchableText(p);
  const match = text.match(/([0-9]{2})\s*["|''|pulgadas|pulg]/i);
  const inches = match ? parseInt(match[1], 10) : null;
  if (!inches) return text.includes(sizeId.replace('-', ' '));

  if (sizeId === '42-or-less') return inches <= 42;
  if (sizeId === '43-49') return inches >= 43 && inches <= 49;
  if (sizeId === '50-58') return inches >= 50 && inches <= 58;
  if (sizeId === '60-65') return inches >= 60 && inches <= 65;
  if (sizeId === '70-or-more') return inches >= 70;
  return true;
};

export const matchesUsbPorts = (p: Product, ports: string): boolean => {
  if (ports === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = ports.toLowerCase().trim();
  const num = clean.replace(/[^0-9]/g, '');
  if (!num) return text.includes(clean);
  return text.includes(`${num} usb`) || text.includes(`${num} puertos usb`) || text.includes(`usb x${num}`) || text.includes(clean);
};

export const matchesHdmiPorts = (p: Product, ports: string): boolean => {
  if (ports === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = ports.toLowerCase().trim();
  const num = clean.replace(/[^0-9]/g, '');
  if (!num) return text.includes(clean);
  return text.includes(`${num} hdmi`) || text.includes(`${num} puertos hdmi`) || text.includes(`hdmi x${num}`) || text.includes(clean);
};

export const matchesScreenResolution = (p: Product, res: string): boolean => {
  if (res === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = res.toLowerCase().trim();
  if (clean.includes('4k') || clean.includes('3840')) return text.includes('4k') || text.includes('3840 x 2160') || text.includes('uhd');
  if (clean.includes('8k')) return text.includes('8k');
  if (clean.includes('fhd') || clean.includes('1920')) return text.includes('fhd') || text.includes('1920 x 1080') || text.includes('full hd');
  if (clean.includes('hd') || clean.includes('1280') || clean.includes('1366')) return text.includes('hd') || text.includes('1280 x 720') || text.includes('1366 x 768');
  return text.includes(clean);
};

export const matchesVoltage = (p: Product, volt: string): boolean => {
  if (volt === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = volt.toLowerCase().trim();
  if (clean.includes('220')) return text.includes('220v') || text.includes('220 v') || text.includes('220-240') || text.includes('100-240');
  if (clean.includes('110') || clean.includes('120')) return text.includes('110v') || text.includes('120v') || text.includes('110-220') || text.includes('100-240');
  return text.includes(clean);
};

export const matchesConnectivity = (p: Product, conn: string): boolean => {
  if (conn === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(conn.toLowerCase());
};

export const matchesEsrb = (p: Product, esrb: string): boolean => {
  if (esrb === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(esrb.toLowerCase());
};

export const matchesMaterial = (p: Product, mat: string): boolean => {
  if (mat === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(mat.toLowerCase().trim());
};

export const matchesGender = (p: Product, gen: string): boolean => {
  if (gen === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(gen.toLowerCase().trim());
};

export const matchesAgeRange = (p: Product, age: string): boolean => {
  if (age === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(age.toLowerCase().trim());
};

export const matchesPetType = (p: Product, pet: string): boolean => {
  if (pet === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = pet.toLowerCase().trim();
  if (clean.includes('perro')) return text.includes('perro') || text.includes('canino') || text.includes('dog');
  if (clean.includes('gato')) return text.includes('gato') || text.includes('felino') || text.includes('cat');
  return text.includes(clean);
};

export const matchesVehicleType = (p: Product, veh: string): boolean => {
  if (veh === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = veh.toLowerCase().trim();
  if (clean.includes('moto')) return text.includes('moto') || text.includes('scooter');
  if (clean.includes('camioneta') || clean.includes('suv')) return text.includes('suv') || text.includes('camioneta');
  return text.includes(clean);
};

export const matchesPowerType = (p: Product, pwr: string): boolean => {
  if (pwr === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = pwr.toLowerCase().trim();
  if (clean.includes('inalámbrico') || clean.includes('batería')) return text.includes('inalámbrico') || text.includes('inalambrico') || text.includes('batería') || text.includes('bateria') || text.includes('cordless');
  if (clean.includes('cable')) return text.includes('cable') || text.includes('220v') || text.includes('eléctrico');
  return text.includes(clean);
};

export const matchesSkinType = (p: Product, skin: string): boolean => {
  if (skin === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(skin.toLowerCase().trim());
};

export const matchesBedSize = (p: Product, bed: string): boolean => {
  if (bed === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(bed.toLowerCase().trim());
};

export const matchesEnergyEfficiency = (p: Product, eff: string): boolean => {
  if (eff === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(eff.toLowerCase().trim());
};

export const matchesDiscipline = (p: Product, disc: string): boolean => {
  if (disc === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(disc.toLowerCase().trim());
};

export const matchesFranchise = (p: Product, fran: string): boolean => {
  if (fran === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(fran.toLowerCase().trim());
};

export const matchesLifeStage = (p: Product, stage: string): boolean => {
  if (stage === 'all') return true;
  const text = getProductSearchableText(p);
  const clean = stage.toLowerCase().trim();
  if (clean.includes('cachorro') || clean.includes('kitten')) return text.includes('cachorro') || text.includes('kitten') || text.includes('puppy') || text.includes('junior');
  if (clean.includes('senior')) return text.includes('senior') || text.includes('mayor');
  return text.includes(clean);
};

export const matchesFuelType = (p: Product, fuel: string): boolean => {
  if (fuel === 'all') return true;
  const text = getProductSearchableText(p);
  return text.includes(fuel.toLowerCase().trim());
};

// ============================================================================
// DETECCIÓN DE FAMILIA DE CATEGORÍA
// ============================================================================
export type CategoryFamily =
  | 'celulares'
  | 'laptops'
  | 'televisores'
  | 'consolas'
  | 'audio'
  | 'electrohogar'
  | 'calzado'
  | 'mujer'
  | 'hombre'
  | 'dormitorio'
  | 'belleza'
  | 'accesorios'
  | 'juguetes'
  | 'bebes'
  | 'deportes'
  | 'salud'
  | 'cocina'
  | 'muebles'
  | 'jardin'
  | 'mascotas'
  | 'construccion'
  | 'automotriz'
  | 'general';

export interface FamilyHeaderInfo {
  family: CategoryFamily;
  categoryTitle: string;
  subcategoryTitle: string;
}

export const detectCategoryFamily = (
  category: string,
  subcategory: string,
  searchQuery: string = ''
): FamilyHeaderInfo => {
  const cat = (category || '').toLowerCase();
  const sub = (subcategory || '').toLowerCase();
  const q = (searchQuery || '').toLowerCase();
  const combined = `${cat} ${sub} ${q}`.trim();

  // 1. Celulares
  if (
    combined.includes('celular') ||
    combined.includes('smartphone') ||
    combined.includes('telefonia') ||
    combined.includes('telefonía') ||
    sub.includes('celulares y smartphones') ||
    sub.includes('smartphones')
  ) {
    return {
      family: 'celulares',
      categoryTitle: 'Telefonía',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Celulares y Teléfonos'
    };
  }

  // 2. Laptops / Computadoras
  if (
    combined.includes('laptop') ||
    combined.includes('notebook') ||
    combined.includes('computación y laptops') ||
    combined.includes('computacion y laptops') ||
    (combined.includes('comput') && !combined.includes('celular'))
  ) {
    return {
      family: 'laptops',
      categoryTitle: 'Computadoras',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Laptops'
    };
  }

  // 3. TV / Televisores / Smart TV
  if (
    combined.includes('televisor') ||
    combined.includes('smart tv') ||
    combined.includes('tv, audio y video') ||
    combined.includes('tv')
  ) {
    return {
      family: 'televisores',
      categoryTitle: 'TV Televisores',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Televisores Smart TV'
    };
  }

  // 4. Consolas y Videojuegos
  if (
    combined.includes('consola') ||
    combined.includes('videojuego') ||
    combined.includes('playstation') ||
    combined.includes('nintendo') ||
    combined.includes('xbox') ||
    combined.includes('gaming')
  ) {
    return {
      family: 'consolas',
      categoryTitle: 'Videojuegos',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Consolas y Videojuegos'
    };
  }

  // 5. Audio
  if (
    combined.includes('audio') ||
    combined.includes('audífono') ||
    combined.includes('audifono') ||
    combined.includes('parlante') ||
    combined.includes('soundbar')
  ) {
    return {
      family: 'audio',
      categoryTitle: 'Audio y Música',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Audífonos y Parlantes'
    };
  }

  // 6. Electrohogar
  if (
    combined.includes('electrohogar') ||
    combined.includes('refriger') ||
    combined.includes('lavad') ||
    combined.includes('climatiz') ||
    combined.includes('licuadora') ||
    combined.includes('freidora')
  ) {
    return {
      family: 'electrohogar',
      categoryTitle: 'Electrohogar',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Línea Blanca y Enseres'
    };
  }

  // 7. Calzado
  if (
    combined.includes('calzado') ||
    combined.includes('zapatilla') ||
    combined.includes('zapato') ||
    combined.includes('bota') ||
    combined.includes('sandalia')
  ) {
    return {
      family: 'calzado',
      categoryTitle: 'Calzado',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Zapatillas y Zapatos'
    };
  }

  // 8. Mujer
  if (cat.includes('mujer') || sub.includes('mujer')) {
    return {
      family: 'mujer',
      categoryTitle: 'Moda Mujer',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Ropa y Accesorios Mujer'
    };
  }

  // 9. Hombre
  if (cat.includes('hombre') || sub.includes('hombre')) {
    return {
      family: 'hombre',
      categoryTitle: 'Moda Hombre',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Ropa y Accesorios Hombre'
    };
  }

  // 10. Dormitorio y Baño
  if (combined.includes('dormitorio') || combined.includes('colch') || combined.includes('baño') || combined.includes('bano')) {
    return {
      family: 'dormitorio',
      categoryTitle: 'Dormitorio y Baño',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Colchones y Ropa de Cama'
    };
  }

  // 11. Belleza
  if (combined.includes('belleza') || combined.includes('facial') || combined.includes('maquillaje') || combined.includes('perfume')) {
    return {
      family: 'belleza',
      categoryTitle: 'Belleza y Cuidado',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Cuidado Personal y Maquillaje'
    };
  }

  // 12. Accesorios Moda
  if (combined.includes('accesorio') || combined.includes('reloj') || combined.includes('cartera') || combined.includes('joya')) {
    return {
      family: 'accesorios',
      categoryTitle: 'Accesorios',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Relojes y Carteras'
    };
  }

  // 13. Niños y Juguetes
  if (combined.includes('juguete') || combined.includes('niño') || combined.includes('nino') || combined.includes('lego')) {
    return {
      family: 'juguetes',
      categoryTitle: 'Niños y Juguetes',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Juguetes Didácticos y Figuras'
    };
  }

  // 14. Bebés
  if (combined.includes('bebé') || combined.includes('bebe') || combined.includes('coche') || combined.includes('pañal') || combined.includes('panal')) {
    return {
      family: 'bebes',
      categoryTitle: 'Mundo Bebé',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Coches y Lactancia'
    };
  }

  // 15. Deportes y Aire Libre
  if (combined.includes('deporte') || combined.includes('bici') || combined.includes('fitness') || combined.includes('camping')) {
    return {
      family: 'deportes',
      categoryTitle: 'Deportes y Aire Libre',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Fitness y Ciclismo'
    };
  }

  // 16. Salud y Bienestar
  if (combined.includes('salud') || combined.includes('bienestar') || combined.includes('suplemento') || combined.includes('vitamina')) {
    return {
      family: 'salud',
      categoryTitle: 'Salud y Bienestar',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Suplementos y Ortopedia'
    };
  }

  // 17. Cocina y Menaje
  if (combined.includes('cocina') || combined.includes('menaje') || combined.includes('olla') || combined.includes('sartén') || combined.includes('sarten')) {
    return {
      family: 'cocina',
      categoryTitle: 'Cocina y Menaje',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Ollas, Sartenes y Vajilla'
    };
  }

  // 18. Muebles y Organización
  if (combined.includes('mueble') || combined.includes('escritorio') || combined.includes('organiza')) {
    return {
      family: 'muebles',
      categoryTitle: 'Muebles y Organización',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Muebles de Sala y Oficina'
    };
  }

  // 19. Jardín y Terraza
  if (combined.includes('jardín') || combined.includes('jardin') || combined.includes('terraza') || combined.includes('parrilla')) {
    return {
      family: 'jardin',
      categoryTitle: 'Jardín y Terraza',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Parrillas y Muebles de Exterior'
    };
  }

  // 20. Mascotas
  if (combined.includes('mascota') || combined.includes('perro') || combined.includes('gato') || combined.includes('alimento para perro')) {
    return {
      family: 'mascotas',
      categoryTitle: 'Mascotas',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Alimento y Accesorios'
    };
  }

  // 21. Construcción y Herramientas
  if (combined.includes('construc') || combined.includes('herramienta') || combined.includes('bosch') || combined.includes('dewalt')) {
    return {
      family: 'construccion',
      categoryTitle: 'Mejoramiento y Herramientas',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Herramientas Eléctricas y Construcción'
    };
  }

  // 22. Automotriz
  if (combined.includes('automotriz') || combined.includes('llanta') || combined.includes('auto') || combined.includes('batería y')) {
    return {
      family: 'automotriz',
      categoryTitle: 'Automotriz',
      subcategoryTitle: sub && sub !== 'todas' ? subcategory : 'Llantas y Accesorios para Auto'
    };
  }

  // General por defecto
  return {
    family: 'general',
    categoryTitle: category && category !== 'Todas' ? category : 'Catálogo General',
    subcategoryTitle: subcategory && subcategory !== 'Todas' ? subcategory : 'Todos los Productos'
  };
};
