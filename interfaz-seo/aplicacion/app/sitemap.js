import { productos } from '../lib/productos';
import { urlPublica } from '../lib/sitio';
export const dynamic = 'force-static';

export default function sitemap() {
  const base = urlPublica();
  if (!base) return [];
  return [
    '/',
    '/catalogo',
    ...productos.filter((p) => p.disponible !== false).map((p) => `/productos/${p.slug}`),
  ].map((ruta) => ({
    url: `${base}${ruta}`,
  }));
}
