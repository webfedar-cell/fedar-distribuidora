export interface ProductItem {
  id: string;
  num: string;
  name: string;
  shortDesc: string;
  category: string;
  badge?: string;
  iconName: string;
  description: string;
  items: string[];
  popularIn: string[];
  gaveteroOption?: string;
  photoLabel?: string;
  imageUrl?: string;
  subCategory?: string;
}

export const CATEGORIES_LIST: ProductItem[] = [
  {
    id: "terminales",
    num: "01",
    name: "Terminales",
    photoLabel: "Foto: Terminales",
    shortDesc: "Terminales eléctricas, automotrices y para conexiones industriales.",
    category: "Electricidad y Automotor",
    badge: "Alta Rotación",
    iconName: "Zap",
    description:
      "Línea completa de terminales estañadas y de bronce para conductores de cobre. Aptas para instalaciones eléctricas de automotores, tableros industriales y línea blanca.",
    items: [
      "Terminales Ojal (todas las medidas y bocas)",
      "Terminales Pala macho y hembra con traba",
      "Terminales Horquilla y Horquilla abierta",
      "Terminales Bala cilíndricos y enchufables",
      "Terminales Punteras huecas aisladas y sin aislar",
      "Manguitos de empalme a compresión",
    ],
    popularIn: ["Talleres mecánicos", "Electricidad del automotor", "Ferreterías"],
    gaveteroOption: "Gavetero de 24 y 36 cajones con surtido completo",
  },
  {
    id: "terminales-2",
    num: "02",
    name: "Terminales Nº 2",
    photoLabel: "Foto: Terminales Nº 2",
    shortDesc: "Terminales especiales, fichas de acople y terminales de batería.",
    category: "Electricidad y Automotor",
    badge: "Especiales",
    iconName: "Zap",
    description:
      "Terminales reforzadas para alta corriente, bornes de batería en bronce y plomo, terminales de compresión de alta sección y fichas de empalme.",
    items: [
      "Terminales para borne de batería positivos y negativos",
      "Terminales reforzadas de potencia (10mm a 70mm)",
      "Terminales tipo espada y bandera",
      "Terminales preaisladas termocontraíbles con estaño",
      "Conectores rápidos vampiro de derivación",
    ],
    popularIn: ["Electricidad pesada", "Talleres de batería", "Casas de repuestos"],
    gaveteroOption: "Módulo organizador de terminales pesadas",
  },
  {
    id: "conectores-terminales",
    num: "03",
    name: "Conectores p/ terminales",
    photoLabel: "Foto: Conectores p/ terminales",
    shortDesc: "Fichas plásticas polarizadas y carcasas para terminales pala y bala.",
    category: "Electricidad y Conexión",
    badge: "Esencial",
    iconName: "Cpu",
    description:
      "Fichas aéreas plásticas de 1 a 8 vías para terminales tipo pala y bala. Material autoextinguible resistente a vibraciones y temperatura automotriz.",
    items: [
      "Fichas de 1, 2, 3, 4, 6 y 8 vías",
      "Fichas estancas tipo Superseal",
      "Capuchones aislantes de silicona y goma",
      "Portafusibles aéreos y fichas para relés",
      "Trabas de seguridad plásticas para terminales",
    ],
    popularIn: ["Electricistas del automotor", "Talleres de motos", "Ferreterías"],
    gaveteroOption: "Organizador de fichas y carcasas",
  },
  {
    id: "borneras-union",
    num: "04",
    name: "Borneras de unión",
    photoLabel: "Foto: Borneras de unión",
    shortDesc: "Regletas seccionables de policarbonato y borneras de potencia.",
    category: "Electricidad y Conexión",
    badge: "Mayor rotación",
    iconName: "Layers",
    description:
      "Regletas bipolares y tripolares de conexión a tornillo, borneras de empalme de 6A hasta 100A, aptas para tableros eléctricos y empalmes industriales seguros.",
    items: [
      "Regletas de 6A, 10A, 16A, 25A, 40A y 60A",
      "Borneras para riel DIN y chasis",
      "Conectores de empalme rápido tipo palanca",
      "Capuchones roscados de empalme",
      "Borneras de distribución de tierra y neutro",
    ],
    popularIn: ["Instaladores electricistas", "Ferreterías industriales", "Buloneras"],
    gaveteroOption: "Gavetero clasificado de regletas y borneras",
  },
  {
    id: "pilas-boton",
    num: "05",
    name: "Pilas botón",
    photoLabel: "Foto: Pilas botón",
    shortDesc: "Pilas botón de litio y alcalinas para controles, llaves y balanzas.",
    category: "Electricidad y Accesorios",
    badge: "Alta demanda",
    iconName: "Disc",
    description:
      "Línea completa de pilas botón de máxima duración: litio 3V (CR2032, CR2016, CR2025, CR2450) y alcalinas 1.5V (LR44, LR43, LR1130) para telecomandos, llaves codificadas y dispositivos electrónicos.",
    items: [
      "CR2032, CR2025, CR2016 (Litio 3V)",
      "CR2450, CR1620, CR1220",
      "LR44 / AG13, LR43, LR1130 / AG10",
      "Pilas A23 y A27 (12V para controles de portón)",
      "Blísters individuales y cajas cerradas x 5 / x 20",
    ],
    popularIn: ["Cerrajerías", "Casas de repuestos", "Ferreterías", "Talleres de alarmas"],
    gaveteroOption: "Exhibidor colgante de mostrador",
  },
  {
    id: "orings",
    num: "06",
    name: "Orings",
    photoLabel: "Foto: Orings",
    shortDesc: "Juntas tóricas milimétricas y en pulgadas en goma nitrilo (NBR).",
    category: "Estanqueidad y Fluidos",
    badge: "Top Ventas",
    iconName: "CircleDot",
    description:
      "Juntas de estanqueidad en NBR (Buna-N), silicona y Viton. Medidas en milímetros (DIN) y pulgadas (SAE/AS-568). Resistentes a aceites, combustibles, gas y agua.",
    items: [
      "O-rings milimétricos (diámetros 2mm a 150mm)",
      "O-rings en pulgadas (secciones estándar 1/16 a 1/4)",
      "Cajas surtidas universales de 382 y 404 piezas",
      "Cordones continuos de oring para empalmar",
      "Adhesivos cianoacrilato para juntas",
    ],
    popularIn: ["Talleres hidráulicos", "Repuesteras de motos y autos", "Buloneras"],
    gaveteroOption: "Gavetero clasificado con calibre y tabla de medidas",
  },
  {
    id: "carbones",
    num: "07",
    name: "Carbones",
    photoLabel: "Foto: Carbones",
    shortDesc: "Escobillas de carbón para motores eléctricos, alternadores y herramientas.",
    category: "Mecánica y Repuestos",
    badge: "Repuesto clave",
    iconName: "Component",
    description:
      "Escobillas de carbón con resorte, cable y terminal para motores de arranque, alternadores, amoladoras, taladros y electrodomésticos.",
    items: [
      "Carbones para alternadores y arranques automotrices",
      "Carbones para herramientas eléctricas (Bosch, DeWalt, Makita)",
      "Carbones con resorte y plaqueta de cobre",
      "Carbones para bombas de agua y forzadores",
      "Juegos surtidos para mostrador",
    ],
    popularIn: ["Bobinadores", "Talleres de herramientas", "Electricidad del automotor"],
    gaveteroOption: "Gavetero de 20 divisiones con tabla de equivalencias",
  },
  {
    id: "regatones",
    num: "08",
    name: "Regatones",
    photoLabel: "Foto: Regatones",
    shortDesc: "Regatones plásticos y de goma exteriores e interiores para caños.",
    category: "Fijación y Muebles",
    badge: "Ferretería",
    iconName: "Layers",
    description:
      "Protectores y topes plásticos para caños redondos, cuadrados y rectangulares. Fabricados en polietileno de alta resistencia al impacto y goma antideslizante.",
    items: [
      "Regatones exteriores redondos de 1/2 a 2 pulgadas",
      "Regatones interiores con aletas para caño estructural",
      "Regatones cuadrados (15x15 a 50x50mm)",
      "Regatones rectangulares (20x30 a 40x80mm)",
      "Regatones inclinados y niveladores con rosca",
    ],
    popularIn: ["Ferreterías", "Herrerías", "Fábricas de muebles y estructuras"],
    gaveteroOption: "Gavetero amplio de 16 cajones",
  },
  {
    id: "tuercas-mariposa",
    num: "09",
    name: "Tuercas Mariposa",
    photoLabel: "Foto: Tuercas mariposa",
    shortDesc: "Tuercas mariposa cincadas paso métrico e imperial para apriete manual.",
    category: "Bulonería y Sujeción",
    iconName: "Wrench",
    description:
      "Tuercas mariposa en acero estampado y fundición cincada (DIN 315). Permiten un apriete manual firme sin necesidad de herramientas.",
    items: [
      "Tuercas mariposa métricas de M4, M5, M6, M8, M10 y M12",
      "Tuercas mariposa en pulgadas (3/16, 1/4, 5/16, 3/8, 1/2 W)",
      "Tuercas mariposa en acero inoxidable AISI 304",
      "Arandelas de apoyo y arandelas Grower complementarias",
      "Tornillos mariposa con rosca macho",
    ],
    popularIn: ["Buloneras", "Ferreterías", "Industrias de armado rápido"],
    gaveteroOption: "Gavetero con medidas escalonadas",
  },
  {
    id: "rulemanes",
    num: "10",
    name: "Rulemanes",
    photoLabel: "Foto: Rulemanes",
    shortDesc: "Rodamientos rígidos de bolas series 6000, 6200 y 6300 blindados.",
    category: "Mecánica y Transmisión",
    badge: "Alta rotación",
    iconName: "Activity",
    description:
      "Rodamientos rígidos de bolas con doble blindaje metálico (ZZ) y de goma (2RS). Ideales para alternadores, motores eléctricos, patines, bombas y maquinaria liviana.",
    items: [
      "Serie 6000 (6000 a 6008 ZZ / 2RS)",
      "Serie 6200 (6200 a 6208 ZZ / 2RS)",
      "Serie 6300 (6300 a 6306 ZZ / 2RS)",
      "Rodamientos miniatura (608 para rollers/ventiladores)",
      "Grasas especiales para rodamientos",
    ],
    popularIn: ["Talleres de motos", "Casas de rulemanes", "Ferreterías industriales"],
    gaveteroOption: "Módulo reforzado para rodamientos",
  },
  {
    id: "retenes",
    num: "11",
    name: "Retenes",
    photoLabel: "Foto: Retenes",
    shortDesc: "Retenes radiales para ejes con resorte en caucho nitrilo y poliacrílico.",
    category: "Estanqueidad y Fluidos",
    badge: "Esencial",
    iconName: "Disc",
    description:
      "Retenes radiales de aceite con labio simple y doble labio antipolvo con resorte toroidal de acero. Excelente resistencia a aceites minerales, grasa y temperaturas de trabajo hasta 120°C.",
    items: [
      "Retenes milimétricos (ejes de 10mm a 90mm)",
      "Retenes para cajas reductoras y bombas de agua",
      "Retenes para cigüeñal y árbol de levas",
      "Retenes doble labio tipo TC / DB",
      "Retenes en viton para alta temperatura",
    ],
    popularIn: ["Talleres mecánicos", "Rectificadoras", "Repuesteras automotor"],
    gaveteroOption: "Gavetero con clasificador por diámetro de eje",
  },
];

export const COMPANY_DATA = {
  name: "FEDAR",
  fullName: "FEDAR Distribuidora Mayorista",
  slogan: "Accesorios para ferreterías, buloneras y repuesteros",
  phone: "(011) 4880-6934",
  phoneRaw: "01148806934",
  whatsapp: "11 2874-3375",
  whatsappNumber: "5491128743375",
  whatsappMessage: "Hola FEDAR! Quisiera consultar por la lista de precios y el sistema de gaveteros.",
  whatsappUrl: "https://wa.me/5491128743375?text=Hola%20FEDAR!%20Quisiera%20consultar%20por%20la%20lista%20de%20precios%20y%20el%20sistema%20de%20gaveteros.",
  email: "ventas@fedardistribuidora.com.ar",
  address: "Buenos Aires, Argentina",
  shipping: "Envíos a todo el país por el transporte de tu elección",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  hours: "Lunes a Viernes de 8:00 a 18:00 hs",
};
