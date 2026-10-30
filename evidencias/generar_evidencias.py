"""Ejecuta las comprobaciones de la instancia y de la aplicación y guarda su salida real como evidencia.

Para cada evidencia guarda la salida tal cual (.txt) y la convierte en imagen (.png) con la fecha.
No son capturas de pantalla: en la imagen el comando aparece abreviado; el completo es el de este script.
No inicia ni detiene servicios: la instancia del piloto (127.0.0.1:3307) debe estar encendida.
Las contraseñas se reemplazan por [oculto]. Uso: python generar_evidencias.py
"""
import re
import subprocess
import textwrap
from datetime import datetime
from pathlib import Path

import matplotlib
from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).parent
APP = AQUI.parent / "aplicacion"
MYSQL = r"C:\xampp\mysql\bin\mysql.exe"
BASE = [MYSQL, "--no-defaults", "--protocol=tcp", "--host=127.0.0.1", "--port=3307", "--user=root"]
FECHA = datetime.now().strftime("%d/%m/%Y %H:%M")
ANCHO_MAX = 100  # caracteres por línea en la imagen
# DejaVu Sans Mono viene con matplotlib y tiene los símbolos de la salida de Next.js (✓, ┌, └)
FUENTES = Path(matplotlib.get_data_path()) / "fonts" / "ttf"

SQL_INSTANCIA = "SELECT @@port AS puerto, @@bind_address AS escucha, @@version AS version, @@datadir AS carpeta_datos;"
SQL_TABLAS = ("SELECT table_name AS tabla, engine AS motor, table_rows AS filas FROM information_schema.tables "
              "WHERE table_schema='casa_jesus_piloto' ORDER BY 1;")
SQL_RELACIONES = ("SELECT table_name AS tabla, column_name AS columna, referenced_table_name AS referencia, "
                  "constraint_name AS restriccion FROM information_schema.key_column_usage "
                  "WHERE table_schema='casa_jesus_piloto' AND referenced_table_name IS NOT NULL ORDER BY 1, 2;")
SQL_RESTRICCIONES = ("SELECT tc.table_name AS tabla, tc.constraint_name AS restriccion, cc.check_clause AS regla "
                     "FROM information_schema.table_constraints tc JOIN information_schema.check_constraints cc "
                     "ON cc.constraint_schema = tc.constraint_schema AND cc.constraint_name = tc.constraint_name "
                     "AND cc.table_name = tc.table_name WHERE tc.table_schema='casa_jesus_piloto' "
                     "AND tc.constraint_type='CHECK' ORDER BY 1, 2;")
SQL_RECHAZOS = """START TRANSACTION;
INSERT INTO productos (nombre, precio) VALUES ('Prueba precio negativo', -10);
INSERT INTO productos (nombre, precio, categoria_id) VALUES ('Prueba categoria inexistente', 100, 999);
INSERT INTO donativos_independientes (folio, importe, nombre_donante) VALUES ('D-PRUEBA', 5, 'Prueba');
INSERT INTO pagos (proveedor, importe) VALUES ('mercado_pago_prueba', 100);
ROLLBACK;
SELECT (SELECT COUNT(*) FROM productos) AS productos, (SELECT COUNT(*) FROM donativos_independientes) AS donativos,
       (SELECT COUNT(*) FROM pagos) AS pagos;
"""


def correr(cmd, entrada=None, cwd=None, errores_primero=False):
    r = subprocess.run(cmd, input=entrada, capture_output=True, text=True, encoding="utf-8", errors="replace",
                       cwd=cwd, shell=isinstance(cmd, str))
    # mysql escribe los errores al momento; ocurren antes del SELECT final, así que van primero
    salida = (r.stderr + r.stdout if errores_primero else r.stdout + r.stderr).replace("\r\n", "\n").strip("\n")
    return re.sub(r"PASSWORD '[^']*'", "PASSWORD '[oculto]'", salida)


def sql(consulta, extra=()):
    return correr(BASE + ["--table", *extra, "-e", consulta])


