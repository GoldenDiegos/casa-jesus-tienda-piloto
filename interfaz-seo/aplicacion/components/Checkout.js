'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { leerCarrito, guardarCarrito } from '../lib/carrito';
import { obtenerProducto, moneda } from '../lib/productos';
import { leerDonativo, guardarDonativo } from '../lib/donativo';

export default function Checkout() {
  const [items, setItems] = useState(null);
  const [punto, setPunto] = useState('');
  const [horario, setHorario] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const [error, setError] = useState('');
  const [donativo, setDonativo] = useState(0);
  const puntoRef = useRef(null);
  const horarioRef = useRef(null);
  const confirmacionRef = useRef(null);
  useEffect(() => {
    const anteriores = leerCarrito();
    const validos = anteriores.filter((i) => {
      const p = obtenerProducto(i.slug);
      return p && p.disponible !== false;
    });
    try {
      if (validos.length === 0) guardarDonativo(0);
      if (validos.length !== anteriores.length) guardarCarrito(validos);
    } catch {
      /* La demostración no solicita datos ni intenta enviar el pedido. */
    }
    setItems(validos);
    setDonativo(validos.length ? leerDonativo() : 0);
  }, []);
  // Al terminar, el botón se desactiva; el foco pasa a la confirmación para no perderse.
  useEffect(() => {
    if (confirmado) confirmacionRef.current?.focus();
  }, [confirmado]);
  if (!items) return <p role="status">Cargando resumen…</p>;
  const productos = items
    .map((i) => ({ ...i, p: obtenerProducto(i.slug) }))
    .filter((x) => x.p && x.p.disponible !== false);
  if (!productos.length)
    return (
      <div className="vacio">
        <h2>No hay productos para revisar</h2>
        <Link href="/catalogo" className="boton">
          Explorar catálogo
        </Link>
      </div>
    );
  const total = productos.reduce((s, i) => s + i.p.precio * i.cantidad, 0);
  function finalizar(evento) {
    evento.preventDefault();
    if (!punto || !horario) {
      setError('Selecciona un punto y un horario de ejemplo para continuar.');
      (!punto ? puntoRef : horarioRef).current?.focus();
      return;
    }
    setError('');
    setConfirmado(true);
  }
  return (
    <div className="carrito-layout">
      <form className="resumen" onSubmit={finalizar} noValidate>
        <h2>Entrega de ejemplo</h2>
        <p>Estas opciones son ficticias y no reservan una entrega.</p>
        <label className="campo">
          Punto de entrega
          <select
            ref={puntoRef}
            required
            value={punto}
            onChange={(e) => setPunto(e.target.value)}
            aria-describedby={error ? 'error-entrega' : undefined}
            aria-invalid={!!error && !punto}
          >
            <option value="">Selecciona un punto</option>
            <option value="Punto de ejemplo A">Punto de ejemplo A</option>
            <option value="Punto de ejemplo B">Punto de ejemplo B</option>
          </select>
        </label>
        <label className="campo">
          Horario
          <select
            ref={horarioRef}
            required
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            aria-describedby={error ? 'error-entrega' : undefined}
            aria-invalid={!!error && !horario}
          >
            <option value="">Selecciona un horario</option>
            <option value="10:00–12:00">10:00–12:00</option>
            <option value="12:00–14:00">12:00–14:00</option>
          </select>
        </label>
        {error && (
          <p id="error-entrega" role="alert">
            {error}
          </p>
        )}
        <p>
          No se guardan pedidos ni se envían datos. El pago y la entrega están pendientes de
          integración.
        </p>
        {/* La región de estado existe desde el inicio para que el lector de pantalla anuncie el cierre. */}
        <div role="status" aria-live="polite">
          {confirmado && (
            <p className="nota" ref={confirmacionRef} tabIndex={-1}>
              <strong>Recorrido terminado.</strong> No se realizó ningún pedido ni cargo. Elegiste{' '}
              {punto}, de {horario}.
            </p>
          )}
        </div>
        <button className="boton" type="submit" disabled={confirmado}>
          {confirmado ? 'Demostración finalizada' : 'Finalizar demostración'}
        </button>
        <p>
          <Link href="/carrito" className="enlace">
            ← Volver al carrito
          </Link>
        </p>
      </form>
      <aside className="resumen">
        <h2>Resumen de demostración</h2>
        {productos.map((x) => (
          <div className="fila" key={x.slug}>
            <span>
              {x.p.nombre} × {x.cantidad}
            </span>
            <strong>{moneda(x.p.precio * x.cantidad)}</strong>
          </div>
        ))}
        <div className="fila">
          <span>Donativo opcional</span>
          <strong>{moneda(donativo)}</strong>
        </div>
        <div className="fila">
          <strong>Total de ejemplo</strong>
          <strong>{moneda(Math.round((total + donativo) * 100) / 100)}</strong>
        </div>
      </aside>
    </div>
  );
}
