import React, { useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardHeader";
import Alert from "../../../components/Alert"; // নিশ্চিত করুন পাথ সঠিক আছে
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

export default function MuqeemEnglish() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    user_id: user.id != null ? String(user.id) : "",
    user_roll: user.role != null ? String(user.role) : "",
    reportDate: "",
    operatorId: "",
    location: "Muqeem Portal",
    iqamaNumber: "",
    versionNumber: "",
    gender: "Male",
    name: "",
    translatedName: "",
    birthDate: "",
    birthCountry: "",
    maritalStatus: "Single",
    religion: "",
    occupation: "",
    status: "Valid",
    entryDate: "",
    entryLocation: "King Fahd",
    passportNumber: "",
    nationality: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    passportIssueLocation: "دكا",
    iqamaIssueDate: "",
    iqamaExpiryDate: "",
    iqamaIssueLocation: "Company Science",
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

    if (!form.iqamaNumber || !form.name) {
      setErrorMsg("Iqama Number and Name are required.");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...form };
      DATE_FIELDS.forEach((key) => {
        if (payload[key]) payload[key] = gregorianToHijri(payload[key]);
      });
      payload.user_id = payload.user_id != null ? String(payload.user_id) : "";
      payload.user_roll = payload.user_roll != null ? String(payload.user_roll) : "";
      const res = await axios.post("muqeemEnglishUserSubmit", payload);
      
      // লারাভেল থেকে পাঠানো JSON চেক করা
      // handleSubmit এর ভেতরে
if (res.data.status === "success") {
    setSuccessMsg(res.data.message);
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
} else {
        setErrorMsg(res.data.message || "Submission failed.");
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setErrorMsg(firstError);
      } else {
        setErrorMsg(err.response?.data?.message || "Something went wrong. Please try again.");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Muqeem English Form">
      <section className="muqeem-form-page w-full bg-gray-50 min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#0B4BFF] p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Muqeem English Form</h2>
            <p className="text-blue-100 text-sm mt-1">Fill out the details for English report generation</p>
          </div>

          <div className="p-6 md:p-8">
            
            {/* --- Alert Section Added Here --- */}
            <div className="mb-6">
                {successMsg && (
                    <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
                )}
                {errorMsg && (
                    <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />
                )}
            </div>
            {/* --------------------------------- */}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {Object.keys(form).map((key) => {
                  if (key === "user_id" || key === "user_roll") return null;
                  const isLargeField = key === "employerName";
                  
                  return (
                    <div key={key} className={isLargeField ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        type={DATE_FIELDS.has(key) ? "date" : "text"}
                        name={key}
                        value={form[key]}
                        onChange={onChange}
                        className={`w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4BFF]/20 transition-all text-sm${DATE_FIELDS.has(key) ? " muqeem-date-input" : ""}`}
                        placeholder={`Enter ${key}`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full md:w-64 h-12 rounded-xl text-white font-bold text-lg transition-all ${
                    loading ? "bg-slate-400 cursor-not-allowed" : "bg-[#0B4BFF] hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit Form"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}