import Link from 'next/link';
import { moneda } from '../lib/productos';
export default function Tarjeta({ producto }) {
  return (
    <article className="producto">
      <Link
        href={`/productos/${producto.slug}`}
        className="producto-imagen"
        style={{ backgroundColor: producto.color }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <img src={producto.imagen} alt={producto.alt} width="600" height="400" loading="lazy" />
      </Link>
      <div className="producto-info">
        <p className="etiqueta">{producto.categoria}</p>
        <h3>
          <Link href={`/productos/${producto.slug}`}>{producto.nombre}</Link>
        </h3>
        <p>{producto.presentacion}</p>
        {producto.disponible === false && <p className="agotado">Agotado · ejemplo</p>}
        <div className="producto-final">
          <strong>{moneda(producto.precio)}</strong>
          <Link href={`/productos/${producto.slug}`} className="enlace">
            Ver detalle →
          </Link>
        </div>
      </div>
    </article>
  );
}
