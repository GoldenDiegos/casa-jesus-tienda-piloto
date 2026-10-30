# Casa de Jesús, A.C. · piloto de la tienda en línea

Integración tecnológica del proyecto social de la materia Taller de Proyecto Social Integrador (Global University). Equipo 3: Diego David Lara Martínez y Héctor Oropeza Pelcastre.

Esta etapa deja configurada la base de datos, conectada la aplicación y documentado lo que falta. Todavía no es la tienda: no hay compras, pagos ni despliegue.

## Entregables de la guía

El documento completo (`Equipo3_Integracion_Tecnologica.pdf`) se entregó en Classroom. Aquí está lo que lo respalda:

| # | Entregable | Dónde está |
|---|---|---|
| 1 | Diagrama de arquitectura tecnológica | [`graficas/fig1_arquitectura.png`](graficas/fig1_arquitectura.png): conexiones comprobadas, previstas y pendientes |
| 2 | Ficha de tecnologías | [Ficha de tecnologías](#ficha-de-tecnologías), abajo, y Tabla 2 del documento |
| 3 | Diseño inicial de la base de datos | [`esquema_casa_jesus.sql`](esquema_casa_jesus.sql), [`migraciones/`](migraciones/) y [`graficas/fig3_modelo_datos.png`](graficas/fig3_modelo_datos.png) |
| 4 | Evidencia de configuración e integración | [`evidencias/`](evidencias/): 01 a 05 base de datos, 06 a 09 conexión de la aplicación, 10 página en el navegador |
| 5 | Mapa del flujo de datos | [`graficas/fig2_flujo_datos.png`](graficas/fig2_flujo_datos.png) |
| 6 | Bitácora técnica | [`BITACORA.md`](BITACORA.md): qué se hizo, decisiones, dificultades y pendientes |
| 7 | Video del equipo (Canva, 5 a 7 min) | Enlace en el documento de Classroom |

## Ficha de tecnologías

| Tecnología | Para qué | Estado |
|---|---|---|
| MariaDB 10.4 (InnoDB) | Catálogo, pedidos, donativos, pagos y entregas | Configurada y comprobada (127.0.0.1:3307) |
| Next.js 16.4 y React 19.3 | Páginas y código de servidor | Compila y lee la base; probada en el navegador |
| mysql2 | Conexión de Next.js con MariaDB con consultas preparadas | Conectado con una cuenta de solo lectura |
| Git y GitHub | Control de versiones del código | Este repositorio |
| Vercel | Publicar la tienda | Pendiente: necesita una base en la nube |
| Mercado Pago Checkout Pro | Cobro en modo de prueba sin ver la tarjeta | Pendiente para la etapa de programación |
| Resend | Correo con el folio | Previsto |
| Autenticación y almacenamiento | Panel de la administradora e imágenes | Pendiente de elegir |

El Parcial 1 proponía Supabase con PostgreSQL. Se usó MariaDB local porque no había proyecto de Supabase y XAMPP ya estaba instalado; a cambio, la autenticación y el almacenamiento hay que resolverlos aparte.

## Archivos

| Carpeta o archivo | Contenido |
|---|---|
| `esquema_casa_jesus.sql` | Esquema MariaDB 10.4 / InnoDB: 10 tablas, 9 claves foráneas, 13 reglas CHECK |
| `migraciones/` | Cambios al esquema después de su creación, en orden |
| `entorno_local/` | Scripts para iniciar y detener la instancia del piloto en 127.0.0.1:3307 |
| `aplicacion/` | Next.js 16 con conexión de solo lectura (mysql2) y scripts de comprobación |
| `evidencias/` | Salida real de las comprobaciones y el script que las genera |
| `graficas/` | Arquitectura, flujo de datos y modelo relacional |
| `BITACORA.md` | Qué se configuró, decisiones, dificultades y pendientes |

## Comprobar

```powershell
entorno_local\iniciar_base.ps1
cd aplicacion
copy .env.example .env.local   # y llenar DB_PASSWORD
npm install
npm run comprobar:bd
npm run comprobar:permisos
npm run build
```

Las credenciales nunca se suben: `.env.local` y la carpeta de datos están en `.gitignore`.
