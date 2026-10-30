# Bitácora técnica: integración del piloto

Tienda en línea de Casa de Jesús, A.C. · Diego David Lara Martínez.

| Fecha | Qué se hizo o se decidió | Dificultad y cómo se resolvió |
|---|---|---|
| 28 oct 2026 | Revisión de la guía y de los requisitos del Parcial 1 (R-001 a R-030); plan de trabajo. | Ninguna. |
| 30 oct 2026 | Se cambió Supabase/PostgreSQL por MariaDB local. | No había proyecto de Supabase y XAMPP ya estaba instalado. Se pierden autenticación y almacenamiento integrados; quedan pendientes. |
| 30 oct 2026 | Base `casa_jesus_piloto` con el esquema `esquema_casa_jesus.sql`: 10 tablas, 9 claves foráneas, 13 reglas CHECK. | El puerto 3306 lo usa otro proyecto. Primero se creó ahí y después se pasó a una instancia propia en 3307 con su carpeta de datos (`entorno_local/datos`). La base vacía del 3306 se retirará después. |
| 30 oct 2026 | Scripts `iniciar_base.ps1` y `detener_base.ps1`. | Antes de arrancar comprueban que el 3307 sea de esta carpeta de datos, para no tocar la otra instancia. |
| 30 oct 2026 | Prueba de reglas con cuatro datos inválidos (precio negativo, categoría inexistente, donativo de $5, pago sin origen). | Se hizo dentro de una transacción con ROLLBACK para no dejar registros. Los cuatro se rechazaron. |
| 30 oct 2026 | Migración `migraciones/001_historial_y_donativos.sql`: el historial registra si el cambio lo hizo la administradora o el sistema; el donativo sin compra tiene folio, nombre opcional y mínimo mayor a $10 (R-008, R-017). Quedan 13 reglas CHECK. | El cambio a «pagado» lo hace el servidor sin persona y la regla anterior no lo permitía. En MariaDB 10.4 la regla escrita junto a la columna no se borra con DROP CONSTRAINT; se quitó redefiniendo la columna. |
| 30 oct 2026 | Proyecto Next.js 16 con `lib/bd.mjs` (mysql2) y cuenta `cj_piloto_lectura` con SELECT solo sobre `productos`. | La contraseña va en `aplicacion/.env.local`, excluido de Git. |
| 30 oct 2026 | `npm run comprobar:bd`, `npm run comprobar:permisos` y `npm run build`. | Borrar, insertar y leer pedidos se rechazan, como se esperaba. |
| 30 oct 2026 | Página probada en el navegador con `next start` en 127.0.0.1:3100. | Se levantó solo para la prueba y se apagó. |
| 30 oct 2026 | Repositorio público en GitHub. | Se revisó qué archivos se subían antes del primer push. |
| 30 oct 2026 | Mercado Pago se deja para la etapa de programación. | La tabla `pagos` ya está lista para guardar la referencia del cobro. |

## Riesgos y pendientes

- La cuenta `root` de la instancia local no tiene contraseña. Solo acepta conexiones de la misma computadora; se le pondrá antes de guardar datos reales.
- Vercel no puede conectarse a una base que solo escucha en 127.0.0.1. Falta elegir una base en la nube (compatible con MySQL, o volver a Supabase).
- El cupo por horario y la regla de al menos un producto por pedido se controlarán en el servidor, dentro de una transacción.
- Pendientes: Mercado Pago en modo de prueba, Resend, autenticación de la administradora y almacenamiento de imágenes.

Las evidencias de cada paso están en `evidencias/` y se regeneran con `python evidencias/generar_evidencias.py` (con la instancia 3307 encendida).
