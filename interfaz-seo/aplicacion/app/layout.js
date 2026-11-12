import Link from 'next/link';
import { urlPublica } from '../lib/sitio';
import './estilos.css';
export const metadata = {
  title: { default: 'Casa de Jesús | Tienda de demostración', template: '%s | Casa de Jesús' },
  description:
    'Conoce la propuesta de tienda en línea para Casa de Jesús, A.C. Demostración académica con productos de ejemplo.',
  robots: { index: !!urlPublica(), follow: true },
  openGraph: {
    title: 'Casa de Jesús | Tienda de demostración',
    description:
      'Conoce la propuesta de tienda en línea para Casa de Jesús, A.C. Demostración académica con productos de ejemplo.',
    type: 'website',
    locale: 'es_MX',
  },
};
export default function Layout({ children }) {
  return (
    <html lang="es">
      <body>
        <a className="saltar" href="#contenido">
          Ir al contenido
        </a>
        <header className="cabecera">
          <Link href="/" className="marca">
            <span className="marca-icono">♥</span>
            <span>
              Casa de Jesús<small>Tienda de demostración</small>
            </span>
          </Link>
          <nav aria-label="Navegación principal">
            <Link href="/">Inicio</Link>
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/donar">Donar</Link>
            <Link href="/carrito">
              Carrito <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </header>
        <main id="contenido">{children}</main>
        <footer>
          <div>
            <strong>Casa de Jesús</strong>
            <p>Una propuesta de tienda para compartir y apoyar.</p>
          </div>
          <div>
            <strong>Explora</strong>
            <p>
              <Link href="/catalogo">Ver catálogo</Link> · <Link href="/donar">Donar</Link> ·{' '}
              <Link href="/carrito">Mi carrito</Link>
            </p>
          </div>
          <p>Demostración académica. No se procesan pagos ni pedidos reales.</p>
        </footer>
      </body>
    </html>
  );
}
