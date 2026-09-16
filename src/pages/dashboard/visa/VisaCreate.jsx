import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardHeader";
import Alert from "../../../components/Alert";

export default function VisaCreate({ initialData = {} }) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    header_datetime: "",
    profile_photo: null,
    visa_no: initialData.visa_num || "",
    duration_of_stay: "90 Days",
    valid_from: initialData.today || "",
    valid_until: initialData.todayPlus90 || "",
    f_name: "",
    l_name: "",
    visa_type: "عمل - Work",
    birth_date: "",
    passport_no: "",
    ref_no: initialData.rep_num || "",
    application_no: initialData.appl_num || "",
    occupation: "عامل تحميل وتنزيل - Load and unload worker",
    employer_name: "شركة معاذ حمد العتيبي التجارية",
    visafooterTitle: "1<BGDRAKIB<<MD<<<<<<<<<<<<<<<<<<<<<<<<<<<\nEM02021029BGD0202199181211120289<<<<<<<<<<<<02",
  });

  // অটোমেটিক ডেট এবং টাইম ফরম্যাটিং
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear().toString().slice(-2);
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const formatted = `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
    setForm((prev) => ({ ...prev, header_datetime: formatted }));
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_photo") {
      setForm((prev) => ({ ...prev, profile_photo: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      const res = await axios.post("/visaStore", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.status === "success") {
        setSuccessMsg(res.data.message);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create New Visa">
      <section className="w-full bg-slate-50 min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
          <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="bg-[#0B4BFF] p-4 flex justify-between items-center text-white">
              <h1 className="text-xl font-bold uppercase tracking-wider">Visa Information Input Form</h1>
              <i className="fas fa-passport text-xl"></i>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Header Date & Time</label>
                  <input
                    type="text"
                    name="header_datetime"
                    value={form.header_datetime}
                    onChange={onChange}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo</label>
                  <input
                    type="file"
                    name="profile_photo"
                    onChange={onChange}
                    className="w-full h-11 px-2 pt-1 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Visa Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Visa No.</label>
                  <input type="text" name="visa_no" value={form.visa_no} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Duration of Stay</label>
                  <input type="text" name="duration_of_stay" value={form.duration_of_stay} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Valid From</label>
                  <input type="text" name="valid_from" value={form.valid_from} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Valid Until</label>
                  <input type="text" name="valid_until" value={form.valid_until} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                  <input type="text" name="f_name" value={form.f_name} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                  <input type="text" name="l_name" value={form.l_name} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Visa Type</label>
                  <input type="text" name="visa_type" value={form.visa_type} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white font-bold text-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Birth Date</label>
                  <input type="date" name="birth_date" value={form.birth_date} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
              </div>

              {/* Application Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Passport No.</label>
                  <input type="text" name="passport_no" value={form.passport_no} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ref. No.</label>
                  <input type="text" name="ref_no" value={form.ref_no} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Application No.</label>
                  <input type="text" name="application_no" value={form.application_no} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
              </div>

              {/* Occupation & Employer */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Occupation</label>
                  <input type="text" name="occupation" value={form.occupation} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Employer Name</label>
                  <input type="text" name="employer_name" value={form.employer_name} onChange={onChange} className="w-full h-10 px-4 rounded-lg border bg-white" />
                </div>
              </div>

              {/* Footer Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Visa Footer Title (Machine Readable Zone)</label>
                <textarea
                  name="visafooterTitle"
                  value={form.visafooterTitle}
                  onChange={onChange}
                  rows="3"
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-900 text-green-400 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-500/20"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-14 rounded-2xl text-white font-bold text-lg shadow-lg transition-all ${
                  loading ? "bg-slate-400" : "bg-green-600 hover:bg-green-700 shadow-green-500/20"
                }`}
              >
                {loading ? "Submitting..." : "Submit Visa Application"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}