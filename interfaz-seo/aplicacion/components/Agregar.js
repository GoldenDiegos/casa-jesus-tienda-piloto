'use client';
import {useState,useId} from 'react';
import Link from 'next/link';
import {agregarProducto} from '../lib/carrito';
export default function Agregar({slug}){const id=useId();const [cantidad,setCantidad]=useState(1);const [mensaje,setMensaje]=useState('');return <div className="compra"><label htmlFor={id}>Cantidad</label><input id={id} type="number" min="1" max="99" value={cantidad} onChange={e=>setCantidad(e.target.value)}/><button className="boton" onClick={()=>{const n=Number(cantidad);if(!Number.isInteger(n)||n<1||n>99){setMensaje('Elige una cantidad entre 1 y 99.');return}try{agregarProducto(slug,n);setMensaje('Producto agregado al carrito.')}catch{setMensaje('No se pudo guardar el carrito en este navegador.')}}}>Agregar al carrito</button><p aria-live="polite">{mensaje}</p>{mensaje.startsWith('Producto agregado')&&<Link href="/carrito" className="enlace">Ver carrito →</Link>}</div>}
