/**
 * Make Noise Lab — Banco de Preguntas Examen Teórico Síntesis Modular
 * (Ciclo Diplomado MNL-MM 2026)
 *
 * ============================================================================
 * CONTROL DE MODO DE EXAMEN (CAMBIO EXCLUSIVO EN CÓDIGO)
 * Cambia únicamente este flag para alternar el set de preguntas:
 *
 *   'fundamentos' : Set de preguntas formativas (Ondas, ADSR, LFO, S&H, VCA, Parámetros del sonido)
 *   'avanzado'    : Set de preguntas técnicas originales (Algoritmos FM, módulos Doepfer, VCV Rack, etc.)
 *   'fundamentos' : Set de preguntas formativas (Ondas, ADSR, LFO, S&H, VCA, Parámetros del sonido)
 *   'avanzado'    : Set de preguntas técnicas originales (Algoritmos FM, módulos Doepfer, VCV Rack, etc.)
 *   'completo'    : Ambos sets combinados (24 preguntas)
 * ============================================================================
 */
const EXAM_MODE = 'completo'; // <-- Modificar aquí: 'fundamentos' | 'avanzado' | 'completo'

const EXAM_CONFIG = {
  title: EXAM_MODE === 'fundamentos'
    ? "Examen Teórico: Fundamentos de Síntesis Modular"
    : (EXAM_MODE === 'avanzado' ? "Examen Teórico de Síntesis Modular" : "Examen Teórico Integral de Síntesis Modular"),
  institution: "Make Noise Lab • Modular Moon Santiago",
  website: "makenoiselab.cl",
  passingScorePercentage: 70,
  webhookUrl: "https://script.google.com/macros/s/AKfycbyHC6rKN0nQba8znR57IsTcixamAFldHBVBgB3N0imKX8oh_tuM8hm3oyQRwMG3uLF6/exec"
};

