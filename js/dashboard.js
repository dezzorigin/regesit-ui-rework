/**
 * REGESIT ORGANIZER DASHBOARD - BENTO SYSTEM & IN-DASHBOARD MODAL CHUNKING WIZARD
 * Includes:
 * 1. Event Detail Modal Popup (4 Tabs: Registration Link & QR, Edit Form, Attendees & Presence, Committee QR Scanner)
 * 2. Centered Success Celebration Modal with Animated Checkmark Draw & Confetti Glitter Cannon
 * 3. In-UI Toast Notification System (Warning, Success, Info)
 * 4. Interactive Input Validation with Shake Animation & Hover Hints
 * 5. Triple Custom Intuitive Date & Time Picker with Day/Night (☀️ AM / 🌙 PM) Icons
 * 6. Expandable Form Drawers for Add-on Toggles (Syarat & Ketentuan, Custom URL, Custom QR Logo)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileSidebar();
  initBentoModuleSwitching();
  initViewSwitcher();
  initBentoTableFilters();
  initModalChunkingWizard();
  initCustomDateTimePicker();
  initAddonToggles();
  initBentoCalendar();
  initConfettiAndCelebration();
  initEventDetailModal();
});

/* ==========================================================================
   0. IN-UI TOAST NOTIFICATION SYSTEM
   ========================================================================== */
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

  // Close handler
  const closeBtn = toast.querySelector('.toast-close-btn');
  const dismiss = () => {
    toast.classList.add('dismissing');
    setTimeout(() => {
      if (toast.parentElement) container.removeChild(toast);
    }, 240);
  };

  closeBtn.addEventListener('click', dismiss);

  // Auto dismiss after 3.5s
  setTimeout(dismiss, 3500);

  container.appendChild(toast);
}

/* ==========================================================================
   1. PARTY POPPER CONFETTI CANNON & CENTERED CELEBRATION MODAL
   ========================================================================== */
let launchConfettiCannon = () => {};
let showSuccessCelebration = () => {};

function initConfettiAndCelebration() {
  const canvas = document.getElementById('confettiCanvas');
  const celebrationModal = document.getElementById('successCelebrationModal');
  const celebrationEventName = document.getElementById('celebrationEventName');
  const btnDismiss = document.getElementById('btnDismissCelebration');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let particles = [];
  let animationId = null;

  const confettiColors = [
    '#1975f9', '#3bc855', '#f59e0b', '#ec4899',
    '#8b5cf6', '#06b6d4', '#10b981', '#f43f5e'
  ];

  class ConfettiParticle {
    constructor(originX, originY) {
      this.x = originX;
      this.y = originY;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = 7 + Math.random() * 16;
      
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (3 + Math.random() * 5);
      
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.shape = Math.random() > 0.4 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'ribbon');
      
      this.size = 6 + Math.random() * 8;
      this.width = this.size;
      this.height = this.shape === 'ribbon' ? this.size * 2.2 : (this.shape === 'rect' ? this.size * 0.7 : this.size);
      
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 16;
      
      this.opacity = 1;
      this.decay = 0.007 + Math.random() * 0.008;
      this.gravity = 0.22;
      this.drag = 0.955;
    }

    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;
      
      this.x += this.vx;
      this.y += this.vy;
      
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
    }

    draw(context) {
      if (this.opacity <= 0) return;
      context.save();
      context.translate(this.x, this.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.globalAlpha = Math.max(0, this.opacity);
      context.fillStyle = this.color;

      if (this.shape === 'circle') {
        context.beginPath();
        context.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      }

      context.restore();
    }
  }

  launchConfettiCannon = function() {
    resizeCanvas();
    particles = [];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 140; i++) {
      particles.push(new ConfettiParticle(centerX, centerY));
    }

    for (let i = 0; i < 50; i++) {
      const pLeft = new ConfettiParticle(centerX - 150, centerY + 50);
      pLeft.vx = Math.abs(pLeft.vx) * 0.9 + 2;
      particles.push(pLeft);

      const pRight = new ConfettiParticle(centerX + 150, centerY + 50);
      pRight.vx = -Math.abs(pRight.vx) * 0.9 - 2;
      particles.push(pRight);
    }

    if (animationId) cancelAnimationFrame(animationId);

    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].opacity > 0 && particles[i].y < canvas.height + 50) {
          aliveCount++;
        }
      }

      if (aliveCount > 0) {
        animationId = requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animateConfetti();
  };

  showSuccessCelebration = function(eventName) {
    if (celebrationEventName) {
      celebrationEventName.textContent = eventName;
    }
    if (celebrationModal) {
      celebrationModal.classList.add('active');
    }
    launchConfettiCannon();
  };

  function dismissCelebration() {
    if (celebrationModal) {
      celebrationModal.classList.remove('active');
    }
  }

  if (btnDismiss) {
    btnDismiss.addEventListener('click', dismissCelebration);
  }

  if (celebrationModal) {
    celebrationModal.addEventListener('click', (e) => {
      if (e.target === celebrationModal) {
        dismissCelebration();
      }
    });
  }
}

/* ==========================================================================
   2. EVENT DETAIL MODAL WITH 4 TABS SYSTEM
   ========================================================================== */
