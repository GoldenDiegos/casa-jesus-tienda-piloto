# Aplicación inicial del piloto

Proyecto Next.js mínimo para documentar la integración con MariaDB local. No es todavía la tienda: no implementa compras, pagos, autenticación ni despliegue.

La configuración local está en `.env.local`, excluida de Git. No compartirla. `.env.example` describe las variables sin credenciales. La cuenta local actual solo puede consultar la tabla de productos; deberá revisarse antes de añadir operaciones.

Con la instancia del piloto encendida, `npm run comprobar:bd` consulta el conteo de productos mediante el mismo módulo de servidor que utiliza la página. `npm run build` verifica la compilación sin arrancar un servidor web. La página se probó en el navegador con `npx next start -p 3100 -H 127.0.0.1`.

La conexión apunta únicamente a `127.0.0.1:3307`: no funciona desde Vercel ni desde otra computadora. La arquitectura de producción y sus credenciales requieren una decisión separada.
