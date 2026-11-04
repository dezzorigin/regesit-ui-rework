/* ==========================================================================
   REGESIT GATE SCANNER - DUAL-BOX CLIENT LOGIC
   Handles:
   - Live Camera / Simulated Canvas Viewfinder
   - Audio Chime Synthesis (Web Audio API)
   - Real-time Right Box Highlight Card update & Animated Flash
   - Live Attendee Feed Stream
   - Manual Code / Name Check-in
   - Standby & Auto-Scan Mode
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Left Box (Camera & Controls)
  const videoEl = document.getElementById('cameraVideo');
  const canvasEl = document.getElementById('simulatedCameraCanvas');
  const standbyOverlay = document.getElementById('standbyOverlay');
  const btnToggleStandby = document.getElementById('btnToggleStandby');
  const standbyBtnText = document.getElementById('standbyBtnText');
  const btnResumeOverlay = document.getElementById('btnResumeOverlay');
  const toggleAutoScan = document.getElementById('toggleAutoScan');
  const btnExitScanner = document.getElementById('btnExitScanner');
  const viewfinderCard = document.getElementById('viewfinderCard');

  // DOM Elements - Right Box (Live Verification & Feed)
  const highlightBox = document.getElementById('highlightAttendeeBox');
  const verifyNameDisplay = document.getElementById('verifyNameDisplay');
  const verifyOrgDisplay = document.getElementById('verifyOrgDisplay');
  const verifyCodeDisplay = document.getElementById('verifyCodeDisplay');
  const verifyCategoryDisplay = document.getElementById('verifyCategoryDisplay');
  const verifyTimeDisplay = document.getElementById('verifyTimeDisplay');
  const inputManualCode = document.getElementById('inputManualCode');
  const btnManualCheckin = document.getElementById('btnManualCheckin');
  const recentFeedList = document.getElementById('recentFeedList');
  const recentFeedCount = document.getElementById('recentFeedCount');
  const gateCountBadge = document.getElementById('gateCountBadge');

  let isStandby = false;
  let isAutoScan = true;
  let attendeesCount = 942;
  const maxQuota = 1000;

  const simulatedAttendees = [
    { name: 'Farras', category: 'General Pass', role: 'Official Attendee Pass', code: 'TIK-1167', org: 'Regesit' },
    { name: 'Aditya Pratama', category: 'VIP Attendee', role: 'VIP All-Access Pass', code: 'TIK-9921', org: 'Gojek Tokopedia' },
    { name: 'Clarissa Maharani', category: 'General Pass', role: 'Standard Pass', code: 'TIK-3382', org: 'Shopee Indonesia' },
    { name: 'Hendrik Gunawan', category: 'Speaker Pass', role: 'Keynote Speaker', code: 'TIK-1102', org: 'Google Cloud ID' },
    { name: 'Nadia Safitri', category: 'VIP Attendee', role: 'Executive Pass', code: 'TIK-7744', org: 'Bank Central Asia' }
  ];
  let scanIndex = 0;
  let recentTotal = 3;

  // ==========================================================================
  // 1. AUDIO CHIME SYNTHESIS (Web Audio API)
  // ==========================================================================
  function playSuccessBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.26);
    } catch (e) {
      console.log('Audio feedback ready.');
    }
  }

  // ==========================================================================
  // 2. CAMERA INITIALIZATION (WebCam or Canvas Simulation)
  // ==========================================================================
  async function initCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoEl) {
          videoEl.srcObject = stream;
          videoEl.style.display = 'block';
          if (canvasEl) canvasEl.style.display = 'none';
        }
        return;
      } catch (err) {
        console.log('Using simulated camera canvas viewfinder.', err.message);
      }
    }
    initSimulatedCanvas();
  }

  function initSimulatedCanvas() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    canvasEl.width = 440;
    canvasEl.height = 440;

    let particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 440,
      y: Math.random() * 440,
      radius: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.5 + 0.2
    }));

    function renderSimulation() {
      if (isStandby) return;

      // Dark background
      ctx.fillStyle = '#0a101d';
      ctx.fillRect(0, 0, 440, 440);

      // Subtle Grid Lines
      ctx.strokeStyle = 'rgba(25, 117, 249, 0.08)';
      ctx.lineWidth = 1;
      const step = 36;
      for (let x = 0; x < 440; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 440);
        ctx.stroke();
      }
      for (let y = 0; y < 440; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(440, y);
        ctx.stroke();
      }

      // Animated Background Particles
      ctx.fillStyle = 'rgba(25, 117, 249, 0.35)';
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speed;
        if (p.y < 0) p.y = 440;
      });

      // Target QR Code Silhouette
      const cx = 220;
      const cy = 220;
      const size = 130;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(cx - size / 2, cy - size / 2, size, size);

      ctx.strokeStyle = 'rgba(25, 117, 249, 0.25)';
      ctx.strokeRect(cx - size / 2, cy - size / 2, size, size);

      // Central Helper Text
      ctx.font = '12px "DM Sans", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText('Arahkan QR Tiket ke Dalam Kotak (Klik untuk Scan)', cx, cy + 92);

      requestAnimationFrame(renderSimulation);
    }

    renderSimulation();
  }

  // Click on Viewfinder triggers simulated scan
  if (viewfinderCard) {
    viewfinderCard.addEventListener('click', () => {
      if (isStandby) return;
      triggerSuccessfulScan();
    });
  }

  // ==========================================================================
  // 3. SCAN EXECUTION & RIGHT BOX HIGHLIGHT UPDATE
  // ==========================================================================
  function triggerSuccessfulScan(customData = null) {
    playSuccessBeep();

    const attendee = customData || simulatedAttendees[scanIndex % simulatedAttendees.length];
    scanIndex++;
    attendeesCount++;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    // Update Right Box Highlight Card
    if (verifyNameDisplay) verifyNameDisplay.textContent = attendee.name;
    if (verifyOrgDisplay) verifyOrgDisplay.textContent = `${attendee.role} • ${attendee.org}`;
    if (verifyCodeDisplay) verifyCodeDisplay.textContent = attendee.code;
    if (verifyCategoryDisplay) verifyCategoryDisplay.textContent = attendee.category || 'General Pass';
    if (verifyTimeDisplay) verifyTimeDisplay.textContent = timeStr;

    // Trigger Digital Stamp Slam Animation
    const stampBadge = document.getElementById('verifiedStampBadge');
    if (stampBadge) {
      stampBadge.classList.remove('stamped');
      void stampBadge.offsetWidth; // force reflow
      stampBadge.classList.add('stamped');
    }

    // Trigger Card Success Glow Pulse
    if (highlightBox) {
      highlightBox.classList.remove('card-success-pulse');
      void highlightBox.offsetWidth; // force reflow
      highlightBox.classList.add('card-success-pulse');
    }

    // Update Count Badges
    const pct = ((attendeesCount / maxQuota) * 100).toFixed(1);
    if (gateCountBadge) {
      gateCountBadge.textContent = `${attendeesCount.toLocaleString('id-ID')} / ${maxQuota.toLocaleString('id-ID')} Hadir (${pct}%)`;
    }

    // Prepend to Live Feed Stream
    addAttendeeToStream(attendee.name, `${attendee.role} • ${attendee.code} • ${attendee.org}`, timeStr);
  }

  // ==========================================================================
  // 4. LIVE FEED STREAM MANAGER
  // ==========================================================================
  function addAttendeeToStream(name, meta, timeStr) {
    if (!recentFeedList) return;
    recentTotal++;
    if (recentFeedCount) recentFeedCount.textContent = recentTotal;

    const row = document.createElement('div');
    row.className = 'stream-item-row';
    row.innerHTML = `
      <div>
        <div class="stream-item-name">${name}</div>
        <div class="stream-item-sub">${meta}</div>
      </div>
      <span class="pill-badge pill-green">✓ ${timeStr}</span>
    `;

    recentFeedList.insertBefore(row, recentFeedList.firstChild);

    // Keep stream to max 8 items
    if (recentFeedList.children.length > 8) {
      recentFeedList.lastElementChild.remove();
    }
  }

  // ==========================================================================
  // 5. STANDBY & AUTO-SCAN CONTROLS
  // ==========================================================================
  if (btnToggleStandby) {
    btnToggleStandby.addEventListener('click', toggleStandbyMode);
  }
  if (btnResumeOverlay) {
    btnResumeOverlay.addEventListener('click', toggleStandbyMode);
  }

  function toggleStandbyMode() {
    isStandby = !isStandby;
    if (isStandby) {
      standbyOverlay?.classList.add('active');
      if (standbyBtnText) standbyBtnText.textContent = '▶ Aktifkan Kamera';
    } else {
      standbyOverlay?.classList.remove('active');
      if (standbyBtnText) standbyBtnText.textContent = 'Pause Kamera (Standby)';
      initSimulatedCanvas();
    }
  }

  if (toggleAutoScan) {
    toggleAutoScan.addEventListener('change', () => {
      isAutoScan = toggleAutoScan.checked;
    });
  }

  // ==========================================================================
  // 6. MANUAL CODE / NAME CHECK-IN
  // ==========================================================================
  function handleManualCheckin() {
    if (!inputManualCode) return;
    const query = inputManualCode.value.trim();
    if (!query) {
      inputManualCode.focus();
      return;
    }

    const generatedCode = query.startsWith('TIK-') ? query : `TIK-${Math.floor(1000 + Math.random() * 9000)}`;
    const manualAttendee = {
      name: query.startsWith('TIK-') ? 'Peserta Terdaftar' : query,
      category: 'General Pass',
      role: 'Standard Ticket (Manual Check-In)',
      code: generatedCode,
      org: 'Input Manual Panitia'
    };

    triggerSuccessfulScan(manualAttendee);
    inputManualCode.value = '';
  }

  if (btnManualCheckin) {
    btnManualCheckin.addEventListener('click', handleManualCheckin);
  }

  if (inputManualCode) {
    inputManualCode.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleManualCheckin();
      }
    });
  }

  // ==========================================================================
  // 7. EXIT TO DASHBOARD
  // ==========================================================================
  if (btnExitScanner) {
    btnExitScanner.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  }

  // Init
  initCamera();
});
