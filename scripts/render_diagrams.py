#!/usr/bin/env python3
"""Renderiza el set de diagramas del Examen Teórico MNL en estilo unificado.

Estilo de casa (brutalista MNL):
- Fondo oscuro #0a0a0a / #0d0d11.
- Señales en amarillo neón #EFFF1A, acentos fucsia #FF3399 / cian #22d3ee.
- Tipografía monoespaciada DejaVu Sans Mono, alta legibilidad en móviles y pantallas retina.
- Módulos Eurorack auténticos (Doepfer A-110, A-124 Wasp, A-130) montados en rack Eurorack oscuro.
- Parche en VCV Rack auténtico en alta resolución (1512x482) para análisis claro de ruteo y errores.

Uso:
    uv run --with matplotlib --with pillow --with numpy scripts/render_diagrams.py
"""
from __future__ import annotations

import os
from PIL import Image, ImageFilter, ImageDraw
import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle, FancyArrowPatch

# ── Tokens de marca ──────────────────────────────────────────────────────────
BG = "#0a0a0a"
PANEL = "#141417"
PANEL2 = "#1c1c20"
FG = "#e6e6ea"
GRID = "#2b2b30"
DIM = "#5b5b63"
FAINT = "#3a3a40"
NEON = "#EFFF1A"
PINK = "#FF3399"
CYAN = "#22d3ee"
ORANGE = "#fb923c"
GREEN = "#4ade80"

SRC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "source"))
OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "images"))
W, H, DPI = 1200, 750, 100

plt.rcParams.update({
    "font.family": "DejaVu Sans Mono",
    "text.color": FG,
    "axes.labelcolor": FG,
    "xtick.color": FG,
    "ytick.color": FG,
    "axes.edgecolor": DIM,
    "figure.facecolor": BG,
    "axes.facecolor": BG,
    "savefig.facecolor": BG,
})

TITLE = 20
NAME = 17
LAB = 16
AX = 14


def save(fig, name):
    os.makedirs(OUT, exist_ok=True)
    fig.savefig(os.path.join(OUT, name), dpi=DPI)
    plt.close(fig)
    print("wrote", name)


def canvas():
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W)
    ax.set_ylim(0, H)
    ax.set_facecolor(BG)
    ax.axis("off")
    return fig, ax


def head(fig, text):
    fig.text(0.5, 0.945, text, ha="center", va="center", color="#ffffff",
             fontsize=TITLE, fontweight="bold")


def style_axis(ax, title=None):
    for s in ax.spines.values():
        s.set_color(DIM)
    ax.grid(True, color=GRID, lw=0.8, ls=(0, (1, 3)))
    ax.tick_params(colors=FG, labelsize=AX)
    ax.set_facecolor(BG)
    if title:
        ax.set_title(title, color="#ffffff", fontsize=TITLE - 1,
                     fontweight="bold", pad=14)


# ── 1. Osciloscopio: diente de sierra y cuadrada ─────────────────────────────
def osc_wave(name, kind):
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    ax = fig.add_axes([0.13, 0.15, 0.82, 0.72])
    style_axis(ax, "MONITOR DE OSCILOSCOPIO ANALÓGICO")
    t = np.linspace(0, 4, 2000)
    if kind == "saw":
        y = 10 * (t - np.floor(t)) - 5
    else:
        y = np.sign(np.sin(np.pi * t)) * 5
    ax.plot(t, y, color=NEON, lw=2.8, solid_capstyle="round")
    ax.axhline(0, color=DIM, lw=1.2)
    ax.set_xlim(0, 4)
    ax.set_ylim(-6.8, 7)
    ax.set_yticks([-5, 0, 5])
    ax.set_yticklabels(["-5 V", "0 V", "+5 V"], fontsize=AX)
    ax.set_xticks([])
    ax.set_xlabel("Tiempo (t)", fontsize=AX + 2, color="#ffffff")
    ax.set_ylabel("Voltaje (+V)", fontsize=AX + 2, color="#ffffff")
    save(fig, name)


