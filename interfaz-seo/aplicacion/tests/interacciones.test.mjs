import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire, Module} from 'node:module';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import {transform} from 'esbuild';
import React from 'react';
import {readFile} from 'node:fs/promises';

const dom=new JSDOM('<!doctype html><html lang="es"><body></body></html>',{url:'http://localhost/'});
globalThis.window=dom.window; globalThis.document=dom.window.document; globalThis.self=dom.window;
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
globalThis.localStorage=dom.window.localStorage;
const {render,screen,fireEvent,cleanup}=await import('@testing-library/react');
const require=createRequire(import.meta.url);
async function cargar(ruta,dependencias={}){
 const archivo=fileURLToPath(new URL(`../${ruta}.js`,import.meta.url));
 const contenido=await readFile(archivo,'utf8');
 const salida=await transform(contenido,{loader:'jsx',format:'cjs',jsx:'automatic'});
 const modulo=new Module(archivo);modulo.filename=archivo;modulo.paths=Module._nodeModulePaths(fileURLToPath(new URL('../',import.meta.url)));modulo.require=(id)=>dependencias[id]??require(id);
 modulo._compile(salida.code,archivo);return modulo.exports;
}
const deps={'../lib/carrito':await cargar('lib/carrito'),'../lib/productos':await cargar('lib/productos'),'../lib/donativo':await cargar('lib/donativo')};
deps['./DonativoCarrito']=await cargar('components/DonativoCarrito',deps);
const Agregar=(await cargar('components/Agregar',deps)).default;
const Carrito=(await cargar('components/Carrito',deps)).default;
const Checkout=(await cargar('components/Checkout',deps)).default;
const Donar=(await cargar('components/Donar',deps)).default;
const tarjeta=await cargar('components/Tarjeta',deps);
const Catalogo=(await cargar('components/Catalogo',{'./Tarjeta':tarjeta})).default;