def imagen(nombre, titulo, comando, salida):
    fuente = ImageFont.truetype(str(FUENTES / "DejaVuSansMono.ttf"), 24)
    negrita = ImageFont.truetype(str(FUENTES / "DejaVuSansMono-Bold.ttf"), 24)
    lineas = [(f"> {l}" if i == 0 else f"  {l}", "#7FDBCA") for i, l in enumerate(comando.split("\n"))]
    lineas += [(l, "#E6E6E6") for l in salida.split("\n")]
    # Para que se lea impresa a lo ancho de la hoja, las líneas largas se parten (las tablas no)
    partidas = []
    for texto, color in lineas:
        if len(texto) <= ANCHO_MAX or texto.lstrip()[:1] in "|+":
            partidas.append((texto, color))
            continue
        sangria = "      "
        trozos = textwrap.wrap(texto, ANCHO_MAX, subsequent_indent=sangria, break_long_words=True)
        partidas += [(x, color) for x in trozos]
    lineas = partidas
    sello = f"Casa de Jesús · piloto · {FECHA}"
    ancho = max(int(negrita.getlength(titulo) + fuente.getlength(sello)) + 100,
                max(int(fuente.getlength(t)) for t, _ in lineas) + 80)
    alto = 70 + 40 + len(lineas) * 34 + 40
    im = Image.new("RGB", (ancho, alto), "#0F1E2E")
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, ancho, 56), fill="#1B3A57")
    d.text((24, 14), titulo, font=negrita, fill="#FFFFFF")
    d.text((ancho - 24, 14), sello, font=fuente, fill="#9FC5E8", anchor="ra")
    y = 90
    for t, color in lineas:
        d.text((40, y), t, font=fuente, fill=color)
        y += 34
    im.save(AQUI / f"{nombre}.png")
    (AQUI / f"{nombre}.txt").write_text(f"{titulo}\nFecha: {FECHA}\n\n> {comando}\n{salida}\n", encoding="utf-8")
    print("ok", nombre)


def main():
    imagen("01_instancia_mariadb", "Evidencia 1. Instancia MariaDB del piloto",
           f"mysql --port=3307 -e \"{SQL_INSTANCIA}\"", sql(SQL_INSTANCIA, ["--vertical"]).replace("*", "").strip())
    imagen("02_tablas", "Evidencia 2. Tablas de casa_jesus_piloto",
           "mysql --port=3307 -e \"SELECT table_name, engine, table_rows FROM information_schema.tables ...\"",
           sql(SQL_TABLAS))
    imagen("03_relaciones", "Evidencia 3. Claves foráneas (relaciones)",
           "mysql --port=3307 -e \"SELECT ... FROM information_schema.key_column_usage ...\"", sql(SQL_RELACIONES))
    imagen("04_restricciones_check", "Evidencia 4. Reglas CHECK del esquema",
           "mysql --port=3307 --vertical -e \"SELECT ... FROM information_schema.check_constraints ...\"",
           sql(SQL_RESTRICCIONES, ["--vertical"]).replace("*", "").strip())
    imagen("05_rechazos_integridad", "Evidencia 5. Datos inválidos rechazados (transacción con ROLLBACK)",
           SQL_RECHAZOS.strip(), correr(BASE + ["--force", "--table", "casa_jesus_piloto"], SQL_RECHAZOS, errores_primero=True))
    grants = correr(BASE + ["--skip-column-names", "-e", "SHOW GRANTS FOR 'cj_piloto_lectura'@'127.0.0.1';"])
    imagen("06_permisos_cuenta_app", "Evidencia 6. Permisos de la cuenta de la aplicación",
           "mysql --port=3307 -e \"SHOW GRANTS FOR 'cj_piloto_lectura'@'127.0.0.1'\"", grants)
    imagen("07_conexion_app", "Evidencia 7. Conexión Next.js → MariaDB (mysql2) y mínimo privilegio",
           "npm run comprobar:bd\nnpm run comprobar:permisos",
           correr("npm run --silent comprobar:bd", cwd=APP) + "\n" + correr("npm run --silent comprobar:permisos", cwd=APP))
    build = correr("npm run build", cwd=APP).split("\n")
    build = [l for l in build if l.strip() and "telemetry" not in l and "Attention" not in l
             and "anonymous" not in l and "learn more" not in l.lower()]
    imagen("08_build_nextjs", "Evidencia 8. Compilación del proyecto Next.js", "npm run build", "\n".join(build))
    env = (APP / ".env.example").read_text(encoding="utf-8").strip()
    imagen("09_configuracion_sin_secretos", "Evidencia 9. Contenido de aplicacion/.env.example y aplicacion/.gitignore",
           "aplicacion/.env.example\naplicacion/.gitignore",
           env + "\n\n" + (APP / ".gitignore").read_text(encoding="utf-8").strip()
           + "\n\n# .env.local (con la contraseña real) existe y está excluido de Git; no se muestra.")


if __name__ == "__main__":
    main()
