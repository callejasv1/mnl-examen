#!/usr/bin/env python3
"""Renderiza el set de diagramas del Examen Teórico MNL en estilo unificado.

Estilo de casa (brutalista MNL): fondo #0a0a0a, señales en amarillo neón
#EFFF1A, acentos fucsia/cian, ejes y etiquetas en gris claro, tipografía
monoespaciada, texto grande para que sea legible en pantalla de teléfono.
Salida: assets/images/*.png a 1200x750.

Uso:
    uv run --with matplotlib scripts/render_diagrams.py
"""
from __future__ import annotations

import os

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
    fig.text(0.5, 0.955, text, ha="center", va="center", color="#ffffff",
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


def knob(ax, x, y, r, ang=110, color=NEON):
    ax.add_patch(Circle((x, y), r, facecolor=PANEL2, edgecolor=color, lw=1.8, zorder=4))
    ax.add_patch(Circle((x, y), r * 0.58, facecolor="#111114", edgecolor=FAINT, lw=1.0, zorder=5))
    a = np.deg2rad(ang)
    ax.plot([x, x + r * 0.86 * np.cos(a)], [y, y + r * 0.86 * np.sin(a)],
            color=color, lw=2.4, zorder=6, solid_capstyle="round")


def jack(ax, x, y, label=None, r=13):
    ax.add_patch(Circle((x, y), r, facecolor="#050505", edgecolor=FG, lw=1.5, zorder=4))
    ax.add_patch(Circle((x, y), r * 0.42, facecolor="#2f2f34", edgecolor="none", zorder=5))
    if label:
        ax.text(x, y - r - 7, label, ha="center", va="top", fontsize=LAB, color=FG)


def panel(ax, x0, y0, w, h):
    ax.add_patch(Rectangle((x0, y0), w, h, facecolor=PANEL, edgecolor=DIM, lw=1.6, zorder=2))
    for yy in (y0 + h - 16, y0 + 16):
        ax.add_patch(Circle((x0 + w / 2, yy), 5, facecolor="#000", edgecolor=DIM, lw=1, zorder=3))


def wave_glyph(ax, cx, cy, w, h, kind, color=NEON, lw=2.4):
    u = np.linspace(0, 1, 200)
    if kind == "saw":
        y = 2 * u - 1
    elif kind == "sqr":
        y = np.where(u < 0.5, 1.0, -1.0)
    elif kind == "tri":
        y = 2 * np.abs(2 * (u - np.floor(u + 0.5))) - 1
    else:
        y = np.sin(2 * np.pi * u)
    ax.plot(cx + (u - 0.5) * w, cy + y * h / 2, color=color, lw=lw,
            solid_capstyle="round", zorder=5)


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
    ax.set_xlabel("Tiempo (t)", fontsize=AX + 2)
    ax.set_ylabel("Voltaje (+V)", fontsize=AX + 2)
    save(fig, name)


# ── 2. Envolvente ADSR ───────────────────────────────────────────────────────
def adsr():
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    ax = fig.add_axes([0.12, 0.20, 0.82, 0.62])
    style_axis(ax, "CURVA DE ENVOLVENTE EN 4 ETAPAS")
    A, D, S, R = 1.0, 1.2, 2.4, 1.8
    Sx, Sy = 1.0, 7.0
    xs = [0, A, A + D, A + D + S, A + D + S + R]
    ys = [0, 10, Sy, Sy, 0]
    ax.plot(xs, ys, color=NEON, lw=3.0, solid_capstyle="round", zorder=4)
    ax.fill_between(xs, ys, color=NEON, alpha=0.07, zorder=1)
    ax.axhline(0, color=DIM, lw=1.2)
    labels = [("1", 0.5, 4.8), ("2", A + D * 0.5, 8.6), ("3", A + D + S * 0.5, Sy + 1.4), ("4", A + D + S + R * 0.5, 3.2)]
    for num, x, y in labels:
        ax.text(x, y, num, ha="center", va="center", color="#000000", fontsize=16,
                fontweight="bold", zorder=7,
                bbox=dict(boxstyle="circle,pad=0.34", facecolor=NEON, edgecolor=BG, linewidth=1.6))
    ax.annotate("", xy=(0, -1.2), xytext=(0, -2.8),
                arrowprops=dict(arrowstyle="-|>", color=PINK, lw=2.0))
    ax.text(0.1, -3.4, "Presionar tecla", ha="left", va="top", fontsize=14, color=PINK)
    ax.annotate("", xy=(A + D + S, -1.2), xytext=(A + D + S, -2.8),
                arrowprops=dict(arrowstyle="-|>", color=PINK, lw=2.0))
    ax.text(A + D + S - 0.1, -3.4, "Soltar tecla", ha="right", va="top", fontsize=14, color=PINK)
    ax.set_xlim(-0.6, A + D + S + R + 0.4)
    ax.set_ylim(-4.6, 12.4)
    ax.set_yticks([0, 10])
    ax.set_yticklabels(["0", "Nivel máx."], fontsize=AX)
    ax.set_xticks([])
    ax.set_xlabel("Tiempo (t)", fontsize=AX + 2)
    ax.set_ylabel("Voltaje / Nivel", fontsize=AX + 2)
    save(fig, "adsr_diagram.png")


# ── 3. Sample & Hold ─────────────────────────────────────────────────────────
def sample_hold():
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    head(fig, "CIRCUITO DE CONTROL MODULAR")
    rects = [(0.10, 0.70, 0.86, 0.17), (0.10, 0.41, 0.86, 0.17), (0.10, 0.12, 0.86, 0.17)]
    axs = [fig.add_axes(r) for r in rects]
    for a in axs:
        a.set_facecolor(BG)
        a.set_xticks([]); a.set_yticks([])
        for s in a.spines.values():
            s.set_color(DIM)
    def s(x):
        return 4 * np.sin(2 * np.pi * x / 3.0)

    t = np.linspace(0, 8, 1400)
    sig = s(t)
    trig = np.arange(0.5, 8, 1.15)
    samples = s(trig)                      # valor exacto de la onda en cada trigger
    idx = np.searchsorted(t, trig)
    hold = np.zeros_like(t)                # antes del primer trigger no hay captura
    for i, ix in enumerate(idx):
        end = idx[i + 1] if i + 1 < len(idx) else len(t)
        hold[ix:end] = samples[i]          # retiene el valor muestreado hasta el próximo trigger
    axs[0].plot(t, sig, color=CYAN, lw=2.4)
    axs[0].plot(trig, samples, "o", color=NEON, ms=5, zorder=5)  # puntos de muestreo
    axs[0].set_ylim(-6, 6)
    axs[1].vlines(trig, 0, 1, color=NEON, lw=5)
    axs[1].set_ylim(-0.2, 1.4)
    axs[2].step(t, hold, color=NEON, lw=2.6, where="post")
    axs[2].fill_between(t, hold, step="post", color=NEON, alpha=0.07)
    axs[2].set_ylim(-6, 6)
    for x in trig:
        for a in axs:
            a.axvline(x, color=GRID, lw=0.8, ls=(0, (1, 3)))
    titles = ["1. SEÑAL CONTINUA IN  (ej. Ruido o LFO)",
              "2. PULSOS DE TRIGGER  (Disparos de Clock)",
              "3. SEÑAL DE SALIDA  (Resultado modulador)"]
    for a, tt in zip(axs, titles):
        a.set_title(tt, loc="left", color=FG, fontsize=13, pad=6)
    save(fig, "sample_and_hold.png")


# ── 4. Respuesta de filtro ───────────────────────────────────────────────────
def filter_lpf():
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    ax = fig.add_axes([0.10, 0.17, 0.85, 0.68])
    style_axis(ax, "RESPUESTA EN FRECUENCIA")
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
    ax.set_ylabel("Amplitud (dB)", fontsize=AX + 2)
    ax.set_xlabel("Frecuencia (Hz)", fontsize=AX + 2)
    save(fig, "filter_lpf.png")


# ── 5. Gate / Trigger / Pitch CV ─────────────────────────────────────────────
def gate_trigger_pitch():
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    head(fig, "SEÑALES DE CONTROL")
    axs = [fig.add_axes([0.13, 0.66, 0.82, 0.16]),
           fig.add_axes([0.13, 0.40, 0.82, 0.16]),
           fig.add_axes([0.13, 0.12, 0.82, 0.18])]
    for a in axs:
        a.set_facecolor(BG)
        a.set_xticks([]); a.set_yticks([])
        for s in a.spines.values():
            s.set_color(DIM)
    press = [1.0, 4.6]
    release = [2.6, 6.2]
    axs[0].step([0, *sum([[p, p, r, r] for p, r in zip(press, release)], [])],
                [0, *sum([[0, 1, 1, 0] for _ in press], [])], color=NEON, lw=2.6)
    axs[0].set_xlim(0, 8); axs[0].set_ylim(-0.2, 1.5)
    for p in press:
        axs[1].plot([p, p, p + 0.18, p + 0.18], [0, 1, 1, 0], color=PINK, lw=2.6)
    axs[1].set_xlim(0, 8); axs[1].set_ylim(-0.2, 1.5)
    axs[2].plot([0, press[0], press[0], press[1], press[1], 7.6, 7.6],
                [0, 0, 3, 3, 6, 6, 6], color=CYAN, lw=2.8)
    axs[2].set_xlim(0, 8); axs[2].set_ylim(-1.4, 8)
    for a, letter in zip(axs, ["A", "B", "C"]):
        a.text(-0.02, 0.5, letter, transform=a.transAxes, ha="right", va="center",
               fontsize=24, fontweight="bold", color="#ffffff")
    for x in press + release:
        for a in axs:
            a.axvline(x, color=GRID, lw=0.7, ls=(0, (1, 3)))
    marks = [(press[0], "Presionar tecla\nNota 1 (ej. C3)"),
             (release[0], "Soltar tecla\nNota 1"),
             (press[1], "Presionar tecla\nNota 2 (más aguda)\nej. G3"),
             (release[1], "Soltar tecla\nNota 2")]
    for x, lab in marks:
        fig.text(0.13 + (x / 8) * 0.82, 0.055, lab, ha="center", va="top",
                 fontsize=11, color=FG)
    save(fig, "image8.png")


# ── 6. Algoritmo FM de 4 operadores ──────────────────────────────────────────
def fm_algorithm():
    fig, ax = canvas()
    head(fig, "ALGORITMO DE 4 OPERADORES")

    def op(x0, y0, n, w=200, h=95, fb=False):
        ax.add_patch(Rectangle((x0, y0), w, h, facecolor=PANEL, edgecolor=NEON, lw=2.0, zorder=3))
        ax.text(x0 + w / 2, y0 + h / 2, str(n), ha="center", va="center",
                color="#ffffff", fontsize=34, fontweight="bold", zorder=4)
        if fb:
            fx = x0 + w + 22
            ax.plot([x0 + w, fx, fx, x0 + w], [y0 + h - 14, y0 + h - 14, y0 + 14, y0 + 14],
                    color=PINK, lw=2.0, zorder=2)
            ax.add_patch(FancyArrowPatch((fx, y0 + 14), (x0 + w, y0 + 14),
                                         arrowstyle="-|>", mutation_scale=14,
                                         color=PINK, lw=2.0, zorder=2))

    op(230, 150, 1)           # portadora
    op(230, 330, 2)
    op(490, 330, 3)
    op(490, 510, 4, fb=True)
    ax.add_patch(FancyArrowPatch((330, 330), (330, 245), arrowstyle="-|>",
                                 mutation_scale=16, color=CYAN, lw=2.2, zorder=2))
    ax.add_patch(FancyArrowPatch((490, 350), (430, 195), arrowstyle="-|>",
                                 mutation_scale=16, color=CYAN, lw=2.2, zorder=2))
    ax.add_patch(FancyArrowPatch((590, 510), (590, 425), arrowstyle="-|>",
                                 mutation_scale=16, color=CYAN, lw=2.2, zorder=2))
    ax.plot([330, 330], [150, 70], color=NEON, lw=3.0)
    ax.add_patch(FancyArrowPatch((330, 92), (330, 58), arrowstyle="-|>",
                                 mutation_scale=16, color=NEON, lw=3.0))
    ax.text(350, 55, "BUS DE AUDIO (SALIDA)", ha="left", va="center",
            fontsize=14, color=NEON)
    ax.text(660, 620, "bucle de\nretroalimentación", ha="center", va="center",
            fontsize=12, color=PINK)
    save(fig, "image3.png")


# ── 7. FM y AM ───────────────────────────────────────────────────────────────
def mod_waves(name, kind):
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    head(fig, "COMPARACIÓN DE SEÑALES")
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
    axs[2].set_xlabel("Tiempo (t)", fontsize=13)
    save(fig, name)


# ── 8. Paneles de módulos (VCO / VCF / VCA) ──────────────────────────────────
def module_panel(name, kind):
    fig, ax = canvas()
    head(fig, "PANEL DE MÓDULO EURORACK")
    px, py, pw, ph = 360, 45, 480, 665
    panel(ax, px, py, pw, ph)
    jx, kx, kr = px + 120, px + 330, 34
    if kind == "vco":
        rows = [("SYNC", "RANGE", 660, 120), ("CV 1", "TUNE", 565, 100),
                ("CV 2", "PW", 470, 135), ("PW CV", "CV2", 375, 95)]
        outs = [("saw", "SAW"), ("sqr", "SQR"), ("tri", "TRI"), ("sin", "SIN")]
    elif kind == "vcf":
        rows = [("CV1 IN", "FRQ", 660, 125), ("CV2 IN", "CV2", 565, 100),
                ("AUDIO IN", "LEV", 470, 110), ("BP OUT", "RES", 375, 145),
                ("LP/HP OUT", "MIX", 280, 90)]
        outs = []
    else:  # vca
        rows = [("CV1", "GAIN", 660, 125), ("CV2", "CV2", 565, 100),
                ("AUDIO IN 1", "IN 1", 470, 110), ("AUDIO IN 2", "IN 2", 375, 105),
                ("AUDIO OUT", "OUT", 280, 95)]
        outs = []
    for jlab, klab, y, ang in rows:
        jack(ax, jx, y, label=jlab)
        knob(ax, kx, y, kr, ang=ang)
        ax.text(kx + kr + 14, y, klab, ha="left", va="center", fontsize=LAB, color=FG)
    if outs:
        for i, (glyph, lab) in enumerate(outs):
            cx = px + 92 + i * 98
            wave_glyph(ax, cx, 205, 70, 38, glyph)
            jack(ax, cx, 150, label=lab)
    else:
        ax.text(px + pw / 2, 175, "ENTRADAS  /  SALIDAS", ha="center", va="center",
                fontsize=14, color=DIM)
    ax.text(px + pw / 2, 92, "MAKE NOISE LAB", ha="center", va="center",
            fontsize=13, color=DIM)
    save(fig, name)


# ── 9. Parche VCV (esquema de ruteo) ─────────────────────────────────────────
def vcv_patch():
    fig, ax = canvas()
    head(fig, "PARCHE EN VCV RACK — ANÁLISIS DE RUTEO")
    mods = ["MIDI-CV", "VCO-1", "VCO-2", "VCF", "ADSR", "VCA", "AUDIO-8"]
    x0, y0, bw, bh, gap = 40, 320, 118, 250, 42

    def bot(m):
        i = mods.index(m)
        return (x0 + i * (bw + gap) + bw / 2, y0)

    def top(m):
        i = mods.index(m)
        return (x0 + i * (bw + gap) + bw / 2, y0 + bh)

    # Jack de destino (el que recibe el cable) y su color
    port_lab = {
        "MIDI-CV": ("V/OCT · GATE", CYAN),
        "VCO-1": ("V/OCT", CYAN),
        "VCO-2": ("", DIM),
        "VCF": ("AUDIO IN", NEON),
        "ADSR": ("GATE", PINK),
        "VCA": ("AUDIO IN", ORANGE),
        "AUDIO-8": ("IN", GREEN),
    }
    for i, m in enumerate(mods):
        x = x0 + i * (bw + gap)
        ax.add_patch(Rectangle((x, y0), bw, bh, facecolor=PANEL, edgecolor=DIM, lw=1.5, zorder=2))
        ax.text(x + bw / 2, y0 + bh - 26, m, ha="center", va="center", color="#ffffff",
                fontsize=NAME, fontweight="bold", zorder=3)
        lab, col = port_lab[m]
        if lab:
            ax.add_patch(Circle((x + bw / 2, y0 + 84), 7, facecolor="#000",
                                edgecolor=col, lw=1.6, zorder=4))
            ax.text(x + bw / 2, y0 + 60, lab, ha="center", va="center",
                    fontsize=11, color=col, zorder=4)
    cables = [
        (bot("MIDI-CV"), bot("VCO-1"), CYAN, -0.5),
        (bot("VCO-1"), bot("VCF"), NEON, -0.28),
        (bot("VCF"), bot("ADSR"), PINK, -0.5),
        (bot("ADSR"), bot("VCA"), ORANGE, -0.5),
        (bot("VCA"), bot("AUDIO-8"), GREEN, -0.5),
    ]
    for p, q, col, rad in cables:
        ax.add_patch(FancyArrowPatch(p, q, arrowstyle="-|>", mutation_scale=16,
                                     color=col, lw=3.0, zorder=4,
                                     connectionstyle=f"arc3,rad={rad}"))
    gp, ap = top("MIDI-CV"), top("ADSR")
    ax.add_patch(FancyArrowPatch(gp, ap, arrowstyle="-", color=FAINT, lw=1.8,
                                 ls=(0, (5, 5)), zorder=3,
                                 connectionstyle="arc3,rad=-0.35"))
    ax.text((gp[0] + ap[0]) / 2, y0 + bh + 70, "GATE   →   ADSR   (sin cable)",
            ha="center", va="center", fontsize=13, color=FAINT)
    ax.text(600, 45, "Los cables muestran el ruteo entre módulos.\n"
                     "Determina si la cadena de síntesis sustractiva es coherente.",
            ha="center", va="center", fontsize=13, color=DIM)
    save(fig, "image2.png")


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
    module_panel("image1.png", "vco")
    module_panel("image6.png", "vcf")
    module_panel("image7.png", "vca")
    vcv_patch()


if __name__ == "__main__":
    main()
