import React, { useState } from "react";
import DashboardLayout from "./DashboardHeader";
import { 
  UserPlus, ImageIcon, FileText, Languages, 
  Globe, Briefcase, Stethoscope, FileStack,
  ChevronDown, CircleDollarSign// Dropdown arrow-er jonno
} from "lucide-react";

export default function DashboardIndex() {
  // Dropdown state handle korar jonno
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Today");

  const filterOptions = ["Today", "Last 7 Days", "This Month", "This Year", "Life Time"];

  // Dummy dynamic data
  const dbData = {
    newAgents: 10,
    newImages: 10,
    muqeemPdfCount: 10000,
    muqeemEnglishCount: 1000,
    medicalReports: 5,
    documents: 9,
    deposite: 500
  };

  const stats = [
    { title: "New Agent", value: `${dbData.newAgents} Agent`, icon: <UserPlus className="text-gray-700" size={24} /> },
    { title: "New Images", value: `${dbData.newImages} Image`, icon: <ImageIcon className="text-gray-700" size={24} /> },
    { title: "Muqeem PDF", value: `${dbData.muqeemPdfCount} Muqeem PDF`, icon: <FileText className="text-gray-700" size={24} /> },
    { title: "Muqeem English", value: `${dbData.muqeemEnglishCount} Muqeem English`, icon: <Languages className="text-gray-700" size={24} /> },
    { title: "Muqeem Arabic", value: "Muqeem Arabic", icon: <Globe className="text-gray-700" size={24} /> },
    { title: "Muqeem Business", value: "Muqeem Business", icon: <Briefcase className="text-gray-700" size={24} /> },
    { title: "Medical Report", value: `${dbData.medicalReports} Medical Report`, icon: <Stethoscope className="text-gray-700" size={24} /> },
    { title: "Document", value: `${dbData.documents} Document`, icon: <FileStack className="text-gray-700" size={24} /> },
    { title: "Deposite Money", value: `${dbData.deposite} Riyal`, icon: <CircleDollarSign className="text-gray-700" size={24} /> },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-8 bg-[#d1d5db] min-h-screen font-sans">
        
        {/* Dropdown Section */}
        <div className="relative mb-6 inline-block text-left">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#1e3a8a] text-white px-4 py-2 rounded-full text-xs font-bold uppercase flex items-center gap-2 hover:bg-blue-800 transition-colors"
          >
            Business Analysis ({selectedFilter})
            <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu Overlay */}
          {isOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
              <div className="py-1">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsOpen(false);
                      // Ekhane API call korar function thakbe filter change hole
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-black mb-2" style={{ fontFamily: 'serif' }}>
            Welcome Back
          </h1>
          <p className="text-gray-800 text-xl font-medium">Bangladeshi studio</p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div 
              key={index} 
              className="bg-[#7fb2f0] p-6 flex items-center shadow-md transition-all duration-300 hover:scale-105 rounded-[15px] overflow-hidden"
            >
              <div className="bg-[#cccccc] w-14 h-14 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-inner">
                {item.icon}
              </div>
              <div>
                <h3 className="text-[#1e3a8a] font-extrabold text-lg leading-tight">{item.title}</h3>
                <p className="text-white font-bold text-sm mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}