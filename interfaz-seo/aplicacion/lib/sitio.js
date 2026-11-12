// La URL y la indexación requieren una decisión de publicación explícita.
export function urlPublica(){
  if(process.env.CASA_JESUS_STATIC==='1')return null;
  if(process.env.CATALOGO_VALIDADO!=='true'||!process.env.SITE_URL)return null;
  try{const url=new URL(process.env.SITE_URL);if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)return null;return url.origin}catch{return null}
}
export function canonical(ruta){const base=urlPublica();return base?`${base}${ruta}`:undefined}
