/* ==========================================================================
   REGESIT DEMO STORE — penyimpanan event buatan pengguna di localStorage.
   Situs ini statis tanpa backend: event yang dibuat lewat wizard
   (create-event.html atau modal wizard di dashboard.html) disimpan di sini
   supaya muncul di dashboard setelah pindah halaman / reload, bukan hilang.
   Data demo bawaan dashboard (4 event contoh di HTML) TIDAK disimpan di
   sini — store ini hanya menampung event yang dibuat pengguna.
   Kunci berversi (regesit.events.v1) agar skema bisa berubah tanpa merusak
   data lama secara diam-diam.
   ========================================================================== */
(function (global) {
  'use strict';

  var KEY = 'regesit.events.v1';

  function load() {
    try {
      var raw = global.localStorage.getItem(KEY);
      if (!raw) return [];
      var list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveAll(list) {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Normalisasi + simpan satu event baru di posisi teratas. Mengembalikan
  // event yang tersimpan (dengan id + url pendaftaran), atau null bila
  // penyimpanan gagal.
  function add(ev) {
    var list = load();
    var item = {
      id: ev.id || ('event-' + Date.now()),
      name: String(ev.name || 'Event Baru').slice(0, 120),
      venue: String(ev.venue || 'Jakarta Convention Center').slice(0, 160),
      format: String(ev.format || 'Offline').slice(0, 40),
      start: String(ev.start || '').slice(0, 80),
      quota: Math.max(1, parseInt(ev.quota, 10) || 150),
      registered: 2,
      status: 'Siap Mulai',
      url: 'register.html?eventId=' + encodeURIComponent(ev.id || ('event-' + Date.now()))
    };
    list.unshift(item);
    if (!saveAll(list)) return null;
    return item;
  }

  // Escape HTML untuk nilai input pengguna sebelum disisipkan ke innerHTML
  // (dipakai dashboard saat merender event dari store).
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  global.RegesitStore = { load: load, add: add, escapeHtml: escapeHtml };
})(window);
