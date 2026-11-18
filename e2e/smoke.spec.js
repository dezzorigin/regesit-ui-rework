// Smoke test end-to-end Regesit UI Rework di atas server statis
// (scripts/serve.mjs). Yang diuji adalah logika & alur produk, bukan
// gambar dekoratif:
//   1. Landing: judul, navbar + tautan GitHub, hero CTA, seksi demo
//      (4 kartu ke 4 halaman), semua section, newsletter inline.
//   2. Wizard buat event: validasi menahan langkah kosong; isi 4 langkah
//      -> publish -> dashboard menampilkan event baru; bertahan reload
//      (localStorage).
//   3. Dashboard: 4 event demo, filter cari, ganti tampilan tabel/kartu,
//      modal detail (QR dibuat lokal), wizard modal publish, ekspor CSV
//      mengunduh file beneran.
//   4. Pendaftaran: validasi menahan form kosong; isi + tanda tangan ->
//      tiket QR lokal (data URL, bukan api.qrserver.com); lightbox.
//   5. Scanner: klik viewfinder -> check-in sukses + counter naik;
//      check-in manual; standby.
//   6. Semua halaman: nol console error/pageerror + nol request lokal 404.
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__testErrors = [];
    window.__testDialogs = [];
    const origError = console.error.bind(console);
    console.error = (...args) => {
      window.__testErrors.push(args.map(String).join(' '));
      origError(...args);
    };
    window.addEventListener('error', (e) => window.__testErrors.push(String(e.message)));
    window.addEventListener('unhandledrejection', (e) => window.__testErrors.push('rejection: ' + String(e.reason)));
  });
  page.on('dialog', (d) => {
    page.evaluate((msg) => window.__testDialogs.push(msg), d.message());
    d.dismiss();
  });
  // Request lokal (127.0.0.1) yang 404/500 = aset hilang — gagalkan tes.
  page.on('response', async (res) => {
    if (res.url().startsWith('http://127.0.0.1:') && res.status() >= 400) {
      await page.evaluate((u) => window.__testErrors.push('HTTP ' + u), `${res.status()} ${res.url()}`);
    }
  });
});

test.afterEach(async ({ page }) => {
  const errors = await page.evaluate(() => window.__testErrors || []);
  expect(errors, `console/page/HTTP errors: ${errors.join(' | ')}`).toEqual([]);
});

test('landing: judul, navbar GitHub, hero CTA, seksi demo, newsletter', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/REGESIT/);
  const gh = page.getByRole('link', { name: 'GitHub Regesit UI Rework' }).first();
  await expect(gh).toBeVisible();
  await expect(gh).toHaveAttribute('href', 'https://github.com/dezzorigin/regesit-ui-rework');
  // Landing: hero CTA dicakup ke .hero-cta-row — kartu demo di bawah
  // memakai teks tautan yang sama ("Buka Dashboard →").
  await expect(page.locator('.hero-cta-row').getByRole('link', { name: 'Buka Dashboard →' })).toBeVisible();
  await expect(page.locator('.hero-cta-row').getByRole('link', { name: 'Buat Event Gratis' })).toBeVisible();
  for (const id of ['about', 'featured', 'services', 'demo', 'footer']) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  // Seksi demo: 4 kartu ke 4 halaman produk.
  for (const [name, href] of [
    ['Dashboard Organizer', 'dashboard.html'],
    ['Buat Event (Wizard)', 'create-event.html'],
    ['Pendaftaran Peserta', 'register.html'],
    ['Gate Scanner', 'scanner.html'],
  ]) {
    const card = page.locator('.demo-card', { hasText: name });
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('href', href);
  }
  // Newsletter: tanpa alert, konfirmasi inline.
  await page.locator('.newsletter-input').fill('tes@uji.id');
  await page.locator('.newsletter-submit-btn').click();
  await expect(page.locator('#newsletterForm')).toContainText('Terima kasih!');
  const dialogs = await page.evaluate(() => window.__testDialogs || []);
  expect(dialogs).toEqual([]);
});

