// Comprueba que la cuenta de la aplicación solo puede leer productos. No muestra credenciales.
import nextEnv from '@next/env';
import mysql from 'mysql2/promise';

nextEnv.loadEnvConfig(process.cwd());
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const c = await mysql.createConnection({ host: DB_HOST, port: Number(DB_PORT), database: DB_NAME, user: DB_USER, password: DB_PASSWORD });
const casos = [
  ['Leer productos', 'SELECT COUNT(*) AS n FROM productos'],
  ['Borrar productos', 'DELETE FROM productos WHERE id = 0'],
  ['Insertar producto', "INSERT INTO productos (nombre, precio) VALUES ('x', 1)"],
  ['Leer pedidos', 'SELECT COUNT(*) AS n FROM pedidos'],
];
for (const [nombre, sql] of casos) {
  try { await c.query(sql); console.log(`${nombre.padEnd(18)} permitido`); }
  catch (e) { console.log(`${nombre.padEnd(18)} rechazado (${e.code})`); }
}
await c.end();
