import Catalogo from '../../components/Catalogo';
import { productos } from '../../lib/productos';
import { canonical, imagenCompartir } from '../../lib/sitio';
export function generateMetadata() {
  const url = canonical('/catalogo');
  return {
    title: 'Catálogo de pays y galletas',
    description: 'Explora el catálogo de demostración de pays y galletas de Casa de Jesús.',
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      images: [imagenCompartir],
      title: 'Catálogo de pays y galletas | Casa de Jesús',
      description: 'Explora el catálogo de demostración de pays y galletas de Casa de Jesús.',
      ...(url ? { url } : {}),
    },
  };
}
export default function Page() {
  return (
    <section className="seccion">
      <p className="sobrelinea">NUESTROS PRODUCTOS</p>
      <h1>Catálogo de pays y galletas</h1>
      <p className="intro">
        Explora el catálogo de demostración. Los precios y la disponibilidad son de ejemplo.
      </p>
      <Catalogo productos={productos} />
    </section>
  );
}
