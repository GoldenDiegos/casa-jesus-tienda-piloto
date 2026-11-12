'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {leerCarrito,guardarCarrito} from '../lib/carrito';
import {obtenerProducto,moneda} from '../lib/productos';
import DonativoCarrito from './DonativoCarrito';
import {guardarDonativo} from '../lib/donativo';

export default function Carrito(){
  const [items,setItems]=useState(null);
  const [mensaje,setMensaje]=useState('');
  const [donativo,setDonativo]=useState(0);
  useEffect(()=>{const originales=leerCarrito();const limpios=originales.filter(i=>{const p=obtenerProducto(i.slug);return p&&p.disponible!==false});setItems(limpios);try{if(limpios.length===0){guardarDonativo(0);setDonativo(0)}guardarCarrito(limpios);if(limpios.length!==originales.length)setMensaje('Se retiraron productos que ya no están disponibles en la demostración.')}catch{setMensaje('No se pudo guardar el carrito en este navegador.')}},[]);
  function actualizar(nuevos, texto){try{if(nuevos.length===0){guardarDonativo(0);setDonativo(0)}guardarCarrito(nuevos);setItems(nuevos);setMensaje(texto)}catch{setMensaje('No se pudo guardar el carrito en este navegador.')}}
  if(!items)return <p role="status">Cargando carrito…</p>;
  if(!items.length)return <div className="vacio"><h2>Tu carrito está vacío</h2><p>Explora los productos de demostración y agrega tus favoritos.</p><Link className="boton" href="/catalogo">Ir al catálogo</Link><p role="status">{mensaje}</p></div>;
  const total=items.reduce((s,i)=>s+obtenerProducto(i.slug).precio*i.cantidad,0);
  return <div className="carrito-layout"><div>{items.map(({slug,cantidad})=>{const p=obtenerProducto(slug);return <article key={slug} className="linea"><div className="mini" style={{background:p.color}}><img src={p.imagen} alt=""/></div><div><h2><Link href={`/productos/${slug}`}>{p.nombre}</Link></h2><p>{moneda(p.precio)} por pieza</p><div className="cantidad"><span>Cantidad: {cantidad}</span><button type="button" disabled={cantidad<=1} aria-label={`Reducir cantidad de ${p.nombre}`} onClick={()=>actualizar(items.map(x=>x.slug===slug?{...x,cantidad:x.cantidad-1}:x),`Cantidad de ${p.nombre}: ${cantidad-1}.`)}>−</button><button type="button" disabled={cantidad>=99} aria-label={`Aumentar cantidad de ${p.nombre}`} onClick={()=>actualizar(items.map(x=>x.slug===slug?{...x,cantidad:x.cantidad+1}:x),`Cantidad de ${p.nombre}: ${cantidad+1}.`)}>+</button></div><button className="texto-boton" aria-label={`Quitar ${p.nombre}`} onClick={()=>actualizar(items.filter(x=>x.slug!==slug),`${p.nombre} se quitó del carrito.`)}>Quitar</button></div><strong>{moneda(p.precio*cantidad)}</strong></article>})}<p role="status">{mensaje}</p></div><aside className="resumen"><h2>Resumen</h2><div className="fila"><span>Productos</span><strong>{moneda(total)}</strong></div><div className="fila"><span>Donativo opcional</span><strong>{moneda(donativo)}</strong></div><div className="fila"><strong>Total de ejemplo</strong><strong>{moneda(Math.round((total+donativo)*100)/100)}</strong></div><p>Importe de ejemplo. No se procesará ningún pago.</p><Link className="boton" href="/checkout">Continuar</Link><DonativoCarrito onChange={setDonativo}/></aside></div>;
}
