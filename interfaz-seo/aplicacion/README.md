# Interfaz de la tienda en línea de Casa de Jesús, A.C.

Demostración académica en Next.js 16 y React 19. Los productos, precios, inventario e ilustraciones son de ejemplo. El carrito se guarda en el navegador; el cierre de pedido y los donativos son simulados: no se procesan pagos, no se guardan pedidos y no se reservan entregas. Esta versión no se conecta a la base de datos de la actividad anterior, porque GitHub Pages solo sirve archivos estáticos.

Demostración publicada: https://goldendiegos.github.io/casa-jesus-tienda-piloto/

## Cómo ejecutarla

Requisitos: Node.js 22 o posterior.

```bash
npm install
npm test          # 12 pruebas de carrito, interacciones y metadatos
npm run dev       # servidor de desarrollo en http://localhost:3000
npm run build     # compilación de producción
```

Las pruebas corren en un DOM simulado (jsdom). No sustituyen una revisión en el navegador con teclado y consola.

## Rutas

| Ruta | Qué hace |
|---|---|
| `/` | Inicio y productos destacados |
| `/catalogo` | Búsqueda y filtro por categoría |
| `/productos/[slug]` | Detalle del producto y botón para agregar al carrito |
| `/carrito` | Cambio de cantidad, eliminación, subtotal y donativo opcional |
| `/checkout` | Resumen, punto y horario de entrega de ejemplo, sin envío de datos |
| `/donar` | Donativo independiente simulado |

## Estructura

- `app/`: páginas, metadatos SEO, `robots.js` y `sitemap.js`.
- `components/`: piezas reutilizables (tarjeta, carrito, cierre, donativo).
- `lib/`: datos de ejemplo y lógica del carrito y del donativo.
- `tests/`: pruebas automatizadas.
- `scripts/`: exportación estática y verificación de metadatos.

## SEO

Cada página tiene su propio título, descripción, H1 y texto alternativo en las imágenes. Mientras los datos sean de ejemplo, todo el sitio lleva `noindex`, el sitemap queda vacío y no se emiten URL canónicas ni datos estructurados de producto. Para publicar la tienda real hay que fijar un dominio HTTPS en `SITE_URL` y `CATALOGO_VALIDADO=true`; con eso el sitemap incluye inicio, catálogo y productos, y se emiten las canónicas. El carrito, el cierre y el donativo se quedan sin indexar. `noindex` evita que los buscadores muestren el sitio, pero no impide abrirlo con el enlace.

## Publicación en GitHub Pages

El workflow `.github/workflows/paginas-demo.yml` corre las pruebas, compila y publica cada vez que cambia `interfaz-seo/` en la rama `main`. Para compilar con la misma subruta en local:

```powershell
$env:CASA_JESUS_STATIC='1'
$env:NEXT_PUBLIC_BASE_PATH='/casa-jesus-tienda-piloto'
npm run build
```

Para un dominio propio, se deja `NEXT_PUBLIC_BASE_PATH` vacío. `npm run build:demo` genera una copia estática aparte en `../qa/` y `npm run verificar:exportacion` revisa sus metadatos.
