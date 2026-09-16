import React, { useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardHeader";
import Alert from "../../../components/Alert";
import { gregorianToHijri } from "../../../utils/gregorianToHijri";
import "./muqeemDateInput.css";

const DATE_FIELDS = new Set([
  "reportDate",
  "birthDate",
  "entryDate",
  "passportIssueDate",
  "passportExpiryDate",
  "iqamaIssueDate",
  "iqamaExpiryDate",
]);

export default function MuqeemArabic() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    reportDate: "",
    operatorId: "",
    user_id: user.id != null ? String(user.id) : "",
    user_roll: user.role != null ? String(user.role) : "",
    location: "بوابة مقيم",
    iqamaNumber: "",
    versionNumber: "",
    gender: "ذكر",
    name: "",
    translatedName: "مهدي رفيق حسن الاسلام",
    birthDate: "1423-12-30",
    birthCountry: "بنجلاديش",
    maritalStatus: "أعزب",
    religion: "الاسلام",
    occupation: "",
    status: "",
    entryDate: "",
    entryLocation: "مطار الملك فهد",
    passportNumber: "",
    nationality: "بنجلاديش",
    passportIssueLocation: "دكا",
    passportIssueDate: "",
    passportExpiryDate: "",
    iqamaIssueDate: "",
    iqamaExpiryDate: "",
    iqamaIssueLocation: "بوابة وزارة",
    employerNumber: "",
    employerName: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
  const payload = { ...form };
  DATE_FIELDS.forEach((key) => {
    if (payload[key]) payload[key] = gregorianToHijri(payload[key]);
  });
  payload.user_id = payload.user_id != null ? String(payload.user_id) : "";
  payload.user_roll = payload.user_roll != null ? String(payload.user_roll) : "";
  const res = await axios.post("muqeemArabicSubmit", payload);
  if (res.data.status === "success") {
    setSuccessMsg(res.data.message); // এর ভেতর এখন ক্লিকযোগ্য লিঙ্ক কাজ করবে
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
} catch (err) {
  setErrorMsg(err.response?.data?.message || "Something went wrong!");
}
     finally {
      setLoading(false);
    }
  };

  // আরবিক লেবেল ম্যাপ (আপনার ব্লেড ফাইল অনুযায়ী)
  const labels = {
    reportDate: "تاريخ التقرير",
    operatorId: "رقم المشغل",
    location: "الموقع",
    iqamaNumber: "رقم الإقامة",
    versionNumber: "رقم النسخة",
    gender: "الجنس",
    name: "الاسم",
    translatedName: "الاسم المترجم",
    birthDate: "تاريخ الميلاد",
    birthCountry: "دولة الميلاد",
    maritalStatus: "الحالة الاجتماعية",
    religion: "الديانة",
    occupation: "المهنة",
    status: "الحالة",
    entryDate: "تاريخ الدخول",
    entryLocation: "مكان الدخول",
    passportNumber: "الرقم (جواز السفر)",
    nationality: "الجنسية",
    passportIssueLocation: "مكان الإصدار",
    passportIssueDate: "تاريخ إصدار جواز السفر",
    passportExpiryDate: "تاريخ انتهاء جواز السفر",
    iqamaIssueDate: "تاريخ الإصدار",
    iqamaExpiryDate: "تاريخ الانتهاء",
    iqamaIssueLocation: "مكان إصدار الإقامة",
    employerNumber: "رقم صاحب العمل",
    employerName: "اسم صاحب العمل",
  };

  return (
    <DashboardLayout title="Muqeem Arabic Form">
      <section className="muqeem-form-page w-full bg-slate-50 min-h-screen p-4 md:p-8" dir="rtl">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#0B4BFF] p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Create Muqeem - Arabic (إنشاء مقيم - عربي)</h2>
          </div>

          <div className="p-6 md:p-8 text-right">
            <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
            <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {Object.keys(form).map((key) => {
                  if (key === "user_id" || key === "user_roll") return null;
                  // ব্লেড ফাইল অনুযায়ী স্পেশাল গ্রিড কলাম স্প্যান হ্যান্ডেল করা
                  const isFullWidth = ["translatedName", "entryLocation", "passportExpiryDate", "employerName"].includes(key);
                  
                  return (
                    <div key={key} className={isFullWidth ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        {labels[key]} = {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type={DATE_FIELDS.has(key) ? "date" : "text"}
                        name={key}
                        value={form[key]}
                        onChange={onChange}
                        dir="rtl"
                        className={`w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4BFF]/20 transition-all${DATE_FIELDS.has(key) ? " muqeem-date-input" : ""}`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-8 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-12 h-12 rounded-xl text-white font-bold text-lg transition-all ${
                    loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                  }`}
                >
                  {loading ? "جاري الحفظ..." : "Submit Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}