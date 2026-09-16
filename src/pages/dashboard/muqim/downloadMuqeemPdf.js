import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/** ~300 DPI capture (4× PDF point grid) for sharp print/download */
const EXPORT_SCALE = 4;
const DEFAULT_PAGE = { width: 595, height: 842 };

/**
 * Capture the on-screen page bitmap and write an A4 PDF.
 * Uses the exact page box (no CSS scale) so download matches the screen design.
 */
export async function downloadMuqeemPdf(
  pageEl,
  filename = 'muqeem-profile-2475061749.pdf',
  page = DEFAULT_PAGE
) {
  if (!pageEl) throw new Error('Page element not found');

  const wrap = pageEl.closest('.new-muqim-page');
  wrap?.classList.add('nm-pdf-exporting');

  // Force layout at native PDF point size (no screen scale)
  const prevTransform = pageEl.style.transform;
  const prevMargin = pageEl.style.marginBottom;
  pageEl.style.transform = 'none';
  pageEl.style.marginBottom = '0';

  // Wait for DIN Next LT Arabic (and others) before capture
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  try {
    await document.fonts.load("10px 'DINNextLTArabic'");
    await document.fonts.load("11px 'DINNextLTArabic'");
    await document.fonts.load("12px 'DINNextLTArabic'");
    await document.fonts.load("600 10px 'DINNextLTArabic'");
    await document.fonts.load("600 11px 'DINNextLTArabic'");
    await document.fonts.load("800 10px 'DINNextLTArabic'");
  } catch {
    /* ignore */
  }
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    const canvas = await html2canvas(pageEl, {
      scale: EXPORT_SCALE,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: page.width,
      height: page.height,
      windowWidth: page.width,
      windowHeight: page.height,
      scrollX: 0,
      scrollY: 0,
      logging: false,
      imageTimeout: 15000,
      onclone: (doc) => {
        const cloned = doc.querySelector('.nm-page');
        if (!cloned) return;
        cloned.style.transform = 'none';
        cloned.style.marginBottom = '0';
        cloned.style.boxShadow = 'none';
        const vp = doc.querySelector('.nm-viewport');
        if (vp) {
          vp.style.padding = '0';
          vp.style.background = '#ffffff';
          vp.style.minHeight = 'auto';
          vp.style.display = 'block';
        }
        const btn = doc.querySelector('.nm-download-bar');
        if (btn) btn.style.display = 'none';
      },
    });

    // A4 in points (same as source PDF MediaBox)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [page.width, page.height],
      compress: true,
      hotfixes: ['px_scaling'],
    });

    // Lossless PNG — max sharpness, no JPEG artifacts
    const img = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(img, 'PNG', 0, 0, page.width, page.height, undefined, 'NONE');
    pdf.save(filename);
  } finally {
    pageEl.style.transform = prevTransform;
    pageEl.style.marginBottom = prevMargin;
    wrap?.classList.remove('nm-pdf-exporting');
  }
}
