'use client';
import Link from 'next/link';

export default function ErrorGlobal({ reset }) {
  return (
    <section className="seccion">
      <h1>Algo salió mal</h1>
      <p className="intro">
        No pudimos mostrar esta página. Puedes intentarlo de nuevo; tu carrito sigue guardado en el
        navegador.
      </p>
      <p>
        <button className="boton" type="button" onClick={() => reset()}>
          Intentar de nuevo
        </button>{' '}
        <Link className="enlace" href="/catalogo">
          Ir al catálogo
        </Link>
      </p>
    </section>
  );
}
