# Aplicación del piloto

Proyecto Next.js que ya se conecta con la base MariaDB local. Todavía no es la tienda: no tiene compras, pagos, autenticación ni despliegue.

La contraseña va en `.env.local`, que no se sube a Git; `.env.example` trae las variables sin valores. La cuenta que usa la aplicación solo puede leer la tabla `productos`, y cada etapa le sumará solo los permisos que necesite.

Con la instancia del piloto encendida:

- `npm run comprobar:bd` cuenta los productos con el mismo `lib/bd.mjs` que usa la página.
- `npm run comprobar:permisos` confirma que borrar, insertar y leer pedidos se rechaza.
- `npm run build` compila sin levantar el servidor.

La página se probó en el navegador con `npx next start -p 3100 -H 127.0.0.1`.

La conexión apunta solo a `127.0.0.1:3307`, así que no funciona desde Vercel ni desde otra computadora. Para publicar falta elegir una base en la nube (ver `../BITACORA.md`).
