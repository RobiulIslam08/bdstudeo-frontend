/**
 * Open the browser print dialog (Save as PDF) so the permit
 * matches the on-screen layout exactly — no html2canvas text shift.
 */
export function printAjeerPdf(filename = "AJEER.pdf") {
  const prevTitle = document.title;
  document.title = String(filename).replace(/\.pdf$/i, "");
  document.body.classList.add("azeer-print-mode");

  let restored = false;
  const restore = () => {
    if (restored) return;
    restored = true;
    document.title = prevTitle;
    document.body.classList.remove("azeer-print-mode");
    window.removeEventListener("afterprint", restore);
  };

  window.addEventListener("afterprint", restore);

  requestAnimationFrame(() => {
    window.print();
  });
}
