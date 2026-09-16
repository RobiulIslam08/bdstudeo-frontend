import React, { useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardHeader";
import Alert from "../../../components/Alert";
import { gregorianToHijri } from "../../../utils/gregorianToHijri";
import "./muqeemDateInput.css";

const DATE_FIELDS = new Set([
  "muqeemCreateDate",
  "iqamaExpDate",
  "iqamaIssueDate",
  "VisaExpiryDate",
  "dateOfBirth",
  "PassportIssuanceDate",
  "PassportExpiryDate",
  "DateLastExit",
]);

export default function MuqeemBusiness() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

 const [form, setForm] = useState({
  muqeemCreateDate: "",

  user_id: user.id != null ? String(user.id) : "",
    user_roll: user.role != null ? String(user.role) : "",
  // iqama
  iqamaNumber: "",
  idVersion: "",
  iqamaStatus: "Valid",
  iqamaExpDate: "",
  iqamaIssueDate: "",
  iqamaOccupation: "",
  iqamaMaritalStatus: "Single",
  iqamaIssuePlace: "Company Science",

  VisaExpiryDate: "",
  VisaIssuancePlace: "",
  
  // personal
  nameEnglish: "",
  arabicName: "",
  gender: "Male",
  nationality: "",
  dateOfBirth: "",
  placeOfBirth: "",
  religion: "",
  
  // passport
  passportNumber: "",
  PassportIssuanceDate: "",
  PassportExpiryDate: "",
  passportIssuancePlace: "دكا",
  PassportStatus: "",
  bloodType: "",
  
  // sponsor
  sponsorIdNumber: "012",
  sponsorName: "",
  slId: "",

  HealthInsurance: "",
  HelthInsuranceExpiry: "",
  NumberofVehicles: "",
  TrafficViolationsNumber: "",
  NumberofLicenses: "",
  hajjEligibility: "",
  lastYearHajj: "",

  NumberOfFamilyMembers: "",
  FamilyMembersInside: "",
  FamilyMembersOutside: "",

  customerImage: null,

  // 

  
  // visa/entry
  DateLastExit: "",
  
});

const [imagePreview, setImagePreview] = useState(null);
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMsg("");
  setErrorMsg("");

  const formData = new FormData();
  
  // সব টেক্সট ডাটা FormData-তে যোগ করা
  Object.keys(form).forEach((key) => {
    const value = DATE_FIELDS.has(key) ? gregorianToHijri(form[key]) : form[key];
    formData.append(key, value);
  });

  try {
    setLoading(true);
    const res = await axios.post("submitMuqeemBusiness", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setSuccessMsg(res.data?.message || "Business Muqeem created successfully!");
  } catch (err) {
    setErrorMsg(err.response?.data?.message || "Failed to submit data.");
  } finally {
    setLoading(false);
  }
};

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setForm((prev) => ({ ...prev, customerImage: file }));
    setImagePreview(URL.createObjectURL(file)); // ইমেজ প্রিভিউ তৈরি
  }
};
  return (
    <DashboardLayout title="Create Muqeem-Business">
      <section className="muqeem-form-page w-full bg-slate-50 min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-[#0B4BFF] p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Create Muqeem-Business</h2>
            <p className="text-blue-100 text-sm mt-1">Fill out the official business muqeem information</p>
          </div>

          <div className="p-6 md:p-8">
            <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
            <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {Object.keys(form).map((key) => {
                  if (key === "user_id" || key === "user_roll") return null;
                  // ব্লেড ফাইল অনুযায়ী স্পেশাল গ্রিড কলাম হ্যান্ডেল করা
                  const isFullWidth = ["translatedName", "employerName"].includes(key);
                  
                  return (
                    <div key={key} className={isFullWidth ? "md:col-span-2" : ""}>
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

              {/* Image Upload Field */}
<div className="md:col-span-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
  <label className="block text-sm font-semibold text-slate-700 mb-2">
    Customer Image
  </label>
  <div className="flex items-center gap-4">
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    {imagePreview && (
      <img
        src={imagePreview}
        alt="Preview"
        className="w-16 h-16 rounded-lg object-cover border border-slate-300"
      />
    )}
  </div>
</div>

              {/* Submit Button */}
              <div className="text-center pt-8 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-16 h-12 rounded-xl text-white font-bold text-lg transition-all ${
                    loading ? "bg-slate-400 cursor-not-allowed" : "bg-[#0B4BFF] hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                  }`}
                >
                  {loading ? "Processing..." : "Submit Business Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}