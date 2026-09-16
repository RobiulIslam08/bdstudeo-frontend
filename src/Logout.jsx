import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // ১. ডাটা ক্লিয়ার করা
        localStorage.removeItem('user');

        // ২. লগইন পেজে পাঠিয়ে দেওয়া
        // replace: true দিলে ইউজার ব্যাক বাটন চেপে আর ফিরতে পারবে না
        navigate('/login', { replace: true });
        
        // ঐচ্ছিক: স্টেট পুরো ক্লিন করতে চাইলে রিফ্রেশ করতে পারেন
        // window.location.reload(); 
    }, [navigate]);

    return null; // এই পেজে কিছু দেখানোর প্রয়োজন নেই
};

export default Logout;