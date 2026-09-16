import React from "react";

export default function Alert({ type = "success", message, onClose }) {
  if (!message) return null;

  const styles =
    type === "success"
      ? {
          wrap: "border-emerald-200 bg-emerald-50",
          text: "text-emerald-800 underline-offset-4", // লিঙ্ক থাকলে আন্ডারলাইন সুন্দর দেখাবে
          btn: "border-emerald-200 hover:bg-emerald-100",
        }
      : {
          wrap: "border-rose-200 bg-rose-50",
          text: "text-rose-800",
          btn: "border-rose-200 hover:bg-rose-100",
        };

  return (
    <div
      className={[
        "mb-4 rounded-2xl border px-4 py-3 flex items-center justify-between gap-3 shadow-sm",
        styles.wrap,
      ].join(" ")}
      role="alert"
    >
      <div className={["text-sm font-semibold flex items-center gap-2", styles.text].join(" ")}>
        <span>{type === "success" ? "✅ " : "❌ "}</span>
        
        {/* --- HTML লিঙ্ক সাপোর্ট করার জন্য নিচের লাইনটি পরিবর্তন করা হয়েছে --- */}
        <span 
          className="alert-content"
          dangerouslySetInnerHTML={{ __html: message }} 
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        className={[
          "w-9 h-9 rounded-xl border bg-white grid place-items-center flex-shrink-0",
          styles.btn,
        ].join(" ")}
        aria-label="Close"
        title="Close"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M18 6l-12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}