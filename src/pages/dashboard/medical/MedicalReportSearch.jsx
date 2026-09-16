import React, { useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardHeader";
import Alert from "../../../components/Alert";

export default function MedicalReportSearch() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const [searchForm, setSearchForm] = useState({
    info: "",
    info_type: "file_no", // Default search type
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setResult(null);
    setErrorMsg("");
    setSuccessMsg("");

    if (!searchForm.info) {
      setErrorMsg("Please enter File No, Iqama or Passport to search.");
      return;
    }

    try {
      setLoading(true);
      // Laravel API Endpoint: searchMedicalReport
      const res = await axios.post("/searchMedicalReport", searchForm);

      if (res.data.status === "success") {
        setResult(res.data.resultData);
        setSuccessMsg("Medical record found!");
      } else {
        setErrorMsg(res.data.message || "No record found.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Search failed. Record not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Search Medical Report">
      <section className="w-full bg-slate-50 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          
          <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
          <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

          {/* Search Card Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="bg-[#0B4BFF] p-4 flex justify-between items-center text-white">
              <h1 className="text-xl font-bold uppercase tracking-wider">Search Medical Report</h1>
              <i className="fas fa-search-plus text-xl"></i>
            </div>

            <form onSubmit={handleSearch} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                
                {/* Search Value Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Search Information</label>
                  <input
                    name="info"
                    type="text"
                    value={searchForm.info}
                    onChange={onChange}
                    placeholder="Enter File No, Iqama or Passport..."
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Info Type Select */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Search By</label>
                  <select
                    name="info_type"
                    value={searchForm.info_type}
                    onChange={onChange}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="file_no">File Number</option>
                    <option value="passport_or_iqama">Iqama / Passport No</option>
                    <option value="id">ID</option>
                    <option value="name">Patient Name</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-xl text-white font-bold transition-all shadow-md ${
                  loading ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i> Searching...
                  </span>
                ) : (
                  "Find Report"
                )}
              </button>
            </form>
          </div>

          {/* Result Display Section (If found) */}
          {result && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-800 p-4 text-white flex justify-between">
                <span className="font-bold">Patient Details</span>
                <span className="bg-blue-500 px-3 py-1 rounded-full text-xs">File: {result.file_no}</span>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="flex justify-between border-b pb-2"><span className="text-slate-500">Name:</span> <strong>{result.name}</strong></p>
                  <p className="flex justify-between border-b pb-2"><span className="text-slate-500">Iqama/Passport:</span> <strong>{result.passport_or_iqama}</strong></p>
                  <p className="flex justify-between border-b pb-2"><span className="text-slate-500">Nationality:</span> <strong>{result.nationality}</strong></p>
                </div>
                <div className="space-y-3">
                  <p className="flex justify-between border-b pb-2"><span className="text-slate-500">Blood Group:</span> <strong className="text-red-600">{result.blood_group}</strong></p>
                  <p className="flex justify-between border-b pb-2"><span className="text-slate-500">B.P:</span> <strong>{result.bp}</strong></p>
                  <p className="flex justify-between border-b pb-2"><span className="text-slate-500">Status:</span> <strong className="text-green-600">FIT</strong></p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 flex gap-3 justify-end">
                <a
                  href={`/editMedicalReport?id=${result.id}`}
                  className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 transition-all"
                >
                  <i className="fas fa-edit"></i> Edit
                </a>
                <button
                  
                  onClick={() => window.open(`${window.siteURL}checkReport?id=${result.id}`, '_blank')}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg"
                >
                  <i className="fas fa-print"></i> View & Print
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}