import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { cpSync, mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

// Se compila una copia aislada para no tocar la compilación del servidor activo.
// La exportación es una demo con datos ficticios: nunca activa indexación pública.
const aplicacion = dirname(dirname(fileURLToPath(import.meta.url)));
const carpetaQA = join(dirname(aplicacion), 'qa');
mkdirSync(carpetaQA, { recursive: true });
const copia = mkdtempSync(join(carpetaQA, 'exportacion-'));
for (const nombre of ['app', 'components', 'lib', 'public', 'next.config.mjs', 'package.json']) {
  cpSync(join(aplicacion, nombre), join(copia, nombre), { recursive: true });
}
symlinkSync(join(aplicacion, 'node_modules'), join(copia, 'node_modules'), 'junction');
const next = join(copia, 'node_modules', 'next', 'dist', 'bin', 'next');
console.log(`Compilación aislada de revisión: ${copia}`);
const resultado = spawnSync(process.execPath, [next, 'build'], {
  cwd: copia,
  stdio: 'inherit',
  env: {
    ...process.env,
    CASA_JESUS_QA: '1',
    CASA_JESUS_STATIC: '1',
    CASA_JESUS_ROOT: dirname(aplicacion),
    CATALOGO_VALIDADO: 'false',
    SITE_URL: '',
  },
});
if (resultado.error) console.error(`No se pudo compilar la demo: ${resultado.error.message}`);
if (resultado.status === 0) writeFileSync(join(copia, '.next-qa', '.nojekyll'), '');
if (resultado.status === 0)
  console.log(`Archivos estáticos de revisión: ${join(copia, '.next-qa')}`);
process.exitCode = resultado.status ?? 1;
