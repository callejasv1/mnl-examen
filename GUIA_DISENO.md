# 🎨 Guía de Diseño y Sistema Visual — Make Noise Lab

Esta guía documenta la identidad visual, el sistema de diseño, la arquitectura CSS (Tailwind), las convenciones HTML/Jinja2 y los patrones de componentes utilizados en el sitio web de **Make Noise Lab** (sede chilena de **Modular Moon**).

---

## ⚡ 1. Filosofía y Concepto Visual

La identidad de Make Noise Lab se fundamenta en la **cultura de la síntesis modular, la electrónica analógica y el brutalismo industrial contemporáneo**:

- **Estética de Hardware & Eurorack:** Inspirada en sintetizadores modulares clásicos y modernos (Make Noise, Buchla, Instruō, ARP 2600). Cables de parcheo (*patch cords*), perillas, chasis metálicos oscuros y señales eléctricas.
- **Brutalismo Funcional:** Bordes afilados, esquinas sin redondear, cortes diagonales angulares en paneles, tipografías condensadas de gran escala y alto impacto visual.
- **Alto Contraste Electro-Industrial:** Fondos oscuros de sala de control (negro azabache, carbón, grafito) contrastados con colores neón de alta energía (amarillo fluorescente y fucsia neón), complementados por tonos cemento/aluminio industrial (`#E2E2E2`).
- **Ritmo y Dinamismo:** Movimiento continuo mediante marquesinas (*tickers*), sutil efecto *parallax* en fotografías de maquinaria y transiciones fluidas de entrada por *scroll*.

---

## 🎨 2. Paleta de Colores y Tokens

Los colores están definidos en `tailwind.config.js` y representan elementos tangibles del laboratorio:

### 🟡 Colores Principales

