import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // LocalStorage থেকে ইউজার ডাটা চেক করা
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // যদি ইউজার লগইন না করা থাকে, তবে তাকে লগইন পেজে পাঠিয়ে দেবে
        return <Navigate to="/login" replace />;
    }

    // লগইন করা থাকলে ওই পেজটি দেখাবে
    return children;
};

export default ProtectedRoute;