function initEventDetailModal() {
  const modal = document.getElementById('eventDetailModalOverlay');
  const closeBtn = document.querySelector('.btn-close-detail-modal');

  const titleEl = document.getElementById('dModalEventTitle');
  const venueEl = document.getElementById('dModalEventVenue');
  const statusEl = document.getElementById('dModalEventStatus');
  const regUrlEl = document.getElementById('dDisplayRegUrl');

  const editName = document.getElementById('dEditEventName');
  const editLocation = document.getElementById('dEditLocation');
  const editQuota = document.getElementById('dEditQuota');

  const tabBtns = document.querySelectorAll('.detail-tab-btn');
  const panes = {
    link: document.getElementById('dPaneLink'),
    form: document.getElementById('dPaneForm'),
    attendees: document.getElementById('dPaneAttendees'),
    scanner: document.getElementById('dPaneScanner')
  };

  if (!modal) return;

  // Open Detail Modal on Table Row 'Detail' Click (Delegated)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-detail-event');
    if (!btn) return;

    e.preventDefault();
    const eventTitle = btn.getAttribute('data-event-title') || 'Tech Summit Indonesia 2026';
    const eventVenue = btn.getAttribute('data-event-venue') || 'Jakarta Convention Center — Hall A';
    const eventStatus = btn.getAttribute('data-event-status') || 'Live';
    const eventQuota = btn.getAttribute('data-event-quota') || '1000';
    const eventUrl = btn.getAttribute('data-event-url') || `https://www.regesit.com/register?eventId=36b83e7a-1246-4fc2-91db-d381e24158e7`;

    // Populate Modal Info
    if (titleEl) titleEl.textContent = eventTitle;
    if (venueEl) venueEl.textContent = eventVenue;
    if (statusEl) {
      if (eventStatus === 'Live') {
        statusEl.className = 'pill-badge pill-green';
        statusEl.innerHTML = '<span class="pulse-indicator"></span> Live';
      } else if (eventStatus === 'Siap Mulai') {
        statusEl.className = 'pill-badge pill-blue';
        statusEl.textContent = 'Siap Mulai';
      } else {
        statusEl.className = 'pill-badge pill-neutral';
        statusEl.textContent = 'Selesai';
      }
    }
    if (regUrlEl) regUrlEl.textContent = eventUrl;
    if (editName) editName.value = eventTitle;
    if (editLocation) editLocation.value = eventVenue;
    if (editQuota) editQuota.value = eventQuota;

    // Reset to Tab 1
    switchDetailTab('link');

    modal.classList.add('active');
  });

  // Close Detail Modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Tab Switcher
  function switchDetailTab(tabKey) {
    tabBtns.forEach((b) => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.detail-tab-btn[data-tab="${tabKey}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    Object.keys(panes).forEach((key) => {
      if (panes[key]) {
        panes[key].style.display = key === tabKey ? 'block' : 'none';
      }
    });
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchDetailTab(tab);
    });
  });

  // Tab 1: Copy Registration URL
  const btnCopyRegUrl = document.getElementById('btnCopyRegUrl');
  if (btnCopyRegUrl && regUrlEl) {
    btnCopyRegUrl.addEventListener('click', () => {
      navigator.clipboard?.writeText(regUrlEl.textContent);
      showToast('Link Pendaftaran Disalin! 📋', 'Tautan siap dibagikan ke calon peserta.', 'success');
    });
  }

  // Tab 1: Download QR Code
  const btnDownloadQr = document.getElementById('btnDownloadQrCode');
  if (btnDownloadQr) {
    btnDownloadQr.addEventListener('click', () => {
      showToast('Mengunduh QR Code', 'File gambar QR Code pendaftaran sedang disiapkan...', 'info');
    });
  }

  // Tab 1: Open Public Registration Page
  const btnOpenPublicRegister = document.getElementById('btnOpenPublicRegister');
  if (btnOpenPublicRegister) {
    btnOpenPublicRegister.addEventListener('click', () => {
      window.open('register.html', '_blank');
      showToast('Membuka Halaman Pendaftaran 📱', 'Halaman pendaftaran peserta dibuka di tab baru.', 'info');
    });
  }

  // Tab 2: Pertanyaan Tambahan (Custom Questions Builder)
  const questionsList = document.getElementById('dEditQuestionsList');
  const questionsCount = document.getElementById('dEditQuestionsCount');
  const quickAddBtns = document.querySelectorAll('.btn-quick-add-q');

  function updateQuestionIndices() {
    if (!questionsList) return;
    const cards = questionsList.querySelectorAll('.edit-question-card');
    cards.forEach((card, idx) => {
      card.setAttribute('data-q-index', idx + 1);
      const numSpan = card.querySelector('.edit-question-num');
      if (numSpan) numSpan.textContent = `#${idx + 1}`;
    });
    if (questionsCount) questionsCount.textContent = cards.length;
  }

  // Quick Add Template Button Handler
  quickAddBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const qName = btn.getAttribute('data-q-name') || 'Pertanyaan Kustom';
      const qType = btn.getAttribute('data-q-type') || 'text';

      if (!questionsList) return;
      const count = questionsList.querySelectorAll('.edit-question-card').length + 1;

      const card = document.createElement('div');
      card.className = 'edit-question-card';
      card.setAttribute('data-q-index', count);
      card.innerHTML = `
        <div class="edit-question-top-row">
          <span class="edit-question-num">#${count}</span>
          <input type="text" class="edit-question-input" value="${qName}" placeholder="Tulis pertanyaan...">
          <select class="edit-question-type-select">
            <option value="phone" ${qType === 'phone' ? 'selected' : ''}>Nomor Telepon ⌵</option>
            <option value="text" ${qType === 'text' ? 'selected' : ''}>Teks Singkat ⌵</option>
            <option value="textarea">Paragraf ⌵</option>
            <option value="select">Pilihan Ganda ⌵</option>
            <option value="file">Unggah File ⌵</option>
          </select>
        </div>
        <div class="edit-question-bottom-row">
          <div class="edit-question-tools">
            <button type="button" class="reorder-arrow-btn btn-reorder-up" title="Pindah ke Atas">↑</button>
            <button type="button" class="reorder-arrow-btn btn-reorder-down" title="Pindah ke Bawah">↓</button>
            <button type="button" class="trash-delete-btn btn-delete-q" title="Hapus Pertanyaan">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
          <div class="edit-required-toggle-group">
            <span style="font-size: 12px; color: var(--text-secondary);">Wajib Diisi</span>
            <label class="toggle-switch">
              <input type="checkbox" class="q-required-toggle" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      `;

      questionsList.appendChild(card);
      updateQuestionIndices();
      showToast('Kolom Ditambahkan', `Pertanyaan "${qName}" berhasil ditambahkan ke formulir.`, 'info');
    });
  });

  // Delegated Actions for Reorder & Delete inside Questions List
  if (questionsList) {
    questionsList.addEventListener('click', (e) => {
      const card = e.target.closest('.edit-question-card');
      if (!card) return;

      // Delete
      if (e.target.closest('.btn-delete-q')) {
        const qName = card.querySelector('.edit-question-input')?.value || 'Pertanyaan';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-6px)';
        setTimeout(() => {
          card.remove();
          updateQuestionIndices();
          showToast('Pertanyaan Dihapus', `Kolom "${qName}" telah dihapus dari formulir.`, 'warning');
        }, 180);
      }

      // Reorder Up
      if (e.target.closest('.btn-reorder-up')) {
        const prev = card.previousElementSibling;
        if (prev && prev.classList.contains('edit-question-card')) {
          questionsList.insertBefore(card, prev);
          updateQuestionIndices();
        }
      }

      // Reorder Down
      if (e.target.closest('.btn-reorder-down')) {
        const next = card.nextElementSibling;
        if (next && next.classList.contains('edit-question-card')) {
          questionsList.insertBefore(next, card);
          updateQuestionIndices();
        }
      }
    });
  }

  // Tab 2: Toggle TOS Expandable Drawer
  const toggleEditTerms = document.getElementById('dEditToggleTerms');
  const boxEditTerms = document.getElementById('boxEditTerms');
  const drawerEditTerms = document.getElementById('drawerEditTerms');
  const textEditTerms = document.getElementById('dEditTermsText');

  if (toggleEditTerms && drawerEditTerms) {
    toggleEditTerms.addEventListener('change', () => {
      if (toggleEditTerms.checked) {
        boxEditTerms?.classList.add('expanded');
        drawerEditTerms.classList.add('active');
        if (textEditTerms) textEditTerms.focus();
        showToast('Syarat & Ketentuan Diaktifkan', 'Aturan pendaftaran akan diwajibkan bagi calon peserta.', 'info');
      } else {
        boxEditTerms?.classList.remove('expanded');
        drawerEditTerms.classList.remove('active');
      }
    });
  }

  // Tab 2: Batas Waktu Pendaftaran Trigger
  const deadlineTrigger = document.getElementById('dEditDeadlineTrigger');
  const deadlineText = document.getElementById('dEditDeadlineText');
  const deadlinePill = document.getElementById('dEditDeadlinePill');

  const deadlinePresets = [
    { text: '30 Jul 2026, 11:59 PM', ampm: 'PM', icon: '🌙' },
    { text: '31 Jul 2026, 06:00 PM', ampm: 'PM', icon: '🌙' },
    { text: '01 Agu 2026, 12:00 PM', ampm: 'PM', icon: '☀️' },
    { text: '28 Agu 2026, 08:00 AM', ampm: 'AM', icon: '☀️' }
  ];
  let currentDeadlineIdx = 0;

  if (deadlineTrigger && deadlineText) {
    deadlineTrigger.addEventListener('click', () => {
      currentDeadlineIdx = (currentDeadlineIdx + 1) % deadlinePresets.length;
      const preset = deadlinePresets[currentDeadlineIdx];
      
      deadlineText.textContent = preset.text;
      if (deadlinePill) {
        deadlinePill.className = `trigger-icon-pill ${preset.ampm === 'AM' ? 'trigger-sun' : 'trigger-moon'}`;
        deadlinePill.innerHTML = `<span>${preset.icon}</span><span>${preset.ampm}</span>`;
      }

      showToast('Batas Waktu Diperbarui ⏱️', `Batas pendaftaran disetel ke ${preset.text}.`, 'info');
    });
  }

  // Tab 2: Cancel Edit
  const btnCancelEdit = document.getElementById('btnCancelEditEvent');
  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Tab 2: Save Edit Form
  const btnSaveEdit = document.getElementById('btnSaveEditEvent');
  if (btnSaveEdit) {
    btnSaveEdit.addEventListener('click', () => {
      const currentTitle = titleEl?.textContent || 'Event';
      const quotaVal = document.getElementById('dEditQuota')?.value || '1.000';
      const deadlineVal = deadlineText?.textContent || '30 Jul 2026, 11:59 PM';

      modal.classList.remove('active');
      showToast('Perubahan Disimpan! ✅', `Formulir "${currentTitle}" diperbarui (Kuota: ${quotaVal} pax, Batas: ${deadlineVal}).`, 'success');
    });
  }

  // Tab 3: Attendee Live Search Filter
  const attendeeSearch = document.getElementById('attendeeSearchInput');
  const attendeeRows = document.querySelectorAll('#attendeeTableBody tr');
  if (attendeeSearch) {
    attendeeSearch.addEventListener('input', () => {
      const query = attendeeSearch.value.toLowerCase().trim();
      attendeeRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // Tab 3: Export CSV
  const btnExportCsv = document.getElementById('btnExportAttendeeData');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      showToast('Ekspor Data Peserta', 'File data registrasi (CSV/Excel) berhasil diunduh.', 'success');
    });
  }

  // Tab 4: Copy Scanner URL
  const btnCopyScanner = document.getElementById('btnCopyScannerUrl');
  const scannerUrlEl = document.getElementById('dDisplayScannerUrl');
  if (btnCopyScanner && scannerUrlEl) {
    btnCopyScanner.addEventListener('click', () => {
      navigator.clipboard?.writeText(scannerUrlEl.textContent);
      showToast('Link Scanner Disalin! 📷', 'Tautan scanner gate berhasil disalin untuk tim panitia.', 'success');
    });
  }

  // Tab 4: Open Scanner Direct
  const btnOpenScanner = document.getElementById('btnOpenScannerDirect');
  if (btnOpenScanner) {
    btnOpenScanner.addEventListener('click', () => {
      window.open('scanner.html', '_blank');
      showToast('Membuka Web Scanner 📷', 'Halaman scanner panitia dibuka di tab baru.', 'info');
    });
  }

  // Bento Hero Scanner Button
  const btnOpenHeroScanner = document.getElementById('btnOpenHeroScanner');
  if (btnOpenHeroScanner) {
    btnOpenHeroScanner.addEventListener('click', () => {
      window.open('scanner.html', '_blank');
      showToast('Membuka Web Scanner 📷', 'Halaman scanner panitia dibuka di tab baru.', 'info');
    });
  }
}

