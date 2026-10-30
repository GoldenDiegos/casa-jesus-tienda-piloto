"""Figuras 1 y 2: arquitectura del piloto (estado al 30/10/2026) y flujo previsto de datos.

Uso: python generar_diagramas.py  →  fig1_arquitectura.png y fig2_flujo_datos.png a 300 ppp.
"""
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

DEST = Path(__file__).resolve().parent
NAVY = '#263d59'
TEAL = '#237f84'
GRAY = '#6a7785'
NARANJA = '#b5651d'
FONDO_LOCAL = '#eef4f7'

# Estado de cada conexión: color, estilo de línea y texto de la leyenda
ESTADOS = {
    'comprobado': (TEAL, 'solid', 'Configurado y comprobado'),
    'previsto': (GRAY, 'dashed', 'Previsto, sin configurar'),
    'pendiente': (NARANJA, 'dotted', 'Pendiente de una decisión o cuenta'),
}


def caja(ax, x, y, w, h, titulo, detalle, estado, color=NAVY):
    borde = {'comprobado': TEAL, 'previsto': GRAY, 'pendiente': NARANJA}[estado]
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.006,rounding_size=0.018',
                                linewidth=1.6 if estado == 'comprobado' else 1.1, edgecolor=borde,
                                facecolor='white', linestyle='solid' if estado == 'comprobado' else (0, (4, 2)),
                                zorder=2))
    ax.text(x + w / 2, y + h - 0.032, titulo, ha='center', va='top', color=color, fontsize=9.5,
            fontweight='bold', zorder=3)
    ax.text(x + w / 2, y + 0.018, detalle, ha='center', va='bottom', color='#333333', fontsize=8,
            linespacing=1.25, zorder=3)


def flecha(ax, a, b, estado, etiqueta=None, pos=0.5, dx=0, dy=0.018, rad=0, ha='center'):
    color, estilo, _ = ESTADOS[estado]
    ax.add_patch(FancyArrowPatch(a, b, arrowstyle='-|>', mutation_scale=11, linestyle=estilo,
                                 linewidth=1.8 if estado == 'comprobado' else 1.2, color=color,
                                 connectionstyle=f'arc3,rad={rad}', shrinkA=2, shrinkB=2, zorder=1))
    if etiqueta:
        x = a[0] + (b[0] - a[0]) * pos + dx
        y = a[1] + (b[1] - a[1]) * pos + dy
        ax.text(x, y, etiqueta, ha=ha, va='bottom', fontsize=8, color=color, zorder=4,
                bbox=dict(facecolor='white', edgecolor='none', pad=0.6))


