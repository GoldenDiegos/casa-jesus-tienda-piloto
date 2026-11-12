const CLAVE='casa-jesus-donativo-demo';
export function validarImporte(valor,{minimo=0}={}){
 const texto=String(valor).trim();
 if(!/^\d+(?:\.\d{1,2})?$/.test(texto))return null;
 const monto=Number(texto);
 return Number.isFinite(monto)&&monto>=minimo&&monto<=100000?Math.round(monto*100)/100:null;
}
export function leerDonativo(){try{const monto=validarImporte(localStorage.getItem(CLAVE)??'0');return monto??0}catch{return 0}}
export function guardarDonativo(valor){const monto=validarImporte(valor);if(monto===null)throw new Error('Importe inválido');localStorage.setItem(CLAVE,String(monto));return monto}
