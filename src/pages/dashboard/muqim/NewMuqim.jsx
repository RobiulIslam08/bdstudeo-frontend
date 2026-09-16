import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../DashboardHeader";
import Alert from "../../../components/Alert";
import MuqeemPage from "./MuqeemPage";
import { buildMuqimTexts } from "./buildMuqimTexts";
import { LOGO, ORANGE, PAGE, RULES } from "./muqeemData.ar";
import "../../../font/muqim-fonts.css";

const EMPTY_FORM = {
  reportDate: "",
  operatorId: "",
  location: "بوابة مقيم",
  gender: "ذكر",
  iqamaNumber: "",
  versionNumber: "",
  name: "",
  translatedName: "",
  birthDate: "",
  birthCountry: "بنجلاديش",
  maritalStatus: "أعزب",
  religion: "الاسلام",
  occupation: "",
  status: "صالح",
  entryDate: "",
  entryLocation: "مطار الملك فهد",
  passportNumber: "",
  nationality: "بنجلاديش",
  passportIssueDate: "",
  passportExpiryDate: "",
  passportIssueLocation: "دكا",
  iqamaIssueDate: "",
  iqamaExpiryDate: "",
  iqamaIssueLocation: "بوابة وزارة",
  employerNumber: "",
  employerName: "",
};

const LABELS = {
  reportDate: "تاريخ التقرير",
  operatorId: "رقم المشغل",
  location: "الموقع",
  gender: "الجنس",
  iqamaNumber: "رقم الإقامة",
  versionNumber: "رقم النسخة",
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
  passportIssueDate: "تاريخ إصدار جواز السفر",
  passportExpiryDate: "تاريخ انتهاء جواز السفر",
  passportIssueLocation: "مكان الإصدار",
  iqamaIssueDate: "تاريخ الإصدار",
  iqamaExpiryDate: "تاريخ الانتهاء",
  iqamaIssueLocation: "مكان إصدار الإقامة",
  employerNumber: "رقم صاحب العمل",
  employerName: "اسم صاحب العمل",
};

export default function NewMuqim() {
  const [searchParams, setSearchParams] = useSearchParams();
  const recordId = searchParams.get("id");

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  // রেকর্ড আইডি থাকলে ডাটাবেস থেকে আসল ডাটা লোড করা হয় (ডাইনামিক সার্টিফিকেট)
  useEffect(() => {
    if (!recordId) {
      setRecord(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setErrorMsg("");

    axios
      .get(`muqimProfiles/${recordId}`)
      .then((res) => {
        if (!cancelled && res.data?.status === "success") {
          setRecord(res.data.data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMsg(err.response?.data?.message || "Muqim profile not found.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [recordId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setSaving(true);

    try {
      const res = await axios.post("muqimProfiles", form);
      if (res.data?.status === "success") {
        setSuccessMsg("Muqim profile saved successfully.");
        if (res.data.newMuqeemId) {
          setSearchParams({ id: res.data.newMuqeemId });
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  // ============ VIEW MODE: dynamic certificate rendered from real DB data ============
  if (recordId) {
    if (loading) {
      return (
        <DashboardLayout title="Muqeem">
          <div className="p-8 text-center text-slate-500">Loading…</div>
        </DashboardLayout>
      );
    }

    if (errorMsg && !record) {
      return (
        <DashboardLayout title="Muqeem">
          <div className="p-8">
            <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />
          </div>
        </DashboardLayout>
      );
    }

    const texts = buildMuqimTexts(record);
    const filename = `muqeem-profile-${record?.iqamaNumber || recordId}.pdf`;

    return (
      <DashboardLayout title="Muqeem">
        <div className="new-muqim-page">
          <MuqeemPage
            page={PAGE}
            orange={ORANGE}
            rules={RULES}
            logo={LOGO}
            texts={texts}
            filename={filename}
            lang="ar"
          />
        </div>
      </DashboardLayout>
    );
  }

  // ============ FORM MODE: create a new Muqeem Arabic record ============
  return (
    <DashboardLayout title="New Muqim">
      <section className="muqeem-form-page w-full bg-slate-50 min-h-screen p-4 md:p-8" dir="rtl">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#0B4BFF] p-6 text-center">
            <h2 className="text-2xl font-bold text-white">
              إنشاء مقيم (Create Muqeem)
            </h2>
          </div>

          <div className="p-6 md:p-8 text-right">
            <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
            <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(form).map((key) => {
                  const isFullWidth = [
                    "translatedName",
                    "entryLocation",
                    "passportExpiryDate",
                    "employerName",
                  ].includes(key);

                  return (
                    <div key={key} className={isFullWidth ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        {LABELS[key]}
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={form[key]}
                        onChange={onChange}
                        dir="rtl"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4BFF]/20 transition-all"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-8 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-12 h-12 rounded-xl text-white font-bold text-lg transition-all ${
                    saving
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                  }`}
                >
                  {saving ? "جاري الحفظ..." : "Submit Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
