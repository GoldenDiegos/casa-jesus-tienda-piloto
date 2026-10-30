import { contarProductos } from '../lib/bd.mjs';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let estado = 'Base de datos no disponible';
  try {
    estado = `Conexión local disponible. Productos registrados: ${await contarProductos()}.`;
  } catch {
    // No se exponen credenciales ni detalles técnicos en la página.
  }
  return <main><h1>Casa de Jesús: integración tecnológica</h1><p>{estado}</p><p>Proyecto inicial de integración. La tienda y los pagos aún no están implementados.</p></main>;
}