# ── 2. Envolvente ADSR ───────────────────────────────────────────────────────
def adsr():
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    head(fig, "CURVA DE ENVOLVENTE ANALÓGICA EN 4 ETAPAS")
    ax = fig.add_axes([0.12, 0.20, 0.82, 0.65])
    style_axis(ax)

    A, D, S, R = 1.0, 1.2, 2.4, 1.8
    Sx, Sy = 1.0, 7.0
    xs = [0, A, A + D, A + D + S, A + D + S + R]
    ys = [0, 10, Sy, Sy, 0]

    ax.plot(xs, ys, color=NEON, lw=3.2, solid_capstyle="round", zorder=4)
    ax.fill_between(xs, ys, color=NEON, alpha=0.08, zorder=1)
    ax.axhline(0, color=DIM, lw=1.2)

    # Badges 1, 2, 3, 4 con el 3 centrado en la meseta de sustain
    labels = [
        ("1", 0.5, 5.0),
        ("2", A + D * 0.5, 8.5),
        ("3", A + D + S * 0.5, Sy),
        ("4", A + D + S + R * 0.5, 3.5),
    ]
    for num, x, y in labels:
        ax.text(x, y, num, ha="center", va="center", color="#000000", fontsize=18,
                fontweight="bold", zorder=7,
                bbox=dict(boxstyle="circle,pad=0.36", facecolor=NEON, edgecolor=BG, linewidth=2.0))

    ax.annotate("", xy=(0, -1.2), xytext=(0, -2.6),
                arrowprops=dict(arrowstyle="-|>", color=PINK, lw=2.2))
    ax.text(0.1, -3.2, "Presionar tecla\n(Inicio Gate)", ha="left", va="top", fontsize=13, color=PINK)

    ax.annotate("", xy=(A + D + S, -1.2), xytext=(A + D + S, -2.6),
                arrowprops=dict(arrowstyle="-|>", color=PINK, lw=2.2))
    ax.text(A + D + S - 0.1, -3.2, "Soltar tecla\n(Fin Gate)", ha="right", va="top", fontsize=13, color=PINK)

    ax.set_xlim(-0.6, A + D + S + R + 0.6)
    ax.set_ylim(-4.8, 12.0)
    ax.set_yticks([0, 10])
    ax.set_yticklabels(["0 V", "Nivel máx."], fontsize=AX)
    ax.set_xticks([])
    ax.set_xlabel("Tiempo (t)", fontsize=AX + 2, color="#ffffff")
    ax.set_ylabel("Voltaje / Nivel", fontsize=AX + 2, color="#ffffff")
    save(fig, "adsr_diagram.png")


# ── 3. Sample & Hold ─────────────────────────────────────────────────────────
def sample_hold():
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    head(fig, "CIRCUITO DE CONTROL MODULAR — SEÑALES DE VOLTAJE")
    rects = [(0.10, 0.70, 0.86, 0.17), (0.10, 0.41, 0.86, 0.17), (0.10, 0.12, 0.86, 0.17)]
    axs = [fig.add_axes(r) for r in rects]
    for a in axs:
        a.set_facecolor(BG)
        a.set_xticks([]); a.set_yticks([])
        for s in a.spines.values():
            s.set_color(DIM)
        a.set_xlim(0, 8)

    def s(x):
        return 4 * np.sin(2 * np.pi * x / 3.0)

    t = np.linspace(0, 8, 2000)
    sig = s(t)
    trig = np.arange(0.6, 8.0, 1.2)
    samples = s(trig)

    # 1. Señal continua analógica IN
    axs[0].plot(t, sig, color=CYAN, lw=2.4)
    axs[0].plot(trig, samples, "o", color=NEON, ms=7, zorder=5)
    axs[0].set_ylim(-6, 6)

    # 2. Pulsos de Trigger sincronizados
    for tr in trig:
        axs[1].fill_between([tr, tr + 0.08], [0, 0], [1, 1], color=NEON, zorder=4)
        axs[1].plot([tr, tr, tr + 0.08, tr + 0.08], [0, 1, 1, 0], color=NEON, lw=2.0, zorder=5)
    axs[1].set_ylim(-0.2, 1.4)

    # 3. Señal de Salida (Hold) con saltos exactamente en cada trigger
    xs = [0, trig[0], trig[0]]
    ys = [0, 0, samples[0]]
    for i in range(len(trig)):
        t_end = trig[i + 1] if i + 1 < len(trig) else 8.0
        val = samples[i]
        xs.extend([t_end])
        ys.extend([val])
        if i + 1 < len(trig):
            next_val = samples[i + 1]
            xs.extend([t_end])
            ys.extend([next_val])

    axs[2].plot(xs, ys, color=NEON, lw=2.6, zorder=4)
    axs[2].fill_between(xs, ys, 0, color=NEON, alpha=0.08)
    axs[2].set_ylim(-6, 6)
    axs[2].axhline(0, color=DIM, lw=1.0)

    # Líneas guía de sincronización vertical
    for tr in trig:
        for a in axs:
            a.axvline(tr, color="#333333", lw=1.2, ls=(0, (3, 3)), zorder=1)

    titles = ["1. SEÑAL CONTINUA IN  (ej. Ruido o LFO)",
              "2. PULSOS DE TRIGGER  (Disparos de Clock)",
              "3. SEÑAL DE SALIDA  (Voltaje modulador retenido)"]
    for a, tt in zip(axs, titles):
        a.set_title(tt, loc="left", color=FG, fontsize=13, pad=6, fontweight="bold")
    save(fig, "sample_and_hold.png")


