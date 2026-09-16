import { useEffect } from "react";
import residence from "../../public/frontsite/muqeem.png"
// import slide5 from "../../public/frontsite/slide5.jpg"
export default function Home() {
  // Flowbite JS load (optional)
  // useEffect(() => {
  //   const flowbite = document.createElement("script");
  //   flowbite.src =
  //     "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.js";
  //   flowbite.async = true;
  //   document.body.appendChild(flowbite);

  //   return () => {
  //     document.body.removeChild(flowbite);
  //   };
  //   initFlowbite()
  // }, []);

  useEffect(() => {
    // ১. স্ক্রিপ্ট তৈরি করা
    const flowbiteScript = document.createElement("script");
    flowbiteScript.src = "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.js";
    flowbiteScript.async = true;
    
    // ২. স্ক্রিপ্ট লোড হওয়ার পর Flowbite ইনিশিয়ালাইজ করার ফাংশন
    flowbiteScript.onload = () => {
      if (window.initFlowbite) {
        window.initFlowbite();
      }
    };

    document.body.appendChild(flowbiteScript);

    // cleanup function
    return () => {
      if (document.body.contains(flowbiteScript)) {
        document.body.removeChild(flowbiteScript);
      }
    };
  }, []);
  const subser = (link) => {
    window.location.href = link;
  };

  return (
    <>
      {/* HEAD equivalent assets (React index.html এ রাখাই best) */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <div className="font-[sans-serif]">
        {/* Notice */}
        <div className="flex bg-blue-400 justify-between items-center">
          <h1 className="bg-[#e12454] text-white w-20 px-4 py-1 md:py-2 font-semibold [clip-path:polygon(0_0,100%_0,84%_100%,0%_100%)]">
            Notice
          </h1>
          <marquee className="py-1 text-white">
            This is notice Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quibusdam est tempora, quae nisi rem quisquam nam nihil ab
            ducimus adipisci.
          </marquee>
        </div>

        {/* Navbar */}
        <nav className="flex items-center justify-between w-full relative px-2 mt-2 md:px-7 shadow-md border-b-2 sticky top-0 z-50 bg-white">
          <div className="flex items-center gap-4">
            <img
              src="/frontsite/logo.jpeg"
              alt="logo"
              className="w-[60px] max-w-full"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#424242]">
                Bangladeshi Studeo
              </h1>
              <p className="text-[#424242]">is Trusted Document Site.</p>
            </div>
          </div>

          {/* Desktop Menu (static) */}
          <ul className="items-center gap-5 text-base text-[#424242] md:flex hidden font-semibold">
            <li className="hover:border-b-[#e12454] border-b-2 border-transparent transition-all duration-500 cursor-pointer capitalize">
              home
            </li>
            <li className="hover:border-b-[#e12454] border-b-2 border-transparent transition-all duration-500 cursor-pointer capitalize">
              about us
            </li>
            <li className="hover:border-b-[#e12454] border-b-2 border-transparent transition-all duration-500 cursor-pointer capitalize">
              services
            </li>
            <li className="hover:border-b-[#e12454] border-b-2 border-transparent transition-all duration-500 cursor-pointer capitalize">
              about us
            </li>
            <li className="hover:border-b-[#e12454] border-b-2 border-transparent transition-all duration-500 cursor-pointer capitalize">
              login
            </li>
          </ul>

          {/* Mobile Toggle (আপনার script.js এর বদলে React state দিয়ে করা যায়—এখন static রাখলাম) */}
          <button className="md:hidden flex cursor-pointer transition-transform duration-300 ease-in-out">
            <svg
              className="w-7 h-7 text-[#424242]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>

        {/* Slider (Flowbite Carousel) */}
        <div id="default-carousel" className="relative w-full" data-carousel="slide">
          <div className="relative h-56 overflow-hidden rounded-lg md:h-96 lg:h-[70vh]">
            {/* <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src={slide5}
                className="w-full h-full object-contain block"
                alt="slide1"
              />
            </div> */}
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/frontsite/slide4.jpg"
                className="w-full h-full object-contain block"
                alt="slide2"
              />
            </div>
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/frontsite/slide1.jpg"
                className="w-full h-full object-contain block"
                alt="slide3"
              />
            </div>
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/frontsite/slide2.jpg"
                className="w-full h-full object-contain block"
                alt="slide4"
              />
            </div>
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/frontsite/slide3.jpg"
                className="w-full h-full object-contain block"
                alt="slide5"
              />
            </div>
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src="/frontsite/slide6.jpg"
                className="w-full h-full object-contain block"
                alt="slide6"
              />
            </div>
          </div>

          {/* indicators */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                className="w-2 h-2 rounded-full"
                aria-label={`Slide ${i + 1}`}
                data-carousel-slide-to={i}
              />
            ))}
          </div>

          {/* controls */}
          <button
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev
          >
            <span className="inline-flex items-center justify-center w-6 md:w-10 h-6 md:h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg
                className="w-2 md:w-4 h-2 md:h-4 text-white rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>

          <button
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next
          >
            <span className="inline-flex items-center justify-center w-6 md:w-10 h-6 md:h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg
                className="w-2 md:w-4 h-2 md:h-4 text-white rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>

        {/* Services */}
        <div className="my-5 md:my-7 lg:my-9">
          <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-center mb-6 text-[#222222]">
            Our Services
          </h1>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 justify-items-center gap-6 w-[90%] mx-auto">
            {/* 1 */}
            <div
              onClick={() => subser("#")}
              className="w-[95px] md:w-[120px] lg:w-[140px] h-[95px] md:h-[120px] lg:h-[140px] relative overflow-hidden cursor-pointer rounded-md"
            >
              <img
                src="/frontsite/medical_logo.png"
                alt="Medical Certificate"
                className="w-full h-full object-cover scale-[1.1] transition-all duration-700"
              />
              <div className="absolute top-1/2 left-0 w-full h-full transform -translate-y-1/2 z-20 flex items-center justify-center flex-col transition-all duration-500">
                <h1 className="text-base font-bold text-center capitalize text-white">
                  Medical Certificate
                </h1>
                <i className="fa-solid fa-square-arrow-up-right text-[18px] mt-4 text-[#b4f079d2]" />
              </div>
              <div className="w-full h-full absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/50" />
            </div>

            {/* 2 */}
            <div className="w-[95px] md:w-[120px] lg:w-[140px] h-[95px] md:h-[120px] lg:h-[140px] relative overflow-hidden cursor-pointer rounded-md">
              <img
                src="/frontsite/cv_logo.png"
                alt="CV"
                className="w-full h-full object-cover scale-[1.1] transition-all duration-700"
              />
              <div className="absolute top-1/2 left-0 w-full h-full transform -translate-y-1/2 z-20 flex items-center justify-center flex-col transition-all duration-500">
                <h1 className="text-base font-bold text-center capitalize text-white">
                  CV
                </h1>
                <i className="fa-solid fa-square-arrow-up-right text-[18px] mt-4 text-[#b4f079d2]" />
              </div>
              <div className="w-full h-full absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/50" />
            </div>

            {/* 3 */}
            <div
              onClick={() => subser("https://bangladeshistudeo.com/muqeemUser")}
              className="w-[95px] md:w-[120px] lg:w-[140px] h-[95px] md:h-[120px] lg:h-[140px] relative overflow-hidden cursor-pointer rounded-md"
            >
              <img
                src={residence}
                alt="Muqeem"
                className="w-full h-full object-cover scale-[1.1] transition-all duration-700"
              />
              <div className="absolute top-1/2 left-0 w-full h-full transform -translate-y-1/2 z-20 flex items-center justify-center flex-col transition-all duration-500">
                <h1 className="text-base font-bold text-center capitalize text-white">
                  Muqeem
                </h1>
                <i className="fa-solid fa-square-arrow-up-right text-[18px] mt-4 text-[#b4f079d2]" />
              </div>
              <div className="w-full h-full absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/50" />
            </div>

            {/* বাকিগুলো residence placeholder */}
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="w-[95px] md:w-[120px] lg:w-[140px] h-[95px] md:h-[120px] lg:h-[140px] relative overflow-hidden cursor-pointer rounded-md"
              >
                <img
                  src={residence}
                  alt="Residence"
                  className="w-full h-full object-cover scale-[1.1] transition-all duration-700"
                />
                <div className="absolute top-1/2 left-0 w-full h-full transform -translate-y-1/2 z-20 flex items-center justify-center flex-col transition-all duration-500">
                  <h1 className="text-base font-bold text-center capitalize text-white">
                    Residence
                  </h1>
                  <i className="fa-solid fa-square-arrow-up-right text-[18px] mt-4 text-[#b4f079d2]" />
                </div>
                <div className="w-full h-full absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/50" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#111111] w-full sm:p-9 pt-5">
          <div className="flex items-center justify-between px-6 md:px-24 mb-7">
            <div className="flex items-center gap-4">
              <img
                src="/frontsite/logo.jpeg"
                alt="logo"
                className="w-[60px] rounded-full max-w-full"
              />
              <div className="hidden md:flex flex-col">
                <h1 className="text-xl md:text-2xl font-semibold text-white">
                  Bangladeshi Studeo
                </h1>
                <p className="text-[#b1aaaa]">is Trusted Document Site.</p>
              </div>
            </div>

            <div className="flex gap-4 text-2xl md:text-3xl mt-4">
              <i className="fab fa-facebook text-[#0866FF] hover:scale-125 transition-all" />
              <i className="fab fa-instagram text-[#E1306C] hover:scale-125 transition-all" />
              <i className="fab fa-linkedin text-[#0A66C2] hover:scale-125 transition-all" />
              <i className="fab fa-youtube text-[#FF0000] hover:scale-125 transition-all" />
              <i className="fa-brands fa-x-twitter text-[#E7ECF0] hover:scale-125 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-24">
            <div className="w-full">
              <h3 className="text-xl font-semibold text-white mb-2">Reach Us</h3>
              <div className="flex flex-col gap-3 text-[#999999]">
                <div className="flex items-center gap-2">
                  <i className="fas fa-phone text-[#b4f079d2]" />
                  <span>+96650775447</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-[#b4f079d2]" />
                  <span>Dammam Al Jubail KSA</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-envelope text-[#b4f079d2]" />
                  <span>bangladeshistudeo@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-2">Services</h3>
              <div className="flex flex-col gap-2 text-[#999999]">
                <p className="hover:text-blue-500 cursor-pointer transition-all duration-200">
                  Service Name
                </p>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-2">Links</h3>
              <div className="flex flex-col gap-2 text-[#999999]">
                <p className="hover:text-blue-500 cursor-pointer transition-all duration-200">
                  Home
                </p>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-2">
                Contact Us
              </h3>
              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
                <textarea
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  placeholder="Message"
                />
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-all">
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center mt-8">
            <i className="fab fa-cc-visa text-2xl md:text-4xl text-[#082fca]" />
            <i className="fab fa-cc-discover text-2xl md:text-4xl text-[#e87800]" />
            <i className="fab fa-cc-mastercard text-2xl md:text-4xl text-[#e3001b]" />
            <i className="fab fa-cc-paypal text-2xl md:text-4xl text-[#00aee3]" />
            <i className="fab fa-cc-amazon-pay text-2xl md:text-4xl text-[#b4f079d2]" />
            <i className="fa-brands fa-apple-pay text-2xl md:text-5xl text-[#767775d2]" />
            <i className="fa-brands fa-google-pay text-2xl md:text-5xl text-[#b7e7a0d2]" />
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-500">Copyright © 2025 Bangladesh Studeo.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
