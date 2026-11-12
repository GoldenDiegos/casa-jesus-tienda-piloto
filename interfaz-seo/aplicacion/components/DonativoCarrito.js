'use client';
import { useState, useEffect } from 'react';
import { leerDonativo, guardarDonativo } from '../lib/donativo';
import { moneda } from '../lib/productos';
export default function DonativoCarrito({ onChange }) {
  const [valor, setValor] = useState('0');
  const [mensaje, setMensaje] = useState('');
  useEffect(() => {
    const monto = leerDonativo();
    setValor(String(monto));
    onChange(monto);
  }, [onChange]);
  function actualizar(e) {
    e.preventDefault();
    try {
      const monto = guardarDonativo(valor);
      onChange(monto);
      setMensaje(
        monto ? `Donativo de ejemplo agregado: ${moneda(monto)}.` : 'Sin donativo adicional.',
      );
    } catch {
      setMensaje('Ingresa un importe entre 0 y 100000 con hasta dos decimales.');
    }
  }
  return (
    <form onSubmit={actualizar} className="donativo-opcional">
      <label htmlFor="donativo-compra">Donativo opcional de ejemplo</label>
      <p>Inicia en $0. Este importe no representa un cobro real.</p>
      <input
        id="donativo-compra"
        inputMode="decimal"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        aria-describedby="mensaje-donativo"
      />
      <button className="boton-secundario" type="submit">
        Actualizar donativo
      </button>
      <p id="mensaje-donativo" role="status">
        {mensaje}
      </p>
    </form>
  );
}