| Token Tailwind | HEX | Muestra | Descripción / Uso |
|---|---|:---:|---|
| `neon-yellow` | `#EFFF1A` | ![#EFFF1A](https://via.placeholder.com/15/EFFF1A/000000?text=+) `#EFFF1A` | **Color insignia de la marca.** Evoca cables de parcheo amarillos, señales de voltaje, botones primarios (CTA), resaltados (`::selection`), *focus-visible* accesible y titulares clave. |
| `neon-pink` | `#FF3399` | ![#FF3399](https://via.placeholder.com/15/FF3399/FFFFFF?text=+) `#FF3399` | **Color secundario de alto impacto.** Franja separadora superior del footer, botones alternos del Hero, enlaces sociales activos y acentos de contraste. |
| `brand-dark` | `#1D1D1D` | ![#1D1D1D](https://via.placeholder.com/15/1D1D1D/FFFFFF?text=+) `#1D1D1D` | **Superficie carbón oscuro.** Color de texto sobre secciones claras y tono base de paneles de sintetizadores. |
| `brand-gray` | `#E2E2E2` | ![#E2E2E2](https://via.placeholder.com/15/E2E2E2/000000?text=+) `#E2E2E2` | **Superficie cemento / metal.** Fondos de secciones claras de alto contraste (ej. banner de Diplomado, FAQ) y textos claros sobre fondo oscuro. |

### 🌑 Fondos y Escalas Oscuras de Soporte

- **Negro Profundo:** `#000000` (`bg-black`) — Fondo base del sitio (`body`), barra de navegación y pie de página.
- **Hero Deep Dark:** `#07131a` — Tono azul-noche del fondo del Hero donde corre el video loop.
- **Panel Intermedio:** `#1a1a1a` — Secciones de contenido estándar (Workshops, Infraestructura/Sede, Contacto).
- **Gris Módulo Eurorack:** `#202020` — Panel superior de Modular Moon y contenedores técnicos.
- **Bordes e Insumos:** `#333333` — Líneas inferiores sutiles para inputs de formularios antes del foco.

### ✨ Efectos Neón y Sombras (Box Shadows)

Definidos en la configuración de Tailwind:
```javascript
boxShadow: {
  'neon-yellow': '0 0 15px rgba(239, 255, 26, 0.2), 0 0 30px rgba(239, 255, 26, 0.1)',
  'neon-pink': '0 0 15px rgba(255, 51, 153, 0.2), 0 0 30px rgba(255, 51, 153, 0.1)',
}
```
Y clase utilitaria para brillo de texto:
```css
.neon-glow-yellow {
  text-shadow: 0 0 10px rgba(239, 255, 26, 0.4);
}
```

---

## 🔤 3. Tipografía y Jerarquía Textual

El sitio utiliza una combinación cuidadosamente seleccionada de fuentes locales condensadas y Google Fonts:

### 📐 Familias Tipográficas

| Token | Familia | Formato | Rol en el Diseño |
|---|---|---|---|
| `font-built` | `'Built Titling RG'` | Local (`woff2`, 400, 600, 700) | **Navegación principal, botones de acción (CTAs), encabezados de sección y preguntas de FAQ.** Tipografía condensada brutalista en mayúsculas. |
| `font-anton` | `'Anton'` | Google Fonts | **Títulos gigantes de alto impacto (Hero, encabezados H1/H2).** Letra ultra-pesada y condensada. |
| `font-aktiv` | `'Aktiv Grotesk'` | Local (`woff2`, 400) | **Cuerpo de lectura, párrafos editoriales y campos de texto.** Proporción geométrica limpia y de alta legibilidad. |
| `font-mono` | `'Space Mono'` | Google Fonts | **Encabezados técnicos de terminal, metadatos y enlaces de pie de página.** Estética técnica/código. |
| `font-sans` | `'Outfit'` | Google Fonts | **Fuente sans-serif por defecto del documento.** |
| `font-myriad`| `'Myriad Pro'` | Local (`woff2`, 400) | **Eyebrows / Antetítulos de secciones.** |

### 🛠️ Optimizaciones de Renderizado Tipográfico

En `layout.html` y `home.html` se aplican reglas globales de suavizado:
```css
*, *::before, *::after {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  text-rendering: optimizeLegibility;
}

/* Evita desenfoques sutiles en titulares masivos */
h1, h2, h3, h4, h5, h6 {
  text-rendering: optimizeSpeed;
}
```

---

## 📐 4. Geometría, Formas y Layout

### 🔲 Ausencia de Bordes Redondeados (Regla Brutalista)
- A diferencia de interfaces SaaS genéricas, **en MNL no se usan bordes redondeados (`rounded-lg`, `rounded-full`)** en componentes arquitectónicos (botones, tarjetas, cajas o inputs).
- Todo botón, contenedor y bloque mantiene **esquinas rectas a 90 grados** para preservar la identidad industrial.
- *Única excepción:* Iconos externos (ej. silueta de la app Instagram).

### ⚡ Cortes Diagonales en Paneles (`clip-path`)
Para romper la monotonía de bloques rectangulares horizontales, se aplican cortes angulares dinámicos en CSS usando polígonos:

```html
<!-- Corte diagonal descendente a la derecha -->
<div class="section-text-panel bg-[#E2E2E2] pb-[5vw] relative z-10"
     style="clip-path: polygon(0 0, 100% 0, 100% calc(100% - 5vw), 0 100%);">
  ...
</div>

<!-- Enlace con imagen inferior solapada -->
<div class="parallax-wrap relative z-0 -mt-[5vw] overflow-hidden">
  ...
</div>
```

```html
<!-- Corte diagonal ascendente a la izquierda -->
<div class="section-text-panel bg-[#1a1a1a] pb-[5vw] relative z-10"
     style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5vw));">
  ...
</div>
```

### 📏 Sistema de Rejilla y Contenedores

- **Contenedor Principal:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (alineado entre Navbar, secciones y Footer).
- **Contenedor de Lectura Estrecha:** `max-w-5xl mx-auto` para bloques editoriales y video institucional.
- **Contenedor de Formularios:** `max-w-2xl mx-auto` para formularios MailerLite centrados y enfocados.

---

## 🧩 5. Catálogo de Componentes y Patrones UI

### A. Botones Principales (CTAs)

#### 1. Botón Primario Amarillo (Barra / Hero)
```html
<a href="/contacto"
   class="inline-flex justify-center items-center min-w-[260px] font-built font-bold text-3xl tracking-tight px-8 py-3 uppercase transition-all bg-[#EFFF1A] text-black hover:brightness-110">
  Contacto
</a>
```

#### 2. Botón Inverso Cemento / Carbón
```html
<a href="/diplomado"
   class="inline-flex justify-center items-center min-w-[260px] font-built font-bold text-3xl tracking-tight px-8 py-3 uppercase transition-all bg-[#1a1a1a] text-[#E2E2E2] hover:text-[#EFFF1A]">
  Ver Programa Completo
</a>
```

#### 3. Botones Cuadrados del Hero (Alto Contraste Dual)
En el Hero se combinan dos bloques cuadrados de proporciones 1:1 (`aspect-square`):
```html
<div class="grid grid-cols-2 gap-3 w-[70%] sm:w-[50%] max-w-[320px]">
  <!-- Fucsia sobre Amarillo -->
  <a href="/contacto"
     class="flex aspect-square items-center justify-center bg-[#FF3399] text-[#EFFF1A] font-built font-bold text-xl md:text-3xl tracking-tighter uppercase hover:brightness-110 transition-all text-center shadow-2xl">
    ÚNETE
  </a>
  <!-- Amarillo sobre Fucsia -->
  <a href="/diplomado"
     class="flex aspect-square items-center justify-center bg-[#EFFF1A] text-[#FF3399] font-built font-bold text-xl md:text-3xl tracking-tighter uppercase hover:brightness-110 transition-all text-center shadow-2xl">
    VER<br>DIPLOMADO
  </a>
</div>
```

#### 4. Barra Fija Móvil (Sticky CTA)
En pantallas móviles (`lg:hidden`), una barra fija en la parte inferior garantiza conversión inmediata:
```html
<div id="mobile-sticky-cta" class="lg:hidden fixed left-0 right-0 bottom-0 z-[100] border-t border-black/10">
  <a href="/contacto" class="block w-full bg-[#EFFF1A] text-black py-5 text-center font-built font-bold text-3xl uppercase tracking-normal shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
    Contacto
  </a>
</div>
```

---

### B. Formulario Brutalista Minimalista (Underline Style)

Los formularios integrados con MailerLite evitan cajas encerradas y emplean líneas inferiores sutiles que brillan en amarillo neón al hacer foco:

```html
<div class="space-y-8">
  <!-- Campo de Texto -->
  <div>
    <label class="block font-built font-bold uppercase tracking-wide text-white text-xl md:text-2xl mb-2" for="FNAME">
      NOMBRE
    </label>
    <input
      id="FNAME" name="fields[name]" type="text" placeholder="Nombre completo"
      class="w-full bg-transparent border-b-2 border-[#333] font-aktiv text-xl text-white px-0 py-3
             focus:border-[#EFFF1A] outline-none transition-colors duration-300 placeholder:text-white/20" />
  </div>

  <!-- Mensaje de Éxito con Borde Lateral Neón -->
  <div class="mb-8 px-5 py-4 border-l-4 border-[#EFFF1A] bg-[#EFFF1A]/10 text-[#EFFF1A] font-aktiv text-base">
    ✓ Datos recibidos. Nos pondremos en contacto pronto.
  </div>
</div>
```

---

### C. Acordeón de Preguntas Frecuentes (FAQ)

Implementado con elementos semánticos HTML `<details>` y `<summary>`, sin librerías pesadas:

```html
<details class="group outline-none border-b border-zinc-300/40 py-4">
  <summary class="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
    <span class="font-built text-2xl md:text-3xl text-[#1D1D1D] tracking-wide leading-tight">
      ¿Qué nivel de conocimientos previos necesito?
    </span>
    <!-- El signo más gira 45 grados para transformarse en una cruz (x) al abrir -->
    <span class="text-[#1D1D1D] text-2xl font-bold shrink-0 transition-transform duration-200 group-open:rotate-45">
      +
    </span>
  </summary>
  <div class="font-aktiv text-[#1D1D1D] text-base md:text-lg leading-relaxed pt-3 pb-2 pr-8 opacity-80">
    No se requieren conocimientos previos de síntesis o teoría musical avanzada.
  </div>
</details>
```

---

### D. Ticker / Marquesina Dinámica Continua

Utilizado para anuncios importantes (ej. Open House, convocatorias). Pausa automática al pasar el cursor (`:hover`):

```html
<div class="ticker-container block bg-[#EFFF1A] text-black overflow-hidden whitespace-nowrap">
  <div class="animate-ticker">
    <div class="flex shrink-0 font-built font-bold uppercase tracking-tight">
      <span class="pr-36 text-3xl md:text-4xl">¡OPEN HOUSE & SHOWCASE! SÁBADO 20 DE JUNIO</span>
      <span class="pr-36 text-3xl md:text-4xl">¡OPEN HOUSE & SHOWCASE! SÁBADO 20 DE JUNIO</span>
    </div>
    <div class="flex shrink-0 font-built font-bold uppercase tracking-tight" aria-hidden="true">
      <span class="pr-36 text-3xl md:text-4xl">¡OPEN HOUSE & SHOWCASE! SÁBADO 20 DE JUNIO</span>
      <span class="pr-36 text-3xl md:text-4xl">¡OPEN HOUSE & SHOWCASE! SÁBADO 20 DE JUNIO</span>
    </div>
  </div>
</div>
```

---

### E. Separador del Pie de Página

Un elemento distintivo de la marca es la franja fucsia neón de 8px que corona el footer negro:
```html
<div class="h-2 bg-[#FF3399]" role="presentation" aria-hidden="true"></div>
```

---

## ♿ 6. Accesibilidad (A11Y) y Buenas Prácticas

El sitio cumple con pautas de accesibilidad **WCAG 2.1 AA**:

1. **Enlace "Saltar al Contenido" (WCAG 2.4.1):**
   ```html
   <a href="#main-content" class="skip-to-content">Saltar al contenido</a>
   ```
   Permanece oculto fuera de pantalla (`left: -9999px`) y aparece con estilo amarillo neón cuando el usuario navega con tabulador (`:focus`).

2. **Indicador de Foco Visible (WCAG 2.4.7):**
   Configurado en `src-css/main.css` para teclado:
   ```css
   a:focus-visible,
   button:focus-visible,
   input:focus-visible,
   select:focus-visible,
   textarea:focus-visible,
   summary:focus-visible,
   [tabindex]:focus-visible {
     outline: 2px solid #EFFF1A;
     outline-offset: 2px;
   }

   /* En paneles claros, el foco conmuta a carbón oscuro */
   .bg-\[\#E2E2E2\] summary:focus-visible {
     outline-color: #1D1D1D;
   }
   ```

3. **Respeto a Preferencias de Movimiento Reducido (`prefers-reduced-motion`):**
   Todas las animaciones de desvanecimiento (*fade-up*), *zoom-out* y *parallax* se desactivan o reducen si el usuario tiene activada la reducción de movimiento en su sistema operativo.

4. **Encabezados Semánticos y SEO:**
   En páginas con logotipo visual destacado, se incluye un `h1` semántico con clase `sr-only` para lectores de pantalla y rastreadores de motores de búsqueda.

---

## ⚙️ 7. Flujo de Trabajo CSS (Tailwind CSS)

### Archivos Clave
- **Configuración:** `tailwind.config.js` *(vive en el repo del sitio principal, no en este)*
- **Directivas y Reglas Base:** `src-css/main.css` *(vive en el repo del sitio principal, no en este)*
- **CSS Compilado de Producción:** `assets/static/css/style.css` *(¡No editar este archivo manualmente!)*

### Comandos de Desarrollo
```bash
# Modo desarrollo con auto-recarga (Watch mode):
npm run watch

# Compilación optimizada para producción:
npm run build
```

---

## 📝 8. Reglas de Oro para Nuevos Diseños y Páginas

1. **Mantén el contraste alto:** Nunca uses textos gris medio sobre fondos oscuros. Usa `#E2E2E2`, `text-white` o `text-zinc-300`.
2. **Usa mayúsculas intencionadas:** Los títulos en `font-built` y `font-anton` deben llevar siempre la clase `uppercase`.
3. **No agregues bordes redondeados estándar:** Conserva las aristas vivas y la estética de panel de sintetizador.
4. **Respeta la paleta neón:** Reserva el `#EFFF1A` (amarillo neón) y `#FF3399` (fucsia neón) para elementos interactivos, acentos y marcas, no para textos de párrafos extensos.
5. **Optimiza siempre las imágenes:** Pasa las fotos nuevas por `bash scripts/optimize_images.sh` para generar versiones WebP ligeras antes de enlazarlas.
