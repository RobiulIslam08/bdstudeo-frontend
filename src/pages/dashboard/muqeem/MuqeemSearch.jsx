import React, { useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardHeader";
import Alert from "../../../components/Alert";

export default function MuqeemSearch() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);
  const [checkLink, setCheckLink] = useState("");

  const [searchForm, setSearchForm] = useState({
    info: "",
    info_type: "id",
    muqeem_table_name: "MuqeemModel", // Default value matching the option
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    
    // যখন Muqeem Type চেঞ্জ হবে, তখন info_type ডিফল্টভাবে 'id' তে রিসেট হবে
    if (name === "muqeem_table_name") {
      setSearchForm((prev) => ({ 
        ...prev, 
        [name]: value,
        info_type: "id" 
      }));
    } else {
      setSearchForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ডাইনামিক অপশন রেন্ডার করার জন্য লজিক
  const renderInfoOptions = () => {
    switch (searchForm.muqeem_table_name) {
      case "MuqeemModel":
        return (
          <>
            <option value="id">ID</option>
            <option value="iqamaNumber">Iqama</option>
           
          </>
        );
      case "MuqeemEnglishModel":
      case "MuqeemArabic":
        return (
          <>
            <option value="id">ID</option>
            <option value="iqamaNumber">Iqama</option>
            <option value="passportNumber">Passport Number</option>
          </>
        );
      case "Business":
        return (
          <>
            <option value="id">ID</option>
            <option value="iqama_number">Iqama</option>
            <option value="passport_number">Passport Number</option>
          </>
        );
      default:
        return <option value="id">ID</option>;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setResult(null);
    setErrorMsg("");
    setSuccessMsg("");

    if (!searchForm.info) {
      setErrorMsg("Please enter Information to search.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("searchMuqeem", searchForm);

      if (res.data.status === "success") {
        setResult(res.data.resultData);
        setCheckLink(res.data.checkLink);
        setSuccessMsg("Result found!");
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
    <DashboardLayout title="Search Muqeem">
      <section className="w-full bg-slate-50 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          
          <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
          <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="bg-[#0B4BFF] p-4 flex justify-between items-center text-white">
              <h1 className="text-xl font-bold">Search Muqeem</h1>
              <i className="fas fa-user-cog text-xl"></i>
            </div>

            <form onSubmit={handleSearch} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                
                {/* Information Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Information</label>
                  <input
                    name="info"
                    type="text"
                    value={searchForm.info}
                    onChange={onChange}
                    placeholder="Enter value..."
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Muqeem Type Select */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Muqeem Type</label>
                  <select
                    name="muqeem_table_name"
                    value={searchForm.muqeem_table_name}
                    onChange={onChange}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="MuqeemModel">PDF Muqeem</option>
                    <option value="MuqeemEnglishModel">English Muqeem</option>
                    <option value="MuqeemArabic">Arabic Muqeem</option>
                    <option value="Business">Business Muqeem</option>
                  </select>
                </div>

                {/* Info Type Select (Dynamic) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Info Type</label>
                  <select
                    name="info_type"
                    value={searchForm.info_type}
                    onChange={onChange}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {renderInfoOptions()}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-xl text-white font-bold transition-all ${
                  loading ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Searching..." : "Submit Search"}
              </button>
            </form>
          </div>

          {/* Result Display Section */}
         {/* Result Display Section */}
{result && (
  <div className="mt-4 p-4 bg-blue-600 text-white rounded-xl flex justify-between items-center">
    <div>
      <p><strong>Name:</strong> {result.name || result.full_name}</p>
      <p><strong>ID:</strong> {result.id}</p>
    </div>
    
    <a 
      href={`${window.siteURL}${checkLink}${result.id}`} 
      target="_blank" 
      rel="noreferrer"
      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold"
    >
      View Report
    </a>
  </div>
)}
        </div>
      </section>
    </DashboardLayout>
  );
}