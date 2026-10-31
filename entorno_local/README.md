# Entorno local de Casa de Jesús

Instancia de MariaDB del piloto, separada de la que usa otro proyecto en el puerto 3306. Usa los ejecutables de XAMPP, pero tiene su propia carpeta de datos (`datos/`, fuera de Git) y escucha solo en `127.0.0.1:3307`. Es para desarrollo local y con datos de prueba.

`iniciar_base.ps1` y `detener_base.ps1` arrancan y detienen solo esta instancia. Antes de hacer nada revisan que el puerto 3307 sea de esta carpeta de datos, así que no tocan Apache, el proxy ni la otra instancia.

La aplicación de `aplicacion/` se conecta aquí con la cuenta `cj_piloto_lectura`, que solo puede leer `productos`, y se probó en 127.0.0.1:3100.

La cuenta `root` de esta instancia todavía no tiene contraseña. Como solo acepta conexiones de la misma computadora no afecta la demostración, pero se le pondrá antes de guardar datos reales.
