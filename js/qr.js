/* ==========================================================================
   REGESIT QR HELPER — pembungkus tipis di atas js/vendor/qrcode.min.js
   (qrcode-generator 1.4.4, MIT) supaya QR tiket dibuat LOKAL di browser,
   tanpa memanggil api.qrserver.com. Dipakai register.html + dashboard.html.
   Mengembalikan data URL (GIF) yang bisa langsung dipasang ke <img> atau
   diunduh. Bila lib vendor tidak termuat, mengembalikan null agar pemanggil
   bisa menampilkan pesan, bukan QR kosong.
   ========================================================================== */
(function (global) {
  'use strict';

  function dataUrl(text, cellSize) {
    if (typeof global.qrcode !== 'function') return null;
    if (!text) return null;
    try {
      var qr = global.qrcode(0, 'M'); // typeNumber 0 = otomatis, level M
      qr.addData(String(text));
      qr.make();
      // cellSize 8 + margin 16 -> ~360px untuk payload tiket biasa.
      return qr.createDataURL(cellSize || 8, 16);
    } catch (e) {
      return null;
    }
  }

  global.RegesitQR = { dataUrl: dataUrl };
})(window);