/* ==========================================================================
   2.5 MOBILE SIDEBAR DRAWER NAVIGATION
   ========================================================================== */
function initMobileSidebar() {
  const sidebar = document.getElementById('dashboardSidebar');
  const toggleBtn = document.getElementById('btnMobileMenuToggle');
  const closeBtn = document.getElementById('btnCloseSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const navLinks = document.querySelectorAll('.sidebar .nav-item-link');

  if (!sidebar) return;

  function openSidebar() {
    sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
}

/* ==========================================================================
   3. BENTO MODULE SWITCHING (CENTRAL, ANALYTICS, CALENDAR)
   ========================================================================== */
function initBentoModuleSwitching() {
  const navLinks = document.querySelectorAll('.nav-item-link[data-module]');
  const modules = {
    central: document.getElementById('module-central'),
    analytics: document.getElementById('module-analytics'),
    calendar: document.getElementById('module-calendar')
  };

  const pageTitle = document.getElementById('pageTitleDisplay');
  const pageDesc = document.getElementById('pageDescDisplay');

  const metaInfo = {
    central: {
      title: 'Central Dashboard',
      desc: 'Kelola event dan pantau ringkasan aktivitas peserta Anda.'
    },
    analytics: {
      title: 'Analytic Event',
      desc: 'Ringkasan statistik pendaftaran dan kehadiran peserta di seluruh event Anda.'
    },
    calendar: {
      title: 'Kalender Event',
      desc: 'Jadwal pelaksanaan seluruh event yang Anda kelola.'
    }
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-module');

      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      Object.keys(modules).forEach((key) => {
        if (modules[key]) {
          modules[key].style.display = key === target ? 'block' : 'none';
        }
      });

      if (metaInfo[target]) {
        if (pageTitle) pageTitle.textContent = metaInfo[target].title;
        if (pageDesc) pageDesc.textContent = metaInfo[target].desc;
      }
    });
  });

  // Calendar Shortcut link from Bento Tile 2
  const linkShortcutCalendar = document.getElementById('linkShortcutCalendar');
  if (linkShortcutCalendar) {
    linkShortcutCalendar.addEventListener('click', (e) => {
      e.preventDefault();
      const calNav = document.querySelector('.nav-item-link[data-module="calendar"]');
      if (calNav) calNav.click();
    });
  }
}

