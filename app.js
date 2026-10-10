/**
 * MAKE NOISE LAB — MOTOR DE EVALUACIÓN
 * Adaptado a la nueva estructura HTML replicada desde makenoiselab.cl
 */

// ═══════════════════════════════════════════════════════════════════
// ESTADO DE LA APLICACIÓN
// ═══════════════════════════════════════════════════════════════════
const state = {
  student: { name: "", whatsapp: "", email: "" },
  currentIndex: 0,
  answers: {},
  startedAt: null,
  completedAt: null,
  soundEnabled: true,
  audioCtx: null,
  imagesPreloaded: false
};

// ═══════════════════════════════════════════════════════════════════
// WEB AUDIO API — Synth feedback tones
// ═══════════════════════════════════════════════════════════════════
function initAudio() {
  if (!state.audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) state.audioCtx = new AC();
  }
}

function playSynthTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.15) {
  if (!state.soundEnabled || !state.audioCtx) return;
  try {
    if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, state.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.start();
    osc.stop(state.audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio error", e);
  }
}

function playSuccessChord() {
  if (!state.soundEnabled || !state.audioCtx) return;
  [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
    setTimeout(() => playSynthTone(freq, 'triangle', 0.45, 0.12), i * 90);
  });
}

function playFailTone() {
  if (!state.soundEnabled || !state.audioCtx) return;
  [310, 260, 210].forEach((freq, i) => {
    setTimeout(() => playSynthTone(freq, 'sawtooth', 0.22, 0.08), i * 110);
  });
}

// ═══════════════════════════════════════════════════════════════════
// DOM ELEMENTS
// ═══════════════════════════════════════════════════════════════════
const elements = {
  welcomeScreen: document.getElementById('welcomeScreen'),
  quizScreen: document.getElementById('quizScreen'),
  resultScreen: document.getElementById('resultScreen'),
  vuProgressWrapper: document.getElementById('vuProgressWrapper'),
  vuFill: document.getElementById('vuFill'),
  progressLabel: document.getElementById('progressLabel'),
  percentageLabel: document.getElementById('percentageLabel'),
  questionBadge: document.getElementById('questionBadge'),
  pointsBadge: document.getElementById('pointsBadge'),
  questionText: document.getElementById('questionText'),
  mediaWrapper: document.getElementById('mediaWrapper'),
  diagramLoadingBox: document.getElementById('diagramLoadingBox'),
  diagramFrame: document.getElementById('diagramFrame'),
  questionImage: document.getElementById('questionImage'),
  optionsContainer: document.getElementById('optionsContainer'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  soundIcon: document.getElementById('soundIcon'),
  lightboxOverlay: document.getElementById('lightboxOverlay'),
  lightboxImg: document.getElementById('lightboxImg'),
  adminModal: document.getElementById('adminModal'),
  adminWebhookUrl: document.getElementById('adminWebhookUrl'),
  adminSubmissionCount: document.getElementById('adminSubmissionCount'),
  preloadStatusText: document.getElementById('preloadStatusText')
};

// ═══════════════════════════════════════════════════════════════════
// PRELOAD IMAGES
// ═══════════════════════════════════════════════════════════════════
function preloadAllImages() {
  const sources = QUESTIONS.filter(q => q.image).map(q => q.image);
  let loaded = 0;
  const total = sources.length;

  if (total === 0) { state.imagesPreloaded = true; return; }

  sources.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = img.onerror = () => {
      loaded++;
      if (elements.preloadStatusText) {
        elements.preloadStatusText.textContent = `${loaded}/${total} LISTOS`;
      }
      if (loaded >= total) {
        state.imagesPreloaded = true;
        if (elements.preloadStatusText) {
          elements.preloadStatusText.textContent = `LISTO (100%)`;
        }
      }
    };
  });
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS — Idénticas al sitio makenoiselab.cl
// ═══════════════════════════════════════════════════════════════════
function initScrollAnimations() {
  if (!window.IntersectionObserver) {
    document.querySelectorAll('.anim-fade-up').forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.anim-fade-up').forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Webhook from local storage
  const savedWebhook = localStorage.getItem('mnl_webhook_url');
  if (savedWebhook) EXAM_CONFIG.webhookUrl = savedWebhook;
  if (elements.adminWebhookUrl) elements.adminWebhookUrl.value = EXAM_CONFIG.webhookUrl || "";

  // Sincronizar métricas dinámicas del examen según el modo activo
  const techCount = QUESTIONS.filter(q => q.points > 0).length;
  const bonusCount = QUESTIONS.filter(q => q.isBonus).length;
  const minPass = Math.ceil((techCount * EXAM_CONFIG.passingScorePercentage) / 100);

  const headingEl = document.getElementById('examMainHeading');
  if (headingEl && EXAM_CONFIG.title) headingEl.textContent = EXAM_CONFIG.title;

  const rulesEl = document.getElementById('examRulesSummary');
  if (rulesEl) {
    rulesEl.textContent = `${techCount} preguntas técnicas de selección múltiple + ${bonusCount} preguntas bonus de humor (sin puntaje). Cada pregunta técnica cuenta con su respectivo diagrama de análisis.`;
  }

  const pointsValEl = document.getElementById('metricPointsVal');
  if (pointsValEl) pointsValEl.textContent = `${techCount} PTS`;

  const pointsLabelEl = document.getElementById('metricPointsLabel');
  if (pointsLabelEl) pointsLabelEl.textContent = `TÉCNICOS (+${bonusCount} BONUS)`;

  const passingRateEl = document.getElementById('metricPassingRate');
  if (passingRateEl) passingRateEl.textContent = `${EXAM_CONFIG.passingScorePercentage}%`;

  const minPassEl = document.getElementById('metricMinPass');
  if (minPassEl) minPassEl.textContent = `${minPass} / ${techCount}`;

  const infoBonusEl = document.getElementById('infoBonusNote');
  if (infoBonusEl) {
    infoBonusEl.textContent = bonusCount === 1
      ? 'La pregunta de humor es bonus y no afecta tu nota. Cada pregunta técnica vale 1 punto.'
      : `Las ${bonusCount} preguntas de humor son bonus y no afectan tu nota. Cada pregunta técnica vale 1 punto.`;
  }

  if (EXAM_CONFIG.title) document.title = `${EXAM_CONFIG.title} — Make Noise Lab`;

  // Preload images
  preloadAllImages();

  // Scroll animations
  initScrollAnimations();

  // Sound toggle
  elements.soundToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    elements.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
    elements.soundToggleBtn.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');
    if (state.soundEnabled) {
      initAudio();
      playSynthTone(587.33, 'triangle', 0.1);
    }
  });

  // Cerrar modales con Escape (WCAG 2.1)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (elements.lightboxOverlay.classList.contains('active')) closeLightbox();
    if (elements.adminModal.classList.contains('active')) closeAdminModal();
  });
});

