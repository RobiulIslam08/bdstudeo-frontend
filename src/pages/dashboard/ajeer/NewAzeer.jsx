import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../DashboardHeader";
import Alert from "../../../components/Alert";
import AjeerQr from "./AjeerQr";
import { printAjeerPdf } from "./downloadAjeerPdf";
import "./NewAzeer.css";

const ALMARAI_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Noto+Sans+Arabic:wght@400;600;700&display=swap";

const AJEER_QR_PREFIX = "TW";
const AJEER_QR_START = 12512545;

function formatAjeerQr(num) {
  return `${AJEER_QR_PREFIX}${num}`;
}

function parseAjeerSeriesQr(value) {
  const match = String(value || "").trim().match(/^TW(125\d+)$/i);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  if (!Number.isFinite(num) || num < AJEER_QR_START) return null;
  return num;
}

function nextAjeerQr(records) {
  let max = AJEER_QR_START - 1;
  for (const rec of records) {
    const num = parseAjeerSeriesQr(rec?.qr_number);
    if (num != null && num > max) max = num;
  }
  return formatAjeerQr(max + 1);
}

function addMonths(dateStr, months) {
  if (!dateStr || !months) return "";
  const n = Number(months);
  if (!Number.isFinite(n) || n < 1) return "";
  const [year, month, day] = String(dateStr).split("-").map(Number);
  if (!year || !month || !day) return "";

  const targetMonthIndex = month - 1 + n;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
  const clampedDay = Math.min(day, lastDay);

  return `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(clampedDay).padStart(2, "0")}`;
}

const EMPTY_FORM = {
  qr_number: formatAjeerQr(AJEER_QR_START),
  worker_name: "",
  iqama_number: "",
  occupation: "عامل تحميل وتنزيل",
  nationality: "باكستاني",
  provider_name: "مؤسسة منّظومة اليمامة للمقاولات العامة",
  provider_reg_no: "4-1462295",
  beneficiary_name: "شركة تمرس شركة مساهمة مقفلة",
  beneficiary_reg_no: "6-21873",
  contract_description: "",
  permit_start_date: "",
  permit_end_date: "",
  duration_months: "",
  work_location: "",
};

