export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="flex bg-blue-400 justify-between items-center">
        <h1 className="bg-[#e12454] text-white w-20 px-4 py-1 md:py-2 font-semibold [clip-path:polygon(0_0,100%_0,84%_100%,0%_100%)]">
          Notice
        </h1>
        <marquee className="py-1 text-white">
          This is notice Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </marquee>
      </div>

      <nav className="flex items-center justify-between w-full relative px-2 mt-0 md:px-7 shadow-md border-b-2 bg-white py-2">
        <div className="flex items-center gap-4">
          <img src="/frontsite/logo.jpeg" alt="logo" className="w-[60px] max-w-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#424242]">Bangladeshi Studeo</h1>
            <p className="text-[#424242] text-sm">is Trusted Document Site.</p>
          </div>
        </div>
        <ul className="items-center gap-5 text-base text-[#424242] md:flex hidden font-semibold">
          <li className="hover:text-[#e12454] cursor-pointer capitalize">home</li>
          <li className="hover:text-[#e12454] cursor-pointer capitalize">about us</li>
          <li className="hover:text-[#e12454] cursor-pointer capitalize">services</li>
          <li className="hover:text-[#e12454] cursor-pointer capitalize">login</li>
        </ul>
      </nav>
    </header>
  );
}