// ═══════════════════════════════════════════════════════════════════
// SCREEN TRANSITIONS
// ═══════════════════════════════════════════════════════════════════
function showScreen(screenEl) {
  [elements.welcomeScreen, elements.quizScreen, elements.resultScreen].forEach(el => {
    el.classList.remove('active');
  });
  screenEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════════════════════
// START EXAM
// ═══════════════════════════════════════════════════════════════════
function startExam() {
  initAudio();
  const nameEl = document.getElementById('studentName');
  const whatsappEl = document.getElementById('studentWhatsapp');
  const emailEl = document.getElementById('studentEmail');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const emailError = document.getElementById('emailError');

  let isValid = true;
  const name = nameEl.value.trim();
  const whatsapp = whatsappEl.value.trim();
  const email = emailEl.value.trim();

  if (!name) {
    if (nameError) nameError.style.display = 'block';
    nameEl.focus();
    isValid = false;
  } else if (nameError) {
    nameError.style.display = 'none';
  }

  if (!whatsapp) {
    if (phoneError) phoneError.style.display = 'block';
    if (isValid) whatsappEl.focus();
    isValid = false;
  } else if (phoneError) {
    phoneError.style.display = 'none';
  }

  if (!email || !email.includes('@')) {
    if (emailError) emailError.style.display = 'block';
    if (isValid) emailEl.focus();
    isValid = false;
  } else if (emailError) {
    emailError.style.display = 'none';
  }

  if (!isValid) return;

  state.student = { name, whatsapp, email };
  state.startedAt = new Date().toISOString();
  state.currentIndex = 0;
  state.answers = {};

  elements.vuProgressWrapper.style.display = 'block';
  playSynthTone(523.25, 'sine', 0.15);

  showScreen(elements.quizScreen);
  renderQuestion(state.currentIndex);
}

// ═══════════════════════════════════════════════════════════════════
// RENDER QUESTION
// ═══════════════════════════════════════════════════════════════════
function renderQuestion(index) {
  const q = QUESTIONS[index];
  if (!q) return;

  const progressPercent = Math.round((index / QUESTIONS.length) * 100);
  elements.vuFill.style.width = `${Math.max(6, progressPercent)}%`;
  elements.progressLabel.textContent = `PARCHE ${String(index + 1).padStart(2, '0')} / ${String(QUESTIONS.length).padStart(2, '0')}`;
  elements.percentageLabel.textContent = `${progressPercent}% LISTO`;

  // Diferenciación visual de pregunta técnica vs bonus cómica
  const bonusBanner = document.getElementById('bonusAlertBanner');
  const quizCard = document.querySelector('.quiz-container');

  if (q.isBonus) {
    elements.questionBadge.textContent = `★ PREGUNTA BONUS (HUMOR & CULTURA)`;
    elements.questionBadge.className = 'badge-rect badge-bonus';
    elements.pointsBadge.textContent = `0 PUNTOS // NO EVALUADA (SIN PUNTAJE)`;
    elements.pointsBadge.className = 'points-label points-bonus';
    if (bonusBanner) bonusBanner.style.display = 'flex';
    if (quizCard) quizCard.classList.add('is-bonus-card');
  } else {
    elements.questionBadge.textContent = `PREGUNTA ${String(index + 1).padStart(2, '0')}`;
    elements.questionBadge.className = 'badge-rect';
    elements.pointsBadge.textContent = `PUNTAJE: ${q.points} PTO`;
    elements.pointsBadge.className = 'points-label';
    if (bonusBanner) bonusBanner.style.display = 'none';
    if (quizCard) quizCard.classList.remove('is-bonus-card');
  }

  elements.questionText.textContent = q.question;

  // Image loading with sync loader
  if (q.image) {
    elements.mediaWrapper.style.display = 'block';
    elements.diagramLoadingBox.style.display = 'flex';
    elements.diagramFrame.style.display = 'none';
    elements.questionImage.classList.remove('loaded');
    elements.questionImage.src = q.image;

    const onImageLoaded = () => {
      elements.diagramLoadingBox.style.display = 'none';
      elements.diagramFrame.style.display = 'flex';
      elements.questionImage.classList.add('loaded');
    };

    if (elements.questionImage.complete) {
      onImageLoaded();
    } else {
      elements.questionImage.onload = onImageLoaded;
      elements.questionImage.onerror = () => {
        elements.diagramLoadingBox.style.display = 'none';
        elements.diagramFrame.style.display = 'flex';
      };
    }
  } else {
    elements.mediaWrapper.style.display = 'none';
    elements.questionImage.src = "";
  }

  // Options with WCAG accessibility
  elements.optionsContainer.innerHTML = '';
  // Roving tabindex: solo la opción seleccionada (o la primera) es tabulable
  const rovingIdx = state.answers[q.id] !== undefined ? state.answers[q.id] : 0;
  q.options.forEach((optText, optIdx) => {
    const isSelected = state.answers[q.id] === optIdx;
    const card = document.createElement('div');
    card.className = `option-card ${isSelected ? 'selected' : ''}`;
    card.tabIndex = optIdx === rovingIdx ? 0 : -1;
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    card.setAttribute('aria-label', `Opción ${optIdx + 1}: ${optText}`);
    card.innerHTML = `
      <div class="option-square" aria-hidden="true"></div>
      <div class="option-text">${optText}</div>
    `;

    card.addEventListener('click', () => selectOption(q.id, optIdx));
    card.addEventListener('focus', () => {
      elements.optionsContainer.querySelectorAll('.option-card').forEach(c => { c.tabIndex = -1; });
      card.tabIndex = 0;
    });
    card.addEventListener('keydown', (e) => {
      // Patrón ARIA radiogroup: flechas mueven el foco Y seleccionan
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(q.id, optIdx);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (optIdx + 1) % q.options.length;
        selectOption(q.id, nextIdx);
        elements.optionsContainer.children[nextIdx].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (optIdx - 1 + q.options.length) % q.options.length;
        selectOption(q.id, prevIdx);
        elements.optionsContainer.children[prevIdx].focus();
      }
    });

    elements.optionsContainer.appendChild(card);
  });

  elements.prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
  elements.nextBtn.textContent = index === QUESTIONS.length - 1 ? 'FINALIZAR ⚡' : 'SIGUIENTE →';
}

