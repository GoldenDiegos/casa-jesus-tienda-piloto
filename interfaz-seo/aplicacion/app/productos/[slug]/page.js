import Link from 'next/link';
import { notFound } from 'next/navigation';
import { obtenerProducto, productos, moneda } from '../../../lib/productos';
import Agregar from '../../../components/Agregar';
import { canonical, urlSitio, imagenCompartir } from '../../../lib/sitio';
export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const p = obtenerProducto((await params).slug);
  if (!p) return { title: 'Producto no encontrado' };
  const url = canonical(`/productos/${p.slug}`);
  return {
    title: p.nombre,
    description: p.descripcion,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      images: [imagenCompartir],
      title: `${p.nombre} | Casa de Jesús`,
      description: p.descripcion,
      ...(url ? { url } : {}),
    },
  };
}
export default async function Producto({ params }) {
  const p = obtenerProducto((await params).slug);
  if (!p) notFound();
  const base = urlSitio();
  const fin = process.env.CASA_JESUS_STATIC === '1' ? '/' : '';
  // Las migas usan solo nombres y direcciones reales; no incluyen precio ni disponibilidad.
  const migas = base && {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${base}/catalogo${fin}` },
      {
        '@type': 'ListItem',
        position: 3,
        name: p.nombre,
        item: `${base}/productos/${p.slug}${fin}`,
      },
    ],
  };
  return (
    <section className="seccion">
      {migas && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(migas) }}
        />
      )}
      <nav aria-label="Ruta de navegación" className="migas">
        <ol>
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li>
            <Link href="/catalogo">Catálogo</Link>
          </li>
          <li aria-current="page">{p.nombre}</li>
        </ol>
      </nav>
      <div className="detalle">
        <div className="detalle-imagen" style={{ backgroundColor: p.color }}>
          <img src={p.imagen} alt={p.alt} width="600" height="400" />
        </div>
        <div>
          <p className="sobrelinea">{p.categoria} · DEMOSTRACIÓN</p>
          <h1>{p.nombre}</h1>
          <p className="intro">{p.descripcion}</p>
          <p className="precio">{moneda(p.precio)}</p>
          <p>{p.presentacion}</p>
          <p className="nota">
            Imagen ilustrativa, precio y disponibilidad de ejemplo; no representan una oferta real.
          </p>
          {p.disponible === false ? (
            <p className="agotado">Agotado en esta demostración</p>
          ) : (
            <Agregar slug={p.slug} />
          )}
        </div>
      </div>
    </section>
  );
}
