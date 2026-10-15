export interface MegaCategoryItem {
  label: string;
  isViewAll?: boolean;
  filterParam?: {
    categoria?: string;
    subcategoria?: string;
    marca?: string;
    q?: string;
  };
}

export interface MegaSubcategoryGroup {
  id: string;
  name: string;
  slug: string;
  items: MegaCategoryItem[];
}

export interface MegaCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  featuredBadge?: string;
  groups: MegaSubcategoryGroup[];
}

export const MEGA_CATALOG_TREE: MegaCategory[] = [
  {
    id: 'tecnologia',
    name: 'Tecnología',
    slug: 'tecnologia',
    iconName: 'Cpu',
    description: 'Smartphones, TV, cómputo, consolas gaming y domótica de última generación',
    featuredBadge: 'Top Ventas',
    groups: [
      {
        id: 'celulares',
        name: 'Celulares',
        slug: 'celulares',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Tecnología', subcategoria: 'Celulares' } },
          { label: 'Celulares', filterParam: { categoria: 'Tecnología', subcategoria: 'Celulares' } },
          { label: 'Apple', filterParam: { categoria: 'Tecnología', subcategoria: 'Celulares', marca: 'Apple', q: 'Apple' } },
          { label: 'Samsung', filterParam: { categoria: 'Tecnología', subcategoria: 'Celulares', marca: 'Samsung', q: 'Samsung' } },
          { label: 'Xiaomi', filterParam: { categoria: 'Tecnología', subcategoria: 'Celulares', marca: 'Xiaomi', q: 'Xiaomi' } },
          { label: 'Motorola', filterParam: { categoria: 'Tecnología', subcategoria: 'Celulares', marca: 'Motorola', q: 'Motorola' } },
          { label: 'Honor', filterParam: { categoria: 'Tecnología', subcategoria: 'Celulares', marca: 'Honor', q: 'Honor' } },
          { label: 'Celulares con IA', filterParam: { categoria: 'Tecnología', subcategoria: 'Celulares', q: 'IA' } },
          { label: 'Accesorios y cases', filterParam: { categoria: 'Tecnología', subcategoria: 'Celulares', q: 'accesorios' } },
          { label: 'Reacondicionados', filterParam: { categoria: 'Tecnología', subcategoria: 'Celulares', q: 'reacondicionado' } }
        ]
      },
      {
        id: 'tv',
        name: 'TV',
        slug: 'tv',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Tecnología', subcategoria: 'TV' } },
          { label: 'Televisores', filterParam: { categoria: 'Tecnología', subcategoria: 'TV' } },
          { label: 'TVs menores a 43"', filterParam: { categoria: 'Tecnología', subcategoria: 'TV', q: '43' } },
          { label: 'TVs entre 50" y 58"', filterParam: { categoria: 'Tecnología', subcategoria: 'TV', q: '55' } },
          { label: 'TVs mayores de 60"', filterParam: { categoria: 'Tecnología', subcategoria: 'TV', q: '65' } },
          { label: 'TVs OLED, QLED, Nanocell', filterParam: { categoria: 'Tecnología', subcategoria: 'TV', q: 'OLED' } },
          { label: 'LG', filterParam: { categoria: 'Tecnología', subcategoria: 'TV', marca: 'LG', q: 'LG' } },
          { label: 'Samsung', filterParam: { categoria: 'Tecnología', subcategoria: 'TV', marca: 'Samsung', q: 'Samsung' } },
          { label: 'JVC', filterParam: { categoria: 'Tecnología', subcategoria: 'TV', marca: 'JVC', q: 'JVC' } },
          { label: 'TCL', filterParam: { categoria: 'Tecnología', subcategoria: 'TV', marca: 'TCL', q: 'TCL' } },
          { label: 'Accesorios', filterParam: { categoria: 'Tecnología', subcategoria: 'TV', q: 'accesorios tv' } }
        ]
      },
      {
        id: 'computo',
        name: 'Cómputo',
        slug: 'computo',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo' } },
          { label: 'Laptops', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', q: 'laptop' } },
          { label: 'Tablets', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', q: 'tablet' } },
          { label: 'Impresoras y Tintas', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', q: 'impresora' } },
          { label: 'Laptops alto rendimiento', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', q: 'alto rendimiento' } },
          { label: 'Computadoras de Escritorio', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', q: 'desktop' } },
          { label: 'Monitores', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', q: 'monitor' } },
          { label: 'Accesorios', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', q: 'mouse teclado' } },
          { label: 'All in One', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', q: 'all in one' } },
          { label: 'MacBook', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', q: 'macbook' } },
          { label: 'Lenovo', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', marca: 'Lenovo', q: 'Lenovo' } },
          { label: 'Asus', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', marca: 'Asus', q: 'Asus' } },
          { label: 'Hp', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', marca: 'HP', q: 'HP' } },
          { label: 'Acer', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', marca: 'Acer', q: 'Acer' } },
          { label: 'Licencias y antivirus', filterParam: { categoria: 'Tecnología', subcategoria: 'Cómputo', q: 'antivirus' } }
        ]
      },
      {
        id: 'videojuegos',
        name: 'Videojuegos',
        slug: 'videojuegos',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Tecnología', subcategoria: 'Videojuegos' } },
          { label: 'Consolas', filterParam: { categoria: 'Tecnología', subcategoria: 'Videojuegos', q: 'consola' } },
          { label: 'Play Station', filterParam: { categoria: 'Tecnología', subcategoria: 'Videojuegos', marca: 'Sony', q: 'Playstation' } },
          { label: 'Nintendo', filterParam: { categoria: 'Tecnología', subcategoria: 'Videojuegos', marca: 'Nintendo', q: 'Nintendo' } },
          { label: 'Juegos', filterParam: { categoria: 'Tecnología', subcategoria: 'Videojuegos', q: 'juego' } },
          { label: 'Juegos Digitales', filterParam: { categoria: 'Tecnología', subcategoria: 'Videojuegos', q: 'digital' } }
        ]
      },
      {
        id: 'mundo-gamer',
        name: 'Mundo Gamer',
        slug: 'mundo-gamer',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Tecnología', subcategoria: 'Mundo Gamer' } },
          { label: 'Laptops Gamer', filterParam: { categoria: 'Tecnología', subcategoria: 'Mundo Gamer', q: 'laptop gamer' } },
          { label: 'Sillas gamer', filterParam: { categoria: 'Tecnología', subcategoria: 'Mundo Gamer', q: 'silla gamer' } },
          { label: 'Monitores Gamer', filterParam: { categoria: 'Tecnología', subcategoria: 'Mundo Gamer', q: 'monitor gamer' } },
          { label: 'Computadoras Gamer', filterParam: { categoria: 'Tecnología', subcategoria: 'Mundo Gamer', q: 'pc gamer' } },
          { label: 'Audífonos Gamer', filterParam: { categoria: 'Tecnología', subcategoria: 'Mundo Gamer', q: 'audifonos gamer' } },
          { label: 'Teclados Gamer', filterParam: { categoria: 'Tecnología', subcategoria: 'Mundo Gamer', q: 'teclado mecanico' } },
          { label: 'Accesorios', filterParam: { categoria: 'Tecnología', subcategoria: 'Mundo Gamer', q: 'accesorios gamer' } }
        ]
      },
      {
        id: 'camaras-drones',
        name: 'Cámaras y Drones',
        slug: 'camaras-y-drones',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Tecnología', subcategoria: 'Cámaras y Drones' } },
          { label: 'Cámaras profesionales', filterParam: { categoria: 'Tecnología', subcategoria: 'Cámaras y Drones', q: 'camara profesional' } },
          { label: 'Cámaras deportivas', filterParam: { categoria: 'Tecnología', subcategoria: 'Cámaras y Drones', q: 'gopro' } },
          { label: 'Cámaras instantáneas', filterParam: { categoria: 'Tecnología', subcategoria: 'Cámaras y Drones', q: 'instax' } },
          { label: 'Drones', filterParam: { categoria: 'Tecnología', subcategoria: 'Cámaras y Drones', q: 'dron' } },
          { label: 'Accesorios', filterParam: { categoria: 'Tecnología', subcategoria: 'Cámaras y Drones', q: 'tripode lente' } }
        ]
      },
      {
        id: 'smartwatches',
        name: 'Smartwatches',
        slug: 'smartwatches',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Tecnología', subcategoria: 'Smartwatches' } },
          { label: 'Apple', filterParam: { categoria: 'Tecnología', subcategoria: 'Smartwatches', marca: 'Apple', q: 'Apple Watch' } },
          { label: 'Samsung', filterParam: { categoria: 'Tecnología', subcategoria: 'Smartwatches', marca: 'Samsung', q: 'Galaxy Watch' } },
          { label: 'Xiaomi', filterParam: { categoria: 'Tecnología', subcategoria: 'Smartwatches', marca: 'Xiaomi', q: 'Mi Band' } },
          { label: 'Huawei', filterParam: { categoria: 'Tecnología', subcategoria: 'Smartwatches', marca: 'Huawei', q: 'Huawei Watch' } }
        ]
      },
      {
        id: 'audio',
        name: 'Audio',
        slug: 'audio',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Tecnología', subcategoria: 'Audio' } },
          { label: 'Audífonos', filterParam: { categoria: 'Tecnología', subcategoria: 'Audio', q: 'audifonos' } },
          { label: 'Parlantes', filterParam: { categoria: 'Tecnología', subcategoria: 'Audio', q: 'parlante bluetooth' } },
          { label: 'Equipos de Sonido', filterParam: { categoria: 'Tecnología', subcategoria: 'Audio', q: 'equipo de sonido' } },
          { label: 'Soundbar y Home Theater', filterParam: { categoria: 'Tecnología', subcategoria: 'Audio', q: 'soundbar' } },
          { label: 'Accesorios', filterParam: { categoria: 'Tecnología', subcategoria: 'Audio', q: 'cables audio' } },
          { label: 'JBL', filterParam: { categoria: 'Tecnología', subcategoria: 'Audio', marca: 'JBL', q: 'JBL' } },
          { label: 'Airpods', filterParam: { categoria: 'Tecnología', subcategoria: 'Audio', marca: 'Apple', q: 'Airpods' } },
          { label: 'LG', filterParam: { categoria: 'Tecnología', subcategoria: 'Audio', marca: 'LG', q: 'LG sound' } },
          { label: 'Sony', filterParam: { categoria: 'Tecnología', subcategoria: 'Audio', marca: 'Sony', q: 'Sony audio' } },
          { label: 'Alexa', filterParam: { categoria: 'Tecnología', subcategoria: 'Audio', q: 'Echo Alexa' } }
        ]
      },
      {
        id: 'smarthome-domotica',
        name: 'Smarthome y domótica',
        slug: 'smarthome-domotica',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Tecnología', subcategoria: 'Smarthome' } },
          { label: 'Asistentes de voz', filterParam: { categoria: 'Tecnología', subcategoria: 'Smarthome', q: 'asistente' } },
          { label: 'Iluminación inteligente', filterParam: { categoria: 'Tecnología', subcategoria: 'Smarthome', q: 'foco inteligente' } },
          { label: 'Proyectores', filterParam: { categoria: 'Tecnología', subcategoria: 'Smarthome', q: 'proyector' } },
          { label: 'Cámaras de seguridad', filterParam: { categoria: 'Tecnología', subcategoria: 'Smarthome', q: 'camara seguridad' } },
          { label: 'Aspiradoras robot', filterParam: { categoria: 'Tecnología', subcategoria: 'Smarthome', q: 'aspiradora robot' } },
          { label: 'Reproductores Streaming', filterParam: { categoria: 'Tecnología', subcategoria: 'Smarthome', q: 'streaming' } }
        ]
      }
    ]
  },
  {
    id: 'electrohogar',
    name: 'Electrohogar',
    slug: 'electrohogar',
    iconName: 'Home',
    description: 'Línea blanca, climatización y pequeños electrodomésticos para el hogar',
    groups: [
      {
        id: 'refrigeracion',
        name: 'Refrigeración',
        slug: 'refrigeracion',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Electrohogar', subcategoria: 'Refrigeración' } },
          { label: 'Refrigeradoras No Frost', filterParam: { categoria: 'Electrohogar', subcategoria: 'Refrigeración', q: 'no frost' } },
          { label: 'French Door y Side by Side', filterParam: { categoria: 'Electrohogar', subcategoria: 'Refrigeración', q: 'french door' } },
          { label: 'Frigobares', filterParam: { categoria: 'Electrohogar', subcategoria: 'Refrigeración', q: 'frigobar' } },
          { label: 'Congeladoras', filterParam: { categoria: 'Electrohogar', subcategoria: 'Refrigeración', q: 'congeladora' } },
          { label: 'Samsung', filterParam: { categoria: 'Electrohogar', subcategoria: 'Refrigeración', marca: 'Samsung', q: 'Samsung' } },
          { label: 'LG', filterParam: { categoria: 'Electrohogar', subcategoria: 'Refrigeración', marca: 'LG', q: 'LG' } },
          { label: 'Mabe', filterParam: { categoria: 'Electrohogar', subcategoria: 'Refrigeración', marca: 'Mabe', q: 'Mabe' } }
        ]
      },
      {
        id: 'lavado-secado',
        name: 'Lavado y Secado',
        slug: 'lavado-secado',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Electrohogar', subcategoria: 'Lavado y Secado' } },
          { label: 'Lavadoras Carga Frontal', filterParam: { categoria: 'Electrohogar', subcategoria: 'Lavado y Secado', q: 'carga frontal' } },
          { label: 'Lavadoras Carga Superior', filterParam: { categoria: 'Electrohogar', subcategoria: 'Lavado y Secado', q: 'carga superior' } },
          { label: 'Lavasecas', filterParam: { categoria: 'Electrohogar', subcategoria: 'Lavado y Secado', q: 'lavaseca' } },
          { label: 'Secadoras', filterParam: { categoria: 'Electrohogar', subcategoria: 'Lavado y Secado', q: 'secadora' } },
          { label: 'LG ThinQ', filterParam: { categoria: 'Electrohogar', subcategoria: 'Lavado y Secado', marca: 'LG', q: 'LG' } },
          { label: 'Samsung EcoBubble', filterParam: { categoria: 'Electrohogar', subcategoria: 'Lavado y Secado', marca: 'Samsung', q: 'Samsung' } }
        ]
      },
      {
        id: 'cocina-hornos',
        name: 'Cocina y Hornos',
        slug: 'cocina-hornos',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Electrohogar', subcategoria: 'Cocina y Hornos' } },
          { label: 'Cocinas de Pie a Gas', filterParam: { categoria: 'Electrohogar', subcategoria: 'Cocina y Hornos', q: 'cocina a gas' } },
          { label: 'Cocinas de Inducción', filterParam: { categoria: 'Electrohogar', subcategoria: 'Cocina y Hornos', q: 'induccion' } },
          { label: 'Microondas', filterParam: { categoria: 'Electrohogar', subcategoria: 'Cocina y Hornos', q: 'microondas' } },
          { label: 'Hornos Empotrables', filterParam: { categoria: 'Electrohogar', subcategoria: 'Cocina y Hornos', q: 'horno empotrable' } },
          { label: 'Campanas Extractoras', filterParam: { categoria: 'Electrohogar', subcategoria: 'Cocina y Hornos', q: 'campana extractora' } }
        ]
      },
      {
        id: 'pequenos-electrodomesticos',
        name: 'Pequeños Electrodomésticos',
        slug: 'pequenos-electrodomesticos',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Electrohogar', subcategoria: 'Pequeños Electrodomésticos' } },
          { label: 'Freidoras de Aire', filterParam: { categoria: 'Electrohogar', q: 'air fryer freidora' } },
          { label: 'Cafeteras Express y Cápsulas', filterParam: { categoria: 'Electrohogar', q: 'cafetera' } },
          { label: 'Licuadoras de Alta Potencia', filterParam: { categoria: 'Electrohogar', q: 'licuadora' } },
          { label: 'Batidoras Planetarias', filterParam: { categoria: 'Electrohogar', q: 'batidora' } },
          { label: 'Oster', filterParam: { categoria: 'Electrohogar', marca: 'Oster', q: 'Oster' } },
          { label: 'Philips', filterParam: { categoria: 'Electrohogar', marca: 'Philips', q: 'Philips' } }
        ]
      },
      {
        id: 'climatizacion-aire',
        name: 'Climatización y Aire',
        slug: 'climatizacion-aire',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Electrohogar', subcategoria: 'Climatización' } },
          { label: 'Aire Acondicionado Split', filterParam: { categoria: 'Electrohogar', q: 'aire acondicionado' } },
          { label: 'Ventiladores de Torre y Pie', filterParam: { categoria: 'Electrohogar', q: 'ventilador' } },
          { label: 'Deshumedecedores', filterParam: { categoria: 'Electrohogar', q: 'deshumedecedor' } },
          { label: 'Purificadores de Aire', filterParam: { categoria: 'Electrohogar', q: 'purificador' } }
        ]
      }
    ]
  },
  {
    id: 'muebles-organizacion',
    name: 'Muebles y Organización',
    slug: 'muebles-y-organizacion',
    iconName: 'Armchair',
    description: 'Mobiliario para sala, comedor, oficinas y soluciones de organización',
    groups: [
      {
        id: 'muebles-sala',
        name: 'Muebles de Sala',
        slug: 'muebles-sala',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Muebles y Organización', subcategoria: 'Muebles de Sala' } },
          { label: 'Juegos de Sala', filterParam: { categoria: 'Muebles y Organización', q: 'juego de sala' } },
          { label: 'Sofás Seccionales', filterParam: { categoria: 'Muebles y Organización', q: 'seccional' } },
          { label: 'Sillones Reclinables', filterParam: { categoria: 'Muebles y Organización', q: 'reclinable' } },
          { label: 'Mesas de Centro y Laterales', filterParam: { categoria: 'Muebles y Organización', q: 'mesa de centro' } },
          { label: 'Racks y Paneles de TV', filterParam: { categoria: 'Muebles y Organización', q: 'rack tv' } }
        ]
      },
      {
        id: 'comedor-bar',
        name: 'Comedor y Bar',
        slug: 'comedor-bar',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Muebles y Organización', subcategoria: 'Muebles de Comedor' } },
          { label: 'Juegos de Comedor 4, 6 y 8 sillas', filterParam: { categoria: 'Muebles y Organización', q: 'comedor' } },
          { label: 'Mesas de Comedor de Vidrio y Madera', filterParam: { categoria: 'Muebles y Organización', q: 'mesa comedor' } },
          { label: 'Sillas de Comedor', filterParam: { categoria: 'Muebles y Organización', q: 'sillas comedor' } },
          { label: 'Bancos y Banquetas de Bar', filterParam: { categoria: 'Muebles y Organización', q: 'bancos bar' } }
        ]
      },
      {
        id: 'oficina-estudio',
        name: 'Oficina y Estudio',
        slug: 'oficina-estudio',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Muebles y Organización', subcategoria: 'Oficina' } },
          { label: 'Escritorios Regulables en Altura', filterParam: { categoria: 'Muebles y Organización', q: 'escritorio' } },
          { label: 'Sillas Ergonómicas de Oficina', filterParam: { categoria: 'Muebles y Organización', q: 'silla ergonomica' } },
          { label: 'Libreros y Estantes', filterParam: { categoria: 'Muebles y Organización', q: 'estante librero' } },
          { label: 'Cajoneras y Archiveros', filterParam: { categoria: 'Muebles y Organización', q: 'archivero' } }
        ]
      },
      {
        id: 'closets-organizacion',
        name: 'Roperos y Organización',
        slug: 'closets-organizacion',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Muebles y Organización', subcategoria: 'Roperos' } },
          { label: 'Roperos de 2 a 6 puertas', filterParam: { categoria: 'Muebles y Organización', q: 'ropero closet' } },
          { label: 'Cómodas y Zapateras', filterParam: { categoria: 'Muebles y Organización', q: 'zapatera comoda' } },
          { label: 'Organizadores y Cajas Plásticas', filterParam: { categoria: 'Muebles y Organización', q: 'cajas organizadoras' } }
        ]
      }
    ]
  },
  {
    id: 'dormitorio-bano',
    name: 'Dormitorio y Baño',
    slug: 'dormitorio-y-bano',
    iconName: 'Bed',
    description: 'Colchones, ropa de cama, almohadas, toallas y grifería de baño',
    groups: [
      {
        id: 'colchones-camas',
        name: 'Colchones y Camas',
        slug: 'colchones-camas',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Dormitorio y Baño', subcategoria: 'Colchones' } },
          { label: 'Colchones 1.5 y 2 Plazas', filterParam: { categoria: 'Dormitorio y Baño', q: 'colchon 2 plazas' } },
          { label: 'Camas Queen y King Size', filterParam: { categoria: 'Dormitorio y Baño', q: 'queen king' } },
          { label: 'Box Tarimas y Cabeceras', filterParam: { categoria: 'Dormitorio y Baño', q: 'box tarima' } },
          { label: 'Paraíso', filterParam: { categoria: 'Dormitorio y Baño', marca: 'Paraiso', q: 'Paraiso' } },
          { label: 'Rosen', filterParam: { categoria: 'Dormitorio y Baño', marca: 'Rosen', q: 'Rosen' } }
        ]
      },
      {
        id: 'ropa-cama',
        name: 'Ropa de Cama',
        slug: 'ropa-cama',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Dormitorio y Baño', subcategoria: 'Ropa de Cama' } },
          { label: 'Juegos de Sábanas 100% Algodón', filterParam: { categoria: 'Dormitorio y Baño', q: 'sabanas algodon' } },
          { label: 'Edredones y Cubrecamas', filterParam: { categoria: 'Dormitorio y Baño', q: 'edredon cubrecama' } },
          { label: 'Almohadas y Cobertores', filterParam: { categoria: 'Dormitorio y Baño', q: 'almohadas' } },
          { label: 'Frazadas y Mantas Térmicas', filterParam: { categoria: 'Dormitorio y Baño', q: 'frazada manta' } }
        ]
      },
      {
        id: 'bano-accesorios',
        name: 'Baño',
        slug: 'bano-accesorios',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Dormitorio y Baño', subcategoria: 'Baño' } },
          { label: 'Juegos de Toallas de Algodón', filterParam: { categoria: 'Dormitorio y Baño', q: 'toallas bano' } },
          { label: 'Cortinas y Tapetes de Baño', filterParam: { categoria: 'Dormitorio y Baño', q: 'cortina bano' } },
          { label: 'Muebles de Baño y Espejos', filterParam: { categoria: 'Dormitorio y Baño', q: 'mueble bano' } },
          { label: 'Grifería y Duchas Españolas', filterParam: { categoria: 'Dormitorio y Baño', q: 'griferia ducha' } }
        ]
      }
    ]
  },
  {
    id: 'mujer',
    name: 'Mujer',
    slug: 'mujer',
    iconName: 'Sparkles',
    description: 'Moda femenina, vestidos, casacas, calzado y ropa deportiva',
    groups: [
      {
        id: 'ropa-mujer',
        name: 'Moda y Prendas',
        slug: 'ropa-mujer',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Mujer', subcategoria: 'Moda' } },
          { label: 'Vestidos y Faldas', filterParam: { categoria: 'Mujer', q: 'vestido falda' } },
          { label: 'Blusas y Camisas', filterParam: { categoria: 'Mujer', q: 'blusa camisa' } },
          { label: 'Jeans y Pantalones', filterParam: { categoria: 'Mujer', q: 'jeans pantalon' } },
          { label: 'Casacas y Abrigos', filterParam: { categoria: 'Mujer', q: 'casaca abrigo' } },
          { label: 'Chompas y Sweaters', filterParam: { categoria: 'Mujer', q: 'chompa sweater' } }
        ]
      },
      {
        id: 'deporte-mujer',
        name: 'Ropa Deportiva',
        slug: 'deporte-mujer',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Mujer', subcategoria: 'Deportiva' } },
          { label: 'Leggings y Tops', filterParam: { categoria: 'Mujer', q: 'leggings top' } },
          { label: 'Polos y Poleras Deportivas', filterParam: { categoria: 'Mujer', q: 'polos deportivos' } },
          { label: 'Buzos y Conjuntos', filterParam: { categoria: 'Mujer', q: 'buzo conjunto' } },
          { label: 'Nike', filterParam: { categoria: 'Mujer', marca: 'Nike', q: 'Nike' } },
          { label: 'Adidas', filterParam: { categoria: 'Mujer', marca: 'Adidas', q: 'Adidas' } }
        ]
      },
      {
        id: 'lenceria-pijamas',
        name: 'Lencería y Pijamas',
        slug: 'lenceria-pijamas',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Mujer', subcategoria: 'Lencería' } },
          { label: 'Pijamas de Algodón y Seda', filterParam: { categoria: 'Mujer', q: 'pijama' } },
          { label: 'Brasieres y Conjuntos', filterParam: { categoria: 'Mujer', q: 'brasier' } },
          { label: 'Ropa de Baño y Bikinis', filterParam: { categoria: 'Mujer', q: 'bikini ropa bano' } }
        ]
      }
    ]
  },
  {
    id: 'hombre',
    name: 'Hombre',
    slug: 'hombre',
    iconName: 'Shirt',
    description: 'Moda masculina, camisas, pantalones, trajes formales y ropa deportiva',
    groups: [
      {
        id: 'ropa-hombre',
        name: 'Prendas y Casual',
        slug: 'ropa-hombre',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Hombre', subcategoria: 'Prendas' } },
          { label: 'Polos Básicos y Cuello Piqué', filterParam: { categoria: 'Hombre', q: 'polo' } },
          { label: 'Camisas Casuales y Formales', filterParam: { categoria: 'Hombre', q: 'camisa' } },
          { label: 'Jeans y Pantalones Chino', filterParam: { categoria: 'Hombre', q: 'jeans chino' } },
          { label: 'Casacas y Chompas', filterParam: { categoria: 'Hombre', q: 'casaca chompa' } },
          { label: 'Bermudas y Shorts', filterParam: { categoria: 'Hombre', q: 'bermuda short' } }
        ]
      },
      {
        id: 'deporte-hombre',
        name: 'Ropa Deportiva Hombre',
        slug: 'deporte-hombre',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Hombre', subcategoria: 'Deportiva' } },
          { label: 'Polos Dry-Fit', filterParam: { categoria: 'Hombre', q: 'dry fit' } },
          { label: 'Pantalones de Buzo y Joggers', filterParam: { categoria: 'Hombre', q: 'jogger buzo' } },
          { label: 'Poleras con Capucha Hoodie', filterParam: { categoria: 'Hombre', q: 'hoodie polera' } },
          { label: 'Under Armour', filterParam: { categoria: 'Hombre', marca: 'Under Armour', q: 'Under Armour' } }
        ]
      },
      {
        id: 'formal-interior',
        name: 'Formal y Ropa Interior',
        slug: 'formal-interior',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Hombre', subcategoria: 'Formal' } },
          { label: 'Trajes y Sacos Formales', filterParam: { categoria: 'Hombre', q: 'traje formal blazer' } },
          { label: 'Bóxers y Ropa Interior', filterParam: { categoria: 'Hombre', q: 'boxer interior' } },
          { label: 'Corbatas y Mancuernas', filterParam: { categoria: 'Hombre', q: 'corbata accesorios' } }
        ]
      }
    ]
  },
  {
    id: 'calzado',
    name: 'Calzado',
    slug: 'calzado',
    iconName: 'Footprints',
    description: 'Zapatillas urbanas, deportivas, formales y sandalias',
    groups: [
      {
        id: 'zapatillas-urbanas',
        name: 'Zapatillas Urbanas',
        slug: 'zapatillas-urbanas',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Calzado', subcategoria: 'Zapatillas Urbanas' } },
          { label: 'Nike Air Force y Dunk', filterParam: { categoria: 'Calzado', marca: 'Nike', q: 'Nike Air' } },
          { label: 'Adidas Originals y Samba', filterParam: { categoria: 'Calzado', marca: 'Adidas', q: 'Adidas Samba' } },
          { label: 'Puma Suede', filterParam: { categoria: 'Calzado', marca: 'Puma', q: 'Puma' } },
          { label: 'Converse All Star', filterParam: { categoria: 'Calzado', marca: 'Converse', q: 'Converse' } },
          { label: 'Vans Old Skool', filterParam: { categoria: 'Calzado', marca: 'Vans', q: 'Vans' } }
        ]
      },
      {
        id: 'zapatillas-deportivas',
        name: 'Zapatillas Deportivas',
        slug: 'zapatillas-deportivas',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Calzado', subcategoria: 'Deportivas' } },
          { label: 'Running y Maratón', filterParam: { categoria: 'Calzado', q: 'running calzado' } },
          { label: 'Fútbol y Chimpunes', filterParam: { categoria: 'Calzado', q: 'chimpunes futbol' } },
          { label: 'Training y Crossfit', filterParam: { categoria: 'Calzado', q: 'training zapatillas' } },
          { label: 'Trekking y Montaña', filterParam: { categoria: 'Calzado', q: 'trekking botas' } }
        ]
      },
      {
        id: 'zapatos-botas',
        name: 'Zapatos y Botas',
        slug: 'zapatos-botas',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Calzado', subcategoria: 'Formal' } },
          { label: 'Zapatos de Vestir de Cuero', filterParam: { categoria: 'Calzado', q: 'zapatos cuero vestir' } },
          { label: 'Mocasines y Loafers', filterParam: { categoria: 'Calzado', q: 'mocasines' } },
          { label: 'Botines Urbanos y Casuales', filterParam: { categoria: 'Calzado', q: 'botines' } },
          { label: 'Sandalias y Pantuflas', filterParam: { categoria: 'Calzado', q: 'sandalias pantuflas' } }
        ]
      }
    ]
  },
  {
    id: 'belleza',
    name: 'Belleza',
    slug: 'belleza',
    iconName: 'Gem',
    description: 'Cuidado facial, maquillaje, perfumería de alta gama y cuidado capilar',
    groups: [
      {
        id: 'skincare-facial',
        name: 'Cuidado Facial',
        slug: 'skincare-facial',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Belleza', subcategoria: 'Facial' } },
          { label: 'Sérums de Vitamina C y Retinol', filterParam: { categoria: 'Belleza', q: 'serum facial' } },
          { label: 'Cremas Hidratantes Antiedad', filterParam: { categoria: 'Belleza', q: 'crema hidratante' } },
          { label: 'Limpiadores y Aguas Micelares', filterParam: { categoria: 'Belleza', q: 'limpiador facial' } },
          { label: 'La Roche-Posay', filterParam: { categoria: 'Belleza', marca: 'La Roche-Posay', q: 'La Roche' } },
          { label: 'CeraVe', filterParam: { categoria: 'Belleza', marca: 'CeraVe', q: 'CeraVe' } },
          { label: 'Isdin', filterParam: { categoria: 'Belleza', marca: 'Isdin', q: 'Isdin' } }
        ]
      },
      {
        id: 'maquillaje',
        name: 'Maquillaje',
        slug: 'maquillaje',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Belleza', subcategoria: 'Maquillaje' } },
          { label: 'Bases y Correctores Líquidos', filterParam: { categoria: 'Belleza', q: 'base corrector' } },
          { label: 'Labiales Matte y Tintas', filterParam: { categoria: 'Belleza', q: 'labial' } },
          { label: 'Máscaras de Pestañas Waterproof', filterParam: { categoria: 'Belleza', q: 'mascara pestanas' } },
          { label: 'Maybelline', filterParam: { categoria: 'Belleza', marca: 'Maybelline', q: 'Maybelline' } },
          { label: 'MAC Cosmetics', filterParam: { categoria: 'Belleza', marca: 'MAC', q: 'MAC' } }
        ]
      },
      {
        id: 'perfumeria',
        name: 'Perfumería',
        slug: 'perfumeria',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Belleza', subcategoria: 'Perfumería' } },
          { label: 'Perfumes Mujer Eau de Parfum', filterParam: { categoria: 'Belleza', q: 'perfume mujer' } },
          { label: 'Perfumes Hombre Eau de Toilette', filterParam: { categoria: 'Belleza', q: 'perfume hombre' } },
          { label: 'Carolina Herrera', filterParam: { categoria: 'Belleza', marca: 'Carolina Herrera', q: 'Carolina Herrera' } },
          { label: 'Dior Sauvage', filterParam: { categoria: 'Belleza', marca: 'Dior', q: 'Dior' } },
          { label: 'Paco Rabanne', filterParam: { categoria: 'Belleza', marca: 'Paco Rabanne', q: 'Paco Rabanne' } }
        ]
      }
    ]
  },
  {
    id: 'deportes-aire-libre',
    name: 'Deportes y aire libre',
    slug: 'deportes-y-aire-libre',
    iconName: 'Bike',
    description: 'Bicicletas, máquinas de fitness, indumentaria deportiva y camping',
    groups: [
      {
        id: 'ciclismo',
        name: 'Ciclismo y Bicicletas',
        slug: 'ciclismo',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Deportes y aire libre', subcategoria: 'Ciclismo' } },
          { label: 'Bicicletas Montañeras MTB', filterParam: { categoria: 'Deportes y aire libre', q: 'bicicleta montanera' } },
          { label: 'Bicicletas de Ruta y Urbanas', filterParam: { categoria: 'Deportes y aire libre', q: 'bicicleta urbana' } },
          { label: 'Cascos, Luces y Candados', filterParam: { categoria: 'Deportes y aire libre', q: 'casco luces bici' } }
        ]
      },
      {
        id: 'fitness-gimnasio',
        name: 'Fitness y Gimnasio',
        slug: 'fitness-gimnasio',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Deportes y aire libre', subcategoria: 'Fitness' } },
          { label: 'Trotadoras y Caminadoras', filterParam: { categoria: 'Deportes y aire libre', q: 'trotadora' } },
          { label: 'Bicicletas de Spinning', filterParam: { categoria: 'Deportes y aire libre', q: 'spinning' } },
          { label: 'Mancuernas y Pesas Rusas', filterParam: { categoria: 'Deportes y aire libre', q: 'mancuernas pesas' } },
          { label: 'Bandas Elásticas y Mats de Yoga', filterParam: { categoria: 'Deportes y aire libre', q: 'mat yoga bandas' } }
        ]
      },
      {
        id: 'camping-aventura',
        name: 'Camping y Aventura',
        slug: 'camping-aventura',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Deportes y aire libre', subcategoria: 'Camping' } },
          { label: 'Carpas 2, 4 y 6 personas', filterParam: { categoria: 'Deportes y aire libre', q: 'carpa' } },
          { label: 'Bolsas de Dormir Térmicas', filterParam: { categoria: 'Deportes y aire libre', q: 'sleeping bolsa dormir' } },
          { label: 'Mochilas de Trekking', filterParam: { categoria: 'Deportes y aire libre', q: 'mochila trekking' } }
        ]
      }
    ]
  },
  {
    id: 'ninos-juguetes',
    name: 'Niños y Juguetes',
    slug: 'ninos-y-juguetes',
    iconName: 'Gamepad2',
    description: 'Juguetes didácticos, figuras de acción, juegos de mesa y entretenimiento infantil',
    groups: [
      {
        id: 'juegos-construccion',
        name: 'Construcción y Didácticos',
        slug: 'juegos-construccion',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Niños y Juguetes', subcategoria: 'Construcción' } },
          { label: 'Lego Star Wars y City', filterParam: { categoria: 'Niños y Juguetes', marca: 'Lego', q: 'Lego' } },
          { label: 'Bloques Didácticos y Puzzles', filterParam: { categoria: 'Niños y Juguetes', q: 'puzzle didactico' } },
          { label: 'Juegos de Mesa Familiares', filterParam: { categoria: 'Niños y Juguetes', q: 'juego de mesa' } }
        ]
      },
      {
        id: 'figuras-munecas',
        name: 'Figuras y Muñecas',
        slug: 'figuras-munecas',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Niños y Juguetes', subcategoria: 'Figuras' } },
          { label: 'Figuras de Acción Marvel y Anime', filterParam: { categoria: 'Niños y Juguetes', q: 'figura accion' } },
          { label: 'Barbie y Muñecas Coleccionables', filterParam: { categoria: 'Niños y Juguetes', marca: 'Barbie', q: 'Barbie' } },
          { label: 'Pistas Hot Wheels y Autos', filterParam: { categoria: 'Niños y Juguetes', marca: 'Hot Wheels', q: 'Hot Wheels' } }
        ]
      },
      {
        id: 'scooters-rodados',
        name: 'Scooters y Rodados',
        slug: 'scooters-rodados',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Niños y Juguetes', subcategoria: 'Rodados' } },
          { label: 'Scooters y Monopatines', filterParam: { categoria: 'Niños y Juguetes', q: 'scooter monopatin' } },
          { label: 'Bicicletas Infantiles', filterParam: { categoria: 'Niños y Juguetes', q: 'bicicleta nino' } },
          { label: 'Patines en Línea', filterParam: { categoria: 'Niños y Juguetes', q: 'patines' } }
        ]
      }
    ]
  },
  {
    id: 'mascotas',
    name: 'Mascotas',
    slug: 'mascotas',
    iconName: 'PawPrint',
    description: 'Alimento, camas, accesorios y cuidado para perros, gatos y más',
    groups: [
      {
        id: 'perros',
        name: 'Perros',
        slug: 'perros',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Mascotas', subcategoria: 'Perros' } },
          { label: 'Alimento Seco y Húmedo', filterParam: { categoria: 'Mascotas', q: 'alimento perro' } },
          { label: 'Camas y Casas Térmicas', filterParam: { categoria: 'Mascotas', q: 'cama perro' } },
          { label: 'Correas y Arneses Antitirones', filterParam: { categoria: 'Mascotas', q: 'arnes correa perro' } },
          { label: 'Snacks y Galletas Dentales', filterParam: { categoria: 'Mascotas', q: 'snacks perro' } }
        ]
      },
      {
        id: 'gatos',
        name: 'Gatos',
        slug: 'gatos',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Mascotas', subcategoria: 'Gatos' } },
          { label: 'Alimento Premium para Gatos', filterParam: { categoria: 'Mascotas', q: 'alimento gato' } },
          { label: 'Arena Sanitaria Aglomerante', filterParam: { categoria: 'Mascotas', q: 'arena gato' } },
          { label: 'Rascadores y Torres de Juego', filterParam: { categoria: 'Mascotas', q: 'rascador gato' } },
          { label: 'Juguetes con Catnip', filterParam: { categoria: 'Mascotas', q: 'catnip juguete' } }
        ]
      }
    ]
  },
  {
    id: 'mejoramiento-hogar-construccion',
    name: 'Mejoramiento del Hogar',
    slug: 'mejoramiento-del-hogar-y-construccion',
    iconName: 'Hammer',
    description: 'Herramientas eléctricas, pinturas, electricidad, grifería y seguridad',
    groups: [
      {
        id: 'herramientas-electricas',
        name: 'Herramientas Eléctricas',
        slug: 'herramientas-electricas',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Mejoramiento del Hogar y Construcción', subcategoria: 'Eléctricas' } },
          { label: 'Taladros Inalámbricos Percutores', filterParam: { categoria: 'Mejoramiento del Hogar y Construcción', q: 'taladro percutor' } },
          { label: 'Amoladoras y Esmeriles', filterParam: { categoria: 'Mejoramiento del Hogar y Construcción', q: 'amoladora' } },
          { label: 'Sierras Circulares y Caladoras', filterParam: { categoria: 'Mejoramiento del Hogar y Construcción', q: 'sierra caladora' } },
          { label: 'DeWalt', filterParam: { categoria: 'Mejoramiento del Hogar y Construcción', marca: 'DeWalt', q: 'DeWalt' } },
          { label: 'Bosch', filterParam: { categoria: 'Mejoramiento del Hogar y Construcción', marca: 'Bosch', q: 'Bosch' } }
        ]
      },
      {
        id: 'manuales-pintura',
        name: 'Herramientas Manuales y Pintura',
        slug: 'manuales-pintura',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Mejoramiento del Hogar y Construcción', subcategoria: 'Manuales' } },
          { label: 'Cajas y Maletines de Herramientas', filterParam: { categoria: 'Mejoramiento del Hogar y Construcción', q: 'caja herramientas' } },
          { label: 'Juegos de Llaves y Destornilladores', filterParam: { categoria: 'Mejoramiento del Hogar y Construcción', q: 'llaves destornilladores' } },
          { label: 'Pinturas Lavables y Brochas', filterParam: { categoria: 'Mejoramiento del Hogar y Construcción', q: 'pintura brocha' } }
        ]
      }
    ]
  },
  {
    id: 'automotriz',
    name: 'Automotriz',
    slug: 'automotriz',
    iconName: 'Car',
    description: 'Llantas, baterías, electrónica para autos, cascos y accesorios vehiculares',
    groups: [
      {
        id: 'electronica-auto',
        name: 'Electrónica y Accesorios',
        slug: 'electronica-auto',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Automotriz', subcategoria: 'Electrónica' } },
          { label: 'Cámaras Dashcam y Sensores', filterParam: { categoria: 'Automotriz', q: 'dashcam' } },
          { label: 'Soportes de Celular y Cargadores Rápidos', filterParam: { categoria: 'Automotriz', q: 'soporte auto' } },
          { label: 'Transmisores FM Bluetooth', filterParam: { categoria: 'Automotriz', q: 'transmisor fm' } }
        ]
      },
      {
        id: 'mantenimiento-limpieza',
        name: 'Mantenimiento y Detailing',
        slug: 'mantenimiento-limpieza',
        items: [
          { label: 'Ver todo', isViewAll: true, filterParam: { categoria: 'Automotriz', subcategoria: 'Mantenimiento' } },
          { label: 'Arrancadores de Batería y Compresores', filterParam: { categoria: 'Automotriz', q: 'arrancador bateria' } },
          { label: 'Ceras de Carnauba y Shampoos', filterParam: { categoria: 'Automotriz', q: 'cera auto' } },
          { label: 'Paños de Microfibra y Aspiradoras de Auto', filterParam: { categoria: 'Automotriz', q: 'microfibra aspiradora auto' } }
        ]
      }
    ]
  }
];
