import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardHeader";
import Alert from "../../../components/Alert";

const FILE_NO_START = 53214;
const FILE_NO_BASE_ID = 4; // current API next_id when this series starts

const nextFileNo = (id) => {
  const numeric = parseInt(String(id ?? "").replace(/\D/g, ""), 10);

  if (Number.isFinite(numeric) && numeric >= FILE_NO_START) {
    return String(numeric);
  }

  if (Number.isFinite(numeric) && numeric > 0) {
    const mapped = FILE_NO_START + (numeric - FILE_NO_BASE_ID);
    return String(Math.max(FILE_NO_START, mapped));
  }

  return String(FILE_NO_START);
};

export default function MedicalReportCreate({ design = "old" }) {
  const isLatest = design === "latest";
  const pageTitle = isLatest ? "Latest Create Medical Report" : "Create Medical Report";
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    report_date: "",
    time: "",
    file_no: "Loading...", // Placeholder until API responds
    name: "",
    nationality: "Bangladesh",
    sex: "M",
    blood_group: "",
    date_of_birth: "",
    passport_or_iqama: "",
    sponsoreCompany: "",
    city: "",
    height: "155 cm",
    weight: "70 kg",
    pulse: "72 b/min",
    bp: "120/80 mmHg",
    temp: "36.6 °C",
  });

  // Fetch Next ID and Set Initial Date/Time on Page Load
useEffect(() => {
  const initializeForm = async () => {
    const now = new Date();
    
    // ফরম্যাট: DD/MM/YYYY (যেমন: 13/02/2026)
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`; 
    
    const currentTime = now.toTimeString().slice(0, 5);

    try {
      const res = await axios.get("/getLatestFileNo");
      if (res.data.status === "success") {
        setForm((prev) => ({
          ...prev,
          report_date: formattedDate,
          time: currentTime,
          // latest design uses the server's nextFileNo directly; old design maps via nextFileNo()
          file_no: isLatest ? res.data.next_id : nextFileNo(res.data.next_id),
        }));
      }
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        report_date: formattedDate,
        time: currentTime,
        file_no: "Error",
      }));
    }
  };
  initializeForm();
}, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSuccessMsg("");
  setErrorMsg("");

  // কনভার্টার ফাংশন: YYYY-MM-DD -> DD/MM/YYYY
  const convertDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("/")) return dateStr; // অলরেডি ফরম্যাট করা থাকলে পরিবর্তন করবে না
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const finalData = {
    ...form,
    report_date: convertDate(form.report_date),
    date_of_birth: convertDate(form.date_of_birth),
    design: design, // pass design to backend
  };

  try {
    const res = await axios.post("/insertReportData", finalData);
    if (res.data.status === "success") {
      setSuccessMsg(res.data.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setForm((prev) => {
        const current = parseInt(String(prev.file_no).replace(/\D/g, ""), 10);
        const next = Number.isFinite(current) ? current + 1 : FILE_NO_START;
        return { ...prev, file_no: String(next) };
      });
    } else {
      setErrorMsg(res.data.message || "Something went wrong.");
    }
  } catch (err) {
    setErrorMsg(err.response?.data?.message || "Failed to submit data.");
  } finally {
    setLoading(false);
  }
};

  return (
    <DashboardLayout title={pageTitle}>
      <section className="w-full bg-slate-50 min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          
          <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
          <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="bg-[#0B4BFF] p-4 flex justify-between items-center text-white">
              <h1 className="text-xl font-bold uppercase tracking-wider">{pageTitle}</h1>
              <i className="fas fa-file-medical text-xl"></i>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
              
              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-sm font-bold text-blue-600 uppercase mb-4 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Report Date</label>
                    <input type="text" name="report_date" value={form.report_date} onChange={onChange} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="DD/MM/YYYY" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                    <input type="time" name="time" value={form.time} onChange={onChange} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">File No</label>
                    <input type="text" name="file_no" value={form.file_no} readOnly maxLength={5} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100 font-bold text-blue-600 outline-none cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Section 2: Personal Details */}
              <div>
                <h3 className="text-sm font-bold text-blue-600 uppercase mb-4 border-b pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input type="text" name="name" value={form.name} onChange={onChange} placeholder="Enter Name" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Passport/Iqama No</label>
                    <input type="text" name="passport_or_iqama" value={form.passport_or_iqama} onChange={onChange} placeholder="Number" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth</label>
                    <input type="text" name="date_of_birth" value={form.date_of_birth} onChange={onChange} placeholder="DD/MM/YYYY" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nationality</label>
                    <input type="text" name="nationality" value={form.nationality} onChange={onChange} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Sex</label>
                    <select name="sex" value={form.sex} onChange={onChange} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none">
                      <option value="M">Male (M)</option>
                      <option value="F">Female (F)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Blood Group</label>
                    <select name="blood_group" value={form.blood_group} onChange={onChange} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none">
                      <option value="">Select Blood Group</option>
                      <option value="A+VE">A+</option>
                      <option value="A-VE">A-</option>
                      <option value="B+VE">B+</option>
                      <option value="B-VE">B-</option>
                      <option value="O+VE">O+</option>
                      <option value="O-VE">O-</option>
                      <option value="AB+VE">AB+</option>
                      <option value="AB-VE">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Sponsore Company</label>
                    <input type="text" name="sponsoreCompany" onChange={onChange} value={form.sponsoreCompany} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                    <input type="text" name="city" onChange={onChange} value={form.city} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
                  </div>
                </div>
              </div>

              {/* Section 4: Vitals */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 uppercase text-right mb-1">Height</label>
                    <input type="text" name="height" value={form.height} onChange={onChange} className="h-10 px-3 rounded-lg border border-slate-200 text-right font-bold outline-none shadow-sm focus:border-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 uppercase text-right mb-1">Weight</label>
                    <input type="text" name="weight" value={form.weight} onChange={onChange} className="h-10 px-3 rounded-lg border border-slate-200 text-right font-bold outline-none shadow-sm focus:border-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 uppercase text-right mb-1">Pulse</label>
                    <input type="text" name="pulse" value={form.pulse} onChange={onChange} className="h-10 px-3 rounded-lg border border-slate-200 text-right outline-none shadow-sm focus:border-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 uppercase text-right mb-1">B.P</label>
                    <input type="text" name="bp" value={form.bp} onChange={onChange} className="h-10 px-3 rounded-lg border border-slate-200 text-right outline-none shadow-sm focus:border-blue-400" />
                  </div>
                  <div className="flex flex-col col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase text-right mb-1">Temp</label>
                    <input type="text" name="temp" value={form.temp} onChange={onChange} className="h-10 px-3 rounded-lg border border-slate-200 text-right outline-none shadow-sm focus:border-blue-400" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-14 rounded-2xl text-white font-bold text-lg transition-all shadow-lg ${
                  loading ? "bg-slate-400 cursor-not-allowed" : "bg-[#0B4BFF] hover:bg-blue-700 shadow-blue-500/20"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i> Saving Data...
                  </span>
                ) : (
                  "Submit Medical Report"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}