/* ==========================================================================
   3.5 BENTO EVENT VIEW SWITCHER (TABLE VS CARDS)
   ========================================================================== */
function initViewSwitcher() {
  const btnTable = document.getElementById('btnViewTable');
  const btnCards = document.getElementById('btnViewCards');
  const tableWrap = document.getElementById('eventTableResponsiveWrap');
  const cardsGrid = document.getElementById('eventCardsGrid');

  if (!btnTable || !btnCards || !tableWrap || !cardsGrid) return;

  btnTable.addEventListener('click', () => {
    btnTable.classList.add('active');
    btnCards.classList.remove('active');
    tableWrap.style.display = '';
    cardsGrid.style.display = 'none';
  });

  btnCards.addEventListener('click', () => {
    btnCards.classList.add('active');
    btnTable.classList.remove('active');
    tableWrap.style.display = 'none';
    cardsGrid.style.display = 'grid';
  });
}

/* ==========================================================================
   4. BENTO TABLE & CARDS FILTER PILLS & LIVE SEARCH
   ========================================================================== */
function initBentoTableFilters() {
  const pillBtns = document.querySelectorAll('.filter-pill-btn');
  const searchInput = document.getElementById('eventTableSearchInput');

  function applyFilter() {
    const activeBtn = document.querySelector('.filter-pill-btn.active');
    const filterStatus = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const rows = document.querySelectorAll('.minimal-table tbody tr');
    const cards = document.querySelectorAll('.bento-event-cards-grid .bento-event-card');

    rows.forEach((row) => {
      const status = row.getAttribute('data-status');
      const text = row.textContent.toLowerCase();

      const matchStatus = filterStatus === 'all' || status === filterStatus;
      const matchSearch = text.includes(searchQuery);

      if (matchStatus && matchSearch) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });

    cards.forEach((card) => {
      const status = card.getAttribute('data-status');
      const text = card.textContent.toLowerCase();

      const matchStatus = filterStatus === 'all' || status === filterStatus;
      const matchSearch = text.includes(searchQuery);

      if (matchStatus && matchSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  pillBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      pillBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }
}

/* ==========================================================================
   5. IN-DASHBOARD MODAL 4-STEP CHUNKING WIZARD (CREATE EVENT)
   ========================================================================== */
function initModalChunkingWizard() {
  const modal = document.getElementById('createEventModalOverlay');
  const triggerBtns = document.querySelectorAll('.btn-trigger-create-wizard');
  const closeBtns = document.querySelectorAll('.btn-close-modal');

  const btnNext = document.getElementById('mBtnNextStep');
  const btnPrev = document.getElementById('mBtnPrevStep');
  const btnPublish = document.getElementById('mBtnPublishEvent');

  const inputEventName = document.getElementById('mInputEventName');
  const hintEventName = document.getElementById('hintEventName');
  const inputLocation = document.getElementById('mInputLocation');
  const hintLocation = document.getElementById('hintLocation');

  let modalCurrentStep = 1;
  const totalModalSteps = 4;

  if (!modal) return;

  if (inputEventName) {
    inputEventName.addEventListener('input', () => {
      inputEventName.classList.remove('input-error');
      if (hintEventName) hintEventName.style.display = 'none';
    });
  }

  if (inputLocation) {
    inputLocation.addEventListener('input', () => {
      inputLocation.classList.remove('input-error');
      if (hintLocation) hintLocation.style.display = 'none';
    });
  }

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      setModalStep(1);
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  document.querySelectorAll('.modal-stepper-bar .step-node').forEach((node) => {
    node.addEventListener('click', () => {
      const step = parseInt(node.getAttribute('data-step'), 10);
      if (step < modalCurrentStep) {
        setModalStep(step);
      }
    });
  });

  btnNext.addEventListener('click', () => {
    if (validateModalStep(modalCurrentStep)) {
      if (modalCurrentStep < totalModalSteps) {
        setModalStep(modalCurrentStep + 1);
      }
    }
  });

  btnPrev.addEventListener('click', () => {
    if (modalCurrentStep > 1) {
      setModalStep(modalCurrentStep - 1);
    }
  });

  function setModalStep(step) {
    document.querySelectorAll('.modal-wizard-body .step-pane').forEach((p) => p.classList.remove('active'));

    const targetPane = document.getElementById(`mPaneStep${step}`);
    if (targetPane) targetPane.classList.add('active');

    for (let i = 1; i <= totalModalSteps; i++) {
      const node = document.getElementById(`mStepNode${i}`);
      const circle = document.getElementById(`mCircle${i}`);
      const line = document.getElementById(`mLine${i}`);

      if (node && circle) {
        if (i < step) {
          node.className = 'step-node completed';
          circle.innerHTML = '✓';
        } else if (i === step) {
          node.className = 'step-node active';
          circle.innerHTML = `${i}`;
        } else {
          node.className = 'step-node';
          circle.innerHTML = `${i}`;
        }
      }

      if (line) {
        if (i < step) {
          line.classList.add('filled');
        } else {
          line.classList.remove('filled');
        }
      }
    }

    if (btnPrev) {
      btnPrev.style.visibility = step === 1 ? 'hidden' : 'visible';
    }

    if (step === totalModalSteps) {
      if (btnNext) btnNext.style.display = 'none';
      if (btnPublish) btnPublish.style.display = 'inline-flex';
    } else {
      if (btnNext) btnNext.style.display = 'inline-flex';
      if (btnPublish) btnPublish.style.display = 'none';
    }

    modalCurrentStep = step;
  }

  function validateModalStep(step) {
    if (step === 1) {
      const name = document.getElementById('mInputEventName');
      if (!name || !name.value.trim()) {
        name.classList.add('input-error');
        if (hintEventName) hintEventName.style.display = 'inline-flex';
        name.focus();
        showToast('Nama Event Belum Diisi', 'Silakan tentukan nama atau judul acara sebelum melanjutkan.', 'warning');
        return false;
      }
    } else if (step === 2) {
      const location = document.getElementById('mInputLocation');
      if (!location || !location.value.trim()) {
        location.classList.add('input-error');
        if (hintLocation) hintLocation.style.display = 'inline-flex';
        location.focus();
        showToast('Lokasi Acara Belum Diisi', 'Silakan tentukan alamat atau venue fisik acara Anda.', 'warning');
        return false;
      }
    }
    return true;
  }

  const formatCards = document.querySelectorAll('.format-card-option');
  const hiddenFormatInput = document.getElementById('modalSelectedFormat');

  formatCards.forEach((card) => {
    card.addEventListener('click', () => {
      formatCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      const format = card.getAttribute('data-format');
      if (hiddenFormatInput) hiddenFormatInput.value = format;
    });
  });

  const customFieldsContainer = document.getElementById('modalCustomFieldsContainer');
  const templatePillBtns = document.querySelectorAll('.template-pill-btn');

  templatePillBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-field-name');
      addCustomField(name);
      btn.style.opacity = '0.4';
      btn.style.pointerEvents = 'none';
      showToast('Kolom Ditambahkan', `Pertanyaan "${name}" berhasil disematkan ke formulir peserta.`, 'info');
    });
  });

  function addCustomField(name) {
    if (!customFieldsContainer) return;
    const card = document.createElement('div');
    card.className = 'field-item-card';
    card.style.animation = 'fadeIn 0.2s ease';
    card.innerHTML = `
      <div class="field-item-left">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>${name}</span>
        <span class="field-tag-badge" style="background: var(--color-primary-subtle); color: var(--color-primary);">Kustom</span>
      </div>
      <button type="button" class="btn btn-ghost" style="padding: 2px 6px; font-size: 12px; color: #ef4444;" title="Hapus pertanyaan">✕</button>
    `;

    const removeBtn = card.querySelector('button');
    removeBtn.addEventListener('click', () => {
      customFieldsContainer.removeChild(card);
      templatePillBtns.forEach((b) => {
        if (b.getAttribute('data-field-name') === name) {
          b.style.opacity = '1';
          b.style.pointerEvents = 'auto';
        }
      });
    });

    customFieldsContainer.appendChild(card);
  }

  // Publish Event
  if (btnPublish) {
    btnPublish.addEventListener('click', (e) => {
      e.preventDefault();
      const eventName = document.getElementById('mInputEventName')?.value.trim() || 'Event Baru';
      const location = document.getElementById('mInputLocation')?.value.trim() || 'Jakarta Convention Center';
      const format = hiddenFormatInput?.value || 'Offline Venue';
      const quota = document.getElementById('mInputQuota')?.value || '150';
      const startTimeFormatted = document.getElementById('startTimeTriggerText')?.textContent || '28 Agu 2026, 09:00 AM';

      const tbody = document.querySelector('.minimal-table tbody');
      if (tbody) {
        const tr = document.createElement('tr');
        tr.setAttribute('data-status', 'active');
        tr.style.animation = 'fadeIn 0.3s ease';
        tr.innerHTML = `
          <td>
            <div class="event-cell-info">
              <span class="event-cell-name">${eventName}</span>
              <span class="event-cell-venue">${location}</span>
            </div>
          </td>
          <td><span class="pill-badge pill-blue">${format}</span></td>
          <td>${startTimeFormatted}</td>
          <td>
            <div style="width: 140px;">
              <div class="progress-track" style="height: 6px; margin-bottom: 4px;">
                <div class="progress-fill-blue" style="width: 2%;"></div>
              </div>
              <div style="font-size: 11.5px; color: var(--text-muted);">2 / ${quota} (2%)</div>
            </div>
          </td>
          <td><span class="pill-badge pill-blue">Siap Mulai</span></td>
          <td>
            <button class="btn btn-secondary btn-sm btn-detail-event" data-event-title="${eventName}" data-event-venue="${location}" data-event-status="Siap Mulai" data-event-quota="${quota}" style="padding: 4px 10px; font-size: 12px;">Detail</button>
          </td>
        `;
        tbody.prepend(tr);
      }

      // Also Prepend to Card Grid View
      const cardsGrid = document.getElementById('eventCardsGrid');
      if (cardsGrid) {
        const card = document.createElement('div');
        card.className = 'bento-event-card';
        card.setAttribute('data-status', 'active');
        card.style.animation = 'fadeIn 0.3s ease';
        card.innerHTML = `
          <div class="event-card-top">
            <div class="event-card-badges">
              <span class="pill-badge pill-blue">Siap Mulai</span>
              <span class="pill-badge pill-blue">${format}</span>
            </div>
            <button type="button" class="btn btn-secondary btn-sm btn-detail-event" data-event-title="${eventName}" data-event-venue="${location}" data-event-status="Siap Mulai" data-event-quota="${quota}" data-event-url="https://www.regesit.com/register?eventId=event-${Date.now()}">Detail</button>
          </div>
          <div class="event-card-body">
            <h4 class="event-card-title">${eventName}</h4>
            <div class="event-card-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${location}</span>
            </div>
            <div class="event-card-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>${startTimeFormatted}</span>
            </div>
            <div class="event-card-progress-section">
              <div class="event-card-progress-label">
                <span>Kehadiran Peserta</span>
                <strong>2 / ${quota} (2%)</strong>
              </div>
              <div class="progress-track" style="height: 6px;">
                <div class="progress-fill-blue" style="width: 2%;"></div>
              </div>
            </div>
          </div>
        `;
        cardsGrid.prepend(card);
      }

      modal.classList.remove('active');
      showSuccessCelebration(eventName);
    });
  }
}

