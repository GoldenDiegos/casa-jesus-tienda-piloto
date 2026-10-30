import nextEnv from '@next/env';
import { contarProductos } from '../lib/bd.mjs';

nextEnv.loadEnvConfig(process.cwd());
console.log(`Conexión de aplicación correcta. Productos registrados: ${await contarProductos()}.`);