def fig_arquitectura():
    fig, ax = plt.subplots(figsize=(7.2, 5.6))
    ax.set(xlim=(0, 1), ylim=(0, 1))
    ax.axis('off')

    # Equipo de desarrollo: lo que ya corre en la computadora de Diego
    ax.add_patch(FancyBboxPatch((0.27, 0.43), 0.70, 0.50, boxstyle='round,pad=0.006,rounding_size=0.02',
                                linewidth=1, edgecolor=NAVY, facecolor=FONDO_LOCAL, zorder=0))
    ax.text(0.29, 0.905, 'Equipo de desarrollo (Windows) · solo escucha en 127.0.0.1', fontsize=8.5,
            color=NAVY, fontweight='bold', va='center')

    caja(ax, 0.02, 0.69, 0.19, 0.16, 'Navegador', 'Cliente o\nadministradora\n(prueba: misma PC)', 'comprobado')
    caja(ax, 0.30, 0.66, 0.27, 0.19, 'Aplicación Next.js 16', 'Páginas y servidor\nlib/bd.mjs (mysql2)\npuerto 3100', 'comprobado')
    caja(ax, 0.69, 0.66, 0.26, 0.19, 'MariaDB 10.4', 'casa_jesus_piloto: 10 tablas\n9 claves foráneas · 13 CHECK\npuerto 3307', 'comprobado', TEAL)
    caja(ax, 0.30, 0.46, 0.20, 0.13, 'Repositorio Git', 'Código y evidencias\n.env.local excluido', 'comprobado')

    caja(ax, 0.02, 0.25, 0.22, 0.13, 'GitHub', 'Repositorio público\ncasa-jesus-tienda-piloto', 'comprobado')
    caja(ax, 0.02, 0.05, 0.22, 0.13, 'Vercel', 'Desde GitHub; espera\nla base remota', 'pendiente')
    caja(ax, 0.30, 0.05, 0.22, 0.13, 'Base remota', 'MySQL en la nube o\nSupabase: por decidir', 'pendiente')
    caja(ax, 0.50, 0.25, 0.18, 0.13, 'Mercado Pago', 'Checkout Pro\nmodo de prueba', 'pendiente')
    caja(ax, 0.79, 0.25, 0.18, 0.13, 'Resend', 'Correo con\nel folio', 'previsto')
    caja(ax, 0.58, 0.05, 0.39, 0.13, 'Autenticación y almacenamiento',
         'Acceso de la administradora e imágenes;\nirán conectados a Next.js. Sin elegir', 'pendiente')

    flecha(ax, (0.21, 0.775), (0.30, 0.775), 'comprobado', 'HTTP', dy=0.012)
    flecha(ax, (0.57, 0.775), (0.69, 0.775), 'comprobado', 'SQL, solo\nlectura', dy=0.012)
    flecha(ax, (0.40, 0.59), (0.40, 0.66), 'comprobado', 'código fuente', pos=0.5, dx=0.008, dy=-0.012, ha='left')
    flecha(ax, (0.30, 0.50), (0.17, 0.38), 'comprobado', 'git push', pos=0.45, dx=0.03, dy=-0.005)
    flecha(ax, (0.13, 0.25), (0.13, 0.18), 'pendiente')
    flecha(ax, (0.24, 0.115), (0.30, 0.115), 'pendiente')
    # Mercado Pago: ida (preferencia) y vuelta (aviso), por el hueco a la derecha del repositorio
    flecha(ax, (0.525, 0.66), (0.555, 0.38), 'pendiente')
    flecha(ax, (0.625, 0.38), (0.555, 0.66), 'pendiente')
    ax.text(0.578, 0.505, '↓ preferencia de pago\n↑ aviso (webhook)', fontsize=8, color=NARANJA, va='center', ha='left',
            bbox=dict(facecolor=FONDO_LOCAL, edgecolor='none', pad=0.6), zorder=4)
    flecha(ax, (0.57, 0.70), (0.86, 0.38), 'previsto', 'correo\ncon folio', pos=0.8, dx=0.02, dy=-0.02, ha='left')

    ax.legend(handles=[Line2D([0], [0], color=c, linestyle=e, linewidth=1.8, label=t) for c, e, t in ESTADOS.values()],
              loc='lower center', bbox_to_anchor=(0.5, -0.06), ncol=3, frameon=False, fontsize=8, handlelength=2.6)
    fig.tight_layout(pad=0.2)
    fig.savefig(DEST / 'fig1_arquitectura.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close(fig)


def fig_flujo():
    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.set(xlim=(0, 1), ylim=(0, 1))
    ax.axis('off')
    pasos = [
        ('1. Catálogo', 'Next.js lee productos\nen MariaDB', 'comprobado'),
        ('2. Selección', 'Productos, punto\ny horario', 'previsto'),
        ('3. Servidor', 'Valida cupo y\nrecalcula el total', 'previsto'),
        ('4. Pedido', 'Guarda pedido y detalle\nen estado «pendiente»', 'previsto'),
        ('5. Pago de prueba', 'Mercado Pago cobra;\nla tienda no ve la tarjeta', 'pendiente'),
        ('6. Estado y aviso', 'Si se aprueba: «pagado»,\nhistorial y correo', 'previsto'),
    ]
    posiciones = [(0.03, 0.66), (0.36, 0.66), (0.69, 0.66), (0.69, 0.30), (0.36, 0.30), (0.03, 0.30)]
    for (t, d, e), (x, y) in zip(pasos, posiciones):
        caja(ax, x, y, 0.28, 0.20, t, d, e)
    for a, b in [((0.31, 0.76), (0.36, 0.76)), ((0.64, 0.76), (0.69, 0.76)), ((0.83, 0.66), (0.83, 0.50)),
                 ((0.69, 0.40), (0.64, 0.40)), ((0.36, 0.40), (0.31, 0.40))]:
        flecha(ax, a, b, 'previsto')
    ax.text(0.5, 0.17, 'Tablas: 1 productos · 3 horarios_entrega · 4 pedidos y detalle_pedido · 5 pagos · '
            '6 historial_estado_pedido.\nSi el pago se rechaza, el pedido no se confirma. '
            'El donativo sin compra va a donativos_independientes y pagos.',
            ha='center', va='center', fontsize=8, color='#333333', linespacing=1.4)
    ax.legend(handles=[Line2D([0], [0], color=c, linestyle=e, linewidth=1.8, label=t) for c, e, t in ESTADOS.values()],
              loc='lower center', bbox_to_anchor=(0.5, -0.03), ncol=3, frameon=False, fontsize=8, handlelength=2.6)
    fig.tight_layout(pad=0.2)
    fig.savefig(DEST / 'fig2_flujo_datos.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close(fig)


if __name__ == '__main__':
    fig_arquitectura()
    fig_flujo()
    print('ok figuras 1 y 2')
