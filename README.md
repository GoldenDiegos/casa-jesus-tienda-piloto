# Casa de Jesús, A.C. · piloto de la tienda en línea

Integración tecnológica del proyecto social de la materia Taller de Proyecto Social Integrador (Global University). Equipo 3: Diego David Lara Martínez y Héctor Oropeza Pelcastre.

Esta etapa deja configurada la base de datos, conectada la aplicación y documentado lo que falta. Todavía no es la tienda: no hay compras, pagos ni despliegue.

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
