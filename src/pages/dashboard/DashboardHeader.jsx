import React, { useMemo, useState } from "react";
import logo from "../../assets/logo.jpg";

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");

  const navItems = useMemo(() => {
    return [
      { key: "Home", label: "Home", icon: "home", href: "/dashboard" },
      { key: "NewAzeer", label: "New Azeer", icon: "fileText", href: "/dashboard/ajeer" },
      { key: "NewMuqim", label: "New Muqim", icon: "idCard", href: "/dashboard/muqim" },

      {
        key: "Image",
        label: "Image",
        icon: "layers",
        children: [
          { label: "New Image", href: "/newsdpn" },
          { label: "search Image", href: "/SearchSDPN" },
          
        ],
      },

      {
        key: "Muqeem",
        label: "Muqeem",
        icon: "layers",
        children: [
          { label: "Muqeem PDF", href: "/dashboard/muqeem/Muqeempdf" },
          { label: "Muqeem English", href: "/dashboard/muqeem/MuqeemEnglish" },
          { label: "Muqeem Arabic", href: "/dashboard/muqeem/MuqeemArabic" },
          { label: "Muqeem Business", href: "/dashboard/muqeem/MuqeemBusiness" },
          { label: "Search Muqeem", href: "/dashboard/muqeem/MuqeemSearch" },
        ],
      },

      {
        key: "medical",
        label: "Medical Report",
        icon: "fileText",
        children: [
          { label: "Create Report", href: "/dashboard/medical/MedicalReportCreate" },
          { label: "Search Report", href: "/dashboard/medical/MedicalReportSearch" },
        ],
      },

      { key: "users", label: "Document", icon: "folder", href: "/dashboard/document" },
      { key: "visa", label: "Visa", icon: "idCard", href: "/dashboard/visa" },
      { key: "agents", label: "Agent List", icon: "users", href: "/dashboard/agents" },
      { key: "logout", label: "Log Out", icon: "logout", href: "/logout" },
    ];
  }, []);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? "" : key));
  };
   
const Role = user.role || "No Title Found";
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "no-print fixed z-50 md:z-30 top-0 left-0 h-full w-[280px] bg-[#071A3A] text-white",
          "border-r border-white/10",
          "transform transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="h-[68px] px-5 flex items-center gap-3 border-b border-white/10">
          <img
            src={logo}
            alt="BD Studeo logo"
            className="w-10 h-10 rounded-xl object-cover bg-white/10"
          />
          <div className="leading-tight">
            <div className="font-semibold">BD Studeo</div>
            <div className="text-xs text-slate-200/80">Dashboard Panel</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="px-3 py-4 overflow-y-auto h-[calc(100%-68px)]">
          <div className="text-xs uppercase tracking-wider text-slate-200/70 px-3 mb-2">
            Main Menu
          </div>

          <ul className="space-y-1">
            {navItems.map((item) => {
              const hasChildren = Array.isArray(item.children);
              const isOpen = openDropdown === item.key;

              return (
                <li key={item.key}>
                  {!hasChildren ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition"
                    >
                      <Icon name={item.icon} />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  ) : (
                    <div className="rounded-xl">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item.key)}
                        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition"
                      >
                        <span className="flex items-center gap-3">
                          <Icon name={item.icon} />
                          <span className="font-medium">{item.label}</span>
                        </span>
                        <ChevronDown rotated={isOpen} />
                      </button>

                      <div
                        className={[
                          "grid overflow-hidden transition-all duration-300",
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70",
                        ].join(" ")}
                      >
                        <div className="min-h-0">
                          <div className="pl-3 pr-2 pb-2">
                            <div className="ml-6 mt-2 space-y-1 border-l border-white/10 pl-3">
                              {item.children.map((c) => (
                                <a
                                  key={c.href + c.label}
                                  href={c.href}
                                  className="block px-3 py-2 rounded-lg text-sm text-slate-100/90 hover:bg-white/10 transition"
                                >
                                  {c.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Top Header */}
      <header className="no-print sticky top-0 z-20 bg-white border-b border-slate-200 md:pl-[280px]">
        <div className="h-[68px] px-4 md:px-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 grid place-items-center"
            aria-label="Open menu"
          >
            <Hamburger />
          </button>

          <div className="flex items-center gap-3 min-w-[180px]">
            <div className="w-10 h-10 rounded-xl bg-[#0B4BFF]/10 grid place-items-center border border-[#0B4BFF]/20">
              <span className="font-bold text-[#0B4BFF]">BS</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-[#071A3A] leading-tight">{title}</div>
              <div className="text-xs text-slate-500">Trusted Document Site</div>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-[560px]">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search services, applications, users..."
                  className="w-full h-11 pl-10 pr-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4BFF]/25"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 hover:bg-slate-50">
              <BellIcon />
              <span className="text-sm font-medium">Alerts</span>
            </button>

            <div className="flex items-center gap-2 h-10 px-2 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#071A3A] text-white grid place-items-center text-sm font-semibold">
                A
              </div>
              <div className="hidden md:block leading-tight pr-2">
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-slate-500">{Role}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="azeer-print-main p-4 md:p-6 md:pl-[280px]">{children}</main>

      {/* Footer */}
      <div className="no-print text-xs text-slate-500 pb-6 md:pl-[280px] px-4 md:px-6">
        © {new Date().getFullYear()} Bangladeshistudeo — Dashboard UI
      </div>
    </div>
  );
}

/* ===== Icons ===== */
function Hamburger() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M10.5 19a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Z" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ChevronDown({ rotated }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={`transition-transform ${rotated ? "rotate-180" : ""}`}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Icon({ name }) {
  const base = "stroke-current";
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    className: "shrink-0 opacity-95",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (name === "home") {
    return (
      <svg {...common}>
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v7H4a1 1 0 0 1-1-1v-10.5Z" />
      </svg>
    );
  }

  if (name === "image") {
    return (
      <svg {...common}>
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m21 16-5.5-5.5a1 1 0 0 0-1.4 0L7 17" />
      </svg>
    );
  }

  if (name === "layers") {
    return (
      <svg {...common}>
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m3 12 9 5 9-5" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m3 16 9 5 9-5" />
      </svg>
    );
  }

  if (name === "fileText") {
    return (
      <svg {...common}>
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v5h5" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 13h8M8 17h6M8 9h4" />
      </svg>
    );
  }

  if (name === "folder") {
    return (
      <svg {...common}>
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      </svg>
    );
  }

  if (name === "idCard") {
    return (
      <svg {...common}>
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 11h5M8 15h8" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg {...common}>
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 21v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 21v-1a4 4 0 0 0-3-3.87" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg {...common}>
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 7V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 12H3" />
        <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9-3 3 3 3" />
      </svg>
    );
  }

  // fallback
  return (
    <svg {...common}>
      <path className={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
    </svg>
  );
}
