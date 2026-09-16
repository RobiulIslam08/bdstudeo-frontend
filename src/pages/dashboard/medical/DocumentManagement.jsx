import React, { useState } from "react";
import DashboardLayout from "../../dashboard/DashboardHeader";
import Alert from "../../../components/Alert";

export default function DocumentManagement() {
  const [successMsg, setSuccessMsg] = useState("");
  const [newDocs, setNewDocs] = useState([]); // নতুন রো গুলোর স্টেট

  // নতুন ইনপুট রো যোগ করার ফাংশন
  const addNewField = () => {
    setNewDocs([...newDocs, { id: Date.now() }]);
  };

  return (
    <DashboardLayout title="Documents">
      <section className="w-full bg-slate-50 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          
          <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            
            {/* Blue Header Section */}
            <div className="bg-[#0B4BFF] p-5 flex justify-between items-center text-white">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wider">Documents</h1>
                <p className="text-xs opacity-80">Search or upload new documents</p>
              </div>
              <i className="fas fa-user-cog text-2xl opacity-50"></i>
            </div>

            <div className="p-6 md:p-8">
              
              {/* Search Box Section */}
              <div className="flex flex-col md:flex-row gap-3 mb-10">
                <div className="flex-grow relative">
                  <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    placeholder="Enter Iqama Number"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all">
                  <i className="fas fa-search text-sm"></i> Search
                </button>
              </div>

              {/* Stored Documents Table Design */}
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
                      <tr className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-4 text-slate-700 font-medium">Iqama Copy</td>
                        <td className="p-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 font-bold text-sm inline-flex items-center gap-1">
                            <i className="fas fa-download"></i> Download
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add New Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Add New Document
                </h3>
                
                {/* Dynamic Rows */}
                {newDocs.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 animate-in fade-in zoom-in-95 duration-300">
                    <input
                      type="text"
                      placeholder="Write Document Title"
                      className="h-11 px-4 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                    />
                    <input
                      type="file"
                      className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-slate-500 pt-1"
                    />
                  </div>
                ))}

                {/* Control Buttons */}
                <div className="grid grid-cols-1 gap-3 pt-4">
                  <button
                    onClick={addNewField}
                    className="w-full h-12 rounded-xl border-2 border-dashed border-blue-200 text-blue-500 font-bold hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-plus-circle"></i> Add New Field
                  </button>
                  
                  <button className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2">
                    <i className="fas fa-paper-plane"></i> Submit Documents
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