import React from 'react';
import logo from '../../assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-[#111111] w-full sm:p-9 pt-10">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-24 mb-10 gap-6">
        <div className="flex items-center gap-4">
          <img src={logo} alt="BD Studeo logo" className="w-[60px] rounded-full" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-semibold text-white">BD Studeo</h1>
            <p className="text-[#b1aaaa] text-sm">is Trusted Document Site.</p>
          </div>
        </div>
        <div className="flex gap-6 text-2xl md:text-3xl">
          <i className="fab fa-facebook text-[#0866FF] hover:scale-125 transition-all cursor-pointer"></i>
          <i className="fab fa-instagram text-[#E1306C] hover:scale-125 transition-all cursor-pointer"></i>
          <i className="fab fa-linkedin text-[#0A66C2] hover:scale-125 transition-all cursor-pointer"></i>
          <i className="fab fa-youtube text-[#FF0000] hover:scale-125 transition-all cursor-pointer"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-24">
        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Reach Us</h3>
          <div className="flex flex-col gap-3 text-[#999999] text-sm">
            <div className="flex items-center gap-3"><i className="fas fa-phone text-[#b4f079]"></i><span>01323090887</span></div>
            <div className="flex items-center gap-3"><i className="fas fa-map-marker-alt text-[#b4f079]"></i><span>Sherpur, Mymensingh, Bangladesh</span></div>
            <div className="flex items-center gap-3"><i className="fas fa-envelope text-[#b4f079]"></i><span>bangladeshistudeo@gmail.com</span></div>
          </div>
        </div>

        {/* Services */}
        <div className="text-left">
          <h3 className="text-xl font-semibold text-white mb-4">Services</h3>
          <div className="flex flex-col gap-2 text-[#999999]">
            <p className="hover:text-blue-400 cursor-pointer transition-all">Document Processing</p>
            <p className="hover:text-blue-400 cursor-pointer transition-all">Online TopUp</p>
          </div>
        </div>

        {/* Links */}
        <div className="text-left">
          <h3 className="text-xl font-semibold text-white mb-4">Links</h3>
          <div className="flex flex-col gap-2 text-[#999999]">
            <a href="/" className="hover:text-blue-400 transition-all">Home</a>
            <a href="/about" className="hover:text-blue-400 transition-all">About Us</a>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Name" className="w-full p-2 rounded bg-gray-800 text-white text-sm outline-none border border-gray-700 focus:border-blue-500"/>
            <input type="email" placeholder="Email" className="w-full p-2 rounded bg-gray-800 text-white text-sm outline-none border border-gray-700 focus:border-blue-500"/>
            <textarea className="w-full p-2 rounded bg-gray-800 text-white text-sm outline-none border border-gray-700 focus:border-blue-500" placeholder="Message" rows="2"></textarea>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-bold transition-all">Submit</button>
          </form>
        </div>
      </div>

      {/* Payment Icons */}
      <div className="flex flex-wrap gap-6 justify-center items-center mt-12 opacity-70">
        <i className="fab fa-cc-visa text-3xl text-white"></i>
        <i className="fab fa-cc-mastercard text-3xl text-white"></i>
        <i className="fab fa-cc-paypal text-3xl text-white"></i>
        <i className="fa-brands fa-apple-pay text-4xl text-white"></i>
        <i className="fa-brands fa-google-pay text-4xl text-white"></i>
      </div>

      <div className="border-t border-gray-800 mt-8 py-6 text-center">
        <p className="text-gray-500 text-sm">Copyright © 2025 Bangladesh Studeo.</p>
      </div>
    </footer>
  );
};

export default Footer;