async function drawSignature(page) {
  // Kanvas berada di bawah lipatan viewport: scroll dulu, kalau tidak
  // koordinat mouse jatuh di luar viewport dan tidak mengenai kanvas.
  await page.locator('#signatureCanvas').scrollIntoViewIfNeeded();
  const sig = await (await page.$('#signatureCanvas')).boundingBox();
  await page.mouse.move(sig.x + 40, sig.y + 60);
  await page.mouse.down();
  for (let i = 0; i <= 10; i++) {
    await page.mouse.move(sig.x + 40 + i * 18, sig.y + 60 - Math.sin(i) * 12, { steps: 2 });
  }
  await page.mouse.up();
}

test('wizard buat event: validasi, publish, muncul di dashboard, tahan reload', async ({ page }) => {
  await page.goto('/create-event.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#paneStep1')).toHaveClass(/active/);

  // Langkah 1 kosong: Next ditahan + alert validasi.
  await page.locator('#btnNextStep').click();
  await expect(page.locator('#paneStep1')).toHaveClass(/active/);
  let dialogs = await page.evaluate(() => window.__testDialogs || []);
  expect(dialogs.join(' ')).toContain('Nama Event');

  // Isi langkah 1 -> 2.
  await page.locator('#inputEventName').fill('Workshop Uji Coba 2026');
  await page.locator('#btnNextStep').click();
  await expect(page.locator('#paneStep2')).toHaveClass(/active/);

  // Langkah 2 kosong: ditahan.
  await page.locator('#btnNextStep').click();
  await expect(page.locator('#paneStep2')).toHaveClass(/active/);

  // Isi langkah 2 -> 3 -> 4.
  await page.locator('#inputStartTime').fill('2026-12-05T09:00');
  await page.locator('#inputLocation').fill('Gedung Uji Coba, Banda Aceh');
  await page.locator('#btnNextStep').click();
  await expect(page.locator('#paneStep3')).toHaveClass(/active/);
  await page.locator('#btnNextStep').click();
  await expect(page.locator('#paneStep4')).toHaveClass(/active/);
  await expect(page.locator('#btnPublishEvent')).toBeVisible();

  // Publish -> redirect dashboard dengan ?created=, event tampil di tabel.
  await page.locator('#btnPublishEvent').click();
  await expect(page).toHaveURL(/dashboard\.html\?created=/);
  await expect(page.locator('.event-cell-name', { hasText: 'Workshop Uji Coba 2026' }).first()).toBeVisible();
  await expect(page.locator('#toastContainer')).toContainText('Event Berhasil Dibuat');

  // Bertahan setelah reload (localStorage).
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.event-cell-name', { hasText: 'Workshop Uji Coba 2026' }).first()).toBeVisible();
});

