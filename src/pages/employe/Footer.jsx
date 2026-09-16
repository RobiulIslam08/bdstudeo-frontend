export default function Footer() {
  return (
    <footer className="bg-[#111111] w-full sm:p-9 pt-5">
      <div className="flex items-center justify-between px-6 md:px-24 mb-7 border-b border-gray-800 pb-8">
        <div className="flex items-center gap-4">
          <img src="/frontsite/logo.jpeg" alt="logo" className="w-[60px] rounded-full" />
          <div className="hidden md:flex flex-col text-white">
            <h1 className="text-xl font-semibold">Bangladeshi Studeo</h1>
            <p className="text-[#b1aaaa] text-xs">is Trusted Document Site.</p>
          </div>
        </div>
        <div className="flex gap-4 text-2xl text-white">
          <i className="fab fa-facebook text-[#0866FF]" />
          <i className="fab fa-instagram text-[#E1306C]" />
          <i className="fab fa-youtube text-[#FF0000]" />
        </div>
      </div>
      <p className="text-gray-500 text-center text-sm">Copyright © 2025 Bangladesh Studeo.</p>
    </footer>
  );
}