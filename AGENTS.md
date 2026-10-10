# AGENTS.md — Make Noise Lab · Examen Teórico

Guía para agentes que trabajen en este repositorio (app web estática del
Examen Teórico del Diplomado en Síntesis Modular de Make Noise Lab).

## Reglas de rama y push

- **NUNCA hacer `git push` a `main`.** Está prohibido. `main` es la rama de
  producción que sirve GitHub Pages.
- Todo cambio se hace en una rama aparte (ej. `fix/...`, `feat/...`) creada
  desde `main`.
- **No hacer `git push`** (ni a `main` ni a ninguna rama) salvo que un humano
  lo pida explícitamente. Los commits locales en la rama son suficientes.
- No reescribir historia (`rebase`, `force-push`, `amend` de commits ya
  compartidos) sin autorización explícita.

## Estructura del proyecto

- `index.html` — vista única (pantallas: bienvenida, quiz, resultados).
- `app.js` — motor de la evaluación (estado, render, audio, resultados, CSV, PDF).
- `questions.js` — banco de preguntas y `EXAM_CONFIG`. El flag `EXAM_MODE`
  (`fundamentos` | `avanzado` | `completo`) alterna el set.
- `style.css` — sistema visual brutalista (réplica de makenoiselab.cl).
- `assets/` — fuentes, imágenes (diagramas) y logos.
- `web/` — copia de referencia de la página "Diplomado" original. No es la
  app; úsala solo como referencia de diseño.
- `GUIA_DISENO.md` — guía de identidad visual de Make Noise Lab.

## Reglas de contenido (evaluación)

- Las métricas (nº de preguntas, puntaje, mínimo de aprobación, bonus) deben
  derivarse de `QUESTIONS`/`EXAM_CONFIG` en tiempo de ejecución. **No
  hardcodear cifras** en `index.html` o en textos de `app.js`.
- El puntaje de aprobación es 70% y las preguntas `isBonus` nunca puntúan.

## Verificación antes de terminar

No hay framework de tests. Verifica así:

```bash
node --check app.js && node --check questions.js
python3 -m http.server 8080   # abrir http://localhost:8080 y probar los flujos
```

- Revisa que las métricas de la pantalla de bienvenida y resultados cuadren
  con el `EXAM_MODE` activo.
- Mantén el diseño brutalista: sin bordes redondeados, paleta neón
  (`#EFFF1A`, `#FF3399`), tipografías `Built Titling`/`Anton`.