// ============================================================================
// SET 1: PREGUNTAS FUNDAMENTALES / FORMATIVAS
// Opciones rigurosamente simétricas en longitud, estilo y nivel de detalle
// ============================================================================
const FUNDAMENTAL_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuáles son las cuatro propiedades o parámetros fundamentales del sonido perceptible?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "Voltaje de control, Frecuencia de corte, Resonancia y Retroalimentación",
      "Tono, Timbre, Intensidad y Envolvente",
      "Reverberación espacial, Retardo (Delay), Modulación de fase y Distorsión armónica",
      "Tiempo de ataque, Tiempo de caída, Nivel de sostenido y Tiempo de liberación"
    ],
    correctIndex: 1,
    explanation: "Las cuatro dimensiones fundamentales del sonido en síntesis son: 1) Tono (altura o frecuencia fundamental); 2) Timbre (color armónico y forma de onda); 3) Intensidad (amplitud o volumen); 4) Envolvente (evolución, articulación y duración en el tiempo)."
  },
  {
    id: 2,
    question: "¿Qué forma de onda elemental es la que se visualiza en este monitor de osciloscopio?",
    points: 1,
    isBonus: false,
    image: "assets/images/waveforms_saw.png",
    options: [
      "Onda Senoidal (Sine)",
      "Onda Cuadrada (Square)",
      "Diente de Sierra (Sawtooth)",
      "Onda Triangular (Triangle)"
    ],
    correctIndex: 2,
    explanation: "Es una onda Diente de Sierra (Sawtooth). Se caracteriza por su rampa ascendente lineal y caída vertical instantánea, conteniendo todos los armónicos (pares e impares) con amplitud inversamente proporcional a su número de armónico (1/n)."
  },
  {
    id: 3,
    question: "¿Qué forma de onda es esta y cuál es su característica armónica principal?",
    points: 1,
    isBonus: false,
    image: "assets/images/waveforms_square.png",
    options: [
      "Onda Cuadrada (Square): posee simetría bipolar del 50% y contiene exclusivamente armónicos impares (1°, 3°, 5°...).",
      "Onda Senoidal (Sine): curva sinusoidal suave con un único armónico; su espectro de frecuencias es completamente puro.",
      "Diente de Sierra (Sawtooth): rampa lineal con caída vertical abrupta; contiene armónicos pares e impares de amplitud 1/n.",
      "Onda Triangular (Triangle): pendientes ascendente y descendente simétricas; armónicos impares con caída rápida de 1/n²."
    ],
    correctIndex: 0,
    explanation: "Es una Onda Cuadrada (Square Wave). Al tener una simetría del 50% (mitad de ciclo arriba y mitad abajo), los armónicos pares se anulan matemáticamente por cancelación de fase, dejando únicamente los armónicos impares (1º, 3º, 5º, 7º...), lo que le confiere su característico sonido hueco o aflautado."
  },
  {
    id: 4,
    question: "En una envolvente clásica en 4 etapas (mostrada en el diagrama), ¿cuál de las fases numeradas (1, 2, 3 o 4) representa un nivel de voltaje en lugar de una duración de tiempo?",
    points: 1,
    isBonus: false,
    image: "assets/images/adsr_diagram.png",
    options: [
      "Fase 1 — Attack (Ataque)",
      "Fase 2 — Decay (Decaimiento)",
      "Fase 3 — Sustain (Sostenimiento)",
      "Fase 4 — Release (Liberación)"
    ],
    correctIndex: 2,
    explanation: "En la envolvente ADSR: Attack (1), Decay (2) y Release (4) son parámetros de tiempo (miden cuántos milisegundos o segundos tarda cada transición). El Sustain (3) es el único parámetro de nivel (voltaje/amplitud): determina a qué voltaje se mantiene la señal mientras la compuerta Gate permanezca activa."
  },
  {
    id: 5,
    question: "En un generador de envolvente estándar de 4 etapas (ADSR), ¿qué determina específicamente el parámetro de Ataque (Attack)?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "El tiempo que tarda el voltaje en descender desde el pico máximo hasta el nivel de sostenimiento.",
      "El tiempo que tarda el voltaje en subir desde cero hasta su nivel máximo tras recibir la orden de disparo.",
      "El nivel de voltaje constante al que se estabiliza la señal mientras el Gate permanezca activo.",
      "El tiempo que tarda el voltaje en extinguirse por completo una vez que se suelta la tecla o cesa el Gate."
    ],
    correctIndex: 1,
    explanation: "El Ataque (Attack) calibra el tiempo de subida inicial: un ataque mínimo (inmediato, 0 a 1 ms) produce un sonido percusivo instantáneo (como un redoblante o bajo pluck), mientras que un ataque largo (segundos) produce una entrada gradual y suave (como cuerdas o pads ambientales)."
  },
  {
    id: 6,
    question: "¿Para qué sirve un LFO (Low Frequency Oscillator) en un sintetizador analógico o modular?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "Reforzar con una señal sincronizada las frecuencias sub-graves del VCO principal para añadir cuerpo y peso tonal.",
      "Marcar el tempo del sistema enviando pulsos de clock regulares a los módulos de secuenciación y ritmo.",
      "Generar formas de onda sub-audibles para modular cíclicamente parámetros como tono, filtro o volumen.",
      "Convertir señales de control de voltaje lento en señales de audio amplificadas antes de la salida final."
    ],
    correctIndex: 2,
    explanation: "Un LFO (Oscilador de Baja Frecuencia) oscila tan lento (ej. 0.1 Hz a 15 Hz) que sus ondas no se escuchan directamente como notas musicales. En su lugar, su voltaje de salida se parchea a otros módulos para crear efectos periódicos: a la afinación del VCO crea vibrato, al Cutoff del VCF crea wah-wah, y al VCA crea trémolo."
  },
  {
    id: 7,
    question: "Observando el diagrama del circuito de control: ¿A qué módulo o función corresponde este comportamiento escalonado?",
    points: 1,
    isBonus: false,
    image: "assets/images/sample_and_hold.png",
    options: [
      "Sample & Hold (S&H): captura el voltaje de entrada en cada pulso y lo retiene constante.",
      "Delay analógico: graba un fragmento sonoro y lo repite sucesivamente con atenuación.",
      "Compresor dinámico: limita los picos de voltaje para evitar sobrecargas en la mezcla.",
      "Slew Limiter: suaviza las transiciones abruptas convirtiendo pulsos en rampas continuas."
    ],
    correctIndex: 0,
    explanation: "Es un Sample & Hold (S&H). Toma una 'muestra' (sample) del voltaje analógico de entrada en el instante exacto en que llega un pulso de clock/trigger, y 'retiene' (hold) ese voltaje fijo en su salida hasta la siguiente orden. Si la entrada es ruido blanco, genera los típicos voltajes aleatorios escalonados de ciencia ficción (estilo R2-D2)."
  },
  {
    id: 8,
    question: "¿Cuál es la función fundamental de un VCA (Voltage Controlled Amplifier) en síntesis modular?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "Generar las frecuencias fundamentales y armónicos principales de la señal de audio.",
      "Afinar los intervalos de notas musicales siguiendo la escala temperada de 12 tonos.",
      "Atenuar de forma estática las frecuencias no deseadas mediante inductores pasivos.",
      "Controlar dinámicamente la ganancia o volumen de una señal mediante voltaje de control."
    ],
    correctIndex: 3,
    explanation: "El VCA (Amplificador Controlado por Voltaje) es la 'compuerta de volumen' del sintetizador: sin un VCA abierto, el oscilador sonaría sin parar infinitamente. Cuando una envolvente ADSR envía voltaje al CV del VCA, este deja pasar el sonido moldeando el volumen en cada nota."
  },
  {
    id: 9,
    question: "Observando esta curva de respuesta espectral de un filtro analógico (eje horizontal: frecuencia, eje vertical: amplitud): ¿A qué tipo de filtro corresponde y cómo actúa?",
    points: 1,
    isBonus: false,
    image: "assets/images/filter_lpf.png",
    options: [
      "Filtro Paso Alto (High-Pass): atenúa las frecuencias graves por debajo del corte y deja pasar intactos los armónicos agudos.",
      "Filtro Paso Bajo (Low-Pass): deja pasar las frecuencias graves y atenúa progresivamente los armónicos agudos sobre el corte.",
      "Filtro Paso Banda (Band-Pass): atenúa tanto extremos graves como agudos, dejando pasar una banda central estrecha.",
      "Filtro Rechazo de Banda (Notch): elimina una frecuencia central estrecha manteniendo intactos ambos extremos del espectro."
    ],
    correctIndex: 1,
    explanation: "Es un Filtro Paso Bajo (Low-Pass Filter o LPF). Mantiene intactas las frecuencias inferiores al punto de corte (banda de paso en 0 dB) y atenúa con pendiente continua (-24 dB/octava) los armónicos superiores, oscureciendo el timbre del sonido."
  },
  {
    id: 10,
    question: "En un filtro analógico (VCF), ¿qué sucede cuando aumentas el control de Resonancia (Resonance o Q)?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "Amplía el rango de frecuencias que el filtro deja pasar, aumentando el brillo general de la señal.",
      "Desplaza el punto de corte hacia frecuencias más graves, oscureciendo gradualmente el timbre.",
      "Retroalimenta la señal en torno al punto de corte, creando un pico de énfasis que puede llegar a autooscilar.",
      "Reduce la pendiente de atenuación del filtro, suavizando la transición entre la banda de paso y el corte."
    ],
    correctIndex: 2,
    explanation: "La Resonancia retroalimenta la salida del filtro hacia su entrada, provocando un pico pronunciado de ganancia justo en la frecuencia de corte (Cutoff). Esto produce el clásico sonido ácido o silbante ('squelch'), y si el filtro es capaz de autooscilar, genera su propia onda senoidal sin necesidad de oscilador conectado."
  },
  {
    id: 11,
    question: "En la síntesis analógica (estándar Eurorack), ¿qué establece rigurosamente la norma de 1V/Octava (1 Volt por Octava)?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "Que cada volt adicional en V/Oct incrementa la frecuencia del oscilador en 100 Hz constantes, de forma lineal.",
      "Que todos los módulos Eurorack comparten un bus de control con voltaje máximo de ±1.0 Voltio para ser compatibles.",
      "Que cada volt adicional en V/Oct mueve el tono del oscilador exactamente un semitono hacia el agudo.",
      "Que cada volt adicional en V/Oct duplica la frecuencia del oscilador, subiendo la afinación una octava completa."
    ],
    correctIndex: 3,
    explanation: "La norma 1V/Octava es el estándar que garantiza la afinación musical: por cada voltio adicional aplicado a la entrada V/Oct de un oscilador, la frecuencia se duplica (por ejemplo, 110 Hz a 1V -> 220 Hz a 2V -> 440 Hz a 3V), permitiendo tocar escalas afinadas."
  },
  {
    id: 12,
    question: "¿Cuál es la diferencia fundamental entre una señal de Audio Rate y una señal de Control Rate (CV)?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "Audio Rate es exclusivamente digital, mientras que Control Rate es puramente analógica.",
      "Audio Rate oscila en rango audible (sonido); Control Rate modula parámetros de módulos.",
      "Audio Rate transporta notas melódicas; Control Rate transporta únicamente datos rítmicos.",
      "Audio Rate requiere cables balanceados; Control Rate utiliza solo cables no balanceados."
    ],
    correctIndex: 1,
    explanation: "En síntesis modular, eléctricamente todas son voltajes, pero funcionalmente: las señales de Audio Rate se mueven a velocidades que el oído humano percibe como sonido (20 Hz - 20 kHz); las señales de Control Rate (CV) se mueven más lento (LFO, envolventes, voltajes de tono) y su propósito no es escucharse directamente, sino dirigir y automatizar a los demás módulos."
  }
];

