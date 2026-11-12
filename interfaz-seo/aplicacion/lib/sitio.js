// La URL y la indexación requieren una decisión de publicación explícita.
export function urlPublica() {
  if (process.env.CASA_JESUS_STATIC === '1') return null;
  if (process.env.CATALOGO_VALIDADO !== 'true' || !process.env.SITE_URL) return null;
  try {
    const url = new URL(process.env.SITE_URL);
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.pathname !== '/' ||
      url.search ||
      url.hash
    )
      return null;
    return url.origin;
  } catch {
    return null;
  }
}
export function canonical(ruta) {
  const base = urlPublica();
  return base ? `${base}${ruta}` : undefined;
}

// Dirección donde vive esta versión (dominio validado o la demostración publicada).
// Solo se usa para enlaces absolutos de migas de pan e imagen para compartir, no para indexar.
export function urlSitio() {
  const base = urlPublica();
  if (base) return base;
  const demo = process.env.SITIO_DEMO_URL;
  return demo && /^https:\/\/[^\s]+$/.test(demo) ? demo.replace(/\/$/, '') : null;
}

// Imagen para compartir (1200 × 630) que usan todas las rutas en Open Graph.
export const imagenCompartir = {
  url: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/imagenes/compartir-casa-de-jesus.png`,
  width: 1200,
  height: 630,
  alt: 'Tienda de demostración de Casa de Jesús: pays y galletas para compartir, con la ilustración de un pay de queso',
};
