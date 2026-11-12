import Carrito from '../../components/Carrito';
import { imagenCompartir } from '../../lib/sitio';
export const metadata = {
  title: 'Carrito de demostración',
  description: 'Revisa los productos elegidos en la demostración de Casa de Jesús.',
  robots: { index: false, follow: true },
  openGraph: {
    images: [imagenCompartir],
    title: 'Carrito de demostración | Casa de Jesús',
    description: 'Revisa los productos elegidos en la demostración de Casa de Jesús.',
    type: 'website',
    locale: 'es_MX',
  },
};
export default function Page() {
  return (
    <section className="seccion">
      <p className="sobrelinea">TU SELECCIÓN</p>
      <h1>Tu carrito</h1>
      <p className="intro">Revisa tus productos antes de continuar con la demostración.</p>
      <Carrito />
    </section>
  );
}
