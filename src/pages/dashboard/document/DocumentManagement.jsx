import React, { useState } from "react";
import DashboardLayout from "../../dashboard/DashboardHeader";
import Alert from "../../../components/Alert";
import axios from "axios"; // ১. Axios ইমপোর্ট করুন

export default function DocumentManagement() {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // এরর মেসেজের জন্য
  const [loading, setLoading] = useState(false);
  const [iqamaNumber, setIqamaNumber] = useState(""); // সার্চ ইনপুট স্টেট
  const [storedDocs, setStoredDocs] = useState([]); // ডাটাবেজ থেকে আসা রেকর্ড
  const [newDocs, setNewDocs] = useState([]); 

  // ২. সার্চ করার ফাংশন (Laravel API call)
  const handleSearch = async () => {
  if (!iqamaNumber) return alert("Please enter an Iqama number");
  
  setLoading(true);
  setErrorMsg("");
  setStoredDocs([]);

  try {
    // এখানে .post ব্যবহার করা হয়েছে এবং ২য় প্যারামিটার হিসেবে ডেটা পাঠানো হয়েছে
    const response = await axios.post('/documentsSearch', {
      iqama: iqamaNumber 
    });

    if (response.data.documents && response.data.documents.length > 0) {
      setStoredDocs(response.data.documents);
    } else {
      setErrorMsg("No records found for this Iqama.");
    }
  } catch (err) {
    console.error("Search Error:", err);
    setErrorMsg("Failed to search. Please check your connection.");
  } finally {
    setLoading(false);
  }
};

  // ৩. নতুন ফিল্ডের ইনপুট হ্যান্ডেল করার ফাংশন
  const handleInputChange = (id, field, value) => {
    setNewDocs(newDocs.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const addNewField = () => {
    setNewDocs([...newDocs, { id: Date.now(), title: "", file: null }]);
  };

  // ৪. সাবমিট করার ফাংশan (Form Data)
  const handleSubmit = async () => {
    if (newDocs.length === 0) return alert("Please add at least one document");
    
    // ভ্যালিডেশন: চেক করুন সব টাইটেল এবং ফাইল ইনপুট দেওয়া হয়েছে কিনা
    const isValid = newDocs.every(doc => doc.title && doc.file);
    if (!isValid) return alert("Please fill all titles and select files before submitting.");

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    // আপনার কন্ট্রোলারের $request->input('iqamaNumber') অনুযায়ী
    formData.append("iqamaNumber", iqamaNumber);

    // লারাভেল অ্যারে হিসেবে রিসিভ করার জন্য লুপ
    newDocs.forEach((doc, index) => {
      // আপনার কন্ট্রোলারের $request->input('document_title') অনুযায়ী
      formData.append(`document_title[${index}]`, doc.title);
      // আপনার কন্ট্রোলারের $request->file('document') অনুযায়ী
      formData.append(`document[${index}]`, doc.file);
    });

    try {
      const response = await axios.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg(response.data.message || "Documents stored successfully");
      setNewDocs([]); // ফর্ম রিসেট
      handleSearch(); // নতুন ফাইলগুলো তালিকায় দেখানোর জন্য সার্চ আবার কল করা
    } catch (err) {
      console.error("Upload Error:", err);
      setErrorMsg(err.response?.data?.message || "Upload failed. Check connection or file size.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Documents">
      <section className="w-full bg-slate-50 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          
          <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />
          {errorMsg && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{errorMsg}</div>}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="bg-[#0B4BFF] p-5 flex justify-between items-center text-white">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wider">Documents</h1>
                <p className="text-xs opacity-80">Search or upload new documents</p>
              </div>
              <i className="fas fa-user-cog text-2xl opacity-50"></i>
            </div>

            <div className="p-6 md:p-8">
              {/* Search Box */}
              <div className="flex flex-col md:flex-row gap-3 mb-10">
                <div className="flex-grow relative">
                  <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    value={iqamaNumber}
                    onChange={(e) => setIqamaNumber(e.target.value)}
                    placeholder="Enter Iqama Number"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all">
                  {loading ? "Searching..." : <><i className="fas fa-search text-sm"></i> Search</>}
                </button>
              </div>

              {/* Stored Records Table */}
              <div className="mb-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Stored Records
                </h3>
                <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="p-4 text-sm font-bold text-slate-600">Document Title</th>
                        <th className="p-4 text-sm font-bold text-slate-600 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {storedDocs.map((doc, index) => (
                        <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-4 text-slate-700 font-medium">{doc.title}</td>
                          <td className="p-4 text-right">
                            <a href={doc.file_url} target="_blank" className="text-blue-600 hover:text-blue-800 font-bold text-sm inline-flex items-center gap-1">
                              <i className="fas fa-download"></i> Download
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add New Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Add New Document
                </h3>
                
                {newDocs.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                    <input
                      type="text"
                      placeholder="Write Document Title"
                      onChange={(e) => handleInputChange(doc.id, "title", e.target.value)}
                      className="h-11 px-4 rounded-lg border border-slate-200 bg-white focus:outline-none"
                    />
                    <input
                      type="file"
                      onChange={(e) => handleInputChange(doc.id, "file", e.target.files[0])}
                      className="h-11 pt-1 text-slate-500"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-3 pt-4">
                  <button onClick={addNewField} className="w-full h-12 rounded-xl border-2 border-dashed border-blue-200 text-blue-500 font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                    <i className="fas fa-plus-circle"></i> Add New Field
                  </button>
                  
                  <button 
                    onClick={handleSubmit}
                    disabled={loading || newDocs.length === 0}
                    className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2">
                    <i className="fas fa-paper-plane"></i> {loading ? "Uploading..." : "Submit Documents"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}