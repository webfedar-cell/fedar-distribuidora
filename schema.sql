-- Esquema Inicial para Base de Datos MySQL FEDAR Distribuidora
-- Base de datos: fedar_distribuidora

CREATE DATABASE IF NOT EXISTS `fedar_distribuidora` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fedar_distribuidora`;

-- 1. Tabla de Categorías / Líneas de Productos
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `num` VARCHAR(10) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `short_desc` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `badge` VARCHAR(50) DEFAULT NULL,
  `icon_name` VARCHAR(50) DEFAULT 'Layers',
  `photo_label` VARCHAR(100) DEFAULT NULL,
  `description` TEXT,
  `gavetero_option` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Artículos / Medidas
CREATE TABLE IF NOT EXISTS `articulos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` VARCHAR(50) NOT NULL,
  `codigo` VARCHAR(50) DEFAULT NULL,
  `nombre` VARCHAR(200) NOT NULL,
  `medida` VARCHAR(100) DEFAULT NULL,
  `precio` DECIMAL(10,2) DEFAULT NULL,
  `unidad` VARCHAR(50) DEFAULT 'unidad',
  `stock` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categorias`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Consultas de Contacto
CREATE TABLE IF NOT EXISTS `consultas_contacto` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `comercio` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `localidad` VARCHAR(100) NOT NULL,
  `motivo` VARCHAR(100) DEFAULT NULL,
  `mensaje` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla de Solicitudes de Lista de Precios
CREATE TABLE IF NOT EXISTS `solicitudes_lista` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `comercio` VARCHAR(150) NOT NULL,
  `rubro` VARCHAR(100) NOT NULL,
  `localidad` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserción de Líneas de Productos Iniciales
INSERT INTO `categorias` (`id`, `num`, `name`, `short_desc`, `category`, `badge`, `icon_name`, `photo_label`, `description`, `gavetero_option`) VALUES
('terminales', '01', 'Terminales', 'Terminales eléctricas, automotrices y para conexiones industriales.', 'Electricidad y Automotor', 'Alta Rotación', 'Zap', 'Foto: Terminales', 'Línea completa de terminales estañadas y de bronce para conductores de cobre.', 'Gavetero de 24 y 36 cajones con surtido completo'),
('terminales-2', '02', 'Terminales Nº 2', 'Terminales especiales, fichas de acople y terminales de batería.', 'Electricidad y Automotor', 'Especiales', 'Zap', 'Foto: Terminales Nº 2', 'Terminales reforzadas para alta corriente y bornes de batería.', 'Módulo organizador de terminales pesadas'),
('conectores-terminales', '03', 'Conectores p/ terminales', 'Fichas plásticas polarizadas y carcasas para terminales pala y bala.', 'Electricidad y Conexión', 'Esencial', 'Cpu', 'Foto: Conectores p/ terminales', 'Fichas aéreas plásticas de 1 a 8 vías.', 'Organizador de fichas y carcasas'),
('borneras-union', '04', 'Borneras de unión', 'Regletas seccionables de policarbonato y borneras de potencia.', 'Electricidad y Conexión', 'Mayor rotación', 'Layers', 'Foto: Borneras de unión', 'Regletas bipolares y tripolares de conexión a tornillo.', 'Gavetero clasificado de regletas y borneras'),
('pilas-boton', '05', 'Pilas botón', 'Pilas botón de litio y alcalinas para controles, llaves y balanzas.', 'Electricidad y Accesorios', 'Alta demanda', 'Disc', 'Foto: Pilas botón', 'Línea completa de pilas botón de litio 3V y alcalinas 1.5V.', 'Exhibidor colgante de mostrador'),
('orings', '06', 'Orings', 'Juntas tóricas milimétricas y en pulgadas en goma nitrilo (NBR).', 'Estanqueidad y Fluidos', 'Top Ventas', 'CircleDot', 'Foto: Orings', 'Juntas de estanqueidad en NBR, silicona y Viton.', 'Gavetero clasificado con calibre y tabla de medidas'),
('carbones', '07', 'Carbones', 'Escobillas de carbón para motores eléctricos, alternadores y herramientas.', 'Mecánica y Repuestos', 'Repuesto clave', 'Component', 'Foto: Carbones', 'Escobillas de carbón con resorte, cable y terminal.', 'Gavetero de 20 divisiones con tabla de equivalencias'),
('regatones', '08', 'Regatones', 'Regatones plásticos y de goma exteriores e interiores para caños.', 'Fijación y Muebles', 'Ferretería', 'Layers', 'Foto: Regatones', 'Protectores y topes plásticos para caños redondos y cuadrados.', 'Gavetero amplio de 16 cajones'),
('tuercas-mariposa', '09', 'Tuercas Mariposa', 'Tuercas mariposa cincadas paso métrico e imperial para apriete manual.', 'Bulonería y Sujeción', NULL, 'Wrench', 'Foto: Tuercas mariposa', 'Tuercas mariposa en acero estampado y fundición cincada.', 'Gavetero con medidas escalonadas'),
('rulemanes', '10', 'Rulemanes', 'Rodamientos rígidos de bolas series 6000, 6200 y 6300 blindados.', 'Mecánica y Transmisión', 'Alta rotación', 'Activity', 'Foto: Rulemanes', 'Rodamientos rígidos de bolas con doble blindaje metálico y goma.', 'Módulo reforzado para rodamientos'),
('retenes', '11', 'Retenes', 'Retenes radiales para ejes con resorte en caucho nitrilo y poliacrílico.', 'Estanqueidad y Fluidos', 'Esencial', 'Disc', 'Foto: Retenes', 'Retenes radiales de aceite con labio simple y doble labio antipolvo.', 'Gavetero con clasificador por diámetro de eje')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
