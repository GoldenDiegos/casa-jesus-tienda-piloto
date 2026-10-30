import mysql from 'mysql2/promise';

export async function contarProductos() {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (DB_HOST !== '127.0.0.1' || DB_PORT !== '3307' || DB_NAME !== 'casa_jesus_piloto' || !DB_USER || !DB_PASSWORD) {
    throw new Error('Revisa la configuración local del piloto.');
  }
  const connection = await mysql.createConnection({ host: DB_HOST, port: Number(DB_PORT), database: DB_NAME, user: DB_USER, password: DB_PASSWORD, connectTimeout: 5000 });
  try {
    const [rows] = await connection.execute('SELECT COUNT(*) AS productos FROM productos');
    return rows[0].productos;
  } finally {
    await connection.end();
  }
}
