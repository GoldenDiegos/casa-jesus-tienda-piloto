# Entorno local de Casa de Jesús

Esta carpeta contiene una instancia de MariaDB para el piloto, separada de la instancia del otro proyecto. Usa los ejecutables de XAMPP y sus propios datos y puerto TCP 3307, limitado a `127.0.0.1`. Solo sirve para desarrollo local con información ficticia.

La aplicación web todavía no está construida. Cuando exista, se ejecutará en su propio puerto y se conectará a esta instancia; su puerto se definirá al preparar el proyecto.

Para iniciar o detener únicamente esta instancia, ejecutar `iniciar_base.ps1` o `detener_base.ps1` desde PowerShell. No detienen Apache, el proxy ni la instancia de MariaDB del otro proyecto.

La cuenta local inicial es solo para configuración y no debe exponerse a la red ni usarse en producción. Antes de desplegar o almacenar datos reales se requieren cuentas con privilegios limitados y credenciales seguras fuera del repositorio.