// ============================================================================
// SET 2: PREGUNTAS TÉCNICAS AVANZADAS (EXAMEN ORIGINAL)
// Sin nombres de modelos exclusivos en la opción correcta, opciones simétricas
// ============================================================================
const ADVANCED_QUESTIONS = [
  {
    id: 1,
    question: "¿Qué módulo Eurorack es este y cuál es su función principal?",
    points: 1,
    isBonus: false,
    image: "assets/images/image1.png",
    options: [
      "VCF (Voltage Controlled Filter): procesa el espectro sonoro mediante corte y resonancia de frecuencias.",
      "VCA (Voltage Controlled Amplifier): modula la ganancia o volumen de señales de audio y voltajes de control.",
      "VCO (Voltage Controlled Oscillator): genera formas de onda periódicas primarias afinadas a 1V/Octava.",
      "ADSR (Envelope Generator): produce curvas transitorias de cuatro etapas para modular otros módulos."
    ],
    correctIndex: 2,
    explanation: "Es un VCO (Voltage Controlled Oscillator) analógico Doepfer A-110. Se identifica de forma inequívoca por sus controles de rango de octavas (Range), afinación fina (Tune), modulación de ancho de pulso (PW) y salidas simultáneas de formas de onda (Sawtooth, Square, Triangle y Sine)."
  },
  {
    id: 2,
    question: "Observando las conexiones de los cables en este parche de VCV Rack: ¿Qué errores de ruteo presenta la cadena de síntesis sustractiva?",
    points: 1,
    isBonus: false,
    image: "assets/images/image2.png",
    options: [
      "No sonará correctamente: el audio del VCF va a GATE del ADSR, la envolvente va a audio del VCA y falta el Gate al ADSR.",
      "Sí sonará correctamente: el VCF modula el tempo del ADSR, el VCA amplifica la envolvente y el MIDI procesa afinación.",
      "No sonará correctamente: el oscilador VCO no tiene ningún cable conectado en su panel y el filtro carece de alimentación.",
      "Sí sonará correctamente: es un parche normal de síntesis donde la envolvente reemplaza la fuente de sonido del oscilador."
    ],
    correctIndex: 0,
    explanation: "El parche tiene tres errores críticos: 1) La salida de audio (LPF) del filtro fue ruteada a la entrada GATE del ADSR; 2) La salida de voltaje del ADSR fue conectada a la entrada de audio IN del VCA en lugar de su entrada CV de modulación; 3) Falta conectar la salida GATE del MIDI-CV al ADSR para disparar las notas."
  },
  {
    id: 3,
    question: "En síntesis FM (Frecuencia Modulada), ¿cómo se describe el flujo de señal de este algoritmo de 4 operadores?",
    points: 1,
    isBonus: false,
    image: "assets/images/image3.png",
    options: [
      "Los Operadores 1 y 2 son portadoras independientes de salida; los Operadores 3 y 4 actúan como moduladores en cascada.",
      "El Operador 1 es la portadora de salida; los Operadores 2 y 3 modulan al 1 en paralelo; el Operador 4 modula al 3 con feedback.",
      "El Operador 4 es la única portadora de salida audible; los Operadores 3, 2 y 1 modulan en serie sucesiva sin retroalimentación.",
      "Los 4 operadores están conectados directamente en paralelo al bus de salida de audio sin interactuar modularmente entre sí."
    ],
    correctIndex: 1,
    explanation: "En la notación clásica de síntesis FM: el operador de la base (Op 1) con la línea inferior es la portadora (Carrier) audible. Los operadores 2 y 3 ingresan a él en paralelo como moduladores. El operador 4 modula específicamente al 3 y cuenta con una línea de retroalimentación (feedback loop) sobre sí mismo."
  },
  {
    id: 4,
    question: "En la síntesis por modulación de frecuencia (FM), ¿qué determina principalmente la cantidad de armónicos (bandas laterales) y la brillantez del timbre?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "La fase eléctrica absoluta de inicio del oscilador portador al momento de recibir la orden de compuerta (Gate).",
      "El índice de modulación, controlado por la amplitud o nivel de salida del operador modulador.",
      "La tasa de muestreo y la profundidad de bits configuradas en el convertidor digital a analógico.",
      "La impedancia de salida de los cables de conexión utilizados para rutear las señales de modulación."
    ],
    correctIndex: 1,
    explanation: "En la síntesis FM (desarrollada por John Chowning), la riqueza armónica depende directamente del Índice de Modulación (I = Δf / fm), el cual se controla variando la amplitud o nivel de salida del operador modulador. A mayor amplitud del modulador, mayor índice de modulación y mayor número de bandas laterales (armónicos) generados alrededor de la portadora."
  },
  {
    id: 5,
    question: "En síntesis FM, ¿cuál es el efecto tímbrico característico de aplicar retroalimentación (Feedback / Automodulación) sobre un operador?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "Disminuye la frecuencia base hasta convertir el operador en una fuente de modulación sub-audible (LFO).",
      "Invierte los intervalos de afinación de la escala temperada transformando notas agudas en notas graves.",
      "Incrementa la densidad armónica enriqueciendo el espectro sonoro, pudiendo generar ruido a niveles altos.",
      "Produce un retardo de fase temporal continuo generando un efecto espacial de eco o reverberación estéreo."
    ],
    correctIndex: 2,
    explanation: "El bucle de feedback (automodulación) retroalimenta la salida de un operador sobre su propia frecuencia. A niveles moderados enriquece progresivamente la onda senoidal pura agregando armónicos (aproximándose al timbre de una onda sierra); a valores extremos genera ruido denso, recurso indispensable para sintetizar platillos y elementos percusivos."
  },
  {
    id: 6,
    question: "¿Cuáles son los cuatro módulos fundamentales que conforman la arquitectura básica de un sintetizador analógico sustractivo?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "VCO (Oscilador) + VCF (Filtro) + LFO (Modulador de Baja Frecuencia) + Mixer Pasivo",
      "VCO (Oscilador) + Mixer Pasivo + Step Sequencer + Clock Divider",
      "VCO (Oscilador) + VCF (Filtro) + ADSR (Envolvente) + VCA (Amplificador)",
      "VCO (Oscilador) + Ring Modulator + Sample & Hold + Noise Generator"
    ],
    correctIndex: 2,
    explanation: "La cadena clásica de síntesis sustractiva se compone de: Fuente de sonido rica en armónicos (VCO), Procesamiento espectral sustractivo (VCF), Generador de control temporal (ADSR) y Control dinámico de ganancia (VCA)."
  },
  {
    id: 7,
    question: "¿Qué tipo de modulación describe la relación entre portadora, modulador y señal resultante en este gráfico?",
    points: 1,
    isBonus: false,
    image: "assets/images/image4.png",
    options: [
      "Modulación de Frecuencia (FM): la densidad temporal de ciclos varía mientras la amplitud pico a pico se mantiene constante.",
      "Modulación de Amplitud (AM): la envolvente de volumen varía con el tiempo mientras la frecuencia portadora permanece constante.",
      "Modulación en Anillo (Ring Modulation): las señales se multiplican invirtiendo la fase y anulando la portadora fundamental.",
      "Modulación por Ancho de Pulso (PWM): el ciclo útil de una onda cuadrada se comprime y expande mediante un voltaje de control."
    ],
    correctIndex: 0,
    explanation: "Es Modulación de Frecuencia (FM). Se evidencia claramente porque la amplitud pico a pico del resultado se mantiene estrictamente constante (+1 a -1), mientras que la densidad temporal de los ciclos de onda varía proporcionalmente a la forma del modulador."
  },
  {
    id: 8,
    question: "¿Qué tipo de modulación describe la relación mostrada en este gráfico?",
    points: 1,
    isBonus: false,
    image: "assets/images/image5.png",
    options: [
      "Modulación de Frecuencia (FM): la distancia entre crestas se altera periódicamente mientras el volumen se conserva inalterado.",
      "Modulación de Amplitud (AM): la frecuencia se mantiene constante mientras la amplitud exterior es moldeada por el modulador.",
      "Modulación en Anillo (Ring Modulation): la polaridad de los ciclos se invierte en cada cruce por cero cancelando frecuencias.",
      "Modulación de Fase (PM): los ciclos sufren desplazamientos temporales de fase manteniendo amplitud y frecuencia promedio."
    ],
    correctIndex: 1,
    explanation: "Es Modulación de Amplitud (AM). La distancia entre ciclos (frecuencia portadora) permanece fija, pero la envolvente exterior de amplitud de la señal crece y decrece siguiendo fielmente a la onda moduladora."
  },
  {
    id: 9,
    question: "¿Qué módulo Eurorack es este y cuál es su función principal?",
    points: 1,
    isBonus: false,
    image: "assets/images/image6.png",
    options: [
      "VCO (Voltage Controlled Oscillator): genera formas de onda periódicas primarias afinadas a 1V/Octava.",
      "VCA (Voltage Controlled Amplifier): atenúa y amplifica la amplitud de audio según voltajes de control.",
      "ADSR (Envelope Generator): produce curvas transitorias de cuatro etapas para modular otros módulos.",
      "VCF (Voltage Controlled Filter): procesa el espectro sonoro mediante corte y resonancia de frecuencias."
    ],
    correctIndex: 3,
    explanation: "Es un VCF (Voltage Controlled Filter), específicamente el Doepfer A-124 Wasp VCF. Se reconoce por sus potenciómetros de Frecuencia de corte (Frq), Resonancia (Res), entradas de audio y CV, y sus salidas dedicadas Band-Pass (BP) y Low/High-Pass (LP/HP Mix)."
  },
  {
    id: 10,
    question: "¿Qué módulo Eurorack es este y cuál es su función principal?",
    points: 1,
    isBonus: false,
    image: "assets/images/image7.png",
    options: [
      "VCA (Voltage Controlled Amplifier): modula la ganancia o volumen de señales de audio y voltajes de control.",
      "VCO (Voltage Controlled Oscillator): genera formas de onda periódicas primarias afinadas a 1V/Octava.",
      "VCF (Voltage Controlled Filter): procesa el espectro sonoro mediante corte y resonancia de frecuencias.",
      "ADSR (Envelope Generator): produce curvas transitorias de cuatro etapas para modular otros módulos."
    ],
    correctIndex: 0,
    explanation: "Es un VCA (Voltage Controlled Amplifier) Doepfer clásico. Cuenta con perilla de ganancia manual inicial (Gain), entrada de señal de audio con atenuador, entradas de voltaje de control (CV) y salida de señal procesada."
  },
  {
    id: 11,
    question: "En la interconexión de instrumentos electrónicos y módulos, ¿qué tipo de señal transmite el estándar de comunicación MIDI?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "Flujo de audio digital multicanal en modulación PCM sin compresión.",
      "Exclusivamente paquetes de datos binarios con instrucciones y eventos de control (Note On, Pitch, Clock), sin señal de audio.",
      "Voltajes analógicos de control de alta precisión para modulación directa de tono (1V/Oct) y disparo.",
      "Señales de audio analógico de nivel de línea balanceadas para evitar interferencias de ruido electromagnético."
    ],
    correctIndex: 1,
    explanation: "El estándar MIDI (Musical Instrument Digital Interface) no transporta audio ni voltajes analógicos, sino exclusivamente un protocolo de comunicación serie con mensajes de datos digitales (eventos como activación/corte de nota, velocidad, cambios de control y sincronía de reloj) que indican a los sintetizadores receptores cómo y cuándo generar sonido."
  },
  {
    id: 12,
    question: "En la síntesis modular, ¿a qué tipo de señal de control corresponde cada forma de onda (A, B y C) al presionar y soltar dos teclas sucesivas (Nota 1 y Nota 2 más aguda)?",
    points: 1,
    isBonus: false,
    image: "assets/images/image8.png",
    options: [
      "A: Trigger (disparo breve) — B: Gate (compuerta sostenida) — C: Pitch CV (voltaje escalonado)",
      "A: Gate (compuerta sostenida) — B: Trigger (disparo breve) — C: Pitch CV (voltaje escalonado)",
      "A: Pitch CV (voltaje escalonado) — B: Gate (compuerta sostenida) — C: Trigger (disparo breve)",
      "A: Pitch CV (voltaje escalonado) — B: Trigger (disparo breve) — C: Gate (compuerta sostenida)"
    ],
    correctIndex: 1,
    explanation: "A es Gate: se mantiene en nivel alto fijo (+5V o +10V) mientras la tecla está oprimida y baja a cero al soltarla (ambas notas tienen exactamente la misma amplitud de compuerta). B es Trigger: genera un pulso muy breve (1 a 10 ms) justo al inicio de cada pulsación. C es Pitch CV: entrega un nivel de voltaje proporcional al tono (1V/Octava), sube a un nivel superior con la nota más aguda y retiene el voltaje al soltar la tecla (Sample & Hold)."
  }
];

// ============================================================================
// EXPORTACIÓN ACTIVA DE PREGUNTAS
// Depende exclusivamente del flag EXAM_MODE ('fundamentos' | 'avanzado' | 'completo')
// ============================================================================
const RAW_QUESTIONS = EXAM_MODE === 'fundamentos'
  ? FUNDAMENTAL_QUESTIONS
  : (EXAM_MODE === 'avanzado' ? ADVANCED_QUESTIONS : [...FUNDAMENTAL_QUESTIONS, ...ADVANCED_QUESTIONS]);

// Numeración de IDs secuencial garantizada
const QUESTIONS = RAW_QUESTIONS.map((q, idx) => ({
  ...q,
  id: idx + 1
}));
