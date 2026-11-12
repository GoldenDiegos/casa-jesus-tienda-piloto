import Link from 'next/link';

export const metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="seccion">
      <h1>No encontramos esta página</h1>
      <p className="intro">Puede que la dirección esté mal escrita o que ya no exista.</p>
      <Link className="boton" href="/catalogo">
        Ir al catálogo
      </Link>
    </section>
  );
}
