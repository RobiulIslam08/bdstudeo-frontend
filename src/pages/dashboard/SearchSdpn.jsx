import React, { useState } from "react";
import axios from "axios";
import DashboardLayout from "../dashboard/DashboardHeader";
import Alert from "../../components/Alert";

export default function SearchSdpn() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    info: "",
    infoType: "iqama_no",
  });

 const downloadImage = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.setAttribute("target", "_blank"); // অনেক সময় এটি কাজ করে
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setResult(null);

    if (!form.info.trim()) {
      setErrorMsg("Please enter information.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("searchImage", { 
        info: form.info, 
        infoType: form.infoType 
      });

      const data = res.data?.result;

      if (data?.image) {
        setResult(data);
        setSuccessMsg("Result found!");
      } else {
        setErrorMsg("No data matched your search.");
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setErrorMsg("Data not found.");
      } else if (status === 422) {
        setErrorMsg("Invalid input format.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ইমেজ পাথ লারাভেলের স্টোরেজ অনুযায়ী (আপনার ডোমেইন অনুযায়ী আপডেট করে নিন)
  const imageUrl = result?.image 
    ? `http://127.0.0.1:8000/uploads/images/${result.image}` 
    : "";

  return (
    <DashboardLayout title="Search Image">
      <section className="max-w-4xl mx-auto">
        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
        <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
          <h1 className="text-xl font-bold text-[#071A3A]">Search SDPN</h1>
          <p className="text-sm text-slate-500">Search by Iqama, Passport, Phone, or SDPN No.</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Information</label>
              <input
                type="text"
                name="info"
                value={form.info}
                onChange={onChange}
                placeholder="Enter search value..."
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>

            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-slate-700 mb-1">Search Type</label>
              <select
                name="infoType"
                value={form.infoType}
                onChange={onChange}
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none"
              >
                <option value="iqama_no">Iqama No</option>
                <option value="passport_no">Passport No</option>
                <option value="phone">Phone</option>
                <option value="sdpn_no">SDPN No</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`h-11 px-8 rounded-xl text-white font-bold transition-all ${
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-[#0B4BFF] hover:bg-blue-700"
              }`}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Result Display */}
          {result && (
            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center">
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt={imageUrl}
                  className="w-64 h-64 object-cover rounded-2xl border-4 border-slate-50 shadow-lg"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-slate-600 font-medium mb-3">Found: {result.name || "SDPN Record"}</p>
                <a
  href={`http://127.0.0.1:8000/api/download-image?file=${result.image}`}
  className="inline-flex items-center px-6 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition"
>
  Download Image
</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}