export default function NewAzeer() {
  const pageRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const recordId = searchParams.get("id");

  const [permit, setPermit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    const existing = document.querySelector(`link[href="${ALMARAI_FONT_HREF}"]`);
    if (existing) return undefined;

    const preconnectGoogle = document.createElement("link");
    preconnectGoogle.rel = "preconnect";
    preconnectGoogle.href = "https://fonts.googleapis.com";

    const preconnectGstatic = document.createElement("link");
    preconnectGstatic.rel = "preconnect";
    preconnectGstatic.href = "https://fonts.gstatic.com";
    preconnectGstatic.crossOrigin = "anonymous";

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = ALMARAI_FONT_HREF;

    document.head.appendChild(preconnectGoogle);
    document.head.appendChild(preconnectGstatic);
    document.head.appendChild(fontLink);

    return () => {
      preconnectGoogle.remove();
      preconnectGstatic.remove();
      fontLink.remove();
    };
  }, []);

  // রেকর্ড আইডি থাকলে ডাটাবেস থেকে আসল ডাটা লোড করা হয় (ডাইনামিক সার্টিফিকেট)
  useEffect(() => {
    if (!recordId) {
      setPermit(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorMsg("");

    axios
      .get(`ajeerPermits/${recordId}`)
      .then((res) => {
        if (!cancelled && res.data?.status === "success") {
          setPermit(res.data.data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMsg(err.response?.data?.message || "Ajeer permit record not found.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [recordId]);

  useEffect(() => {
    if (recordId) return undefined;

    let cancelled = false;

    const loadNextQr = async () => {
      try {
        const records = [];
        let page = 1;
        let lastPage = 1;

        do {
          const res = await axios.get("ajeerPermits", { params: { page } });
          const payload = res.data?.data;
          const rows = Array.isArray(payload) ? payload : payload?.data || [];
          records.push(...rows);
          lastPage = Number(payload?.last_page) || 1;
          page += 1;
        } while (page <= lastPage);

        if (!cancelled) {
          setForm((prev) => ({ ...prev, qr_number: nextAjeerQr(records) }));
        }
      } catch {
        if (!cancelled) {
          setForm((prev) => ({
            ...prev,
            qr_number: prev.qr_number || formatAjeerQr(AJEER_QR_START),
          }));
        }
      }
    };

    loadNextQr();

    return () => {
      cancelled = true;
    };
  }, [recordId]);

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "permit_start_date" || name === "duration_months") {
        const start = name === "permit_start_date" ? value : next.permit_start_date;
        const months = name === "duration_months" ? value : next.duration_months;
        next.permit_end_date = addMonths(start, months);
      }
      return next;
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = { ...form };
      delete payload.duration_months;
      const res = await axios.post("ajeerPermits", payload);
      if (res.data?.status === "success") {
        setSuccessMsg("Ajeer permit saved successfully.");
        setSearchParams({ id: res.data.id });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save Ajeer permit.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const safeName = String(permit?.worker_name || "AJEER").replace(/[\\/:*?"<>|]/g, " ").trim();
    printAjeerPdf(`${safeName} AJEER.pdf`);
  };

  const data = permit || {};

  if (recordId) {
    return (
      <DashboardLayout title="New Azeer">
        <div className="new-azeer-page">
          {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>}
          {errorMsg && (
            <div style={{ maxWidth: "595.28pt", margin: "20px auto" }}>
              <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />
            </div>
          )}

          {!loading && !errorMsg && (
            <div className="azeer-page-container" ref={pageRef}>
          {/* ===== HEADER ===== */}
          <div className="azeer-header-box">
            <div className="azeer-header-right">
              <img
                src="/ajeer/ministry-ajeer-logo.jpg"
                alt="الموارد البشرية والتنمية الاجتماعية - أجير"
                className="azeer-ministry-logo"
                crossOrigin="anonymous"
              />
            </div>

            <div className="azeer-header-center">
              <h1 className="azeer-header-title">تصريح أجير – تعاقد أجير</h1>
            </div>

            <div className="azeer-header-left">
              <AjeerQr value={data.qr_number} data={data} className="azeer-qr-code" />
              <div className="azeer-qr-number">{data.qr_number || "-"}</div>
              <div className="azeer-qr-label">امسح للتحقق</div>
            </div>
          </div>

          {/* ===== BODY TEXT ===== */}
          <div className="azeer-body-text">
            نشعركم أنه تم التعاقد من قبلنا كجهة مقدمة للخدمة مع الجهة المستفيدة من الخدمة حسب المعلومات المبينة أدناه، ولذلك تم تسجيل
            <br />
            معلومات العقد لتكون بحوزة العامل لإثبات عدم مخالفته لنظام العمل ولتقديمها إلى من يهمه الأمر من الجهات المختصة عند طلبها
            <br />
            للتحقق من صحة تواجده في مكان تقديم الخدمة
          </div>

          {/* ===== DATA TABLES ===== */}
          <table className="azeer-data-table">
            <colgroup>
              <col className="azeer-col-label" />
              <col className="azeer-col-value" />
              <col className="azeer-col-mid-label" />
              <col className="azeer-col-mid-value" />
            </colgroup>
            <tbody>
              <tr>
                <td colSpan="4" className="azeer-section-header">
                  <b>بيانات العامل</b>
                </td>
              </tr>
              <tr>
                <td className="azeer-label-cell">اسم العامل</td>
                <td className="azeer-value-cell azeer-worker-name">{data.worker_name || "-"}</td>
                <td className="azeer-label-cell">المهنة</td>
                <td className="azeer-value-cell-rtl">{data.occupation || "-"}</td>
              </tr>
              <tr>
                <td className="azeer-label-cell">رقم الهوية / الإقامة</td>
                <td className="azeer-value-cell">{data.iqama_number || "-"}</td>
                <td className="azeer-label-cell">الجنسية</td>
                <td className="azeer-value-cell-rtl">{data.nationality || "-"}</td>
              </tr>

              <tr>
                <td colSpan="4" className="azeer-section-header">
                  <b>بيانات مقدم الخدمة</b>
                </td>
              </tr>
              <tr>
                <td className="azeer-label-cell">المنشأة المقدمة للخدمة</td>
                <td className="azeer-value-cell-rtl">{data.provider_name || "-"}</td>
                <td className="azeer-mid-label-cell">
                  رقم المنشأة في وزارة الموارد
                  <br />
                  البشرية و التنمية الإجتماعية
                </td>
                <td className="azeer-mid-value-cell">{data.provider_reg_no || "-"}</td>
              </tr>

              <tr>
                <td colSpan="4" className="azeer-section-header">
                  <b>بيانات المستفيد من الخدمة</b>
                </td>
              </tr>
              <tr>
                <td className="azeer-label-cell">المنشأة المستفيدة من الخدمة</td>
                <td className="azeer-value-cell-rtl">{data.beneficiary_name || "-"}</td>
                <td className="azeer-mid-label-cell">
                  رقم المنشأة في وزارة الموارد
                  <br />
                  البشرية و التنمية الإجتماعية
                </td>
                <td className="azeer-mid-value-cell">{data.beneficiary_reg_no || "-"}</td>
              </tr>

              <tr>
                <td colSpan="4" className="azeer-section-header">
                  <b>بيانات التصريح</b>
                </td>
              </tr>
              <tr>
                <td className="azeer-label-cell">نبذة عن التعاقد</td>
                <td colSpan="3" className="azeer-value-cell">
                  {data.contract_description || "-"}
                </td>
              </tr>
              <tr>
                <td className="azeer-label-cell">تاريخ بداية التصريح</td>
                <td className="azeer-value-cell">{data.permit_start_date || "-"}</td>
                <td className="azeer-label-cell">تاريخ نهاية التصريح</td>
                <td className="azeer-value-cell">{data.permit_end_date || "-"}</td>
              </tr>
              {String(data.work_location || "").trim() ? (
                <tr>
                  <td className="azeer-label-cell">مواقع العمل</td>
                  <td colSpan="3" className="azeer-value-cell-rtl">
                    {data.work_location}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          {/* ===== DECLARATIONS ===== */}
          <div className="azeer-declarations-section">
            <h2 className="azeer-declarations-title">
              <b>إقرارات</b>
            </h2>
            <p className="azeer-declarations-intro">
              <b>أقر أنا المنشأة المقدمة للخدمة والموضحة بياناتي أعلاه وأتعهد بـ:</b>
            </p>
            <ul className="azeer-declarations-list">
              <li>
                <strong>•</strong> إن العامل حامل هذا التصريح بحمله له يقر ويتعهد بأن البيانات المدونة فيه صحيحة على مسؤوليته الشخصية، وأنه يعمل لدى المنشأة
                <br />
                ولحسابها، بموجب رخصة إقامة سارية المفعول. وأتحمل أي تبعات قانونية أو غرامات تترتب على خلاف المذكور أعلاه.
              </li>
              <li>
                <strong>•</strong> الالتزام والتقيد بأنظمة العمل والعمال وأي أنظمة و لوائح وقرارات أخرى ذات علاقة.
              </li>
              <li>
                <strong>•</strong> أن الموقع الإلكتروني الخاص بأجير أو القائمين عليه عبارة عن وسيط إلكتروني ما بين الباحثين عن العمل وأصحاب الأعمال فقط وبدون
                <br />
                أي التزام قانوني أو غيره على القائمين على موقع أجير.
              </li>
              <li>
                <strong>•</strong> أي تعديل أو كشط في هذا التصريح يجعله لاغياً.
              </li>
            </ul>
          </div>

          {/* ===== FOOTER ===== */}
          <div className="azeer-footer-section">
            <div className="azeer-footer-text">
              للتحقق من صحة هذا التصريح وسريان مفعوله بإمكانك زيارة موقع أجير (https://ajeer.com.sa)
              <br />* خدمة معتمدة من وزارة الموارد البشرية والتنمية الإجتماعية *
            </div>
          </div>
            </div>
          )}

          {!loading && !errorMsg && (
            <button type="button" className="azeer-download-btn" onClick={handleDownload}>
              تحميل PDF
            </button>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="New Azeer">
      <section className="w-full bg-slate-50 min-h-screen p-4 md:p-8" dir="rtl">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#1a3a5c] p-6 text-center">
            <h2 className="text-2xl font-bold text-white">إنشاء تصريح أجير جديد (Create New Ajeer Permit)</h2>
          </div>

          <div className="p-6 md:p-8 text-right">
            <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
            <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ["worker_name", "اسم العامل (Worker Name)", "md:col-span-2"],
                  ["iqama_number", "رقم الهوية / الإقامة (ID / Iqama Number)"],
                  ["occupation", "المهنة (Occupation)"],
                  ["nationality", "الجنسية (Nationality)", "md:col-span-2"],
                  ["provider_name", "المنشأة المقدمة للخدمة (Service Provider)"],
                  ["provider_reg_no", "رقم منشأة مقدم الخدمة (Provider Establishment No.)"],
                  ["beneficiary_name", "المنشأة المستفيدة من الخدمة (Beneficiary)"],
                  ["beneficiary_reg_no", "رقم منشأة المستفيد (Beneficiary Establishment No.)"],
                  ["contract_description", "نبذة عن التعاقد (Contract Description)"],
                  ["work_location", "مواقع العمل (Work Locations)"],
                ].map(([key, label, spanClass]) => (
                  <div key={key} className={spanClass || ""}>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
                    <input
                      type="text"
                      name={key}
                      value={form[key]}
                      onChange={onFormChange}
                      dir={key === "worker_name" ? "auto" : "rtl"}
                      required={["worker_name", "iqama_number"].includes(key)}
                      className={`w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 transition-all ${
                        key === "worker_name" ? "text-start" : "text-right"
                      }`}
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    الرقم المرجعي (Reference No. / QR)
                  </label>
                  <input
                    type="text"
                    name="qr_number"
                    value={form.qr_number}
                    readOnly
                    dir="ltr"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100 text-start text-slate-700 font-semibold tracking-wide cursor-default focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ بداية التصريح (Permit Start Date)</label>
                  <input
                    type="date"
                    name="permit_start_date"
                    value={form.permit_start_date}
                    onChange={onFormChange}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    مدة التصريح بالأشهر (Duration in Months)
                  </label>
                  <select
                    name="duration_months"
                    value={form.duration_months}
                    onChange={onFormChange}
                    dir="ltr"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 transition-all text-start"
                  >
                    <option value="">Select months</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  {form.permit_end_date ? (
                    <p className="mt-2 text-sm text-slate-500 text-start" dir="ltr">
                      End date: {form.permit_end_date}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="text-center pt-8 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-12 h-12 rounded-xl text-white font-bold text-lg transition-all ${
                    saving ? "bg-slate-400 cursor-not-allowed" : "bg-[#1a3a5c] hover:bg-[#0d2840] shadow-lg shadow-blue-500/20"
                  }`}
                >
                  {saving ? "جاري الحفظ... (Saving...)" : "حفظ وإنشاء التصريح (Save & Create Permit)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

