import React, { useState } from "react";
import axios from "axios";
import DashboardLayout from "../../dashboard/DashboardHeader";
import Alert from "../../../components/Alert";

export default function Muqeempdf() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    iqamaNumber: "",
    personImg: null,
    detailsImg: null,
    user_id: user.id,      // Blade এ স্ট্যাটিক ছিল
    user_roll: user.role // Blade এ স্ট্যাটিক ছিল
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // Validation
    if (!form.personImg || !form.detailsImg) {
      setErrorMsg("Both Person and Details images are required.");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("iqamaNumber", form.iqamaNumber);
      fd.append("personImg", form.personImg);
      fd.append("detailsImg", form.detailsImg);
      fd.append("user_id", form.user_id);
      fd.append("user_roll", form.user_roll);

      // আপনার API এন্ডপয়েন্ট (storeInfo)
      const res = await axios.post("storeInfo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg(res.data?.message || "Muqeem created successfully!");
      
      // Form Reset
      setForm({ ...form, name: "", iqamaNumber: "", personImg: null, detailsImg: null });
      document.getElementById("personImg").value = "";
      document.getElementById("detailsImg").value = "";

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to store data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Muqeem">
      <section className="max-w-6xl mx-auto">
        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
        <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
          <h1 className="text-xl font-bold text-[#071A3A]">Create Muqeem</h1>
          <p className="text-sm text-slate-500">Upload person image and details to create record.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Person Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Person Image</label>
                <input
                  id="personImg"
                  name="personImg"
                  type="file"
                  onChange={onFileChange}
                  accept="image/*"
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Details Image/PDF */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Details Image/PDF</label>
                <input
                  id="detailsImg"
                  name="detailsImg"
                  type="file"
                  onChange={onFileChange}
                  accept="image/*,.pdf"
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Enter Name"
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              {/* Iqama Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Iqama Number</label>
                <input
                  name="iqamaNumber"
                  type="number"
                  value={form.iqamaNumber}
                  onChange={onChange}
                  placeholder="Enter Iqama Number"
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-xl text-white font-bold transition-all ${
                  loading ? "bg-slate-400 cursor-not-allowed" : "bg-[#0B4BFF] hover:bg-blue-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit Muqeem"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </DashboardLayout>
  );
}