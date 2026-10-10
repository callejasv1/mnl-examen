# AGENTS.md — Examen Teórico MNL

App web estática (sin build) del Examen Teórico del Diplomado en Síntesis
Modular de Make Noise Lab.

## Rama y push
- **NUNCA `git push` a `main`** (producción, GitHub Pages).
- Trabaja en ramas `fix/...` o `feat/...` creadas desde `main`.
- No hagas `git push` (a ninguna rama) ni reescribas historia salvo pedido explícito.

## Archivos
- `index.html` — 3 pantallas: bienvenida, quiz, resultados.
- `app.js` — motor (estado, render, audio, CSV, PDF, sync).
- `questions.js` — `QUESTIONS` + `EXAM_CONFIG`; `EXAM_MODE` = `fundamentos|avanzado|completo`.
- `style.css` — sistema brutalista (réplica de makenoiselab.cl).
- `assets/` — fuentes, diagramas (`assets/images/`) y logos.
- `scripts/` — utilidades (render de diagramas).
- `web/` — referencia del Diplomado original (no es la app).
- `GUIA_DISENO.md` — identidad visual.

## Reglas de contenido
- Cero cifras hardcodeadas: deriva preguntas, puntaje y mínimo de aprobación
  de `QUESTIONS`/`EXAM_CONFIG` en runtime.
- Aprobación 70%; `isBonus` nunca puntúa.

## Tooling
- **Usa siempre `uv`** para Python (ej. `uv run --with matplotlib script.py`).
  Nunca `pip install` global.

## Verificación
```bash
node --check app.js && node --check questions.js
python3 -m http.server 8080   # probar flujos en http://localhost:8080
```
- Comprueba que las métricas cuadren con el `EXAM_MODE` activo.
- Mantén el estilo: sin bordes redondeados; neón `#EFFF1A`/`#FF3399`;
  tipografías Built Titling/Anton.
