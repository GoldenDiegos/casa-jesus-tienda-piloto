-- Versión vigente del esquema del piloto. MariaDB 10.4 / InnoDB.
-- Ya incluye la migración 001; esa migración documenta el cambio sobre la primera versión
-- y no se aplica sobre este archivo.
-- Crear una sola vez en una instancia de desarrollo; sin datos reales ni tarjetas.
CREATE DATABASE casa_jesus_piloto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE casa_jesus_piloto;

CREATE TABLE categorias (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE productos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria_id BIGINT UNSIGNED NULL,
  nombre VARCHAR(160) NOT NULL,
  descripcion TEXT,
  presentacion VARCHAR(160),
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  imagen_ruta VARCHAR(500),
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB;

CREATE TABLE puntos_entrega (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  indicaciones VARCHAR(300),
  activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE horarios_entrega (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  punto_id BIGINT UNSIGNED NOT NULL,
  inicio DATETIME NOT NULL,
  fin DATETIME NOT NULL,
  cupo INT UNSIGNED NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_horario CHECK (fin > inicio),
  CONSTRAINT fk_horario_punto FOREIGN KEY (punto_id) REFERENCES puntos_entrega(id)
) ENGINE=InnoDB;

CREATE TABLE perfiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(254) NOT NULL UNIQUE,
  rol ENUM('administradora','cliente') NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE pedidos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  folio VARCHAR(36) NOT NULL UNIQUE,
  nombre_contacto VARCHAR(160) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  correo VARCHAR(254) NULL,
  horario_id BIGINT UNSIGNED NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  donativo DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (donativo >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  estado ENUM('pendiente','pagado','en_preparacion','listo','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_total CHECK (total = subtotal + donativo),
  CONSTRAINT fk_pedido_horario FOREIGN KEY (horario_id) REFERENCES horarios_entrega(id)
) ENGINE=InnoDB;

CREATE TABLE detalle_pedido (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT UNSIGNED NOT NULL,
  producto_id BIGINT UNSIGNED NOT NULL,
  nombre_producto VARCHAR(160) NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
  cantidad INT UNSIGNED NOT NULL CHECK (cantidad > 0),
  CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

-- Los donativos de compra se guardan en pedidos.donativo. Esta tabla registra
-- donativos independientes, para impedir el doble conteo en los reportes.
CREATE TABLE donativos_independientes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  folio VARCHAR(36) NOT NULL,
  importe DECIMAL(10,2) NOT NULL,
  nombre_donante VARCHAR(160) NULL,
  anonimo BOOLEAN NOT NULL DEFAULT FALSE,
  estado ENUM('pendiente','aprobado','rechazado','cancelado') NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_donativo_folio UNIQUE (folio),
  CONSTRAINT chk_donativo_minimo CHECK (importe > 10),
  CONSTRAINT chk_donativo_nombre CHECK (anonimo OR nombre_donante IS NOT NULL)
) ENGINE=InnoDB;

CREATE TABLE pagos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT UNSIGNED NULL,
  donativo_id BIGINT UNSIGNED NULL,
  proveedor VARCHAR(80) NOT NULL,
  referencia_externa VARCHAR(160) NULL,
  importe DECIMAL(10,2) NOT NULL CHECK (importe > 0),
  estado ENUM('pendiente','aprobado','rechazado','cancelado') NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_pago_origen CHECK ((pedido_id IS NOT NULL AND donativo_id IS NULL) OR (pedido_id IS NULL AND donativo_id IS NOT NULL)),
  CONSTRAINT fk_pago_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  CONSTRAINT fk_pago_donativo FOREIGN KEY (donativo_id) REFERENCES donativos_independientes(id)
) ENGINE=InnoDB;

CREATE TABLE historial_estado_pedido (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT UNSIGNED NOT NULL,
  estado_anterior ENUM('pendiente','pagado','en_preparacion','listo','entregado','cancelado') NULL,
  estado_nuevo ENUM('pendiente','pagado','en_preparacion','listo','entregado','cancelado') NOT NULL,
  -- «sistema» es el cambio automático al verificar el aviso de pago; ahí no hay persona
  origen ENUM('administradora','sistema') NOT NULL DEFAULT 'administradora',
  actor_id BIGINT UNSIGNED NULL,
  cambiado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_historial_actor CHECK ((origen = 'administradora' AND actor_id IS NOT NULL)
                                      OR (origen = 'sistema' AND actor_id IS NULL)),
  CONSTRAINT fk_historial_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  CONSTRAINT fk_historial_actor FOREIGN KEY (actor_id) REFERENCES perfiles(id)
) ENGINE=InnoDB;
