/**
 * REGESIT FRONT-END TO BACK-END DOCUMENTATION SCRIPT
 * Handles:
 * 1. Fast Full-Text & Fuzzy Search Indexer (Ctrl+K / Cmd+K Modal)
 * 2. 1-Click Code Payload Copying to Clipboard
 * 3. Interactive Code Tabs (JSON Request vs Response vs cURL vs Fetch)
 * 4. Active Navigation ScrollSpy
 * 5. Mobile Navigation Sidebar Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearchEngine();
  initCodeCopyButtons();
  initCodeTabs();
  initScrollSpy();
  initMobileSidebar();
});

/* ==========================================================================
   1. SEARCH ENGINE & MODAL CONTROLLER (CTRL+K / CMD+K)
   ========================================================================== */
function initSearchEngine() {
  const searchInputs = document.querySelectorAll('.docs-search-input');
  const searchModalOverlay = document.getElementById('searchModalOverlay');
  const searchModalInput = document.getElementById('searchModalInput');
  const searchModalList = document.getElementById('searchModalList');
  const searchCountBadge = document.getElementById('searchCountBadge');

  if (!searchModalOverlay || !searchModalInput) return;

  // Build Search Index from DOM Sections and API Endpoints
  const searchIndex = [];
  const sections = document.querySelectorAll('.docs-section, .api-endpoint-box, .bento-doc-card');

  sections.forEach((el) => {
    const id = el.id || el.getAttribute('data-doc-id');
    const titleEl = el.querySelector('.section-heading, .endpoint-path, .bento-card-title, h3, h4');
    const title = titleEl ? titleEl.textContent.trim() : '';
    const descEl = el.querySelector('.section-lead, .endpoint-desc-badge, p');
    const desc = descEl ? descEl.textContent.trim() : '';
    const textContent = el.textContent.toLowerCase();

    // Determine category
    let category = 'Dokumentasi';
    if (el.classList.contains('api-endpoint-box')) category = 'REST API';
    else if (id && id.includes('model')) category = 'Database Schema';
    else if (id && id.includes('dom')) category = 'DOM & Selectors';
    else if (id && id.includes('scanner')) category = 'Scanner Gate';
    else if (id && id.includes('register')) category = 'Pendaftaran';

    if (id && title) {
      searchIndex.push({
        id: id,
        title: title,
        desc: desc,
        category: category,
        rawText: textContent
      });
    }
  });

  // Open Modal
  function openSearchModal() {
    searchModalOverlay.classList.add('active');
    searchModalInput.value = '';
    searchModalInput.focus();
    renderSearchResults('');
    document.body.style.overflow = 'hidden';
  }

  // Close Modal
  function closeSearchModal() {
    searchModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Trigger search on sidebar search click
  searchInputs.forEach((inp) => {
    inp.addEventListener('focus', (e) => {
      e.target.blur();
      openSearchModal();
    });
  });

  // Global Keyboard Shortcut (Ctrl+K or Cmd+K or /)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModalOverlay.classList.contains('active')) {
        closeSearchModal();
      } else {
        openSearchModal();
      }
    } else if (e.key === 'Escape' && searchModalOverlay.classList.contains('active')) {
      closeSearchModal();
    }
  });

  searchModalOverlay.addEventListener('click', (e) => {
    if (e.target === searchModalOverlay) {
      closeSearchModal();
    }
  });

  // Live typing search
  searchModalInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value.toLowerCase().trim());
  });

  function renderSearchResults(query) {
    if (!searchModalList) return;
    searchModalList.innerHTML = '';

    const results = query === '' 
      ? searchIndex.slice(0, 7) // Show top items
      : searchIndex.filter((item) => {
          return item.title.toLowerCase().includes(query) ||
                 item.desc.toLowerCase().includes(query) ||
                 item.category.toLowerCase().includes(query) ||
                 item.rawText.includes(query);
        });

    if (searchCountBadge) {
      searchCountBadge.textContent = `${results.length} hasil`;
    }

    if (results.length === 0) {
      const empty = document.createElement('li');
      empty.style.padding = '24px 16px';
      empty.style.textAlign = 'center';
      empty.style.color = '#94a3b8';
      empty.style.fontSize = '13.5px';
      empty.innerHTML = `Tidak ditemukan hasil untuk "<strong>${escapeHtml(query)}</strong>"`;
      searchModalList.appendChild(empty);
      return;
    }

    results.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = `search-result-item ${idx === 0 ? 'selected' : ''}`;
      
      const highlightedTitle = highlightKeyword(item.title, query);
      const highlightedDesc = highlightKeyword(item.desc.slice(0, 110) + '...', query);

      li.innerHTML = `
        <div class="search-result-title">
          <span>${highlightedTitle}</span>
          <span class="nav-badge-pill badge-get">${item.category}</span>
        </div>
        <div class="search-result-snippet">${highlightedDesc}</div>
      `;

      li.addEventListener('click', () => {
        closeSearchModal();
        const targetElem = document.getElementById(item.id);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetElem.style.transition = 'box-shadow 0.3s ease';
          targetElem.style.boxShadow = '0 0 0 4px rgba(25, 117, 249, 0.35)';
          setTimeout(() => {
            targetElem.style.boxShadow = '';
          }, 1800);
        }
      });

      searchModalList.appendChild(li);
    });
  }

  function highlightKeyword(text, keyword) {
    if (!keyword) return escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
    return escapeHtml(text).replace(regex, '<span class="search-highlight">$1</span>');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

/* ==========================================================================
   2. COPY TO CLIPBOARD BUTTONS
   ========================================================================== */
function initCodeCopyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-copy-code');
    if (!btn) return;

    const codeWrap = btn.closest('.code-block-wrap');
    if (!codeWrap) return;

    const activePre = codeWrap.querySelector('.code-pre-box.active') || codeWrap.querySelector('.code-pre-box');
    if (!activePre) return;

    const textToCopy = activePre.innerText.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalHtml = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Tersalin!</span>
      `;

      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = originalHtml;
      }, 2000);
    }).catch(() => {
      alert('Gagal menyalin kode.');
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE CODE BLOCK TABS (JSON / CURL / FETCH)
   ========================================================================== */
function initCodeTabs() {
  document.querySelectorAll('.code-block-wrap').forEach((wrap) => {
    const tabBtns = wrap.querySelectorAll('.code-tab-btn');
    const preBoxes = wrap.querySelectorAll('.code-pre-box');

    if (tabBtns.length <= 1) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        preBoxes.forEach((pre) => {
          if (pre.getAttribute('data-tab') === targetTab) {
            pre.style.display = 'block';
            pre.classList.add('active');
          } else {
            pre.style.display = 'none';
            pre.classList.remove('active');
          }
        });
      });
    });
  });
}

/* ==========================================================================
   4. SCROLLSPY & ACTIVE SIDEBAR LINK
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('.docs-section');
  const navLinks = document.querySelectorAll('.sidebar-nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-70px 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/* ==========================================================================
   5. MOBILE SIDEBAR TOGGLE
   ========================================================================== */
function initMobileSidebar() {
  const sidebar = document.querySelector('.docs-sidebar');
  const toggleBtn = document.getElementById('btnToggleMobileDocsNav');
  const closeBtn = document.getElementById('btnCloseMobileSidebar');

  if (!sidebar) return;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  // Close sidebar on link click in mobile view
  document.querySelectorAll('.sidebar-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        sidebar.classList.remove('open');
      }
    });
  });
}
