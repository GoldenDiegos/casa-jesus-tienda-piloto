$ErrorActionPreference = 'Stop'
$baseDir = $PSScriptRoot
$dataDir = Join-Path $baseDir 'datos'
$exe = 'C:\xampp\mysql\bin\mysqld.exe'
$port = 3307
if (-not (Test-Path -LiteralPath $exe)) { throw "No existe MariaDB en $exe." }
if (-not (Test-Path -LiteralPath (Join-Path $dataDir 'mysql'))) { throw 'La carpeta de datos no está inicializada.' }
if (Test-NetConnection -ComputerName 127.0.0.1 -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue) {
    $actual = & 'C:\xampp\mysql\bin\mysql.exe' --no-defaults --protocol=tcp --host=127.0.0.1 --port=$port --user=root --batch --skip-column-names -e 'SELECT @@datadir'
    if ($LASTEXITCODE -ne 0 -or -not $actual -or [IO.Path]::GetFullPath($actual.Trim().TrimEnd('\','/')) -ine [IO.Path]::GetFullPath($dataDir)) { throw 'El puerto 3307 ya está ocupado por otra instancia; no se inició ningún proceso.' }
    Write-Output 'La instancia de Casa de Jesús ya está funcionando en 127.0.0.1:3307.'
    exit
}
$arguments = @('--no-defaults', '--basedir=C:/xampp/mysql', "--datadir=`"$dataDir`"", '--bind-address=127.0.0.1', "--port=$port", '--console')
Start-Process -FilePath $exe -ArgumentList $arguments -WindowStyle Hidden
Write-Output 'Se inició MariaDB de Casa de Jesús en 127.0.0.1:3307.'
