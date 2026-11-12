import Link from 'next/link';
import Tarjeta from '../components/Tarjeta';
import { productos } from '../lib/productos';
import { canonical } from '../lib/sitio';
export function generateMetadata() {
  const url = canonical('/');
  return url ? { alternates: { canonical: url } } : {};
}
export default function Inicio() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="sobrelinea">HECHO PARA COMPARTIR</p>
          <h1>Pays y galletas para compartir</h1>
          <p>
            Conoce una propuesta de tienda para Casa de Jesús, A.C. Explora productos de ejemplo y
            descubre cómo funcionaría tu compra.
          </p>
          <div className="acciones">
            <Link className="boton" href="/catalogo">
              Explorar catálogo →
            </Link>
            <Link className="boton-secundario" href="#como-funciona">
              Cómo funciona
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="sol">✳</div>
          <div className="pastel">◒</div>
          <div className="hero-nota">
            Un gesto que suma
            <br />
            <strong>Hecho para compartir</strong>
          </div>
        </div>
      </section>
      <section className="seccion">
        <div className="seccion-cabecera">
          <div>
            <p className="sobrelinea">UNA PROBADITA</p>
            <h2>Para tus momentos especiales</h2>
            <p>Estos productos y precios son ejemplos del prototipo.</p>
          </div>
          <Link className="enlace" href="/catalogo">
            Ver todo el catálogo →
          </Link>
        </div>
        <div className="rejilla">
          {productos.slice(0, 3).map((p) => (
            <Tarjeta key={p.slug} producto={p} />
          ))}
        </div>
      </section>
      <section className="seccion como" id="como-funciona">
        <p className="sobrelinea">ASÍ FUNCIONA</p>
        <h2>Una compra sencilla</h2>
        <div className="pasos">
          <div>
            <b>01</b>
            <h3>Elige</h3>
            <p>Explora los productos y agrega tus favoritos.</p>
          </div>
          <div>
            <b>02</b>
            <h3>Revisa</h3>
            <p>Ajusta las cantidades en tu carrito.</p>
          </div>
          <div>
            <b>03</b>
            <h3>Conoce el cierre</h3>
            <p>Revisa el recorrido de ejemplo. No se genera un pedido real.</p>
          </div>
        </div>
      </section>
    </>
  );
}