/* ==========================================================================
   6. DUAL & TRIPLE CUSTOM INTUITIVE DATE & TIME PICKER
   ========================================================================== */
function initCustomDateTimePicker() {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  function setupPicker({
    triggerId,
    popoverId,
    textId,
    pillId,
    inputId,
    gridId,
    monthTitleId,
    prevBtnId,
    nextBtnId,
    amBtnSelector,
    pmBtnSelector,
    hourSelectId,
    minSelectId,
    presetSelector,
    summaryId,
    applyBtnId,
    defaultYear = 2026,
    defaultMonth = 7,
    defaultDay = 28,
    defaultHour = '09',
    defaultMin = '00',
    defaultAmPm = 'AM',
    labelPrefix = 'Mulai'
  }) {
    const trigger = document.getElementById(triggerId);
    const popover = document.getElementById(popoverId);
    const triggerText = document.getElementById(textId);
    const iconPill = document.getElementById(pillId);
    const hiddenInput = document.getElementById(inputId);

    const daysGrid = document.getElementById(gridId);
    const monthTitle = document.getElementById(monthTitleId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    const amBtn = document.querySelector(amBtnSelector);
    const pmBtn = document.querySelector(pmBtnSelector);
    const hourSelect = document.getElementById(hourSelectId);
    const minSelect = document.getElementById(minSelectId);
    const presetBtns = document.querySelectorAll(presetSelector);
    const summaryText = document.getElementById(summaryId);
    const applyBtn = document.getElementById(applyBtnId);

    if (!trigger || !popover) return;

    let sYear = defaultYear;
    let sMonth = defaultMonth;
    let sDay = defaultDay;
    let sHour = defaultHour;
    let sMin = defaultMin;
    let sAmPm = defaultAmPm;

    function renderCalendar() {
      if (!daysGrid || !monthTitle) return;
      monthTitle.textContent = `${monthNames[sMonth]} ${sYear}`;
      daysGrid.innerHTML = '';

      const firstDay = new Date(sYear, sMonth, 1).getDay();
      const daysInMonth = new Date(sYear, sMonth + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'picker-day-cell disabled';
        daysGrid.appendChild(empty);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement('div');
        cell.className = 'picker-day-cell';
        cell.textContent = d;

        if (d === sDay) {
          cell.classList.add('selected');
        }
        if (d === 22 && sMonth === 7) {
          cell.classList.add('today-marker');
        }

        cell.addEventListener('click', () => {
          sDay = d;
          renderCalendar();
          updateSummary();
        });

        daysGrid.appendChild(cell);
      }
    }

    function updateSummary() {
      if (!summaryText) return;
      const isDay = sAmPm === 'AM';
      const icon = isDay ? '☀️' : '🌙';
      const label = isDay ? 'Pagi/Siang' : 'Malam';
      summaryText.innerHTML = `${labelPrefix}: <strong>${sDay} ${monthShorts[sMonth]} ${sYear}, ${sHour}:${sMin} ${sAmPm} (${label} ${icon})</strong>`;
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.datetime-popover-card.active').forEach((p) => {
        if (p !== popover) p.classList.remove('active');
      });
      document.querySelectorAll('.custom-datetime-trigger.focused').forEach((t) => {
        if (t !== trigger) t.classList.remove('focused');
      });

      const isActive = popover.classList.contains('active');
      if (isActive) {
        popover.classList.remove('active');
        trigger.classList.remove('focused');
      } else {
        popover.classList.add('active');
        trigger.classList.add('focused');
        renderCalendar();
        updateSummary();

        if (window.innerWidth <= 768) {
          setTimeout(() => {
            trigger.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 80);
        }
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (sMonth > 0) sMonth--;
        else { sMonth = 11; sYear--; }
        renderCalendar();
        updateSummary();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (sMonth < 11) sMonth++;
        else { sMonth = 0; sYear++; }
        renderCalendar();
        updateSummary();
      });
    }

    if (amBtn && pmBtn) {
      amBtn.addEventListener('click', () => {
        sAmPm = 'AM';
        amBtn.className = 'day-night-pill-btn active am';
        pmBtn.className = 'day-night-pill-btn pm';
        updateSummary();
      });

      pmBtn.addEventListener('click', () => {
        sAmPm = 'PM';
        pmBtn.className = 'day-night-pill-btn active pm';
        amBtn.className = 'day-night-pill-btn am';
        updateSummary();
      });
    }

    if (hourSelect) {
      hourSelect.addEventListener('change', () => {
        sHour = hourSelect.value;
        updateSummary();
      });
    }

    if (minSelect) {
      minSelect.addEventListener('change', () => {
        sMin = minSelect.value;
        updateSummary();
      });
    }

    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sHour = btn.getAttribute('data-preset-h');
        sMin = btn.getAttribute('data-preset-m');
        sAmPm = btn.getAttribute('data-preset-ampm');

        if (hourSelect) hourSelect.value = sHour;
        if (minSelect) minSelect.value = sMin;

        if (sAmPm === 'AM' && amBtn && pmBtn) {
          amBtn.className = 'day-night-pill-btn active am';
          pmBtn.className = 'day-night-pill-btn pm';
        } else if (sAmPm === 'PM' && amBtn && pmBtn) {
          pmBtn.className = 'day-night-pill-btn active pm';
          amBtn.className = 'day-night-pill-btn am';
        }

        updateSummary();
      });
    });

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const isDay = sAmPm === 'AM';
        const icon = isDay ? '☀️' : '🌙';
        const formatted = `${sDay} ${monthShorts[sMonth]} ${sYear}, ${sHour}:${sMin} ${sAmPm}`;

        if (triggerText) triggerText.textContent = formatted;

        if (iconPill) {
          iconPill.className = `trigger-icon-pill ${isDay ? 'trigger-sun' : 'trigger-moon'}`;
          iconPill.innerHTML = `<span>${icon}</span><span>${sAmPm}</span>`;
        }

        if (hiddenInput) {
          hiddenInput.value = `${sYear}-${String(sMonth + 1).padStart(2, '0')}-${String(sDay).padStart(2, '0')}T${sHour}:${sMin}`;
        }

        popover.classList.remove('active');
        trigger.classList.remove('focused');
        showToast(`Waktu ${labelPrefix} Disetel`, `Jadwal acara telah diatur ke ${formatted} (${isDay ? 'Siang ☀️' : 'Malam 🌙'}).`, 'info');
      });
    }

    renderCalendar();
  }

  // 1. Setup Start Time Picker (Waktu Mulai)
  setupPicker({
    triggerId: 'startTimeTrigger',
    popoverId: 'startTimePopover',
    textId: 'startTimeTriggerText',
    pillId: 'startTimeIconPill',
    inputId: 'mInputStartTime',
    gridId: 'popCalDaysGrid',
    monthTitleId: 'popCalMonthTitle',
    prevBtnId: 'popCalPrev',
    nextBtnId: 'popCalNext',
    amBtnSelector: '#startTimePopover .day-night-pill-btn[data-ampm="AM"]',
    pmBtnSelector: '#startTimePopover .day-night-pill-btn[data-ampm="PM"]',
    hourSelectId: 'popHourSelect',
    minSelectId: 'popMinSelect',
    presetSelector: '#startTimePopover .time-preset-btn',
    summaryId: 'popoverLiveSummary',
    applyBtnId: 'btnApplyCustomDateTime',
    defaultHour: '09',
    defaultMin: '00',
    defaultAmPm: 'AM',
    labelPrefix: 'Mulai'
  });

  // 2. Setup End Time Picker (Waktu Selesai)
  setupPicker({
    triggerId: 'endTimeTrigger',
    popoverId: 'endTimePopover',
    textId: 'endTimeTriggerText',
    pillId: 'endTimeIconPill',
    inputId: 'mInputEndTime',
    gridId: 'endPopCalDaysGrid',
    monthTitleId: 'endPopCalMonthTitle',
    prevBtnId: 'endPopCalPrev',
    nextBtnId: 'endPopCalNext',
    amBtnSelector: '#endAmBtn',
    pmBtnSelector: '#endPmBtn',
    hourSelectId: 'endPopHourSelect',
    minSelectId: 'endPopMinSelect',
    presetSelector: '.end-time-preset',
    summaryId: 'endPopoverLiveSummary',
    applyBtnId: 'btnApplyEndCustomDateTime',
    defaultHour: '05',
    defaultMin: '00',
    defaultAmPm: 'PM',
    labelPrefix: 'Selesai'
  });

  // 3. Setup Deadline Time Picker (Batas Waktu Pendaftaran)
  setupPicker({
    triggerId: 'deadlineTrigger',
    popoverId: 'deadlinePopover',
    textId: 'deadlineTriggerText',
    pillId: 'deadlineIconPill',
    inputId: 'mInputDeadline',
    gridId: 'deadlinePopCalDaysGrid',
    monthTitleId: 'deadlinePopCalMonthTitle',
    prevBtnId: 'deadlinePopCalPrev',
    nextBtnId: 'deadlinePopCalNext',
    amBtnSelector: '#deadlineAmBtn',
    pmBtnSelector: '#deadlinePmBtn',
    hourSelectId: 'deadlinePopHourSelect',
    minSelectId: 'deadlinePopMinSelect',
    presetSelector: '.deadline-time-preset',
    summaryId: 'deadlinePopoverLiveSummary',
    applyBtnId: 'btnApplyDeadlineCustomDateTime',
    defaultDay: 27,
    defaultHour: '11',
    defaultMin: '59',
    defaultAmPm: 'PM',
    labelPrefix: 'Batas Pendaftaran'
  });

  // Close popovers on outside click
  document.addEventListener('click', (e) => {
    const popovers = document.querySelectorAll('.datetime-popover-card.active');
    popovers.forEach((p) => {
      const trigger = p.parentElement.querySelector('.custom-datetime-trigger');
      if (!p.contains(e.target) && e.target !== trigger && !trigger?.contains(e.target)) {
        p.classList.remove('active');
        trigger?.classList.remove('focused');
      }
    });
  });
}

