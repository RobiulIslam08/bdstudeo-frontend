import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    terms: false,
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await axios.post('http://localhost:8000/api/register', formData);

        if (response.data.status === 'success') {
            const userData = response.data.user;

            // ১. LocalStorage-এ ইউজার ডাটা সেভ করা
            localStorage.setItem('user', JSON.stringify(userData));

            // ২. রোল অনুযায়ী রিডাইরেক্ট করা
            if (userData.role === "User") {
                navigate('/userProfile');
            } else {
                navigate('/dashboard');
            }

            alert("Registration Successful! Welcome, " + userData.name);
        }
    } catch (error) {
        // ভ্যালিডেশন এরর হ্যান্ডলিং
        const errorMsg = error.response?.data?.message || "Registration failed. Try again.";
        alert(errorMsg);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md my-8">
        {/* Brand / Logo */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#1E40AF]">
            BangladeshiStudio
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100">
          <img 
            className="w-[50px] h-[50px] mx-auto mb-4 object-contain" 
            src="/frontsite/logo.jpeg" 
            alt="Logo" 
          />
          
          <h2 className="text-xl font-semibold text-gray-800 mb-1 text-center">
            Create Account
          </h2>
          <p className="text-xs text-gray-500 text-center mb-6">
            Please fill in the details to create your account
          </p>

          {/* Alert Message */}
          {message.text && (
            <div className={`mb-4 p-3 text-sm text-white rounded-lg text-center ${
              message.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <i className="fa-regular fa-user text-xs"></i>
                        </span>
                        <input
                            type="text"
                            name="fname"
                            required
                            value={formData.fname}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] outline-none text-sm"
                            placeholder="First name"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <i className="fa-regular fa-user text-xs"></i>
                        </span>
                        <input
                            type="text"
                            name="lname"
                            required
                            value={formData.lname}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] outline-none text-sm"
                            placeholder="Last name"
                        />
                    </div>
                </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <i className="fa-regular fa-envelope text-xs"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] outline-none text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <i className="fa-solid fa-phone text-xs"></i>
                </span>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] outline-none text-sm"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <i className="fa-solid fa-lock text-xs"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] outline-none text-sm"
                  placeholder="Create a password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <i className="fa-solid fa-lock text-xs"></i>
                </span>
                <input
                  type="password"
                  name="password_confirmation"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1E40AF] outline-none text-sm"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center text-xs text-gray-600">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={formData.terms}
                onChange={handleChange}
                className="h-3.5 w-3.5 text-[#1E40AF] border-gray-300 rounded focus:ring-[#1E40AF]"
              />
              <label htmlFor="terms" className="ml-2">
                I agree to the <a href="#" className="text-[#1E40AF] hover:underline">Terms & Conditions</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold rounded-lg bg-[#16A34A] hover:bg-green-600 text-white shadow-sm transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>

            {/* Separator */}
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-xs text-gray-400 uppercase">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-xs font-medium hover:bg-gray-50 transition">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="16" alt="Google" />
                <span>Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-xs font-medium hover:bg-gray-50 transition">
                <i className="fa-brands fa-facebook-f text-blue-600"></i>
                <span className="ml-1">Facebook</span>
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#1E40AF] hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-gray-400 uppercase tracking-widest">
          © {new Date().getFullYear()} BangladeshiStudio.com • Secure Registration
        </p>
      </div>
    </div>
  );
};

export default Register;