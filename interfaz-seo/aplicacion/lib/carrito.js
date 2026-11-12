const CLAVE = 'casa-jesus-carrito-demo';
export function leerCarrito(){try {const valor=JSON.parse(localStorage.getItem(CLAVE)||'[]'); return Array.isArray(valor)?valor.filter(x=>typeof x.slug==='string'&&Number.isInteger(x.cantidad)&&x.cantidad>0&&x.cantidad<=99):[];}catch{return []}}
export function guardarCarrito(items){localStorage.setItem(CLAVE,JSON.stringify(items));}
export function agregarProducto(slug,cantidad){if(typeof slug!=='string'||!slug.trim()||!Number.isInteger(cantidad)||cantidad<1||cantidad>99)throw new Error('Producto o cantidad inválida');const items=leerCarrito();const item=items.find(x=>x.slug===slug);if(item)item.cantidad=Math.min(99,item.cantidad+cantidad);else items.push({slug,cantidad});guardarCarrito(items);}