// ═══════════════════════════════════════════════════════════════════
// SELECT OPTION
// ═══════════════════════════════════════════════════════════════════
function selectOption(questionId, optionIndex) {
  state.answers[questionId] = optionIndex;
  playSynthTone(440 + (optionIndex * 55), 'sine', 0.07);

  elements.optionsContainer.querySelectorAll('.option-card').forEach((card, idx) => {
    // Roving tabindex: la opción seleccionada pasa a ser la única tabulable
    card.tabIndex = idx === optionIndex ? 0 : -1;
    if (idx === optionIndex) {
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
    } else {
      card.classList.remove('selected');
      card.setAttribute('aria-checked', 'false');
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════
function navigatePrev() {
  if (state.currentIndex > 0) {
    playSynthTone(349.23, 'triangle', 0.05);
    state.currentIndex--;
    renderQuestion(state.currentIndex);
  }
}

function navigateNext() {
  const currentQ = QUESTIONS[state.currentIndex];
  if (state.answers[currentQ.id] === undefined) {
    const confirmSkip = confirm("No seleccionaste respuesta. ¿Avanzar igual?");
    if (!confirmSkip) return;
  }

  if (state.currentIndex < QUESTIONS.length - 1) {
    playSynthTone(523.25, 'triangle', 0.05);
    state.currentIndex++;
    renderQuestion(state.currentIndex);
  } else {
    finishExam();
  }
}

// ═══════════════════════════════════════════════════════════════════
// FINISH EXAM — Bonus questions don't count
// ═══════════════════════════════════════════════════════════════════
function finishExam() {
  state.completedAt = new Date().toISOString();
  elements.vuFill.style.width = '100%';
  elements.percentageLabel.textContent = '100% COMPLETADO';

  let technicalScore = 0;
  let technicalMax = 0;
  let bonusCorrect = 0;

  QUESTIONS.forEach(q => {
    if (q.points > 0) {
      technicalMax += q.points;
      if (state.answers[q.id] === q.correctIndex) technicalScore += q.points;
    } else if (q.isBonus) {
      if (state.answers[q.id] === q.correctIndex) bonusCorrect++;
    }
  });

  const percentage = Math.round((technicalScore / technicalMax) * 100);
  const passed = percentage >= EXAM_CONFIG.passingScorePercentage;

  if (passed) playSuccessChord(); else playFailTone();

  const record = {
    id: 'MNL-' + Date.now(),
    studentName: state.student.name,
    studentWhatsapp: state.student.whatsapp,
    studentEmail: state.student.email,
    score: technicalScore,
    totalPoints: technicalMax,
    bonusCorrect,
    bonusTotal: QUESTIONS.filter(q => q.isBonus).length,
    percentage,
    passed,
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    answers: state.answers
  };

  saveSubmissionLocally(record);
  syncSubmissionToRemote(record);
  renderResultsScreen(record);
  showScreen(elements.resultScreen);
}

// ═══════════════════════════════════════════════════════════════════
// RESULTS SCREEN
// ═══════════════════════════════════════════════════════════════════
function renderResultsScreen(record) {
  const stampEl = document.getElementById('resultStamp');
  const greetingEl = document.getElementById('resultGreeting');
  const summaryEl = document.getElementById('resultSummary');
  const scorePercentEl = document.getElementById('scorePercent');
  const scoreRatioEl = document.getElementById('scoreRatio');
  const feedbackEl = document.getElementById('scoreFeedback');

  scorePercentEl.textContent = `${record.percentage}%`;
  scoreRatioEl.textContent = `${record.score} / ${record.totalPoints} PUNTOS TÉCNICOS`;

  const passingPoints = Math.ceil((record.totalPoints * EXAM_CONFIG.passingScorePercentage) / 100);

  if (record.passed) {
    stampEl.textContent = 'APROBADO';
    stampEl.className = 'verdict-tag pass';
    scorePercentEl.className = 'score-big';
    greetingEl.textContent = `¡EXCELENTE, ${record.studentName.split(' ')[0].toUpperCase()}!`;
    summaryEl.textContent = 'Has aprobado la evaluación teórica de síntesis modular.';
    feedbackEl.textContent = `Superaste el ${EXAM_CONFIG.passingScorePercentage}% de exigencia (mínimo ${passingPoints} de ${record.totalPoints} pts).`;
  } else {
    stampEl.textContent = 'REPROBADO';
    stampEl.className = 'verdict-tag fail';
    scorePercentEl.className = 'score-big fail';
    greetingEl.textContent = `ÁNIMO, ${record.studentName.split(' ')[0].toUpperCase()}`;
    summaryEl.textContent = 'No alcanzaste el puntaje de corte.';
    feedbackEl.textContent = `Exigencia mínima: ${EXAM_CONFIG.passingScorePercentage}% (${passingPoints} de ${record.totalPoints} pts). Revisa abajo y repite.`;
  }

  // Acciones dinámicas en la pantalla de resultados
  const actionsContainer = document.getElementById('resultsActionsContainer');
  if (actionsContainer) {
    if (record.passed) {
      actionsContainer.innerHTML = `
        <button class="btn-cta-cert" id="downloadCertBtn" onclick="downloadCertificatePdf()" aria-label="Descargar Certificado Oficial en PDF">
          🎓 DESCARGAR CERTIFICADO OFICIAL (PDF)
        </button>
        <button class="btn-cta-whatsapp" id="shareWhatsappBtn" onclick="sendWhatsAppReceipt()" aria-label="Enviar comprobante por WhatsApp">
          ENVIAR POR WHATSAPP 📲
        </button>
        <div class="dual-actions-grid">
          <button class="btn-cta-secondary" onclick="downloadStudentCsv()" aria-label="Descargar CSV">
            DESCARGAR CSV 📥
          </button>
          <button class="btn-cta-secondary" onclick="restartExam()" aria-label="Repetir evaluación">
            REPETIR 🔄
          </button>
        </div>
      `;
    } else {
      actionsContainer.innerHTML = `
        <button class="btn-cta-yellow btn-retry-pulse" id="retryExamBtn" onclick="retryExam()" aria-label="Reintentar evaluación ahora">
          REINTENTAR EVALUACIÓN AHORA 🔄
        </button>
        <div class="dual-actions-grid">
          <button class="btn-cta-secondary" onclick="restartExam()" aria-label="Cambiar datos de alumno">
            CAMBIAR ALUMNO 👤
          </button>
          <button class="btn-cta-whatsapp" onclick="sendWhatsAppReceipt()" aria-label="Consultar al profesor por WhatsApp">
            CONSULTAR PROFE 📲
          </button>
        </div>
      `;
    }
  }

  const reviewList = document.getElementById('reviewList');
  reviewList.innerHTML = '';

  QUESTIONS.forEach((q, idx) => {
    const studentAnsIdx = record.answers[q.id];
    const isCorrect = studentAnsIdx === q.correctIndex;
    const studentAnsText = studentAnsIdx !== undefined ? q.options[studentAnsIdx] : "(Sin responder)";
    const correctAnsText = q.options[q.correctIndex];

    const item = document.createElement('div');
    if (q.isBonus) {
      item.className = 'review-item bonus';
      item.innerHTML = `
        <div class="review-q-num">★ PREGUNTA BONUS (SIN PUNTAJE) // ${isCorrect ? '✓ RESPUESTA ACERTADA' : '○ RESPUESTA ALTERNATIVA'} [0 PTS // NO AFECTA NOTA]</div>
        <div class="review-q-text">${q.question}</div>
        <div class="review-ans-row student"><strong>Tu selección:</strong> ${studentAnsText}</div>
        ${record.passed && !isCorrect ? `<div class="review-ans-row correct-ans"><strong>Respuesta del parche:</strong> ${correctAnsText}</div>` : ''}
        ${record.passed 
          ? `<div class="review-explanation"><strong>Comentario lúdico:</strong> ${q.explanation}</div>` 
          : `<div class="review-explanation locked">🔒 <strong>Fundamento bloqueado:</strong> Aprueba la evaluación con al menos ${EXAM_CONFIG.passingScorePercentage}% para desbloquear las soluciones.</div>`}
      `;
    } else {
      item.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
      if (record.passed) {
        // Alumno APROBADO: Ver respuestas correctas y explicaciones completas
        item.innerHTML = `
          <div class="review-q-num">[PARCHE ${String(idx + 1).padStart(2, '0')}] // ${isCorrect ? `✓ CORRECTO (+${q.points} PTO)` : '✗ INCORRECTO (0 PTO)'}</div>
          <div class="review-q-text">${q.question}</div>
          <div class="review-ans-row student"><strong>Tu selección:</strong> ${studentAnsText}</div>
          ${!isCorrect ? `<div class="review-ans-row correct-ans"><strong>Respuesta correcta:</strong> ${correctAnsText}</div>` : ''}
          <div class="review-explanation"><strong>Fundamento técnico:</strong> ${q.explanation}</div>
        `;
      } else {
        // Alumno REPROBADO: Respuestas correctas y explicaciones OCULTAS
        item.innerHTML = `
          <div class="review-q-num">[PARCHE ${String(idx + 1).padStart(2, '0')}] // ${isCorrect ? `✓ CORRECTO (+${q.points} PTO)` : '✗ INCORRECTO (0 PTO)'}</div>
          <div class="review-q-text">${q.question}</div>
          <div class="review-ans-row student ${!isCorrect ? 'student-wrong' : ''}"><strong>Tu selección:</strong> ${studentAnsText}</div>
          ${!isCorrect ? `<div class="review-ans-row locked-msg">🔒 <strong>Respuesta correcta oculta:</strong> Debes aprobar para desbloquear las soluciones.</div>` : ''}
          <div class="review-explanation locked">
            ${isCorrect 
              ? `✓ <strong>Respuesta acertada:</strong> ¡Muy bien! Recuerda este principio para el reintento.` 
              : `🔒 <strong>Fundamento bloqueado:</strong> Revisa tus conceptos y presiona <em>REINTENTAR EVALUACIÓN AHORA</em> arriba.`}
          </div>
        `;
      }
    }
    reviewList.appendChild(item);
  });
}

// ═══════════════════════════════════════════════════════════════════
// WHATSAPP RECEIPT
// ═══════════════════════════════════════════════════════════════════
function sendWhatsAppReceipt() {
  const record = getLatestSubmission();
  if (!record) return;

  const bonusTotal = record.bonusTotal || QUESTIONS.filter(q => q.isBonus).length;
  const statusText = record.passed ? '✅ APROBADO' : '❌ REPROBADO';
  const msg =
`*Make Noise Lab — Examen Teórico Síntesis Modular* 🎛️

👤 *Alumno:* ${record.studentName}
📱 *Contacto:* ${record.studentWhatsapp}
📊 *Puntaje:* ${record.score}/${record.totalPoints} pts (${record.percentage}%)
🎯 *Resultado:* ${statusText} (Corte: ${EXAM_CONFIG.passingScorePercentage}%)
🤡 *Bonus:* ${record.bonusCorrect}/${bonusTotal} preguntas de humor
📅 *Fecha:* ${new Date(record.completedAt).toLocaleString('es-CL')}

_Make Noise Lab (makenoiselab.cl)_`;

  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
}

// ═══════════════════════════════════════════════════════════════════
// LOCAL STORAGE
// ═══════════════════════════════════════════════════════════════════
function saveSubmissionLocally(record) {
  try {
    const list = JSON.parse(localStorage.getItem('mnl_submissions') || '[]');
    list.push(record);
    localStorage.setItem('mnl_submissions', JSON.stringify(list));
  } catch (e) { console.error("LocalStorage save error", e); }
}

function getLatestSubmission() {
  try {
    const list = JSON.parse(localStorage.getItem('mnl_submissions') || '[]');
    return list[list.length - 1];
  } catch (e) { return null; }
}

// ═══════════════════════════════════════════════════════════════════
// GOOGLE SHEETS SYNC
// ═══════════════════════════════════════════════════════════════════
function syncSubmissionToRemote(record) {
  const syncText = document.getElementById('syncText');
  const syncIcon = document.getElementById('syncIcon');
  const syncBanner = document.getElementById('syncBanner');

  const webhook = EXAM_CONFIG.webhookUrl || localStorage.getItem('mnl_webhook_url');

  if (!webhook) {
    syncIcon.textContent = '💾';
    syncText.textContent = 'Respaldado en memoria local.';
    return;
  }

  syncIcon.textContent = '⏳';
  syncText.textContent = 'Transmitiendo a Google Sheets...';

  const payload = {
    fecha: new Date(record.completedAt).toLocaleString('es-CL'),
    nombre: record.studentName,
    whatsapp: record.studentWhatsapp,
    email: record.studentEmail,
    puntaje: record.score,
    total: record.totalPoints,
    porcentaje: `${record.percentage}%`,
    estado: record.passed ? 'APROBADO' : 'REPROBADO',
    respuestas_json: JSON.stringify(record.answers)
  };

  fetch(webhook, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    syncBanner.className = 'sync-indicator success';
    syncIcon.textContent = '⚡';
    syncText.textContent = '¡Sincronizado con Google Sheets!';
  })
  .catch(() => {
    syncIcon.textContent = '⚠️';
    syncText.textContent = 'Respaldado localmente (WhatsApp / CSV disponible).';
  });
}

// ═══════════════════════════════════════════════════════════════════
// CSV DOWNLOADS
// ═══════════════════════════════════════════════════════════════════
function downloadStudentCsv() {
  const record = getLatestSubmission();
  if (!record) return;

  let csv = "ID,Fecha,Nombre,WhatsApp,Email,Puntaje_Tecnico,Total_Tecnico,Porcentaje,Estado\n";
  csv += `"${record.id}","${record.completedAt}","${record.studentName}","${record.studentWhatsapp}","${record.studentEmail}",${record.score},${record.totalPoints},"${record.percentage}%","${record.passed ? 'APROBADO' : 'REPROBADO'}"\n\n`;

  csv += "Nro,Pregunta,Tipo,Respuesta_Alumno,Respuesta_Correcta,Acierto\n";
  QUESTIONS.forEach((q, idx) => {
    const studentAns = record.answers[q.id] !== undefined ? q.options[record.answers[q.id]] : "Sin responder";
    const correctAns = q.options[q.correctIndex];
    const ok = record.answers[q.id] === q.correctIndex ? "SI" : "NO";
    const tipo = q.isBonus ? "BONUS" : "TECNICA";
    csv += `${idx + 1},"${q.question.replace(/"/g, '""')}","${tipo}","${studentAns.replace(/"/g, '""')}","${correctAns.replace(/"/g, '""')}","${ok}"\n`;
  });

  downloadFile(csv, `Examen_${record.studentName.replace(/\s+/g, '_')}_MNL.csv`, 'text/csv;charset=utf-8;');
}

function exportConsolidatedCsv() {
  const list = JSON.parse(localStorage.getItem('mnl_submissions') || '[]');
  if (list.length === 0) { alert("No hay registros."); return; }

  let csv = "ID,Fecha,Nombre,WhatsApp,Email,Puntaje_Tecnico,Total_Tecnico,Porcentaje,Estado\n";
  list.forEach(rec => {
    csv += `"${rec.id}","${rec.completedAt}","${rec.studentName}","${rec.studentWhatsapp}","${rec.studentEmail}",${rec.score},${rec.totalPoints},"${rec.percentage}%","${rec.passed ? 'APROBADO' : 'REPROBADO'}"\n`;
  });

  downloadFile(csv, `MNL_BBDD_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
}

function downloadFile(content, fileName, contentType) {
  const blob = new Blob(["\uFEFF" + content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════════════════════════════════
function openLightbox(src) {
  if (!src) return;
  elements.lightboxImg.src = src;
  elements.lightboxOverlay.classList.add('active');
}
function closeLightbox() {
  elements.lightboxOverlay.classList.remove('active');
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN MODAL
// ═══════════════════════════════════════════════════════════════════
function openAdminModal() {
  const list = JSON.parse(localStorage.getItem('mnl_submissions') || '[]');
  elements.adminSubmissionCount.textContent = list.length;
  elements.adminModal.classList.add('active');
}
function closeAdminModal() {
  elements.adminModal.classList.remove('active');
}
function saveWebhookUrl() {
  const url = elements.adminWebhookUrl.value.trim();
  localStorage.setItem('mnl_webhook_url', url);
  EXAM_CONFIG.webhookUrl = url;
  alert('Conexión con Webhook actualizada.');
  closeAdminModal();
}
function clearLocalSubmissions() {
  if (confirm("¿Vaciar todos los exámenes respaldados en este navegador?")) {
    localStorage.removeItem('mnl_submissions');
    elements.adminSubmissionCount.textContent = 0;
    alert("Historial local vaciado.");
  }
}
function restartExam() {
  if (confirm("¿Reiniciar y hacer una nueva evaluación?")) {
    showScreen(elements.welcomeScreen);
    elements.vuProgressWrapper.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════════
// REINTENTO DIRECTO DE EVALUACIÓN
// ═══════════════════════════════════════════════════════════════════
function retryExam() {
  state.currentIndex = 0;
  state.answers = {};
  state.startedAt = new Date().toISOString();

  elements.vuProgressWrapper.style.display = 'block';
  playSynthTone(523.25, 'sine', 0.15);
  showScreen(elements.quizScreen);
  renderQuestion(state.currentIndex);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════════════════════
// CERTIFICADO OFICIAL EN PDF (Make Noise Lab / Modular Moon)
// ═══════════════════════════════════════════════════════════════════
function downloadCertificatePdf() {
  const record = getLatestSubmission();
  if (!record || !record.passed) {
    alert(`El certificado de aprobación solo está disponible si superas el ${EXAM_CONFIG.passingScorePercentage}% de exigencia.`);
    return;
  }

  // Comprobar disponibilidad de jsPDF (cargado vía CDN)
  if (window.jspdf && window.jspdf.jsPDF) {
    generateJsPdfCertificate(record);
  } else {
    // Fallback a ventana de impresión certificada
    openPrintableCertificate(record);
  }
}

function generateJsPdfCertificate(record) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageW = 297;
  const pageH = 210;

  // Fondo oscuro industrial Make Noise Lab (#111111)
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Marco exterior amarillo neón (#EFFF1A)
  doc.setDrawColor(239, 255, 26);
  doc.setLineWidth(1.5);
  doc.rect(12, 12, pageW - 24, pageH - 24);

  // Marco interior fino dorado (#f9e750)
  doc.setDrawColor(249, 231, 80);
  doc.setLineWidth(0.5);
  doc.rect(14.5, 14.5, pageW - 29, pageH - 29);

  // Filetes decorativos en las 4 esquinas
  const cornerLen = 8;
  doc.setDrawColor(239, 255, 26);
  doc.setLineWidth(1.2);
  doc.line(10, 10, 10 + cornerLen, 10);
  doc.line(10, 10, 10, 10 + cornerLen);
  doc.line(pageW - 10, 10, pageW - 10 - cornerLen, 10);
  doc.line(pageW - 10, 10, pageW - 10, 10 + cornerLen);
  doc.line(10, pageH - 10, 10 + cornerLen, pageH - 10);
  doc.line(10, pageH - 10, 10, pageH - 10 - cornerLen);
  doc.line(pageW - 10, pageH - 10, pageW - 10 - cornerLen, pageH - 10);
  doc.line(pageW - 10, pageH - 10, pageW - 10, pageH - 10 - cornerLen);

  // Encabezado institucional
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(239, 255, 26);
  doc.text("MAKE NOISE LAB • MODULAR MOON SANTIAGO", pageW / 2, 27, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(180, 180, 180);
  doc.text("SEDE CHILENA DE MODULAR MOON AMSTERDAM • EVALUACIÓN ACADÉMICA OFICIAL", pageW / 2, 33, { align: "center" });

  // Línea divisoria dorada
  doc.setDrawColor(239, 255, 26);
  doc.setLineWidth(0.6);
  doc.line(45, 38, pageW - 45, 38);

  // Título Principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFICADO DE APROBACIÓN", pageW / 2, 52, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(249, 231, 80);
  doc.text("DIPLOMADO EN SÍNTESIS MODULAR", pageW / 2, 60, { align: "center" });

  // Texto introductorio
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(200, 200, 200);
  doc.text("Por cuanto se certifica que:", pageW / 2, 73, { align: "center" });

  // Nombre del Estudiante (Destacado en amarillo neón)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(239, 255, 26);
  doc.text(record.studentName.toUpperCase(), pageW / 2, 86, { align: "center" });

  // Subrayado del nombre
  doc.setDrawColor(239, 255, 26);
  doc.setLineWidth(0.8);
  const nameWidth = doc.getTextWidth(record.studentName.toUpperCase());
  doc.line((pageW / 2) - (nameWidth / 2) - 8, 90, (pageW / 2) + (nameWidth / 2) + 8, 90);

  // Descripción técnica
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(220, 220, 220);
  const desc = "Ha aprobado exitosamente la Evaluación Teórica de Síntesis Modular, demostrando dominio riguroso en control de voltaje (CV/Gate), arquitectura de sistemas Eurorack, síntesis sustractiva, osciladores, envolventes, modulación y ruteo analógico.";
  const splitDesc = doc.splitTextToSize(desc, 220);
  doc.text(splitDesc, pageW / 2, 100, { align: "center" });

  // Caja de métricas de certificación
  doc.setFillColor(28, 28, 30);
  doc.roundedRect(45, 116, pageW - 90, 24, 2.5, 2.5, 'F');
  doc.setDrawColor(60, 60, 65);
  doc.setLineWidth(0.4);
  doc.roundedRect(45, 116, pageW - 90, 24, 2.5, 2.5, 'D');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(239, 255, 26);
  doc.text(`PUNTAJE: ${record.score} / ${record.totalPoints} PTS (${record.percentage}%)`, 58, 126);

  doc.setTextColor(249, 231, 80);
  doc.text(`ESTADO: APROBADO (EXIGENCIA ${EXAM_CONFIG.passingScorePercentage}%)`, 58, 133);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text(`FOLIO: ${record.id}`, pageW - 58, 126, { align: "right" });
  const dateFormatted = new Date(record.completedAt || Date.now()).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`FECHA DE EMISIÓN: ${dateFormatted}`, pageW - 58, 133, { align: "right" });

  // Firmas y Sellos Institucionales (Inferior)
  const lineY = 168;

  // Firma Make Noise Lab (Izquierda)
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(45, lineY, 115, lineY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("MAKE NOISE LAB", 80, lineY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(160, 160, 160);
  doc.text("Dirección Académica Santiago", 80, lineY + 9, { align: "center" });

  // Sello Central
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(239, 255, 26);
  doc.text("★ CERTIFICACIÓN VERIFICADA ★", pageW / 2, lineY + 3, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text("makenoiselab.cl • modularmoon.com", pageW / 2, lineY + 8, { align: "center" });

  // Firma Modular Moon (Derecha)
  doc.line(pageW - 115, lineY, pageW - 45, lineY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("MODULAR MOON", pageW - 80, lineY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(160, 160, 160);
  doc.text("Amsterdam • The Netherlands", pageW - 80, lineY + 9, { align: "center" });

  // Descargar archivo PDF
  const filename = `Certificado_Sintesis_Modular_${record.studentName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
}

function openPrintableCertificate(record) {
  const dateFormatted = new Date(record.completedAt || Date.now()).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Por favor habilita las ventanas emergentes para generar el certificado.");
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Certificado — ${record.studentName}</title>
      <style>
        @page { size: A4 landscape; margin: 0; }
        body { margin: 0; padding: 20mm; background: #111; color: #fff; font-family: 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
        .cert-card { border: 2px solid #EFFF1A; outline: 1px solid #f9e750; padding: 30px; text-align: center; width: 100%; max-width: 900px; box-sizing: border-box; }
        h1 { color: #fff; font-size: 2.2rem; margin: 15px 0 5px; }
        h2 { color: #f9e750; font-size: 1.1rem; margin-bottom: 20px; }
        .student { color: #EFFF1A; font-size: 2rem; font-weight: bold; border-bottom: 2px solid #EFFF1A; display: inline-block; padding: 0 20px 5px; margin: 15px 0; }
        .desc { font-size: 0.95rem; color: #ccc; max-width: 650px; margin: 0 auto 25px; line-height: 1.5; }
        .metrics { background: #222; border: 1px solid #444; padding: 12px; margin-bottom: 30px; display: flex; justify-content: space-around; font-size: 0.85rem; color: #EFFF1A; font-family: monospace; }
        .signatures { display: flex; justify-content: space-between; margin-top: 20px; font-size: 0.8rem; color: #aaa; }
        .sig-block { border-top: 1px solid #666; width: 220px; padding-top: 6px; }
        @media print { body { background: #111 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      <div class="cert-card">
        <div style="color: #EFFF1A; font-weight: bold; font-size: 0.9rem; letter-spacing: 0.05em;">MAKE NOISE LAB • MODULAR MOON SANTIAGO</div>
        <div style="font-size: 0.75rem; color: #888; margin-top: 2px;">SEDE CHILENA DE MODULAR MOON AMSTERDAM</div>
        <h1>CERTIFICADO DE APROBACIÓN</h1>
        <h2>DIPLOMADO EN SÍNTESIS MODULAR</h2>
        <div style="color: #bbb; font-size: 0.9rem;">Por cuanto se certifica que:</div>
        <div class="student">${record.studentName.toUpperCase()}</div>
        <div class="desc">Ha aprobado exitosamente la Evaluación Teórica de Síntesis Modular, demostrando dominio en control de voltaje (CV/Gate), arquitectura de sistemas Eurorack, modulación analógica y diseño sonoro.</div>
        <div class="metrics">
          <span>PUNTAJE: ${record.score} / ${record.totalPoints} PTS (${record.percentage}%)</span>
          <span>ESTADO: APROBADO</span>
          <span>FOLIO: ${record.id}</span>
          <span>FECHA: ${dateFormatted}</span>
        </div>
        <div class="signatures">
          <div class="sig-block"><strong style="color: #fff;">MAKE NOISE LAB</strong><br>Dirección Académica Santiago</div>
          <div style="align-self: center; color: #EFFF1A; font-weight: bold;">★ ACREDITADO ★</div>
          <div class="sig-block"><strong style="color: #fff;">MODULAR MOON</strong><br>Amsterdam • The Netherlands</div>
        </div>
      </div>
      <script>window.onload = function() { window.print(); };</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