# ── 4. Respuesta de filtro ───────────────────────────────────────────────────
def filter_lpf():
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    ax = fig.add_axes([0.10, 0.17, 0.85, 0.68])
    style_axis(ax, "RESPUESTA EN FRECUENCIA — FILTRO ANALÓGICO VCF")
    f = np.logspace(1, np.log10(20000), 900)
    fc = 1000.0
    mag = np.where(f <= fc, 0.0, np.maximum(-40.0, -24 * np.log2(f / fc)))
    ax.semilogx(f, mag, color=NEON, lw=3.0)
    ax.set_xlim(20, 20000)
    ax.set_ylim(-40, 3)
    ax.set_yticks([0, -6, -12, -18, -24, -36])
    ax.set_xticks([20, 100, 500, 1000, 5000, 10000, 20000])
    ax.set_xticklabels(["20 Hz", "100 Hz", "500 Hz", "1 kHz", "5 kHz", "10 kHz", "20 kHz"],
                       fontsize=12)
    ax.set_ylabel("Amplitud (dB)", fontsize=AX + 2, color="#ffffff")
    ax.set_xlabel("Frecuencia (Hz)", fontsize=AX + 2, color="#ffffff")
    save(fig, "filter_lpf.png")


# ── 5. Gate / Trigger / Pitch CV ─────────────────────────────────────────────
def gate_trigger_pitch():
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    head(fig, "SEÑALES DE CONTROL MODULAR POR EVENTO DE TECLA")
    axs = [fig.add_axes([0.13, 0.69, 0.82, 0.17]),
           fig.add_axes([0.13, 0.45, 0.82, 0.17]),
           fig.add_axes([0.13, 0.21, 0.82, 0.17])]
    for a in axs:
        a.set_facecolor(BG)
        a.set_xticks([]); a.set_yticks([])
        for s in a.spines.values():
            s.set_color(DIM)

    press = [1.0, 4.6]
    release = [2.6, 6.2]

    # A: Gate (compuerta sostenida)
    axs[0].step([0, *sum([[p, p, r, r] for p, r in zip(press, release)], [])],
                [0, *sum([[0, 1, 1, 0] for _ in press], [])], color=NEON, lw=2.8)
    axs[0].set_xlim(0, 8); axs[0].set_ylim(-0.2, 1.5)

    # B: Trigger (pulso breve)
    for p in press:
        axs[1].plot([p, p, p + 0.18, p + 0.18], [0, 1, 1, 0], color=PINK, lw=2.8)
    axs[1].set_xlim(0, 8); axs[1].set_ylim(-0.2, 1.5)

    # C: Pitch CV (voltaje escalonado proporcional al tono)
    axs[2].plot([0, press[0], press[0], press[1], press[1], 7.6, 7.6],
                [0, 0, 3, 3, 6, 6, 6], color=CYAN, lw=3.0)
    axs[2].set_xlim(0, 8); axs[2].set_ylim(-1.4, 8)

    for a, letter in zip(axs, ["A", "B", "C"]):
        a.text(-0.02, 0.5, letter, transform=a.transAxes, ha="right", va="center",
               fontsize=26, fontweight="bold", color="#ffffff")

    for x in press + release:
        for a in axs:
            a.axvline(x, color=GRID, lw=0.8, ls=(0, (1, 3)))

    marks = [(press[0], "Presionar tecla\nNota 1 (ej. C3)"),
             (release[0], "Soltar tecla\nNota 1"),
             (press[1], "Presionar tecla\nNota 2 (más aguda)\nej. G3"),
             (release[1], "Soltar tecla\nNota 2")]
    for x, lab in marks:
        fig.text(0.13 + (x / 8) * 0.82, 0.11, lab, ha="center", va="top",
                 fontsize=12, color=FG)
    save(fig, "image8.png")


