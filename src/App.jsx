import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Home from "./pages/Home.jsx";
import Employeform from "./pages/employe/EmployeeForm.jsx";
import DashBoardIndex from "./pages/dashboard/Index.jsx";
import AddNewsDpn from "./pages/dashboard/AddNewsDpn.jsx";
import SearchSDPN from "./pages/dashboard/SearchSdpn.jsx";
import AgentList from "./pages/dashboard/AgentList";
import Muqeempdf from "./pages/dashboard/muqeem/Muqeempdf.jsx";
import MuqeemEnglish from "./pages/dashboard/muqeem/MuqeemEnglish.jsx";
import MuqeemArabic from "./pages/dashboard/muqeem/MuqeemArabic.jsx";
import MuqeemBusiness from "./pages/dashboard/muqeem/MuqeemBusiness.jsx";
import MuqeemSearch from "./pages/dashboard/muqeem/MuqeemSearch.jsx";
import MedicalReportCreate from "./pages/dashboard/medical/MedicalReportCreate.jsx";
import MedicalReportSearch from "./pages/dashboard/medical/MedicalReportSearch.jsx";
import Document from "./pages/dashboard/document/DocumentManagement.jsx";
import VisaForm from "./pages/dashboard/visa/VisaCreate.jsx";
import NewAzeer from "./pages/dashboard/ajeer/NewAzeer.jsx";
import NewMuqim from "./pages/dashboard/muqim/NewMuqim.jsx";
// 
import Logout from "./Logout.jsx";


// user
import UserProfile from "./pages/user/UserProfile.jsx";

// protected route
import ProtectedRoute from "./ProtectedRoute.jsx";

function About() {
  return <h2 className="p-10 text-center text-2xl font-bold">About Page</h2>;
}

function NotFound() {
  return <h2 className="p-10 text-center text-2xl font-bold text-red-600">404 - Page Not Found</h2>;
}

export default function App() {
  return (
    <div>
      <Routes>
        {/* পাবলিক রাউটস (যে কেউ দেখতে পারবে) */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Login />} />
        <Route path="/employeform" element={<Employeform />} />
        <Route path="/about" element={<About />} />

        {/* ড্যাশবোর্ড রাউটস (শুধুমাত্র Admin/Agent এর জন্য) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashBoardIndex /></ProtectedRoute>} />
        <Route path="/dashboard/ajeer" element={<ProtectedRoute><NewAzeer /></ProtectedRoute>} />
        <Route path="/dashboard/muqim" element={<ProtectedRoute><NewMuqim /></ProtectedRoute>} />
        <Route path="/newsdpn" element={<ProtectedRoute><AddNewsDpn /></ProtectedRoute>} />
        <Route path="/SearchSDPN" element={<ProtectedRoute><SearchSDPN /></ProtectedRoute>} />
        <Route path="/dashboard/agents" element={<ProtectedRoute><AgentList /></ProtectedRoute>} />
        <Route path="/dashboard/muqeem/Muqeempdf" element={<ProtectedRoute><Muqeempdf /></ProtectedRoute>} />
        <Route path="/dashboard/muqeem/MuqeemEnglish" element={<ProtectedRoute><MuqeemEnglish /></ProtectedRoute>} />
        <Route path="/dashboard/muqeem/MuqeemArabic" element={<ProtectedRoute><MuqeemArabic /></ProtectedRoute>} />
        <Route path="/dashboard/muqeem/MuqeemBusiness" element={<ProtectedRoute><MuqeemBusiness /></ProtectedRoute>} />
        <Route path="/dashboard/muqeem/MuqeemSearch" element={<ProtectedRoute><MuqeemSearch /></ProtectedRoute>} />
        <Route path="/dashboard/medical/MedicalReportCreate" element={<ProtectedRoute><MedicalReportCreate /></ProtectedRoute>} />
        <Route path="/dashboard/medical/MedicalReportSearch" element={<ProtectedRoute><MedicalReportSearch /></ProtectedRoute>} />
        <Route path="/dashboard/document" element={<ProtectedRoute><Document /></ProtectedRoute>} />
        <Route path="/dashboard/visa" element={<ProtectedRoute><VisaForm /></ProtectedRoute>} />

        {/* ইউজার প্রোফাইল (শুধুমাত্র সাধারণ ইউজারের জন্য) */}
        <Route 
          path="/userProfile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />

        {/* ভুল ইউআরএল এর জন্য ৪MD৪ */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}