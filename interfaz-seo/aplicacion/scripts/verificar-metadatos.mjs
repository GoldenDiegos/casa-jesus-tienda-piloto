// Comprueba la demostración local sin iniciar servicios ni modificar datos.
const base = 'http://127.0.0.1:3115';
const rutas = [
  '/',
  '/catalogo',
  '/productos/pay-de-queso',
  '/productos/pay-de-limon',
  '/productos/galletas-de-mantequilla',
  '/productos/galletas-de-avena',
  '/carrito',
  '/checkout',
  '/donar',
];
const titulos = new Set();
let fallos = 0;
for (const ruta of rutas) {
  try {
    const respuesta = await fetch(base + ruta, { signal: AbortSignal.timeout(5000) });
    const html = await respuesta.text();
    const titulo = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    const descripcion = /<meta name="description" content="[^"]+"/i.test(html);
    const h1 = (html.match(/<h1(?:\s[^>]*)?>/gi) || []).length;
    const noindex = /<meta name="robots" content="noindex,\s*follow"/i.test(html);
    const ogTitulo = html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1];
    const ogDescripcion = /<meta property="og:description" content="[^"]+"/i.test(html);
    const ogCorrecto = Boolean(titulo) && ogTitulo === titulo && ogDescripcion;
    const ok =
      respuesta.status === 200 &&
      Boolean(titulo) &&
      !titulos.has(titulo) &&
      descripcion &&
      h1 === 1 &&
      noindex &&
      ogCorrecto;
    if (titulo) titulos.add(titulo);
    if (!ok) fallos++;
    console.log(
      `${ok ? 'OK' : 'REVISAR'} ${ruta}: HTTP ${respuesta.status}; title=${Boolean(titulo)}; description=${descripcion}; H1=${h1}; noindex=${noindex}; Open Graph=${ogCorrecto}`,
    );
  } catch (error) {
    fallos++;
    console.error(`ERROR ${ruta}: ${error.message}`);
  }
}
if (fallos) {
  console.error(`Comprobación incompleta: ${fallos} ruta(s) requieren revisión.`);
  process.exitCode = 1;
} else
  console.log(
    'Metadatos locales revisados. Canonical y sitemap público requieren dominio y catálogo validados.',
  );