test('selección, cambio de cantidad y eliminación del carrito',async()=>{
 localStorage.clear();
 render(React.createElement(Agregar,{slug:'pay-de-queso'}));
 fireEvent.change(screen.getByLabelText('Cantidad'),{target:{value:'2'}});
 fireEvent.click(screen.getByRole('button',{name:'Agregar al carrito'}));
 assert.match(screen.getByText('Producto agregado al carrito.').textContent,/agregado/);
 cleanup();render(React.createElement(Carrito));
 await screen.findByRole('button',{name:'Aumentar cantidad de Pay de queso'});
 assert.equal(document.querySelector('.mini img')?.getAttribute('src'),`${process.env.NEXT_PUBLIC_BASE_PATH||''}/imagenes/pay-de-queso-ilustracion.svg`);
 fireEvent.click(screen.getByRole('button',{name:'Aumentar cantidad de Pay de queso'}));
 assert.match(screen.getByText('Cantidad: 3').textContent,/3/);
 assert.equal(JSON.parse(localStorage.getItem('casa-jesus-carrito-demo'))[0].cantidad,3);
 fireEvent.click(screen.getByRole('button',{name:'Quitar Pay de queso'}));
 assert.ok(screen.getByText('Tu carrito está vacío'));
 assert.deepEqual(JSON.parse(localStorage.getItem('casa-jesus-carrito-demo')),[]);
 cleanup();
});
test('cierre requiere opciones y confirma solo el recorrido simulado',async()=>{
 localStorage.setItem('casa-jesus-carrito-demo',JSON.stringify([{slug:'pay-de-queso',cantidad:1}]));
 render(React.createElement(Checkout));
 const finalizar=await screen.findByRole('button',{name:'Finalizar demostración'});
 fireEvent.click(finalizar);
 assert.match(screen.getByRole('alert').textContent,/Selecciona un punto y un horario/);
 assert.equal(document.activeElement,screen.getByLabelText('Punto de entrega'));
 fireEvent.change(screen.getByLabelText('Punto de entrega'),{target:{value:'Punto de ejemplo A'}});
 fireEvent.change(screen.getByLabelText('Horario'),{target:{value:'10:00–12:00'}});
 fireEvent.click(finalizar);
 assert.match(screen.getByRole('status').textContent,/No se realizó ningún pedido ni cargo/);
 cleanup();
});
test('cierre valida cada opción por separado y mueve el foco al primer campo faltante',async()=>{
 localStorage.clear();
 localStorage.setItem('casa-jesus-carrito-demo',JSON.stringify([{slug:'pay-de-queso',cantidad:1}]));
 render(React.createElement(Checkout));
 const finalizar=await screen.findByRole('button',{name:'Finalizar demostración'});
 const punto=screen.getByLabelText('Punto de entrega');
 const horario=screen.getByLabelText('Horario');

 // Con el punto elegido, el error debe señalar el horario que falta.
 fireEvent.change(punto,{target:{value:'Punto de ejemplo A'}});
 fireEvent.click(finalizar);
 assert.match(screen.getByRole('alert').textContent,/Selecciona un punto y un horario/);
 assert.equal(document.activeElement,horario);

 // Con el horario elegido, el error debe señalar el punto que falta.
 fireEvent.change(horario,{target:{value:'10:00–12:00'}});
 fireEvent.change(punto,{target:{value:''}});
 fireEvent.click(finalizar);
 assert.match(screen.getByRole('alert').textContent,/Selecciona un punto y un horario/);
 assert.equal(document.activeElement,punto);

 // Una vez completados ambos campos, el error desaparece y se confirma la demo.
 fireEvent.change(punto,{target:{value:'Punto de ejemplo B'}});
 fireEvent.click(finalizar);
 assert.equal(screen.queryByRole('alert'),null);
 assert.match(screen.getByRole('status').textContent,/No se realizó ningún pedido ni cargo/);
 cleanup();
});
test('catálogo filtra por búsqueda y categoría y comunica resultados vacíos',()=>{
 render(React.createElement(Catalogo,{productos:deps['../lib/productos'].productos}));
 fireEvent.change(screen.getByLabelText('Buscar producto'),{target:{value:'queso'}});
 assert.ok(screen.getByRole('link',{name:'Pay de queso'}));
 assert.equal(screen.queryByRole('link',{name:'Pay de limón'}),null);
 fireEvent.change(screen.getByLabelText('Categoría'),{target:{value:'Galletas'}});
 assert.ok(screen.getByText('No encontramos productos'));
 cleanup();
});
test('donativo opcional se suma de forma separada y llega al resumen',async()=>{
 localStorage.clear();localStorage.setItem('casa-jesus-carrito-demo',JSON.stringify([{slug:'pay-de-queso',cantidad:1}]));
 render(React.createElement(Carrito));
 await screen.findByLabelText('Donativo opcional de ejemplo');
 fireEvent.change(screen.getByLabelText('Donativo opcional de ejemplo'),{target:{value:'25.50'}});
 fireEvent.click(screen.getByRole('button',{name:'Actualizar donativo'}));
 assert.match(screen.getByText('Total de ejemplo').parentElement.textContent,/275\.5/);
 fireEvent.click(screen.getByRole('button',{name:'Quitar Pay de queso'}));
 assert.equal(localStorage.getItem('casa-jesus-donativo-demo'),'0');
 localStorage.setItem('casa-jesus-carrito-demo',JSON.stringify([{slug:'pay-de-queso',cantidad:1}]));
 localStorage.setItem('casa-jesus-donativo-demo','25.5');
 cleanup();render(React.createElement(Checkout));
 await screen.findByLabelText('Punto de entrega');
 assert.match(screen.getByText('Total de ejemplo').parentElement.textContent,/275\.5/);
 cleanup();
});
test('donativo independiente rechaza importes pequeños y aclara que no hay cargo',()=>{
 render(React.createElement(Donar));
 fireEvent.change(screen.getByLabelText('Monto en pesos'),{target:{value:'10'}});
 fireEvent.click(screen.getByRole('button',{name:'Simular donativo'}));
 assert.match(screen.getByRole('status').textContent,/mayor a \$10/);
 fireEvent.change(screen.getByLabelText('Monto en pesos'),{target:{value:'50'}});
 fireEvent.click(screen.getByRole('button',{name:'Simular donativo'}));
 assert.match(screen.getByRole('status').textContent,/No se realizó ningún cargo/);
 cleanup();
});
test('retira un producto de ejemplo agotado que quedó guardado en el carrito',async()=>{
 localStorage.clear();localStorage.setItem('casa-jesus-carrito-demo',JSON.stringify([{slug:'galletas-de-avena',cantidad:1}]));
 localStorage.setItem('casa-jesus-donativo-demo','25');
 render(React.createElement(Carrito));
 await screen.findByText('Tu carrito está vacío');
 assert.deepEqual(JSON.parse(localStorage.getItem('casa-jesus-carrito-demo')),[]);
 assert.equal(localStorage.getItem('casa-jesus-donativo-demo'),'0');
 assert.match(screen.getByRole('status').textContent,/ya no están disponibles/);
 cleanup();
});
test('al abrir directamente el cierre con un producto agotado no conserva el donativo',async()=>{
 localStorage.clear();
 localStorage.setItem('casa-jesus-carrito-demo',JSON.stringify([{slug:'galletas-de-avena',cantidad:1}]));
 localStorage.setItem('casa-jesus-donativo-demo','25');
 render(React.createElement(Checkout));
 await screen.findByText('No hay productos para revisar');
 assert.deepEqual(JSON.parse(localStorage.getItem('casa-jesus-carrito-demo')),[]);
 assert.equal(localStorage.getItem('casa-jesus-donativo-demo'),'0');
 cleanup();
});
