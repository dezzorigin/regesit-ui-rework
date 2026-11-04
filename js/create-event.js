/**
 * REGESIT MULTI-STEP EVENT CREATION WIZARD
 * Handles: 4-Step Navigation, Stepper Indicator visual updates,
 * Format Selection, Dynamic Custom Fields builder, and Publishing.
 */

document.addEventListener('DOMContentLoaded', () => {
  initWizardNavigation();
  initFormatSelector();
  initCustomFieldsBuilder();
});

let currentStep = 1;
const totalSteps = 4;

function initWizardNavigation() {
  const btnNext = document.getElementById('btnNextStep');
  const btnPrev = document.getElementById('btnPrevStep');
  const btnPublish = document.getElementById('btnPublishEvent');
  const form = document.getElementById('createEventWizardForm');

  // Step Node clicks (allow clicking on previous steps)
  document.querySelectorAll('.step-node').forEach((node) => {
    node.addEventListener('click', () => {
      const targetStep = parseInt(node.getAttribute('data-step'), 10);
      if (targetStep < currentStep) {
        goToStep(targetStep);
      }
    });
  });

  btnNext.addEventListener('click', () => {
    if (validateCurrentStep(currentStep)) {
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      }
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const eventName = document.getElementById('inputEventName')?.value.trim() || 'Event Baru';
      alert(`Selamat! Event "${eventName}" berhasil dibuat dan siap menerima pendaftaran.`);
      window.location.href = 'dashboard.html';
    });
  }
}

function goToStep(step) {
  // Hide all step panes
  document.querySelectorAll('.step-pane').forEach((pane) => pane.classList.remove('active'));

  // Show target step pane
  const targetPane = document.getElementById(`paneStep${step}`);
  if (targetPane) targetPane.classList.add('active');

  // Update Stepper Bar Nodes and Lines
  for (let i = 1; i <= totalSteps; i++) {
    const node = document.getElementById(`stepNode${i}`);
    const circle = document.getElementById(`circle${i}`);
    const line = document.getElementById(`line${i}`);

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

  // Update Footer buttons
  const btnPrev = document.getElementById('btnPrevStep');
  const btnNext = document.getElementById('btnNextStep');
  const btnPublish = document.getElementById('btnPublishEvent');

  if (btnPrev) {
    btnPrev.style.visibility = step === 1 ? 'hidden' : 'visible';
  }

  if (step === totalSteps) {
    if (btnNext) btnNext.style.display = 'none';
    if (btnPublish) btnPublish.style.display = 'inline-flex';
  } else {
    if (btnNext) btnNext.style.display = 'inline-flex';
    if (btnPublish) btnPublish.style.display = 'none';
  }

  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentStep(step) {
  if (step === 1) {
    const nameInput = document.getElementById('inputEventName');
    if (!nameInput || !nameInput.value.trim()) {
      alert('Silakan isi Nama Event terlebih dahulu.');
      if (nameInput) nameInput.focus();
      return false;
    }
  } else if (step === 2) {
    const startTime = document.getElementById('inputStartTime');
    const location = document.getElementById('inputLocation');
    if (!startTime || !startTime.value) {
      alert('Silakan tentukan Waktu Mulai acara.');
      if (startTime) startTime.focus();
      return false;
    }
    if (!location || !location.value.trim()) {
      alert('Silakan tentukan Lokasi / Alamat Fisik acara.');
      if (location) location.focus();
      return false;
    }
  }
  return true;
}

/* ==========================================================================
   2. FORMAT EVENT SELECTION
   ========================================================================== */
function initFormatSelector() {
  const options = document.querySelectorAll('.format-card-option');
  const hiddenInput = document.getElementById('selectedEventFormat');

  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      options.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      const format = opt.getAttribute('data-format');
      if (hiddenInput) hiddenInput.value = `Event ${format}`;
    });
  });
}

/* ==========================================================================
   3. CUSTOM FIELDS TEMPLATE BUILDER
   ========================================================================== */
function initCustomFieldsBuilder() {
  const container = document.getElementById('customFieldsContainer');
  const templateBtns = document.querySelectorAll('.template-pill-btn');

  if (!container) return;

  templateBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const fieldName = btn.getAttribute('data-field-name');
      addCustomFieldItem(fieldName);
      btn.style.opacity = '0.5';
      btn.style.pointerEvents = 'none';
    });
  });

  function addCustomFieldItem(name) {
    const card = document.createElement('div');
    card.className = 'field-item-card';
    card.style.animation = 'fadeIn 0.25s ease';
    card.innerHTML = `
      <div class="field-item-left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>${name}</span>
        <span class="field-tag-badge" style="background: var(--color-primary-subtle); color: var(--color-primary);">Kustom</span>
      </div>
      <button type="button" class="btn btn-ghost" style="padding: 4px 8px; font-size: 13px; color: #ef4444;" title="Hapus pertanyaan">✕</button>
    `;

    const removeBtn = card.querySelector('button');
    removeBtn.addEventListener('click', () => {
      container.removeChild(card);
      // restore template button
      templateBtns.forEach((b) => {
        if (b.getAttribute('data-field-name') === name) {
          b.style.opacity = '1';
          b.style.pointerEvents = 'auto';
        }
      });
    });

    container.appendChild(card);
  }
}
