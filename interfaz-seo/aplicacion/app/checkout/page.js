import Checkout from '../../components/Checkout';
export const metadata = {
  title: 'Cierre de pedido de demostración',
  description: 'Conoce el cierre de pedido simulado de la tienda de Casa de Jesús.',
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Cierre de pedido de demostración | Casa de Jesús',
    description: 'Conoce el cierre de pedido simulado de la tienda de Casa de Jesús.',
    type: 'website',
    locale: 'es_MX',
  },
};
export default function Page() {
  return (
    <section className="seccion">
      <p className="sobrelinea">Entrega y cierre · demostración</p>
      <h1>Cierre de pedido</h1>
      <p className="intro">
        Esta pantalla es una demostración: no se enviarán datos ni se cobrará un pago.
      </p>
      <Checkout />
    </section>
  );
}
