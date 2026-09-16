import { useEffect, useRef, useState } from 'react';
import MuqeemLogo from './MuqeemLogo';
import { downloadMuqeemPdf } from './downloadMuqeemPdf';
import './NewMuqim.css';

let measureCanvas;

function measureNmText(str, size, weight = 400) {
  if (typeof document === 'undefined') return 0;
  if (!measureCanvas) measureCanvas = document.createElement('canvas');
  const ctx = measureCanvas.getContext('2d');
  ctx.font = `${weight} ${size}px "DINNextLTArabic"`;
  return ctx.measureText(String(str ?? '')).width;
}

export default function MuqeemPage({
  page,
  orange,
  rules,
  logo,
  texts,
  filename,
  lang = 'ar',
  downloadLabel = 'PDF ডাউনলোড',
  downloadingLabel = 'PDF তৈরি হচ্ছে…',
  errorLabel = 'PDF ডাউনলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
}) {
  const pageRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [, setFontsTick] = useState(0);

  useEffect(() => {
    let alive = true;
    document.fonts?.ready?.then(() => {
      if (alive) setFontsTick((n) => n + 1);
    });
    return () => {
      alive = false;
    };
  }, []);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadMuqeemPdf(pageRef.current, filename, page);
    } catch (err) {
      console.error(err);
      alert(errorLabel);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="nm-viewport">
      <div className="nm-download-bar nm-no-print">
        <button
          type="button"
          className="nm-download-btn"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? downloadingLabel : downloadLabel}
        </button>
      </div>

      <article
        ref={pageRef}
        className="nm-page"
        lang={lang}
        style={{
          width: page.width,
          height: page.height,
          ['--orange']: orange,
        }}
      >
        <div
          className="nm-logo"
          style={{
            left: logo.left,
            top: logo.top,
            width: logo.width,
            height: logo.height,
          }}
        >
          <MuqeemLogo />
        </div>

        {rules.map((top) => (
          <div
            key={top}
            className="nm-rule"
            style={{ top, left: 20, width: 555 }}
          />
        ))}

        {texts.map((t, i) => {
          const weight = t.weight === 600 ? 600 : 400;
          const style = {
            left: t.left,
            top: t.top,
            fontSize: `${t.size}px`,
          };

          // Arabic page: values sit left of labels. Keep the template's
          // right edge fixed so longer strings grow left, not over the label.
          if (t.kind === 'value' && lang === 'ar') {
            const templateWidth = measureNmText(
              t.templateStr ?? t.str,
              t.size,
              weight
            );
            let rightEdge = t.left + templateWidth;
            let nearestLabelLeft = Infinity;
            for (const other of texts) {
              if (other.kind !== 'label') continue;
              if (Math.abs(other.top - t.top) > 2) continue;
              if (other.left <= t.left) continue;
              if (other.left < nearestLabelLeft) nearestLabelLeft = other.left;
            }
            if (Number.isFinite(nearestLabelLeft)) {
              rightEdge = Math.min(rightEdge, nearestLabelLeft - 8);
            }
            style.left = rightEdge;
            style.transform = 'translateX(-100%)';
          }

          return (
            <span
              key={`${t.kind}-${i}`}
              className={`nm-txt nm-txt-${t.kind}${weight === 600 ? ' nm-txt-semibold' : ''}`}
              dir={t.dir}
              style={style}
            >
              {t.str}
            </span>
          );
        })}
      </article>
    </div>
  );
}
