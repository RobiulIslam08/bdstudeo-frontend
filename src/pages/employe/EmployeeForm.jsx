import { useEffect, useState } from "react";
import Header from "./Header"; 
import Footer from "./Footer";
import idCard from "../../assets/idCard.PNG";

export default function EmployeeForm() {
  // পাসপোর্ট এবং ইকামার জন্য ডিফল্ট স্যাম্পল ইমেজ সেট করা হয়েছে
  const [passportPreview, setPassportPreview] = useState("https://www.w3schools.com/howto/img_avatar.png");
  // এখানে ইকামার জন্য একটি ডিফল্ট স্যাম্পল ইমেজ পাথ দেওয়া হয়েছে
  const [iqamaPreview, setIqamaPreview] = useState(idCard);

  useEffect(() => {
    const flowbiteScript = document.createElement("script");
    flowbiteScript.src = "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.js";
    flowbiteScript.async = true;
    flowbiteScript.onload = () => { if (window.initFlowbite) window.initFlowbite(); };
    document.body.appendChild(flowbiteScript);
    return () => { if (document.body.contains(flowbiteScript)) document.body.removeChild(flowbiteScript); };
  }, []);

  const handleImageChange = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="font-[sans-serif] bg-gray-50 min-h-screen">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />

      <Header />

      <main className="max-w-5xl mx-auto my-6 md:my-10 p-4 md:p-8 bg-white shadow-xl rounded-xl border border-gray-100">
        <div className="text-center mb-8 border-b pb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-wide">Employee Registration</h2>
          <p className="text-gray-500 text-sm mt-2">Fill out the information below. Fields with <span className="text-red-600 font-bold">*</span> are mandatory.</p>
        </div>

        <form className="space-y-8">
          
          {/* Section 1: Personal & Job Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Full Name <span className="text-red-600">*</span></label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i className="fas fa-user"></i></span>
                <input type="text" className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 focus:ring-[#e12454] focus:border-[#e12454] transition-all" placeholder="Enter full name" required />
              </div>
            </div>

             <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Iqama Number <span className="text-red-600">*</span></label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i className="fas fa-id-card"></i></span>
                <input type="number" className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 focus:ring-[#e12454] focus:border-[#e12454]" placeholder="2XXXXXXXXX" required />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Date Of Birth <span className="text-red-600">*</span></label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i className="fas fa-calendar-alt"></i></span>
                <input type="date" className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 focus:ring-[#e12454] focus:border-[#e12454] transition-all" required />
              </div>
            </div>

            <div>
  <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
  <div className="relative">
    {/* Swapped fa-calendar-alt for fa-envelope */}
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      <i className="fas fa-envelope"></i>
    </span>
    <input 
      type="email" 
      className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 focus:ring-[#e12454] focus:border-[#e12454] transition-all" 
      placeholder="name@company.com"
      required 
    />
  </div>
</div>


            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Mobile Number <span className="text-red-600">*</span></label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i className="fas fa-phone"></i></span>
                <input type="tel" className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 focus:ring-[#e12454] focus:border-[#e12454]" placeholder="05XXXXXXXX" required />
              </div>
            </div>

            

           

            <div>
  <label className="block mb-2 text-sm font-bold text-gray-700">
    Position / Trade <span className="text-red-600">*</span>
  </label>
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
      <i className="fas fa-briefcase"></i>
    </span>
    <select 
      className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-[#e12454] focus:border-[#e12454] appearance-none" 
      required
    >
      <option value="" disabled selected>Select your position</option>
      
      <optgroup label="Scaffolding">
        <option value="Scaffolder">Scaffolder</option>
        <option value="Scaffolding Foreman">Scaffolding Foreman</option>
        <option value="Scaffolding Supervisor">Scaffolding Supervisor</option>
      </optgroup>

      <optgroup label="Painting & Coating">
        <option value="Touch up Painter">Touch up Painter</option>
        <option value="Painting Foreman">Painting Foreman</option>
        <option value="Painting Supervisor">Painting Supervisor</option>
      </optgroup>

      <optgroup label="Piping & Fabrication">
        <option value="Pipe Fitter">Pipe Fitter</option>
        <option value="Piping Foreman">Piping Foreman</option>
        <option value="Fabricator">Fabricator</option>
        <option value="Welder">Welder</option>
        <option value="Grinder Man">Grinder Man</option>
      </optgroup>

      <optgroup label="Rigging">
        <option value="Rigger">Rigger</option>
        <option value="Rigger I">Rigger I</option>
        <option value="Rigger II">Rigger II</option>
        <option value="Rigger III">Rigger III</option>
      </optgroup>

      <optgroup label="General & Admin">
        <option value="Helper">Helper</option>
        <option value="Work Permit Receiver">Work Permit Receiver</option>
        <option value="Document Controller">Document Controller</option>
        <option value="Supervisor">Supervisor</option>
      </optgroup>
    </select>
    
    {/* Optional: Custom dropdown arrow because of appearance-none */}
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
      <i className="fas fa-chevron-down text-xs"></i>
    </div>
  </div>
</div>

            <div>
  <label className="block mb-2 text-sm font-bold text-gray-700">
    Nationality <span className="text-red-600">*</span>
  </label>
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      <i className="fas fa-globe"></i>
    </span>
    <input 
      type="text" 
      list="nationalities" 
      className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 focus:ring-[#e12454] focus:border-[#e12454]" 
      placeholder="Your Country" 
      required 
    />
    <datalist id="nationalities">
      <option value="Bangladesh" />
      <option value="Pakistan" />
      <option value="India" />
      <option value="Nepal" />
      <option value="Bhutan" />
      <option value="Egypt" />
      <option value="Yemen" />
      <option value="Afghanistan" />
    </datalist>
  </div>
</div>

            

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Camp / Location <span className="text-red-600">*</span></label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i className="fas fa-map-marker-alt"></i></span>
                <input type="text" className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 focus:ring-[#e12454] focus:border-[#e12454]" placeholder="Enter Camp Name" required />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Company Name <span className="text-red-600">*</span></label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i className="fas fa-building"></i></span>
                <input type="text" className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 focus:ring-[#e12454] focus:border-[#e12454]" placeholder="Current Company" required />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Iqama Expiry Date <span className="text-red-600">*</span></label>
              <div className="relative">
                <input type="date" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#e12454] focus:border-[#e12454]" required />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Train <span className="text-red-600">*</span></label>
              <div className="relative">
                <input type="number" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#e12454] focus:border-[#e12454]" placeholder="Training ID/Score" required />
              </div>
            </div>
          </div>

          {/* Section 2: Image Uploads (Placed at the bottom) */}
          <div className="mt-10 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
            <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center">
              <i className="fas fa-images mr-2 text-[#e12454]"></i> Document Photos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              
              {/* Passport Size Photo Box */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-bold text-gray-600 mb-3">Passport Size Photo <span className="text-red-600">*</span></label>
                <div className="relative w-36 h-48 bg-white border-4 border-white shadow-md rounded-md overflow-hidden group">
                  <img src={passportPreview} alt="Passport Sample" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                    <i className="fas fa-cloud-upload-alt text-white text-2xl mb-1"></i>
                    <span className="text-[10px] text-white font-bold">UPLOAD</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setPassportPreview)} required />
                  </label>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">Format: Portrait (JPG/PNG)</p>
              </div>

              {/* Iqama Card Photo Box */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-bold text-gray-600 mb-3">Iqama Expire Date Image(Absher) </label>
                <div className="relative w-full max-w-[320px] h-48 bg-white border-4 border-white shadow-md rounded-md overflow-hidden group">
                  {/* এখানে iqamaPreview এখন ডিফল্ট ইমেজ দেখাবে */}
                  <img src={iqamaPreview} alt="Iqama Sample" className="w-full h-full object-contain bg-gray-100" />
                  <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                    <i className="fas fa-camera text-white text-3xl mb-1"></i>
                    <span className="text-xs text-white font-bold">UPLOAD CARD</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setIqamaPreview)} required />
                  </label>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">Format: Horizontal (Clear View)</p>
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button 
  type="submit" 
  className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-xl active:scale-95 flex items-center justify-center"
>
  <i className="fas fa-user-plus mr-3"></i> COMPLETE REGISTRATION
</button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}