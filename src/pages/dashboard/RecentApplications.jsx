import React from "react";

export default function RecentApplications({
  title = "Recent Applications",
  subtitle = "Latest activity overview",
  viewAllHref = "/dashboard/applications",
  rows = [],
}) {
  return (
    <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200">
      <div className="p-4 md:p-5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <div className="font-semibold text-[#071A3A]">{title}</div>
          <div className="text-xs text-slate-500">{subtitle}</div>
        </div>
        <a href={viewAllHref} className="text-sm font-semibold text-[#0B4BFF] hover:underline">
          View all
        </a>
      </div>

      <div className="p-4 md:p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="text-left py-2.5 font-semibold">ID</th>
              <th className="text-left py-2.5 font-semibold">Name</th>
              <th className="text-left py-2.5 font-semibold">Service</th>
              <th className="text-left py-2.5 font-semibold">Status</th>
              <th className="text-right py-2.5 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="text-slate-700">
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100">
                <td className="py-3 font-medium">{r.id}</td>
                <td className="py-3">{r.name}</td>
                <td className="py-3">{r.service}</td>
                <td className="py-3">
                  <StatusPill status={r.status} />
                </td>
                <td className="py-3 text-right">
                  <a
                    href={r.viewHref || `/dashboard/applications/${r.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    View <ArrowIcon />
                  </a>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusPill({ status }) {
  const map = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const cls = map[status] || "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-xl border text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