test('dashboard: filter cari, ganti tampilan, modal detail QR lokal, ekspor CSV', async ({ page }) => {
  await page.goto('/dashboard.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#eventManagementTable tbody tr')).toHaveCount(4);

  // Filter cari "Tech Summit" -> 1 baris.
  await page.locator('#eventTableSearchInput').fill('Tech Summit');
  await expect(page.locator('#eventManagementTable tbody tr:visible')).toHaveCount(1);
  await page.locator('#eventTableSearchInput').fill('');

  // Ganti tampilan ke kartu.
  await page.locator('#btnViewCards').click();
  await expect(page.locator('#eventCardsGrid')).toBeVisible();
  await expect(page.locator('.bento-event-card').first()).toBeVisible();
  await page.locator('#btnViewTable').click();

  // Modal detail: QR dibuat lokal (data URL panjang, bukan placeholder 1x1).
  await page.locator('.btn-detail-event').first().click();
  await expect(page.locator('#eventDetailModalOverlay')).toHaveClass(/active/);
  await expect(page.locator('#dModalEventTitle')).toContainText('Tech Summit Indonesia 2026');
  const qrSrc = await page.locator('#dRegQrImg').getAttribute('src');
  expect(qrSrc.startsWith('data:image/')).toBeTruthy();
  expect(qrSrc.length).toBeGreaterThan(500);

  // Ekspor CSV mengunduh file beneran.
  await page.locator('.detail-tab-btn', { hasText: 'Peserta' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#btnExportAttendeeData').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.csv$/);
  await page.locator('.btn-close-detail-modal').click();
  await expect(page.locator('#eventDetailModalOverlay')).not.toHaveClass(/active/);
});

test('pendaftaran: validasi menahan form kosong; submit -> tiket QR lokal', async ({ page }) => {
  await page.goto('/register.html', { waitUntil: 'domcontentloaded' });
  // Submit kosong: toast peringatan, tetap di form.
  await page.locator('#btnSubmitForm').click();
  await expect(page.locator('#toastContainer')).toContainText('Nama Lengkap Belum Diisi');
  await expect(page.locator('#registrationFormView')).toBeVisible();

  await page.locator('#regFullName').fill('Tamu Uji Coba');
  await page.locator('#regEmail').fill('tamu@uji.id');
  await page.locator('#regPhone').fill('081234567890');
  await drawSignature(page);
  await page.locator('#regAgreement').check();
  await page.locator('#btnSubmitForm').click();
  await expect(page.locator('#ticketSuccessView')).toHaveClass(/active/, { timeout: 10000 });
  await expect(page.locator('#resTicketCode')).toHaveText(/^TIK-\d{4}$/);
  await expect(page.locator('#resAttendeeName')).toHaveText('Tamu Uji Coba');
  // QR dibuat lokal: data URL, bukan api.qrserver.com.
  const qrSrc = await page.locator('#resTicketQrImg').getAttribute('src');
  expect(qrSrc.startsWith('data:image/')).toBeTruthy();
  expect(qrSrc).not.toContain('qrserver');

  // Lightbox fullscreen menampilkan QR yang sama.
  await page.locator('#ticketQrTrigger').click();
  await expect(page.locator('#qrFullscreenModal')).toHaveClass(/active/);
  const modalSrc = await page.locator('#modalTicketQrImg').getAttribute('src');
  expect(modalSrc).toBe(qrSrc);
  await page.locator('#btnCloseQrModal').click();
  await expect(page.locator('#qrFullscreenModal')).not.toHaveClass(/active/);
});

test('scanner: klik viewfinder check-in sukses, counter naik; manual check-in', async ({ page }) => {
  await page.goto('/scanner.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#gateCountBadge')).toContainText('942 / 1.000 Hadir (94.2%)');

  await page.locator('#viewfinderCard').click();
  await expect(page.locator('#verifyNameDisplay')).toHaveText('Farras');
  await expect(page.locator('#verifyCodeDisplay')).toHaveText('TIK-1167');
  await expect(page.locator('#gateCountBadge')).toContainText('943 / 1.000 Hadir (94.3%)');
  await expect(page.locator('#recentFeedList .stream-item-row').first()).toContainText('Farras');

  // Check-in manual dengan kode tiket.
  await page.locator('#inputManualCode').fill('TIK-9999');
  await page.locator('#btnManualCheckin').click();
  await expect(page.locator('#verifyCodeDisplay')).toHaveText('TIK-9999');
  await expect(page.locator('#gateCountBadge')).toContainText('944 / 1.000 Hadir (94.4%)');

  // Standby: overlay tampil, klik viewfinder tidak scan lagi.
  await page.locator('#btnToggleStandby').click();
  await expect(page.locator('#standbyOverlay')).toHaveClass(/active/);
  await page.locator('#viewfinderCard').click();
  await expect(page.locator('#verifyCodeDisplay')).toHaveText('TIK-9999');
});
