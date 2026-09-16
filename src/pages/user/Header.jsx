import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'home', link: '/user/profile' },
    { name: 'about us', link: '/about' },
    { name: 'services', link: '/services' },
  ];

  return (
    <div className="font-[sans-serif]">
      {/* Notice Marquee */}
      <div className="flex bg-[#60a5fa] justify-between items-center">
        <h1 className="bg-[#e12454] text-white w-20 px-4 py-1 md:py-2 font-semibold [clip-path:polygon(0_0,100%_0,84%_100%,0%_100%)]">
          Notice
        </h1>
        <marquee className="py-1 text-white">
          This is notice Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Quibusdam est tempora, quae nisi rem quisquam nam nihil ab ducimus adipisci.
        </marquee>
      </div>

      {/* Main Navigation */}
      <nav className="flex items-center justify-between w-full relative px-2 mt-2 md:px-7 shadow-md border-b-2 sticky top-0 z-50 bg-white">
        <div className="flex items-center gap-4 py-2">
          <img src={logo} alt="BD Studeo logo" className="w-[60px] max-w-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#424242]">BD Studeo</h1>
            <p className="text-[#424242] text-xs md:text-sm">is Trusted Document Site.</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="items-center gap-5 text-base text-[#424242] md:flex hidden font-semibold">
          {navLinks.map((item, idx) => (
            <li key={idx} className="hover:border-b-[#e12454] border-b-2 border-transparent transition-all duration-500 cursor-pointer capitalize">
              <a href={item.link}>{item.name}</a>
            </li>
          ))}
          <li className="hover:border-b-[#e12454] border-b-2 border-transparent transition-all duration-500 cursor-pointer capitalize text-red-600">
            <a href="/logout">Logout</a>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex cursor-pointer transition-transform duration-300 ease-in-out"
        >
          {isMenuOpen ? (
            <svg className="w-7 h-7 text-[#424242]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-7 h-7 text-[#424242]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`absolute top-[70px] right-0 w-[200px] bg-white border-l shadow-lg transition-all duration-300 transform ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'} md:hidden`}>
          <ul className="flex flex-col text-[#424242]">
            {navLinks.map((item, idx) => (
              <li key={idx} className="w-full hover:bg-gray-50 border-b p-3 cursor-pointer capitalize">
                <a href={item.link}>{item.name}</a>
              </li>
            ))}
            <li className="w-full hover:bg-red-50 p-3 cursor-pointer capitalize text-red-600">
               <a href="/logout">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;