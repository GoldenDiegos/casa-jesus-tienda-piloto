import {urlPublica} from '../lib/sitio';
export const dynamic='force-static';
// Las páginas privadas usan noindex; permitir el rastreo deja leer esa directiva.
export default function robots(){const base=urlPublica();return {rules:{userAgent:'*',allow:'/'},...(base?{sitemap:`${base}/sitemap.xml`}:{})}}
