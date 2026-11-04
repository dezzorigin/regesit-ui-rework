/* ==========================================================================
   REGESIT PARTICIPANT REGISTRATION SCRIPT
   Handles:
   - Floating Toast Notification System (No Native Browser Alerts)
   - Real-time Form Validation with Shake & Color Highlight Animation
   - Digital Signature Canvas (Touch / Mouse / Stylus Drawing)
   - Celebratory Confetti Cannon Burst
   - Dynamic QR Ticket Generation & Fullscreen Lightbox Modal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const formView = document.getElementById('registrationFormView');
  const successView = document.getElementById('ticketSuccessView');
  const form = document.getElementById('participantRegisterForm');

  // Input Fields & Elements
  const inputFullName = document.getElementById('regFullName');
  const inputEmail = document.getElementById('regEmail');
  const inputPhone = document.getElementById('regPhone');
  const inputCompany = document.getElementById('regCompany');
  const checkAgreement = document.getElementById('regAgreement');
  const agreementCard = document.querySelector('.agreement-check-card');
  const btnSubmit = document.getElementById('btnSubmitForm');
  const canvasWrap = document.querySelector('.signature-canvas-wrap');

  // Result Elements
  const resTicketCode = document.getElementById('resTicketCode');
  const resAttendeeName = document.getElementById('resAttendeeName');
  const resAttendeeOrg = document.getElementById('resAttendeeOrg');
  const resTicketQrImg = document.getElementById('resTicketQrImg');
  const btnDownloadTicket = document.getElementById('btnDownloadTicket');

  // ==========================================================================
  // 1. FLOATING TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(title, desc, type = 'warning') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-card ${type}`;

    const iconSvg = type === 'success' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
      : type === 'warning'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

    toast.innerHTML = `
      <div class="toast-icon-wrap">${iconSvg}</div>
      <div class="toast-content-wrap">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${desc}</div>
      </div>
      <button class="toast-close-btn" type="button" aria-label="Tutup">✕</button>
      <div class="toast-progress-bar"></div>
    `;

    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismiss = () => {
      toast.classList.add('dismissing');
      setTimeout(() => {
        if (toast.parentElement) container.removeChild(toast);
      }, 240);
    };

    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, 3500);

    container.appendChild(toast);
  }

  // ==========================================================================
  // 2. SHAKE ERROR & VALIDATION HIGHLIGHT CONTROLLER
  // ==========================================================================
  function triggerFieldError(el, title, desc) {
    if (!el) return;

    // Reset animation if already present
    el.classList.remove('shake-error');
    void el.offsetWidth; // Force reflow to re-trigger CSS animation
    el.classList.add('is-invalid', 'shake-error');

    // Scroll smoothly to element
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Focus input if applicable
    if (typeof el.focus === 'function') {
      el.focus();
    }

    // Show custom warning toast
    showToast(title, desc, 'warning');
  }

  function clearFieldError(el) {
    if (!el) return;
    el.classList.remove('is-invalid', 'shake-error');
  }

  // Auto-remove error state on typing / interaction
  if (inputFullName) inputFullName.addEventListener('input', () => clearFieldError(inputFullName));
  if (inputEmail) inputEmail.addEventListener('input', () => clearFieldError(inputEmail));
  if (inputPhone) inputPhone.addEventListener('input', () => clearFieldError(inputPhone));
  if (checkAgreement && agreementCard) {
    checkAgreement.addEventListener('change', () => clearFieldError(agreementCard));
  }

  // ==========================================================================
  // 3. DIGITAL SIGNATURE CANVAS CONTROLLER
  // ==========================================================================
  const canvas = document.getElementById('signatureCanvas');
  const clearBtn = document.getElementById('btnClearSignature');
  const signatureHint = document.getElementById('signatureHint');

  let ctx = null;
  let isDrawing = false;
  let hasSigned = false;

  if (canvas) {
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function getPointerPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDrawing(e) {
      isDrawing = true;
      hasSigned = true;
      if (signatureHint) signatureHint.style.display = 'none';
      if (canvasWrap) clearFieldError(canvasWrap);

      const pos = getPointerPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault(); // Prevent scrolling on touch devices
      const pos = getPointerPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function stopDrawing() {
      if (isDrawing) {
        ctx.closePath();
        isDrawing = false;
      }
    }

    // Mouse Events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);

    // Touch Events (Mobile & Tablet)
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDrawing);
    window.addEventListener('touchcancel', stopDrawing);

    // Clear Signature
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        hasSigned = false;
        if (signatureHint) signatureHint.style.display = 'flex';
        if (canvasWrap) clearFieldError(canvasWrap);
      });
    }
  }

  // ==========================================================================
  // 4. CELEBRATORY CONFETTI GLITTER CANNON ENGINE
  // ==========================================================================
  function fireConfettiGlitterCannon() {
    const confettiCanvas = document.getElementById('confettiCanvas');
    if (!confettiCanvas) return;

    const cCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#1975f9', '#3bc855', '#fbbf24', '#f43f5e', '#a855f7', '#06b6d4', '#ec4899', '#ffffff'];

    function spawnBurst(originX, originY, count = 50) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 12 + 6;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - Math.random() * 6,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5,
          opacity: 1,
          decay: Math.random() * 0.012 + 0.008,
          gravity: 0.28,
          shape: Math.random() > 0.4 ? 'rect' : 'circle'
        });
      }
    }

    spawnBurst(window.innerWidth * 0.5, window.innerHeight * 0.45, 90);
    setTimeout(() => spawnBurst(window.innerWidth * 0.25, window.innerHeight * 0.3, 40), 120);
    setTimeout(() => spawnBurst(window.innerWidth * 0.75, window.innerHeight * 0.3, 40), 200);

    let animId = null;

    function renderConfetti() {
      cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > confettiCanvas.height) {
          particles.splice(i, 1);
          continue;
        }

        cCtx.save();
        cCtx.translate(p.x, p.y);
        cCtx.rotate((p.rotation * Math.PI) / 180);
        cCtx.globalAlpha = p.opacity;
        cCtx.fillStyle = p.color;

        if (p.shape === 'rect') {
          cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          cCtx.beginPath();
          cCtx.arc(0, 0, p.size / 2.2, 0, Math.PI * 2);
          cCtx.fill();
        }

        cCtx.restore();
      }

      if (particles.length > 0) {
        animId = requestAnimationFrame(renderConfetti);
      } else {
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        cancelAnimationFrame(animId);
      }
    }

    renderConfetti();
  }

  // ==========================================================================
  // 5. FORM SUBMISSION & SHAKE VALIDATION
  // ==========================================================================
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = inputFullName?.value.trim();
      const email = inputEmail?.value.trim();
      const phone = inputPhone?.value.trim();
      const company = inputCompany?.value.trim() || 'Peserta Terdaftar';
      const isAgreed = checkAgreement?.checked;

      // 1. Validate Nama Lengkap
      if (!fullName) {
        triggerFieldError(inputFullName, 'Nama Lengkap Belum Diisi ⚠️', 'Silakan masukkan nama lengkap Anda untuk dicetak pada tiket.');
        return;
      }

      // 2. Validate Alamat Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        triggerFieldError(inputEmail, 'Alamat Email Belum Valid ⚠️', 'Mohon masukkan format email yang benar (contoh: nama@email.com).');
        return;
      }

      // 3. Validate Nomor WhatsApp
      if (!phone) {
        triggerFieldError(inputPhone, 'Nomor WhatsApp Belum Diisi ⚠️', 'Silakan masukkan nomor telepon / WhatsApp aktif Anda.');
        return;
      }

      // 4. Validate Digital Signature
      if (!hasSigned) {
        triggerFieldError(canvasWrap, 'Tanda Tangan Diperlukan ✍️', 'Mohon bubuhkan tanda tangan digital Anda pada kanvas yang disediakan.');
        return;
      }

      // 5. Validate Agreement Checkbox
      if (!isAgreed) {
        triggerFieldError(agreementCard, 'Persetujuan Belum Dicentang ⚠️', 'Mohon centang pernyataan persetujuan pendaftaran sebelum melanjutkan.');
        return;
      }

      // Button Loading State
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = '0.85';
        btnSubmit.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          <span>Menerbitkan Tiket QR...</span>
        `;
      }

      setTimeout(() => {
        // Generate Ticket Details
        const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
        const ticketCode = `TIK-${randomTicketNum}`;

        if (resTicketCode) resTicketCode.textContent = ticketCode;
        if (resAttendeeName) resAttendeeName.textContent = fullName;
        if (resAttendeeOrg) resAttendeeOrg.textContent = company;
        if (resTicketQrImg) {
          const qrPayload = encodeURIComponent(`${ticketCode}|${fullName}|${email}`);
          resTicketQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${qrPayload}`;
        }

        // Store payload for Fullscreen Lightbox Modal
        window.currentTicketPayload = {
          code: ticketCode,
          name: fullName,
          org: company,
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(`${ticketCode}|${fullName}|${email}`)}`
        };

        // Fire Confetti Cannon
        fireConfettiGlitterCannon();

        // Switch View with Smooth Entrance Animation
        if (formView) formView.style.display = 'none';
        if (successView) successView.classList.add('active');

        // Scroll smoothly to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Show Success Toast
        showToast('Pendaftaran Berhasil! 🎉', `Tiket ${ticketCode} atas nama ${fullName} telah siap.`, 'success');
      }, 420);
    });
  }

  // ==========================================================================
  // 6. FULLSCREEN QR LIGHTBOX MODAL CONTROLLER
  // ==========================================================================
  const qrTrigger = document.getElementById('ticketQrTrigger');
  const qrModal = document.getElementById('qrFullscreenModal');
  const btnCloseQrModal = document.getElementById('btnCloseQrModal');
  const qrModalBackdrop = document.getElementById('qrModalBackdrop');
  const modalTicketCode = document.getElementById('modalTicketCode');
  const modalAttendeeName = document.getElementById('modalAttendeeName');
  const modalTicketQrImg = document.getElementById('modalTicketQrImg');

  function openFullscreenQrModal() {
    if (!qrModal) return;
    const data = window.currentTicketPayload || {
      code: resTicketCode?.textContent || 'TIK-8821',
      name: resAttendeeName?.textContent || 'Peserta Terdaftar',
      qrUrl: resTicketQrImg?.src || 'https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=TIK-8821'
    };

    if (modalTicketCode) modalTicketCode.textContent = data.code;
    if (modalAttendeeName) modalAttendeeName.textContent = data.name;
    if (modalTicketQrImg) modalTicketQrImg.src = data.qrUrl;

    qrModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeFullscreenQrModal() {
    if (!qrModal) return;
    qrModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (qrTrigger) qrTrigger.addEventListener('click', openFullscreenQrModal);
  if (btnCloseQrModal) btnCloseQrModal.addEventListener('click', closeFullscreenQrModal);
  if (qrModalBackdrop) qrModalBackdrop.addEventListener('click', closeFullscreenQrModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal?.classList.contains('active')) {
      closeFullscreenQrModal();
    }
  });

  // Download Ticket Simulation (Custom Toast)
  if (btnDownloadTicket) {
    btnDownloadTicket.addEventListener('click', () => {
      showToast('Tiket Berhasil Disimpan! 📥', 'File tiket QR resmi berhasil diunduh ke galeri ponsel Anda.', 'success');
    });
  }
});
