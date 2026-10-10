# 🎛️ Make Noise Lab — Evaluación Teórica de Síntesis Modular

Aplicación web interactiva brutalista diseñada para enviar por **WhatsApp** a los alumnos de **Make Noise Lab** (`makenoiselab.cl`), sede chilena de **Modular Moon**.

---

## ⚡ Características Principales

1. **Alineada al 100% con `GUIA_DISENO.md`**:
   - Brutalismo industrial electro-analógico (Eurorack Hardware).
   - **Cero bordes redondeados** (aristas vivas a 90 grados).
   - Tipografía condensada brutalista (`Anton`), monoespaciada (`Space Mono`) y cuerpo limpio (`Outfit`).
   - Colores oficiales: **Amarillo Neón** (`#EFFF1A`), **Fucsia Neón** (`#FF3399`), **Carbón** (`#1D1D1D`) y **Negro Profundo** (`#000000`).
   - Ticker / marquesina superior continua.
   - Franja fucsia neón de 8px en el pie de página.
   - Formulario brutalista minimalista (*Underline style* con foco amarillo neón).

2. **Evaluación Pedagógica**:
   - El banco de preguntas (`questions.js`) se alterna con el flag `EXAM_MODE`:
     `fundamentos` (formativo), `avanzado` (técnico original) o `completo`
     (ambos; **modo activo por defecto**). El nº de preguntas, el puntaje y el
     mínimo de aprobación se calculan en tiempo de ejecución, nunca hardcodeados.
   - Incluye diagramas de módulos Eurorack Doepfer, parches VCV Rack y
     esquemas de modulación FM/AM, formas de onda, ADSR, S&H y filtros.
   - Las preguntas abiertas fueron convertidas a selección múltiple técnica para calificación automática instantánea.
   - Incluye preguntas bonus de humor/cultura (*"¿A qué suena el cable MIDI?"*, *"Nudos náuticos"*, *"un parche nunca se termina"*); nunca puntúan.
   - **Exigencia mínima de aprobación:** **70%** del puntaje técnico.
   - Visor Lightbox para ampliar cualquier esquema en pantalla completa desde el celular.

3. **Audio Analógico Interactivo (Web Audio API)**:
   - Retroalimentación auditiva tipo sintetizador analógico en selecciones de opciones.
   - Acorde sintetizado en aprobación y tono descendente en reprobación.
   - Botón de silencio On/Off en la cabecera.

4. **Respaldo de Respuestas (Base de Datos / CSV / WhatsApp)**:
   - **Envío directo a WhatsApp:** Botón para que el alumno envíe su comprobante oficial pre-formateado al WhatsApp del laboratorio o profesor con un solo toque.
   - **Descarga en CSV:** Cada alumno puede descargar su comprobante detallado con respuestas correctas y explicaciones.
   - **Panel Docente (`[ PANEL DOCENTE / BBDD ]`):** Permite descargar un archivo `.csv` consolidado con todas las evaluaciones de los alumnos.
   - **Google Sheets en tiempo real:** Viene con el script listo `google_apps_script.js` para registrar las notas como filas automáticas en una hoja de cálculo sin costo de servidores.

---

## 🌐 Enlace Oficial en Vivo (GitHub Pages)

- **URL de la Evaluación:** [https://callejasv1.github.io/mnl-examen/](https://callejasv1.github.io/mnl-examen/)
- **Repositorio en GitHub:** [https://github.com/callejasv1/mnl-examen](https://github.com/callejasv1/mnl-examen)

---

## 🚀 Cómo compartirlo con los alumnos por WhatsApp

1. Comparte el enlace directo: `https://callejasv1.github.io/mnl-examen/`.
2. Al pegarlo en WhatsApp, se generará de inmediato la tarjeta oficial con la vista previa del examen y el logo de Make Noise Lab.

### Opción B: Ejecución local
Para probar en tu computadora:
```bash
python3 -m http.server 8080
```
Y abre en tu navegador: [http://localhost:8080](http://localhost:8080)

### Regenerar los diagramas
Los diagramas (`assets/images/`) se generan con un script reproducible en el
estilo de casa (fondo oscuro, neón, texto grande). Requiere
[`uv`](https://docs.astral.sh/uv/):
```bash
uv run --with matplotlib scripts/render_diagrams.py
```

---

## 📊 Configuración de Google Sheets (BBDD en la Nube)

1. Abre una hoja nueva en [Google Sheets](https://sheets.new).
2. Ve a **Extensiones > Apps Script**.
3. Pega el código de [google_apps_script.js](google_apps_script.js).
4. Haz clic en **Implementar > Nueva implementación > Aplicación web** (Acceso: *Cualquier usuario*).
5. Copia la URL generada y pégala en el pie de página de la web app en **[ PANEL DOCENTE / BBDD ]** o en `questions.js` (`webhookUrl`).
