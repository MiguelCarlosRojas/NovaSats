export interface CategoryDefinition {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  subcategories: string[];
}

export const CATEGORY_CATALOG: CategoryDefinition[] = [
  {
    id: 'tecnologia',
    name: 'Tecnología',
    slug: 'tecnologia',
    iconName: 'Cpu',
    description: 'Hardware, cómputo, componentes, consolas y dispositivos cripto',
    subcategories: [
      'Computación y Laptops',
      'Tablets e iPads',
      'Consolas y Videojuegos',
      'TV, Audio y Video',
      'Hardware Wallets & Cripto',
      'Almacenamiento y Discos',
      'Cámaras y Fotografía',
      'Impresión y Escáneres',
      'Monitores y Proyectores'
    ]
  },
  {
    id: 'electrohogar',
    name: 'Electrohogar',
    slug: 'electrohogar',
    iconName: 'Home',
    description: 'Línea blanca, climatización y pequeños electrodomésticos para el hogar',
    subcategories: [
      'Refrigeración',
      'Lavado y Secado',
      'Climatización y Aire',
      'Microondas y Hornos',
      'Aspiradoras y Limpieza',
      'Licuadoras y Batidoras',
      'Cafeteras y Teteras',
      'Freidoras de Aire y Parrillas Eléctricas'
    ]
  },
  {
    id: 'telefonia-accesorios',
    name: 'Telefonía y Accesorios',
    slug: 'telefonia-y-accesorios',
    iconName: 'Smartphone',
    description: 'Smartphones, smartwatches, cargadores, fundas y periféricos móviles',
    subcategories: [
      'Celulares y Smartphones',
      'Smartwatches y Smartbands',
      'Audífonos y Manos Libres',
      'Cargadores y Baterías Externas',
      'Fundas y Carcasas',
      'Protectores de Pantalla',
      'Cables y Adaptadores',
      'Soportes y Accesorios para Celular'
    ]
  },
  {
    id: 'muebles-organizacion',
    name: 'Muebles y Organización',
    slug: 'muebles-y-organizacion',
    iconName: 'Armchair',
    description: 'Mobiliario para sala, comedor, oficinas y soluciones de organización',
    subcategories: [
      'Muebles de Sala',
      'Muebles de Comedor',
      'Escritorios y Sillas Ergonómicas',
      'Estantes y Libreros',
      'Roperos y Clósets',
      'Zapateras y Cómodas',
      'Organizadores y Cajas'
    ]
  },
  {
    id: 'dormitorio-bano',
    name: 'Dormitorio y Baño',
    slug: 'dormitorio-y-bano',
    iconName: 'Bed',
    description: 'Colchones, ropa de cama, almohadas, toallas y grifería de baño',
    subcategories: [
      'Colchones y Box Tarimas',
      'Sábanas y Fundas',
      'Edredones y Cubrecamas',
      'Almohadas y Cobertores',
      'Toallas de Baño',
      'Cortinas y Accesorios de Baño',
      'Muebles de Baño'
    ]
  },
  {
    id: 'mujer',
    name: 'Mujer',
    slug: 'mujer',
    iconName: 'Sparkles',
    description: 'Moda femenina, prendas de vestir, lencería, abrigos y ropa deportiva',
    subcategories: [
      'Blusas y Polos',
      'Vestidos y Faldas',
      'Pantalones y Jeans',
      'Casacas y Abrigos',
      'Ropa Deportiva Mujer',
      'Lencería y Pijamas',
      'Trajes de Baño',
      'Sweaters y Chompas'
    ]
  },
  {
    id: 'hombre',
    name: 'Hombre',
    slug: 'hombre',
    iconName: 'Shirt',
    description: 'Moda masculina, camisas, pantalones, trajes formales y ropa deportiva',
    subcategories: [
      'Polos y Camisas',
      'Pantalones y Jeans',
      'Casacas y Chompas',
      'Ropa Deportiva Hombre',
      'Trajes y Sacos Formales',
      'Ropa Interior y Medias',
      'Shorts y Bermudas'
    ]
  },
  {
    id: 'belleza',
    name: 'Belleza',
    slug: 'belleza',
    iconName: 'Gem',
    description: 'Cuidado facial, maquillaje, perfumería de alta gama y cuidado capilar',
    subcategories: [
      'Cuidado Facial y Sérums',
      'Maquillaje',
      'Perfumes y Colonias',
      'Cuidado del Cabello',
      'Cuidado Corporal',
      'Bloqueadores y Protectores Solares',
      'Manicure y Pedicure'
    ]
  },
  {
    id: 'accesorios-moda',
    name: 'Accesorios Moda',
    slug: 'accesorios-moda',
    iconName: 'Watch',
    description: 'Relojes, carteras, mochilas, lentes de sol, joyería y bisutería',
    subcategories: [
      'Relojes',
      'Carteras y Bolsos',
      'Mochilas y Billeteras',
      'Lentes de Sol',
      'Joyería y Bisutería',
      'Gorros, Sombreros y Bufandas',
      'Cinturones y Billeteras'
    ]
  },
  {
    id: 'calzado',
    name: 'Calzado',
    slug: 'calzado',
    iconName: 'Footprints',
    description: 'Zapatillas urbanas, deportivas, calzado formal, botas y sandalias',
    subcategories: [
      'Zapatillas Urbanas',
      'Zapatillas Deportivas',
      'Zapatos Formales',
      'Botas y Botines',
      'Sandalias y Pantuflas',
      'Calzado Confort y Ortopédico'
    ]
  },
  {
    id: 'ninos-juguetes',
    name: 'Niños y Juguetes',
    slug: 'ninos-y-juguetes',
    iconName: 'Gamepad2',
    description: 'Juguetes didácticos, figuras de acción, juegos de mesa y entretenimiento infantil',
    subcategories: [
      'Figuras de Acción y Muñecos',
      'Juegos de Mesa y Puzzles',
      'Bloques de Construcción',
      'Juguetes Educativos y Didácticos',
      'Scooters, Patines y Triciclos',
      'Muñecas y Peluches',
      'Pistas y Autos a Escala'
    ]
  },
  {
    id: 'bebes',
    name: 'Bebés',
    slug: 'bebes',
    iconName: 'Baby',
    description: 'Coches, cunas, lactancia, pañales y cuidado especializado para el bebé',
    subcategories: [
      'Coches y Sillas para Auto',
      'Cunas, Moisés y Corrales',
      'Biberones y Lactancia',
      'Pañales y Toallitas Húmedas',
      'Ropa para Bebé',
      'Juguetes de Estimulación Temprana',
      'Higiene y Baño del Bebé'
    ]
  },
  {
    id: 'deportes-aire-libre',
    name: 'Deportes y aire libre',
    slug: 'deportes-y-aire-libre',
    iconName: 'Bike',
    description: 'Bicicletas, máquinas de fitness, indumentaria deportiva y camping',
    subcategories: [
      'Ciclismo y Bicicletas',
      'Fitness y Máquinas de Ejercicio',
      'Mancuernas y Pesas',
      'Camping y Senderismo',
      'Fútbol y Deportes de Pelota',
      'Natación y Deportes Acuáticos',
      'Accesorios de Entrenamiento'
    ]
  },
  {
    id: 'salud-bienestar',
    name: 'Salud y Bienestar',
    slug: 'salud-y-bienestar',
    iconName: 'HeartPulse',
    description: 'Suplementos nutricionales, tensiómetros, cuidado personal y ortopedia',
    subcategories: [
      'Suplementos y Vitaminas',
      'Tensiómetros y Termómetros',
      'Masajeadores y Relajación',
      'Cuidado Bucal',
      'Ortopedia y Soporte Muscular',
      'Purificadores de Aire y Difusores'
    ]
  },
  {
    id: 'cocina-menaje',
    name: 'Cocina y menaje',
    slug: 'cocina-y-menaje',
    iconName: 'UtensilsCrossed',
    description: 'Ollas, sartenes, vajillas, copas, cubiertos y utensilios gastronómicos',
    subcategories: [
      'Ollas y Sartenes',
      'Vajilla y Platos',
      'Vasos, Copas y Tazas',
      'Cubiertos y Cuchillos de Cocina',
      'Utensilios y Repostería',
      'Herméticos y Almacenamiento de Alimentos',
      'Botellas y Termos'
    ]
  },
  {
    id: 'decoracion-iluminacion',
    name: 'Decoración e Iluminación',
    slug: 'decoracion-e-iluminacion',
    iconName: 'Lightbulb',
    description: 'Lámparas de techo, foco led, cuadros, espejos, cortinas y alfombras',
    subcategories: [
      'Lámparas y Focos LED',
      'Cuadros y Espejos',
      'Cortinas y Persianas',
      'Alfombras y Tapetes',
      'Cojines Decorativos y Mantas',
      'Floreros, Velas y Aromatizadores'
    ]
  },
  {
    id: 'jardin-terraza',
    name: 'Jardín y terraza',
    slug: 'jardin-y-terraza',
    iconName: 'Flower2',
    description: 'Muebles de exterior, parrillas, macetas, jardinería y piscinas',
    subcategories: [
      'Muebles de Terraza',
      'Parrillas y Asadores',
      'Macetas y Plantas',
      'Mangueras y Riego',
      'Herramientas de Jardinería',
      'Toldos y Sombrillas de Terraza',
      'Piscinas y Accesorios'
    ]
  },
  {
    id: 'mascotas',
    name: 'Mascotas',
    slug: 'mascotas',
    iconName: 'PawPrint',
    description: 'Alimento, camas, accesorios y cuidado para perros, gatos y más',
    subcategories: [
      'Alimento para Perros',
      'Alimento para Gatos',
      'Camas y Casas',
      'Juguetes para Mascotas',
      'Correas, Arneses y Collares',
      'Higiene, Areneros y Baño',
      'Rascadores y Transportadores'
    ]
  },
  {
    id: 'otras-categorias',
    name: 'Otras categorías',
    slug: 'otras-categorias',
    iconName: 'MoreHorizontal',
    description: 'Libros, papelería, instrumentos musicales, viajes y coleccionables',
    subcategories: [
      'Libros y Criptoeducación',
      'Papelería y Útiles de Oficina',
      'Instrumentos Musicales',
      'Maletas, Mochilas de Viaje y Equipaje',
      'Arte y Coleccionables',
      'Regalos y Ocasiones Especiales'
    ]
  },
  {
    id: 'mejoramiento-hogar-construccion',
    name: 'Mejoramiento del Hogar y Construcción',
    slug: 'mejoramiento-del-hogar-y-construccion',
    iconName: 'Hammer',
    description: 'Herramientas eléctricas, pinturas, electricidad, grifería y seguridad',
    subcategories: [
      'Herramientas Eléctricas',
      'Herramientas Manuales',
      'Pinturas y Brochas',
      'Electricidad y Domótica',
      'Grifería y Sanitarios',
      'Cerraduras y Seguridad Hogar',
      'Pisos y Revestimientos'
    ]
  },
  {
    id: 'automotriz',
    name: 'Automotriz',
    slug: 'automotriz',
    iconName: 'Car',
    description: 'Llantas, baterías, electrónica para autos, cascos y accesorios vehiculares',
    subcategories: [
      'Llantas y Neumáticos',
      'Baterías y Mantenimiento',
      'Audio y Electrónica para Autos',
      'Accesorios de Interior y Exterior',
      'Limpieza y Cuidado Automotriz',
      'Cascos y Equipamiento para Motos',
      'Soportes y Cargadores de Auto'
    ]
  }
];

export const CATEGORY_NAMES = CATEGORY_CATALOG.map((c) => c.name);

export function getCategoryDefinition(nameOrSlug: string): CategoryDefinition | undefined {
  if (!nameOrSlug) return undefined;
  const clean = nameOrSlug.toLowerCase().trim();
  return CATEGORY_CATALOG.find(
    (c) => c.name.toLowerCase() === clean || c.slug.toLowerCase() === clean || c.id === clean
  );
}

export function getSubcategoriesForCategory(categoryName: string): string[] {
  const cat = getCategoryDefinition(categoryName);
  return cat ? cat.subcategories : [];
}

export function findCategoryBySubcategory(subcategoryName: string): CategoryDefinition | undefined {
  if (!subcategoryName) return undefined;
  const clean = subcategoryName.toLowerCase().trim();
  return CATEGORY_CATALOG.find((c) =>
    c.subcategories.some((s) => s.toLowerCase() === clean)
  );
}
