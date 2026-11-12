import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const codigo = await readFile(new URL('../lib/carrito.js', import.meta.url), 'utf8');
const carrito = await import(
  `data:text/javascript;base64,${Buffer.from(codigo).toString('base64')}`
);
let datos;
globalThis.localStorage = {
  getItem: () => datos ?? null,
  setItem: (_clave, valor) => {
    datos = valor;
  },
};

test('carrito conserva y acumula productos sin exceder 99', () => {
  datos = undefined;
  assert.deepEqual(carrito.leerCarrito(), []);
  carrito.agregarProducto('pay-de-queso', 2);
  carrito.agregarProducto('pay-de-queso', 99);
  carrito.agregarProducto('galletas-de-avena', 1);
  assert.deepEqual(carrito.leerCarrito(), [
    { slug: 'pay-de-queso', cantidad: 99 },
    { slug: 'galletas-de-avena', cantidad: 1 },
  ]);
});
test('rechaza cantidades inválidas y descarta datos guardados corruptos', () => {
  datos = undefined;
  for (const n of [0, -1, 100, 1.5, '2'])
    assert.throws(() => carrito.agregarProducto('pay-de-queso', n));
  assert.throws(() => carrito.agregarProducto('', 1));
  datos = '{json inválido';
  assert.deepEqual(carrito.leerCarrito(), []);
  datos = JSON.stringify([
    { slug: 'pay-de-queso', cantidad: -1 },
    { slug: 'galletas-de-avena', cantidad: 3 },
  ]);
  assert.deepEqual(carrito.leerCarrito(), [{ slug: 'galletas-de-avena', cantidad: 3 }]);
});
