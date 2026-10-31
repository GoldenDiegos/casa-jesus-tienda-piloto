-- 001 · 30/10/2026 · Ajustes tras la revisión del modelo contra R-008 y R-017.
-- 1) El cambio a «pagado» lo hace el sistema al verificar el aviso de Mercado Pago, sin persona:
--    actor_id pasa a opcional y se agrega el origen del cambio. Los estados usan el mismo ENUM que pedidos.
-- 2) El donativo sin compra necesita folio para su comprobante, nombre opcional (anónimo)
--    y un importe mayor a $10 (R-008).
-- Se aplicó con las tablas vacías; no hay datos que migrar.
-- esquema_casa_jesus.sql ya trae este cambio: esta migración es solo para una base creada con la primera versión.
USE casa_jesus_piloto;

ALTER TABLE historial_estado_pedido
  MODIFY estado_anterior ENUM('pendiente','pagado','en_preparacion','listo','entregado','cancelado') NULL,
  MODIFY estado_nuevo ENUM('pendiente','pagado','en_preparacion','listo','entregado','cancelado') NOT NULL,
  ADD COLUMN origen ENUM('administradora','sistema') NOT NULL DEFAULT 'administradora' AFTER estado_nuevo,
  MODIFY actor_id BIGINT UNSIGNED NULL;

ALTER TABLE historial_estado_pedido
  ADD CONSTRAINT chk_historial_actor CHECK ((origen = 'administradora' AND actor_id IS NOT NULL)
                                          OR (origen = 'sistema' AND actor_id IS NULL));

ALTER TABLE donativos_independientes
  ADD COLUMN folio VARCHAR(36) NOT NULL AFTER id,
  ADD COLUMN nombre_donante VARCHAR(160) NULL AFTER importe,
  ADD CONSTRAINT uq_donativo_folio UNIQUE (folio);

-- En MariaDB 10.4 el CHECK escrito junto a la columna se quita redefiniendo la columna
ALTER TABLE donativos_independientes MODIFY importe DECIMAL(10,2) NOT NULL;

ALTER TABLE donativos_independientes
  ADD CONSTRAINT chk_donativo_minimo CHECK (importe > 10),
  ADD CONSTRAINT chk_donativo_nombre CHECK (anonimo OR nombre_donante IS NOT NULL);
