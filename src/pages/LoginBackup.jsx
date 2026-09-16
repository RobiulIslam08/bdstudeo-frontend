import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    // --- লজিক: অলরেডি লগইন থাকলে এই পেজ থেকে বের করে দেওয়া ---
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const userData = JSON.parse(loggedInUser);
            if (userData.role === "User") {
                navigate('/userProfile', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: '', message: '' });

        try {
            const response = await axios.post('/login', credentials);

            if (response.data.status === 'success') {
                const userData = response.data.user;

                // ডাটা লোকাল স্টোরেজে সেভ করা
                localStorage.setItem('user', JSON.stringify(userData));

                // সাকসেস মেসেজ দেখানো
                setAlert({ type: 'success', message: `Welcome back, ${userData.name || 'User'}!` });

                // ১.৫ সেকেন্ড পর রিডাইরেক্ট
                setTimeout(() => {
                    if (userData.role === "User") {
                        navigate('/userProfile');
                    } else {
                        navigate('/dashboard');
                    }
                }, 1500);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Invalid credentials. Please try again.";
            setAlert({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md">
                {/* Brand / Logo */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-[#1E40AF]">
                        BD Studeo
                    </h1>
                </div>

                {/* Card */}
                <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
                    <img 
                        className="w-[60px] h-[60px] mx-auto mb-4 rounded-full object-cover border" 
                        src={logo}
                        alt="BD Studeo logo"
                    />
                    
                    <h2 className="text-xl font-semibold text-gray-800 mb-1 text-center">
                        Login
                    </h2>
                    <p className="text-xs text-gray-500 text-center mb-6">
                        Please login to continue to your account
                    </p>

                    {/* Alert Messages */}
                    {alert.message && (
                        <div className={`mb-4 p-3 text-sm text-white rounded-lg text-center animate-pulse ${
                            alert.type === 'error' ? 'bg-red-600' : 'bg-green-600'
                        }`}>
                            {alert.message}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email or Phone Number
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <i className="fa-regular fa-envelope text-sm"></i>
                                </span>
                                <input
                                    type="text"
                                    name="email"
                                    required
                                    value={credentials.email}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm transition-all"
                                    placeholder="Enter your email or phone"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <i className="fa-solid fa-lock text-sm"></i>
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-sm transition-all"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div className="flex justify-end mt-1">
                                <Link to="/forgot-password" title="reset password" className="text-xs text-[#1E40AF] hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-sm font-bold rounded-lg bg-[#1E40AF] hover:bg-blue-800 text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </span>
                            ) : 'Login'}
                        </button>

                        {/* Separator */}
                        <div className="flex items-center my-4">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="px-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">OR</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-xs font-semibold hover:bg-gray-50 transition"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="16" alt="Google" />
                                <span>Google</span>
                            </button>
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-xs font-semibold hover:bg-gray-50 transition"
                            >
                                <i className="fa-brands fa-facebook text-blue-600 text-sm"></i>
                                <span>Facebook</span>
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-[#16A34A] hover:underline">
                                Create a new account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <p className="mt-6 text-center text-[10px] text-gray-400 uppercase tracking-tighter">
                    © {new Date().getFullYear()} BD Studeo • Secure Login
                </p>
            </div>
        </div>
    );
};

export default Login;