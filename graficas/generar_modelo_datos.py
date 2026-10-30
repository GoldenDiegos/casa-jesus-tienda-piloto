"""Figura del modelo relacional de casa_jesus_piloto (esquema tras la migración 001).

Se dibuja a 6.5" de ancho, el ancho útil de la hoja, para que el texto quede en 8 pt impreso.
Uso: python generar_modelo_datos.py  →  fig3_modelo_datos.png a 300 ppp.
"""
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

OUT = Path(__file__).resolve().parent / 'fig3_modelo_datos.png'
NAVY = '#263d59'
TEAL = '#237f84'

# nombre: (columna, fila, campos). Fila 0 arriba.
TABLAS = {
    'categorias': (0, 0, ['PK id', 'nombre VARCHAR(100)', 'activa BOOLEAN']),
    'productos': (1, 0, ['PK id', 'FK categoria_id (opcional)', 'nombre VARCHAR(160)', 'precio DECIMAL(10,2) ≥ 0',
                         'disponible · activo', 'imagen_ruta']),
    'detalle_pedido': (2, 0, ['PK id', 'FK pedido_id', 'FK producto_id', 'nombre_producto (copia)',
                              'precio_unitario ≥ 0', 'cantidad INT > 0']),
    'puntos_entrega': (0, 1, ['PK id', 'nombre VARCHAR(160)', 'indicaciones', 'activo']),
    'horarios_entrega': (1, 1, ['PK id', 'FK punto_id', 'inicio · fin DATETIME', 'cupo INT', 'activo']),
    'pedidos': (2, 1, ['PK id', 'folio ÚNICO', 'nombre_contacto · telefono', 'correo (opcional)', 'FK horario_id',
                       'subtotal · donativo · total', 'estado ENUM']),
    'perfiles': (0, 2, ['PK id', 'correo ÚNICO', "rol ENUM", 'activo']),
    'historial_estado_pedido': (1, 2, ['PK id', 'FK pedido_id', 'estado_anterior · estado_nuevo',
                                       "origen ENUM", 'FK actor_id (opcional)', 'cambiado_en']),
    'pagos': (2, 2, ['PK id', 'FK pedido_id (opcional)', 'FK donativo_id (opcional)', 'proveedor',
                     'referencia_externa', 'importe > 0 · estado']),
    'donativos_independientes': (2, 3, ['PK id', 'folio ÚNICO', 'importe > 10', 'nombre_donante (opcional)',
                                        'anonimo · estado']),
}
W, X0, DX = 2.0, 0.05, 2.2       # ancho de caja y separación, en pulgadas
FILAS_Y = [8.5, 6.55, 4.38, 2.42]  # borde superior de cada fila
LINEA, CABEZA = 0.205, 0.30


def caja(nombre):
    col, fila, campos = TABLAS[nombre]
    x = X0 + col * DX
    top = FILAS_Y[fila]
    h = CABEZA + 0.08 + LINEA * len(campos)
    return x, top - h, W, h


def flecha(origen, destino, lado_o, lado_d, rad=0.0):
    def punto(nombre, lado):
        x, y, w, h = caja(nombre)
        return {'izq': (x, y + h - 0.5), 'der': (x + w, y + h - 0.5), 'arr': (x + w / 2, y + h),
                'aba': (x + w / 2, y), 'der_arr': (x + w, y + h - 0.2), 'aba_izq': (x + w * 0.12, y)}[lado]
    plt.gca().add_patch(FancyArrowPatch(punto(origen, lado_o), punto(destino, lado_d), arrowstyle='-|>',
                                        mutation_scale=9, linewidth=1, color='#7d8c99',
                                        connectionstyle=f'arc3,rad={rad}', zorder=1))


fig = plt.figure(figsize=(6.5, 8.6))
ax = fig.add_axes([0, 0, 1, 1])
ax.set(xlim=(0, 6.5), ylim=(0, 8.6))
ax.axis('off')

flecha('productos', 'categorias', 'izq', 'der')
flecha('detalle_pedido', 'productos', 'izq', 'der')
flecha('detalle_pedido', 'pedidos', 'aba', 'arr')
flecha('horarios_entrega', 'puntos_entrega', 'izq', 'der')
flecha('pedidos', 'horarios_entrega', 'izq', 'der')
flecha('historial_estado_pedido', 'perfiles', 'izq', 'der')
flecha('historial_estado_pedido', 'pedidos', 'der_arr', 'aba_izq')  # por el hueco entre columnas
flecha('pagos', 'pedidos', 'arr', 'aba')
flecha('pagos', 'donativos_independientes', 'aba', 'arr')

for nombre, (_, _, campos) in TABLAS.items():
    x, y, w, h = caja(nombre)
    nuevo = nombre in ('historial_estado_pedido', 'donativos_independientes')
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.02,rounding_size=0.04', linewidth=1,
                                edgecolor='#b4c2ce', facecolor='white', zorder=2))
    ax.add_patch(plt.Rectangle((x, y + h - CABEZA), w, CABEZA, color=TEAL if nuevo else NAVY, zorder=3))
    ax.text(x + 0.07, y + h - CABEZA / 2, nombre, va='center', ha='left', fontsize=8.6, color='white',
            weight='bold', zorder=4)
    for i, campo in enumerate(campos):
        ax.text(x + 0.07, y + h - CABEZA - 0.16 - i * LINEA, campo, va='center', ha='left', fontsize=8,
                color='#20252c', zorder=4)

ax.text(0.05, 0.55, 'Encabezado turquesa: tablas ajustadas con la migración 001 (R-008 y R-017).',
        fontsize=8, color='#3b4550', va='center')
ax.text(0.05, 0.25, 'Las flechas van de la clave foránea a la tabla referenciada.', fontsize=8, color='#3b4550',
        va='center')
fig.savefig(OUT, dpi=300, facecolor='white')
print(OUT)
