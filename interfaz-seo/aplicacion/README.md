# Prototipo de interfaz para Casa de Jesús

Proyecto académico en Next.js y React. Los productos, precios e imágenes esquemáticas son de ejemplo; el carrito se guarda en el navegador y el cierre no crea pedidos ni procesa pagos. No usa la base local ni datos reales.

## Ejecución local

Requiere Node.js compatible con Next.js 16 y dependencias instaladas mediante `npm install`. Ejecutar `npm test` para comprobar lógica y algunas interacciones de catálogo, carrito y cierre en un DOM simulado, y `npm run build` para compilar. Con el servidor autorizado en `127.0.0.1:3115`, `npm run verificar:local` revisa las respuestas y los metadatos de las nueve rutas de demostración. Estas pruebas no sustituyen la revisión visual y de teclado en un navegador. Para iniciar un servidor de desarrollo, respetar la autorización de Diego y elegir un puerto libre separado del otro proyecto; después ejecutar `npm run dev -- --hostname 127.0.0.1 --port <puerto>`. No publicar ni abrir el servicio a internet sin decidirlo antes.

## Rutas

- `/`: inicio y productos destacados.
- `/catalogo`: búsqueda y filtro por categoría.
- `/productos/[slug]`: detalle y adición al carrito.
- `/carrito`: cambios de cantidad, eliminación y subtotal.
- `/checkout`: resumen y selección de punto y horario ficticios, sin envío de datos ni reserva real.
- `/donar`: donativo independiente simulado; el carrito también permite agregar un donativo opcional de ejemplo, sin cobros.

SEO: las páginas tienen títulos y descripciones. Durante la demostración se indica `noindex` para todo el sitio; carrito, cierre y donativos conservan `noindex` incluso después. `sitemap.xml` y las URL canónicas están preparados, pero solo incluyen rutas públicas si se fija un dominio HTTPS real en `SITE_URL` y `CATALOGO_VALIDADO=true` después de validar el catálogo y contar con autorización. Sin esa configuración el sitemap queda vacío. No se incluyen datos estructurados de ofertas ficticias.

## Exportación estática de revisión

`npm run build:demo` crea una copia aislada en `../qa/exportacion-<identificador>/` y compila una demostración estática dentro de su carpeta `.next-qa/`, sin usar la base de datos ni sobrescribir la compilación del servidor local. La exportación fuerza `noindex` y omite URL públicas, aunque existan variables de publicación en el entorno. El comando imprime la ubicación exacta. Para verificar sus archivos ejecutar `npm run verificar:exportacion -- "<ruta a .next-qa>"`.

La carpeta de copia completa contiene un enlace local a `node_modules`; no es el paquete a compartir. La exportación y cualquier versión que se vaya a subir requieren una revisión de seguridad independiente y aprobación del destino. `noindex` no impide que alguien acceda a una URL compartida.

Para GitHub Pages bajo una subruta, fijar NEXT_PUBLIC_BASE_PATH antes de compilar, por ejemplo en PowerShell: `$env:NEXT_PUBLIC_BASE_PATH='/casa-jesus-tienda-piloto'`; ejecutar `npm.cmd run build:demo`. Para dominio raiz, dejar la variable vacia. La subruta queda incorporada al build; cambiarla requiere recompilar. Los enlaces Next.js, recursos e imagenes comparten ese prefijo. La exportacion incluye `.nojekyll` para conservar `_next`. Verificar con `npm.cmd run verificar:exportacion -- "<ruta a .next-qa>" /casa-jesus-tienda-piloto`. Compartir solamente el contenido estatico de `.next-qa`, nunca su carpeta padre. La ejecucion local habitual permanece en la raiz si no se fija la variable.
