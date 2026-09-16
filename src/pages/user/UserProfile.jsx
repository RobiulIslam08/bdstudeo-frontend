import React from 'react';
import Header from './Header'; // হেডার ইম্পোর্ট
import Footer from './Footer'; // ফুটার ইম্পোর্ট

const UserProfile = ({ userData, userDocuments = [] }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ১. হেডার এখানে থাকবে */}
      <Header />

      {/* ২. মেইন কন্টেন্ট (প্রোফাইল বডি) */}
      <main className="flex-grow bg-gray-50"> 
        <div className="max-w-6xl mx-auto px-3 md:px-0 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* বাম পাশের প্রোফাইল কার্ড */}
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-36 h-36 rounded-full bg-red-600 text-white flex items-center justify-center text-3xl font-bold">
                  {userData?.fname ? userData.fname[0].toUpperCase() : 'U'}
                </div>
                <h2 className="mt-4 text-lg font-bold">{userData?.fname}</h2>
                {/* ... বাকি প্রোফাইল কোড ... */}
              </div>
            </div>

            {/* ডান পাশের ডকুমেন্ট লিস্ট */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
              <h3 className="font-semibold text-gray-800 mb-4">Completed Documents</h3>
              {/* ... আপনার ডকুমেন্ট লুপ ... */}
            </div>

          </div>
        </div>
      </main>

      {/* ৩. ফুটার এখানে থাকবে */}
      <Footer />
    </div>
  );
};

export default UserProfile;