# ── 6. Algoritmo FM de 4 operadores ──────────────────────────────────────────
def fm_algorithm():
    fig, ax = canvas()
    head(fig, "ALGORITMO FM DE 4 OPERADORES")

    def op(x0, y0, n, w=200, h=95, fb=False):
        ax.add_patch(Rectangle((x0, y0), w, h, facecolor=PANEL, edgecolor=NEON, lw=2.2, zorder=3))
        ax.text(x0 + w / 2, y0 + h / 2, str(n), ha="center", va="center",
                color="#ffffff", fontsize=34, fontweight="bold", zorder=4)
        if fb:
            fx = x0 + w + 35
            fy_top = y0 + h - 15
            fy_bot = y0 + 15
            ax.plot([x0 + w, fx, fx, x0 + w], [fy_top, fy_top, fy_bot, fy_bot],
                    color=PINK, lw=2.4, zorder=2)
            ax.add_patch(FancyArrowPatch((fx, fy_bot), (x0 + w + 2, fy_bot),
                                         arrowstyle="-|>", mutation_scale=16,
                                         color=PINK, lw=2.4, zorder=2))

    # Operadores: 1 abajo, 2 arriba de 1; 3 a la derecha; 4 arriba de 3
    op(300, 150, 1)           # Portadora (Carrier)
    op(300, 340, 2)           # Modulador paralelo 1
    op(600, 340, 3)           # Modulador paralelo 2
    op(600, 520, 4, fb=True)  # Modulador con feedback sobre 3

    # Flechas de modulación
    # Op 2 -> Op 1
    ax.add_patch(FancyArrowPatch((400, 340), (400, 245), arrowstyle="-|>",
                                 mutation_scale=18, color=CYAN, lw=2.5, zorder=2))
    # Op 3 -> Op 1 (diagonal)
    ax.add_patch(FancyArrowPatch((600, 340), (480, 245), arrowstyle="-|>",
                                 mutation_scale=18, color=CYAN, lw=2.5, zorder=2))
    # Op 4 -> Op 3
    ax.add_patch(FancyArrowPatch((700, 520), (700, 435), arrowstyle="-|>",
                                 mutation_scale=18, color=CYAN, lw=2.5, zorder=2))

    # Salida de audio desde Op 1 al bus
    ax.plot([400, 400], [150, 65], color=NEON, lw=3.2)
    ax.add_patch(FancyArrowPatch((400, 85), (400, 55), arrowstyle="-|>",
                                 mutation_scale=18, color=NEON, lw=3.2))
    ax.text(420, 55, "BUS DE AUDIO (SALIDA)", ha="left", va="center",
            fontsize=14, color=NEON, fontweight="bold")

    save(fig, "image3.png")


# ── 7. FM y AM ───────────────────────────────────────────────────────────────
def mod_waves(name, kind):
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    head(fig, "COMPARACIÓN DE SEÑALES DE MODULACIÓN")
    axs = [fig.add_axes([0.12, 0.66, 0.84, 0.19]),
           fig.add_axes([0.12, 0.38, 0.84, 0.19]),
           fig.add_axes([0.12, 0.10, 0.84, 0.19])]
    for a in axs:
        a.set_facecolor(BG)
        for s in a.spines.values():
            s.set_color(DIM)
        a.grid(True, color=GRID, lw=0.7, ls=(0, (1, 3)))
        a.tick_params(colors=FG, labelsize=12)
        a.set_xlim(0, 10)
        a.set_ylim(-1.3, 1.3)
        a.set_yticks([-1, 0, 1])
    t = np.linspace(0, 10, 4000)
    carrier = np.sin(2 * np.pi * 6 * t)
    modul = np.sin(2 * np.pi * 0.7 * t)
    result = np.sin(2 * np.pi * 6 * t + 3.0 * modul) if kind == "fm" else (0.55 + 0.42 * modul) * carrier
    for a, y, lab in zip(axs, [carrier, modul, result],
                         ["PORTADORA", "MODULADOR", "RESULTADO"]):
        col = NEON if lab == "RESULTADO" else CYAN
        a.plot(t, y, color=col, lw=2.2)
        a.text(0.0, 1.04, lab, transform=a.transAxes, ha="left", va="bottom",
               fontsize=14, fontweight="bold", color="#ffffff")
    axs[0].set_xticklabels([])
    axs[1].set_xticklabels([])
    axs[2].set_xlabel("Tiempo (t)", fontsize=13, color="#ffffff")
    save(fig, name)


