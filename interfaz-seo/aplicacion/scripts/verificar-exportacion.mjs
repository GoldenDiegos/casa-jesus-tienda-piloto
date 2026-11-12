import { readFile, access } from 'node:fs/promises';
import { join, resolve, relative, isAbsolute } from 'node:path';

const argumento = process.argv[2];
if (!argumento) {
  console.error('Uso: node scripts/verificar-exportacion.mjs <carpeta-exportada> [subruta]');
  process.exit(1);
}
const raiz = resolve(argumento);
const basePath = process.argv[3] || '';
if (basePath && !/^\/(?:[A-Za-z0-9_-]+)(?:\/[A-Za-z0-9_-]+)*$/.test(basePath))
  throw new Error('Subruta invalida');
const rutas = [
  '/',
  '/catalogo/',
  '/productos/pay-de-queso/',
  '/productos/pay-de-limon/',
  '/productos/galletas-de-mantequilla/',
  '/productos/galletas-de-avena/',
  '/carrito/',
  '/checkout/',
  '/donar/',
];
let errores = 0;
for (const ruta of rutas) {
  try {
    const archivo = join(raiz, ruta, 'index.html');
    const html = await readFile(archivo, 'utf8');
    if (!/<meta name="robots" content="noindex,\s*follow"/i.test(html))
      throw new Error('Falta noindex en la demostración');
    const direcciones = [...html.matchAll(/(?:src|href)="(\/[^"?#]*)"/g)].map((m) => m[1]);
    for (const direccion of direcciones) {
      if (basePath && !direccion.startsWith(basePath + '/'))
        throw new Error('Ruta sin subruta: ' + direccion);
    }
    const recursos = direcciones.filter(
      (x) => x.includes('/_next/static/') || x.includes('/imagenes/'),
    );
    for (const direccion of direcciones.filter((x) => !recursos.includes(x))) {
      await access(join(raiz, direccion.slice(basePath.length), 'index.html'));
    }
    if (!recursos.some((x) => x.startsWith(`${basePath}/_next/static/`)))
      throw new Error('No se encontraron recursos de Next.js');
    for (const recurso of new Set(recursos)) {
      const destino = resolve(raiz, `.${recurso.slice(basePath.length)}`);
      const subruta = relative(raiz, destino);
      if (subruta.startsWith('..') || isAbsolute(subruta))
        throw new Error('Ruta de recurso fuera de la exportación');
      await access(destino);
    }
    console.log(`OK ${ruta}: HTML, noindex y ${new Set(recursos).size} recursos locales presentes`);
  } catch (error) {
    errores++;
    console.error(`ERROR ${ruta}: ${error.message}`);
  }
}
try {
  await access(join(raiz, '.nojekyll'));
  const sitemap = await readFile(join(raiz, 'sitemap.xml'), 'utf8');
  if (/<loc(?:\s|>)/i.test(sitemap)) throw new Error('La demo no debe declarar URL públicas');
  console.log('OK sitemap.xml: sin URL públicas en la demostración');
} catch (error) {
  errores++;
  console.error(`ERROR sitemap.xml: ${error.message}`);
}
if (errores) {
  console.error(`Revisión incompleta: ${errores} error(es).`);
  process.exitCode = 1;
} else
  console.log(
    'Estructura de exportación revisada; aún requiere prueba visual y aprobación antes de publicar.',
  );