/* ==========================================================================
   7. EXPANDABLE ADD-ON TOGGLES (TERMS & CONDITIONS TEXTAREA)
   ========================================================================== */
function initAddonToggles() {
  const toggleTerms = document.getElementById('mToggleTerms');
  const boxTerms = document.getElementById('boxToggleTerms');
  const drawerTerms = document.getElementById('drawerTerms');
  const textareaTerms = document.getElementById('mInputTermsText');

  if (toggleTerms && drawerTerms) {
    toggleTerms.addEventListener('change', () => {
      if (toggleTerms.checked) {
        boxTerms?.classList.add('expanded');
        drawerTerms.classList.add('active');
        if (textareaTerms) textareaTerms.focus();
        showToast('Syarat & Ketentuan Diaktifkan', 'Silakan tuliskan butir persyaratan keikutsertaan acara.', 'info');
      } else {
        boxTerms?.classList.remove('expanded');
        drawerTerms.classList.remove('active');
      }
    });
  }

  const toggleUrl = document.getElementById('mToggleCustomUrl');
  const boxUrl = document.getElementById('boxToggleCustomUrl');
  const drawerUrl = document.getElementById('drawerCustomUrl');
  const inputSlug = document.getElementById('mInputCustomUrlSlug');

  if (toggleUrl && drawerUrl) {
    toggleUrl.addEventListener('change', () => {
      if (toggleUrl.checked) {
        boxUrl?.classList.add('expanded');
        drawerUrl.classList.add('active');
        if (inputSlug) inputSlug.focus();
      } else {
        boxUrl?.classList.remove('expanded');
        drawerUrl.classList.remove('active');
      }
    });
  }

  const toggleLogo = document.getElementById('mToggleCustomLogo');
  const boxLogo = document.getElementById('boxToggleCustomLogo');
  const drawerLogo = document.getElementById('drawerCustomLogo');

  if (toggleLogo && drawerLogo) {
    toggleLogo.addEventListener('change', () => {
      if (toggleLogo.checked) {
        boxLogo?.classList.add('expanded');
        drawerLogo.classList.add('active');
      } else {
        boxLogo?.classList.remove('expanded');
        drawerLogo.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   8. BENTO CALENDAR MONTH NAVIGATION
   ========================================================================== */
function initBentoCalendar() {
  const prevBtn = document.getElementById('calPrevMonthBtn');
  const nextBtn = document.getElementById('calNextMonthBtn');
  const label = document.getElementById('calendarMonthLabel');

  const months = ['Agustus 2026', 'September 2026', 'Oktober 2026'];
  let currentIdx = 0;

  if (!prevBtn || !nextBtn || !label) return;

  function update() {
    label.textContent = months[currentIdx];
  }

  prevBtn.addEventListener('click', () => {
    if (currentIdx > 0) {
      currentIdx--;
      update();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIdx < months.length - 1) {
      currentIdx++;
      update();
    }
  });
}