# ── 8. Módulos Eurorack auténticos montados en Rack ──────────────────────────
def rack_module(out_name, src_name, target_h=720):
    src_path = os.path.join(SRC_DIR, src_name)
    im = Image.open(src_path)
    arr = np.array(im)
    white_mask = (arr[:, :, 0] > 245) & (arr[:, :, 1] > 245) & (arr[:, :, 2] > 245)
    non_white = np.where(~white_mask)
    ymin, ymax = non_white[0].min(), non_white[0].max()
    xmin, xmax = non_white[1].min(), non_white[1].max()

    crop = im.crop((xmin, ymin, xmax + 1, ymax + 1))

    scale = target_h / crop.height
    target_w = int(round(crop.width * scale))
    crop_scaled = crop.resize((target_w, target_h), Image.Resampling.LANCZOS)

    canvas_w = max(700, target_w + 240)
    canvas_h = target_h + 80
    canvas_im = Image.new("RGB", (canvas_w, canvas_h), "#0d0d11")
    draw = ImageDraw.Draw(canvas_im)

    # Rieles Eurorack superior e inferior
    rail_h = 36
    draw.rectangle([0, 0, canvas_w, rail_h], fill="#18181d", outline="#2a2a32")
    draw.rectangle([0, canvas_h - rail_h, canvas_w, canvas_h], fill="#18181d", outline="#2a2a32")

    # Orificios de tornillos en rieles
    for x in range(20, canvas_w, 32):
        draw.ellipse([x - 3, rail_h // 2 - 3, x + 3, rail_h // 2 + 3], fill="#08080a", outline="#3a3a44")
        draw.ellipse([x - 3, canvas_h - rail_h // 2 - 3, x + 3, canvas_h - rail_h // 2 + 3], fill="#08080a", outline="#3a3a44")

    # Posición central del módulo
    cx = (canvas_w - target_w) // 2
    cy = (canvas_h - target_h) // 2

    # Sombra sutil para profundidad Eurorack
    shadow = Image.new("RGBA", (target_w + 20, target_h + 20), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rectangle([6, 6, target_w + 14, target_h + 14], fill=(0, 0, 0, 160))
    shadow = shadow.filter(ImageFilter.GaussianBlur(6))
    canvas_im.paste(shadow, (cx - 10, cy - 10), shadow)

    canvas_im.paste(crop_scaled, (cx, cy))
    out_path = os.path.join(OUT, out_name)
    canvas_im.save(out_path, dpi=(DPI, DPI))
    print("wrote rack module", out_name, canvas_im.size)


# ── 9. Parche auténtico en VCV Rack (Resolución 2x mejorada) ─────────────────
def vcv_patch_rack(out_name, src_name):
    src_path = os.path.join(SRC_DIR, src_name)
    im = Image.open(src_path)
    w, h = im.size
    target_w = w * 2
    target_h = h * 2

    scaled = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    scaled = scaled.filter(ImageFilter.UnsharpMask(radius=1.5, percent=120, threshold=2))

    pad = 16
    out_im = Image.new("RGB", (target_w + pad * 2, target_h + pad * 2), "#0a0a0a")
    out_im.paste(scaled, (pad, pad))

    out_path = os.path.join(OUT, out_name)
    out_im.save(out_path, dpi=(DPI, DPI))
    print("wrote authentic vcv patch", out_name, out_im.size)


def main():
    os.makedirs(OUT, exist_ok=True)
    osc_wave("waveforms_saw.png", "saw")
    osc_wave("waveforms_square.png", "square")
    adsr()
    sample_hold()
    filter_lpf()
    gate_trigger_pitch()
    fm_algorithm()
    mod_waves("image4.png", "fm")
    mod_waves("image5.png", "am")
    rack_module("image1.png", "module_vco_doepfer.png")
    rack_module("image6.png", "module_vcf_wasp.png")
    rack_module("image7.png", "module_vca_doepfer.png")
    vcv_patch_rack("image2.png", "vcv_patch_original.png")


if __name__ == "__main__":
    main()
