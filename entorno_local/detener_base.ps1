$ErrorActionPreference = 'Stop'
$mysql = 'C:\xampp\mysql\bin\mysql.exe'
$admin = 'C:\xampp\mysql\bin\mysqladmin.exe'
$expected = (Join-Path $PSScriptRoot 'datos').TrimEnd('\')
$actual = & $mysql --no-defaults --protocol=tcp --host=127.0.0.1 --port=3307 --user=root --batch --skip-column-names -e 'SELECT @@datadir' 2>$null
if ($LASTEXITCODE -ne 0 -or -not $actual) { throw 'La instancia de Casa de Jesús no responde en el puerto 3307.' }
if ([IO.Path]::GetFullPath($actual.Trim().TrimEnd('\','/')) -ine [IO.Path]::GetFullPath($expected)) { throw 'La ruta de datos no coincide; no se detuvo ningún proceso.' }
& $admin --no-defaults --protocol=tcp --host=127.0.0.1 --port=3307 --user=root shutdown
if ($LASTEXITCODE -ne 0) { throw 'No se pudo detener la instancia.' }
Write-Output 'Instancia de Casa de Jesús detenida.'
