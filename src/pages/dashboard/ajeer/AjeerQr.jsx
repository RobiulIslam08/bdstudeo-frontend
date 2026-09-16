import { useEffect, useState } from "react";
import QRCode from "qrcode";

function buildAjeerQrPayload(value, data) {
  // If `data` prop is provided, encode permit info as JSON (like the image)
  if (data && typeof data === "object") {
    const json = {
      id_number: data.iqama_number || "",
      occupation: data.occupation || "",
      status: "ساري",
      issue_date: data.permit_start_date || "",
      expiry_date: data.permit_end_date || "",
    };
    return JSON.stringify(json);
  }

  // Fallback: use the raw value / URL
  const raw = String(value || "").trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw) return `https://ajeer.com.sa/?ref=${encodeURIComponent(raw)}`;
  return "https://ajeer.com.sa/";
}

export default function AjeerQr({ value, data, className }) {
  const [src, setSrc] = useState("");
  const payload = buildAjeerQrPayload(value, data);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(payload, {
      width: 512,
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setSrc("");
      });
    return () => {
      cancelled = true;
    };
  }, [payload]);

  if (!src) {
    return <div className={className} aria-hidden="true" />;
  }

  return <img src={src} alt="QR Code" className={className} />;
}
