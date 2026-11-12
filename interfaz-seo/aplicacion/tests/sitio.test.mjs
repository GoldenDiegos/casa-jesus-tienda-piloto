import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const codigo=await readFile(new URL('../lib/sitio.js',import.meta.url),'utf8');
const {urlPublica,canonical}=await import(`data:text/javascript;base64,${Buffer.from(codigo).toString('base64')}`);
test('requiere catálogo validado y dominio HTTPS antes de construir URL públicas',()=>{
 const originalUrl=process.env.SITE_URL, originalFlag=process.env.CATALOGO_VALIDADO;
 try{
  delete process.env.SITE_URL; delete process.env.CATALOGO_VALIDADO;
  assert.equal(urlPublica(),null);
  process.env.SITE_URL='https://ejemplo.invalid';
  assert.equal(urlPublica(),null);
  process.env.CATALOGO_VALIDADO='true';
  assert.equal(canonical('/catalogo'),'https://ejemplo.invalid/catalogo');
  for(const valor of ['http://ejemplo.invalid','https://user:pass@ejemplo.invalid','https://ejemplo.invalid/carpeta','dato-invalido']){
   process.env.SITE_URL=valor; assert.equal(urlPublica(),null);
  }
 }finally{
  if(originalUrl===undefined)delete process.env.SITE_URL;else process.env.SITE_URL=originalUrl;
  if(originalFlag===undefined)delete process.env.CATALOGO_VALIDADO;else process.env.CATALOGO_VALIDADO=originalFlag;
 }
});

test('la exportacion estatica conserva noindex aun con catalogo validado',()=>{
 const previo={...process.env};
 try{process.env.CASA_JESUS_STATIC='1';process.env.CATALOGO_VALIDADO='true';process.env.SITE_URL='https://ejemplo.invalid';assert.equal(urlPublica(),null);assert.equal(canonical('/catalogo'),undefined)}finally{process.env=previo}
});
