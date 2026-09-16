import React, { useMemo, useState, useEffect } from "react";
import axios from "axios"; 
import DashboardLayout from "../../pages/dashboard/DashboardHeader"; 

import { useNavigate } from "react-router-dom";

export default function AgentList() {

const navigate = useNavigate();

  // --- Super Admin Check Logic ---
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  if (user.role !== "Super Admin") {
    setTimeout(() => {
      
      navigate(-1); // ৩ সেকেন্ড পর আগের পেজে ফেরত পাঠাবে
    }, 3000);

    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied!</h2>
          <p className="text-gray-500 mt-2">Redirecting to previous page in 3 seconds...</p>
        </div>
      </div>
    );
  }



  const [agents, setAgents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  

  // Status Update Logic (Block/Unblock)
const handleToggleStatus = async (agent) => {
  const newStatus = agent.acount_satatus === "block" ? "active" : "block"; // ধরুন একটিভ স্ট্যাটাস 'active'
  const confirmMsg = `Are you sure you want to ${newStatus === 'block' ? 'Block' : 'Unblock'} this agent?`;
  
  if (!window.confirm(confirmMsg)) return;

  try {
    // আপনার API এন্ডপয়েন্ট অনুযায়ী এটি পরিবর্তন করুন
    const response = await axios.post("/updateStatus", { 
      agent_id: agent.id, 
      status: newStatus 
    });
    
    alert(response.data.message);
    await fetchAgents(); // লিস্ট রিফ্রেশ করার জন্য
  } catch (error) {
    console.error("Status update failed:", error);
    alert("Failed to update status.");
  }
};

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("agents", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Accept": "application/json"
        }
      });
      setAgents(response.data.data || response.data); 
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Balance Update Logic
 const handleUpdateBalance = async (e) => {
  e.preventDefault();
  if (!amount || amount <= 0) return alert("Please enter a valid amount");

  setSubmitting(true);
  try {
    // লক্ষ্য করুন: route এবং payload পরিবর্তন করা হয়েছে
    const response = await axios.post("/addBalance", { 
      agent_id: selectedAgent.id, 
      amount: parseFloat(amount) 
    });
    
    // কন্ট্রোলার থেকে আসা সাকসেস মেসেজ দেখানো
    alert(response.data.message); 
    
    await fetchAgents();
    closeModal();
  } catch (error) {
    // যদি API কল ফেইল করে বা রুট না পায় তবে এখানে মেসেজ আসবে
    console.error("Update failed:", error.response);
    const errorMsg = error.response?.data?.message || "Internal Server Error. Check API Route.";
    alert("API Error: " + errorMsg);
  } finally {
    setSubmitting(false);
  }
};

  const openModal = (agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
    setAmount("");
  };

  const filteredAgents = useMemo(() => {
    const s = searchQuery.trim().toLowerCase();
    if (!s) return agents;
    return agents.filter((a) =>
      [a.name, a.email, a.phone].some(val => val?.toString().toLowerCase().includes(s))
    );
  }, [agents, searchQuery]);

  const avatarLetter = (name) => (name?.trim()?.[0] || "A").toUpperCase();

  return (
    <DashboardLayout title="Agent Management">
      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Agent Directory</h1>
            <p className="text-gray-500 mt-1">Showing {filteredAgents.length} agents</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full md:w-80 pl-4 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table logic */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                <p className="text-gray-500 font-medium">Loading Agents...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Agent Details</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Balance</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAgents.length > 0 ? (
                    filteredAgents.map((agent) => (
                        <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                                {avatarLetter(agent.name)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-gray-900">{agent.name}</div>
                                
                                <div className="text-xs text-gray-500">{agent.email || agent.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-gray-500">{agent.title }</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded-md text-sm font-bold ${Number(agent.balance) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                {parseFloat(agent.balance || 0).toFixed(2)} SAR
                                </span>
                                {/* Add Balance Button */}
                                <button 
                                    onClick={() => openModal(agent)}
                                    className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    title="Add Balance"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-gray-500">{agent.acount_satatus }</div>
                          </td>
                          <td className="px-6 py-4 text-right">
  <button 
    onClick={() => handleToggleStatus(agent)}
    className={`font-bold text-sm px-3 py-1 rounded-lg transition-colors ${
      agent.acount_satatus === "block" 
        ? "text-emerald-600 hover:bg-emerald-50" 
        : "text-rose-600 hover:bg-rose-50"
    }`}
  >
    {agent.acount_satatus === "block" ? "Unblock Agent" : "Block Agent"}
  </button>
</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No agents found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- Modern Balance Modal --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Add Balance</h3>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <p className="text-sm text-gray-500 mb-6">
                  Adding balance to <span className="font-semibold text-gray-700">{selectedAgent?.name}</span>'s account.
                </p>

                <form onSubmit={handleUpdateBalance} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (SAR)</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none text-lg font-semibold"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
                    >
                      {submitting ? "Processing..." : "Confirm Top-up"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}