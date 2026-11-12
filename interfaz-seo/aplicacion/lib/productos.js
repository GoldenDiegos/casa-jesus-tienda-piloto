const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
// Datos ficticios para la demostración; no representan ofertas verificadas.
export const productos = [
  { slug:'pay-de-queso', nombre:'Pay de queso', categoria:'Pays', precio:250, descripcion:'Pay de queso cremoso con base de galleta. Presentación de ejemplo para compartir.', presentacion:'Entero · 8 rebanadas', color:'#edc9a7', simbolo:'◒', imagen:`${basePath}/imagenes/pay-de-queso-ilustracion.svg`, alt:'Ilustración de ejemplo de un pay de queso entero' },
  { slug:'pay-de-limon', nombre:'Pay de limón', categoria:'Pays', precio:230, descripcion:'Pay de limón con base de galleta. Descripción y precio de ejemplo.', presentacion:'Entero · 8 rebanadas', color:'#e8dcaa', simbolo:'◒', imagen:`${basePath}/imagenes/pay-de-limon-ilustracion.svg`, alt:'Ilustración de ejemplo de un pay de limón entero' },
  { slug:'galletas-de-mantequilla', nombre:'Galletas de mantequilla', categoria:'Galletas', precio:90, descripcion:'Galletas de mantequilla para acompañar tu café. Contenido de ejemplo.', presentacion:'Caja · 12 piezas', color:'#e9cfae', simbolo:'✿', imagen:`${basePath}/imagenes/galletas-de-mantequilla-ilustracion.svg`, alt:'Ilustración de ejemplo de galletas de mantequilla en un plato' },
  { slug:'galletas-de-avena', nombre:'Galletas de avena', categoria:'Galletas', precio:100, descripcion:'Galletas de avena en una presentación para compartir. Contenido de ejemplo.', presentacion:'Caja · 12 piezas', color:'#dcc2a7', simbolo:'✿', imagen:`${basePath}/imagenes/galletas-de-avena-ilustracion.svg`, alt:'Ilustración de ejemplo de galletas de avena en un plato', disponible:false }
];
export const obtenerProducto = slug => productos.find(p => p.slug === slug);
export const moneda = valor => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',minimumFractionDigits:0,maximumFractionDigits:2}).format(valor);
