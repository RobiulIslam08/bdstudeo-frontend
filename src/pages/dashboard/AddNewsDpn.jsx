import React, { useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import DashboardLayout from "../../pages/dashboard/DashboardHeader";

export default function AddNewsDpn() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    image: null,
    iqama_no: "",
    passport_no: "",
    phone: "",
    sdpn_no: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  // ✅ REAL SUBMIT: SDPN store (POST multipart/form-data)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!form.image) {
      setErrorMsg("Please select an image.");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("image", form.image);
      fd.append("iqama_no", form.iqama_no);
      fd.append("passport_no", form.passport_no);
      fd.append("phone", form.phone);
      fd.append("sdpn_no", form.sdpn_no);

      // main.jsx এ baseURL সেট থাকায় এখন শুধু এন্ডপয়েন্ট দিলেই হবে
      const res = await axios.post("sdpnStorageData", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg(res.data?.message || "Saved successfully!");

      // Form Reset
      setForm({
        image: null,
        iqama_no: "",
        passport_no: "",
        phone: "",
        sdpn_no: "",
      });

      const fileInput = document.getElementById("sdpn_image_input");
      if (fileInput) fileInput.value = "";
      
    } catch (err) {
      console.error("STORE ERR:", err);
      if (err.response?.status === 422) {
        const errors = err.response.data?.errors || {};
        const firstKey = Object.keys(errors)[0];
        setErrorMsg(firstKey ? errors[firstKey][0] : "Validation error");
      } else {
        setErrorMsg(err.response?.data?.message || err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Add New SDPN">
      <section className="w-full">
        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
        <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
          <h1 className="text-lg md:text-xl font-bold text-[#071A3A]">Add New SDPN</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Fill in the details and upload an image to register a new SDPN.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 bg-white rounded-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-4 md:p-5 border-b border-slate-200">
            <div className="font-semibold text-[#071A3A]">SDPN Information</div>
            <div className="text-xs text-slate-500 mt-1">Image is required, other fields are optional.</div>
          </div>

          <div className="p-4 md:p-5 overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="text-slate-600">
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 font-semibold">Image *</th>
                  <th className="text-left py-3 font-semibold">Iqama No</th>
                  <th className="text-left py-3 font-semibold">Passport No</th>
                  <th className="text-left py-3 font-semibold">Phone</th>
                  <th className="text-left py-3 font-semibold">SDPN No</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-4 pr-4">
                    <input
                      id="sdpn_image_input"
                      type="file"
                      name="image"
                      onChange={onFileChange}
                      className="block w-[260px] text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-[#0B4BFF]/10 file:px-4 file:py-2 file:font-semibold file:text-[#0B4BFF] hover:file:bg-[#0B4BFF]/15"
                      accept="image/png,image/jpeg"
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <input type="text" name="iqama_no" value={form.iqama_no} onChange={onChange} placeholder="e.g. 147852369" className="h-11 w-[170px] rounded-2xl border border-slate-200 bg-slate-50 px-4" />
                  </td>
                  <td className="py-4 pr-4">
                    <input type="text" name="passport_no" value={form.passport_no} onChange={onChange} placeholder="e.g. 123456789" className="h-11 w-[170px] rounded-2xl border border-slate-200 bg-slate-50 px-4" />
                  </td>
                  <td className="py-4 pr-4">
                    <input type="text" name="phone" value={form.phone} onChange={onChange} placeholder="e.g. 0500000000" className="h-11 w-[170px] rounded-2xl border border-slate-200 bg-slate-50 px-4" />
                  </td>
                  <td className="py-4">
                    <input type="text" name="sdpn_no" value={form.sdpn_no} onChange={onChange} placeholder="e.g. 456" className="h-11 w-[170px] rounded-2xl border border-slate-200 bg-slate-50 px-4" />
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} className="pt-5">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full h-12 rounded-2xl text-white font-bold transition ${loading ? "bg-slate-400" : "bg-[#0B4BFF] hover:opacity-95"}`}
                    >
                      {loading ? "Saving..." : "Add to SDPN"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
          <div className="flex flex-wrap gap-3">
            {["/newsdpn", "/searchsdpn"].map((href, i) => (
              <a key={i} href={href} className="h-11 px-5 rounded-full bg-[#0B4BFF] text-white font-semibold flex items-center">
                {href.replace("/", "").toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}