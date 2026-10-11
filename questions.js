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
 *   'completo'    : Ambos sets combinados (26 preguntas)
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
      "Tono (Frecuencia), Timbre (Espectro armónico), Intensidad (Amplitud) y Duración",
      "Reverberación espacial, Retardo (Delay), Modulación de fase y Distorsión armónica",
      "Tiempo de ataque, Tiempo de caída, Nivel de sostenido y Tiempo de liberación"
    ],
    correctIndex: 1,
    explanation: "El sonido se define por cuatro dimensiones físicas perceptibles: 1) Tono/Altura (frecuencia fundamental en Hz); 2) Timbre (composición y distribución de armónicos); 3) Intensidad (amplitud o volumen en dB); 4) Duración y evolución en el tiempo (envolvente temporal)."
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
      "Onda Cuadrada (Square): posee simetría bipolar del 50% y contiene exclusivamente armónicos impares.",
      "Onda Senoidal (Sine): es un tono puro fundamental y carece totalmente de armónicos superiores.",
      "Diente de Sierra (Sawtooth): tiene pendiente lineal continua y contiene armónicos pares e impares.",
      "Onda Triangular (Triangle): tiene forma piramidal simétrica y sus armónicos impares decaen muy rápido."
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
      "Generar frecuencias sub-graves audibles para alimentar exclusivamente los subwoofers.",
      "Filtrar los armónicos agudos de una señal de audio para darle un carácter más cálido.",
      "Generar formas de onda lentas (sub-audibles) para modular cíclicamente otros parámetros.",
      "Amplificar la ganancia de salida general del instrumento antes de llegar a los monitores."
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
      "Aumenta el volumen global de salida del módulo de forma lineal en todo el espectro.",
      "Modifica la afinación de las notas del oscilador desplazando la octava hacia el grave.",
      "Enfatiza las frecuencias cercanas al corte, pudiendo autooscilar en valores extremos.",
      "Invierte la fase de la señal de entrada en 180 grados anulando las frecuencias medias."
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
      "Que el sintetizador modular no puede recibir voltajes de entrada superiores a 1.0 Voltio.",
      "Que el rango de afinación de todo el instrumento está restringido a 1 sola octava útil.",
      "Que la fuente de alimentación del sistema entrega exactamente 1.0 Voltio por cada módulo.",
      "Que cada incremento de 1.0 Voltio en la entrada de control duplica la frecuencia del tono (f x 2)."
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
  },
  {
    id: 13,
    question: "Cultura Make Noise Lab: ¿Por qué en síntesis modular se dice que 'un parche nunca se termina'?",
    points: 0,
    isBonus: true,
    image: null,
    options: [
      "Porque siempre hay una modulación más que probar y si desconectas el parche se pierde.",
      "Porque los módulos Eurorack se sobrecalientan si permanecen conectados en la misma posición.",
      "Porque es una norma técnica estipulada en los manuales de la Asociación Chilena de Sonido.",
      "Porque los cables de patch pierden conductividad si se dejan fijos por más de una sesión."
    ],
    correctIndex: 0,
    explanation: "El encanto y la mística de la síntesis modular es lo efímero: un parche es una escultura sonora temporal e irrepetible. Cada sesión es una exploración única."
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
    question: "Con respecto al algoritmo anterior: ¿Cuál operador es la portadora (Carrier) que entrega el sonido al bus de audio de salida?",
    points: 1,
    isBonus: false,
    image: "assets/images/image3.png",
    options: [
      "Operador 1",
      "Operador 2",
      "Operador 3",
      "Operador 4"
    ],
    correctIndex: 0,
    explanation: "El Operador 1 es la portadora porque es el único que tiene la línea de conexión saliendo hacia el bus de audio del sintetizador."
  },
  {
    id: 5,
    question: "Con respecto al mismo algoritmo: ¿Cuál operador cuenta con bucle de retroalimentación (Feedback / Automodulación)?",
    points: 1,
    isBonus: false,
    image: "assets/images/image3.png",
    options: [
      "Operador 1",
      "Operador 2",
      "Operador 3",
      "Operador 4"
    ],
    correctIndex: 3,
    explanation: "El Operador 4 posee el recuadro de retorno sobre su propia entrada (feedback loop), lo que le permite automodularse para generar mayor densidad de armónicos o ruido controlado."
  },
  {
    id: 6,
    question: "¿Cuáles son los cuatro módulos fundamentales que conforman la arquitectura básica de un sintetizador analógico sustractivo?",
    points: 1,
    isBonus: false,
    image: null,
    options: [
      "VCO (Oscilador) + VCV Rack + Delay Analógico + Reverb Digital",
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
    question: "Pregunta de rigor Make Noise Lab: La dura, ¿a qué suena realmente un cable MIDI cuando lo conectai?",
    points: 0,
    isBonus: true,
    image: null,
    options: [
      "A sinte analógico ochentero bien gordito y con calidez vintage.",
      "A nada po: no lleva audio, solo paquetes de datos y números binarios.",
      "Al clásico chillido de módem telefónico Dial-Up de los años noventa.",
      "A latencia analógica pura circulando entre los conectores DIN."
    ],
    correctIndex: 1,
    explanation: "Un cable MIDI jamás transporta sonido: solo paquetes numéricos que le indican a un instrumento digital cuándo, cuánto y con qué fuerza tocar una nota."
  },
  {
    id: 12,
    question: "Cultura modular en Make Noise Lab: ¿Por qué es fundamental dominar los nudos náuticos?",
    points: 0,
    isBonus: true,
    image: null,
    options: [
      "Porque si el cable no tiene nudo marinero se le escapa el voltaje de control de afinación.",
      "Para fondear el case Eurorack y que no salga volando cuando hay marejadas de feedback.",
      "Para desenredar la selva de patch cords de 3.5mm cuando el modular se pone mañoso.",
      "Es un requisito técnico de la Armada de Chile para autorizar conciertos con sintetizadores."
    ],
    correctIndex: 2,
    explanation: "El orden del cableado en síntesis modular es vital para no terminar con una ensalada inmanejable de cables cruzados en pleno concierto."
  },
  {
    id: 13,
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
