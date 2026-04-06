"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  TrendingUp, TrendingDown, FileText, CheckCircle2,
  Clock, ChevronRight,
  ArrowUpRight,

} from "lucide-react";

/* ── Mock Data ── */
const MONTHLY = [
  { month: "জানু", রিপোর্ট: 18, সমাধান: 12 },
  { month: "ফেব্রু", রিপোর্ট: 24, সমাধান: 19 },
  { month: "মার্চ", রিপোর্ট: 31, সমাধান: 26 },
  { month: "এপ্রিল", রিপোর্ট: 22, সমাধান: 18 },
  { month: "মে", রিপোর্ট: 38, সমাধান: 30 },
  { month: "জুন", রিপোর্ট: 45, সমাধান: 39 },
];

const CATEGORY_DATA = [
  { name: "রাস্তা", value: 34, color: "#f59e0b" },
  { name: "বিদ্যুৎ", value: 22, color: "#3b82f6" },
  { name: "পানি", value: 18, color: "#06b6d4" },
  { name: "বর্জ্য", value: 14, color: "#10b981" },
  { name: "অন্যান্য", value: 12, color: "#8b5cf6" },
];

const WEEKLY = [
  { day: "সোম", রিপোর্ট: 4 },
  { day: "মঙ্গল", রিপোর্ট: 7 },
  { day: "বুধ", রিপোর্ট: 3 },
  { day: "বৃহস্পতি", রিপোর্ট: 9 },
  { day: "শুক্র", রিপোর্ট: 5 },
  { day: "শনি", রিপোর্ট: 11 },
  { day: "রবি", রিপোর্ট: 6 },
];

const RESOLUTION_TIME = [
  { name: "রাস্তা", সময়: 4.2, fill: "#f59e0b" },
  { name: "বিদ্যুৎ", সময়: 1.8, fill: "#3b82f6" },
  { name: "পানি", সময়: 3.1, fill: "#06b6d4" },
  { name: "বর্জ্য", সময়: 5.7, fill: "#10b981" },
  { name: "স্বাস্থ্য", সময়: 2.4, fill: "#ef4444" },
];

const RECENT_REPORTS = [
  { id: "NB-041", title: "মিরপুর ১০ এ বড় গর্ত", status: "solved", cat: "🛣️", time: "২ দিন আগে" },
  { id: "NB-038", title: "গুলশানে বিদ্যুৎ বিভ্রাট", status: "inprogress", cat: "⚡", time: "৩ দিন আগে" },
  { id: "NB-035", title: "লালবাগে ময়লার স্তূপ", status: "pending", cat: "🗑️", time: "৫ দিন আগে" },
  { id: "NB-031", title: "পানির লাইনে লিকেজ", status: "inprogress", cat: "💧", time: "৭ দিন আগে" },
];

const BADGES = [
  { icon: "🌟", label: "প্রথম রিপোর্ট", earned: true },
  { icon: "🔥", label: "৫ রিপোর্ট স্ট্রিক", earned: true },
  { icon: "💎", label: "১০ সমাধান", earned: true },
  { icon: "🏆", label: "টপ রিপোর্টার", earned: false },
  { icon: "⚡", label: "দ্রুত রেসপন্স", earned: false },
  { icon: "🎯", label: "১০০% নির্ভুল", earned: false },
];

const STATUS_CFG = {
  solved: { label: "সমাধান", color: "#16a34a", bg: "#f0fdf4" },
  inprogress: { label: "চলছে", color: "#2563eb", bg: "#eff6ff" },
  pending: { label: "অপেক্ষা", color: "#d97706", bg: "#fffbeb" },
};

const HEATMAP_DATA = Array.from({ length: 28 }).map(() => {
  const intensity = Math.floor(Math.random() * 5);
  const colors = ["#f1f5f9", "#bfdbfe", "#93c5fd", "#3b82f6", "#1d4ed8"];
  return { intensity, color: colors[intensity] };
});

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, sub, color, trend, trendVal }) {
  const up = trend === "up";
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${up ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"}`}>
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trendVal}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: "Sora, sans-serif" }}>{value}</div>
      <div className="text-sm font-semibold text-slate-600">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

/* ── Section Header ── */
function SectionHead({ title, sub, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div>
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {action && (
        <a href={action.href} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
          {action.label} <ChevronRight size={13} />
        </a>
      )}
    </div>
  );
}

/*OVERVIEW PAGE */
export default function OverviewPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email?.toLowerCase?.() || "";

  const [range, setRange] = useState("6m");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/complaints");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Failed to fetch reports");

        const mapped = (json.data || []).map((c) => ({
          ...c,
          status: c.status?.toLowerCase?.() || "pending",
          createdAt: c.createdAt ? new Date(c.createdAt) : null,
          updatedAt: c.updatedAt ? new Date(c.updatedAt) : null,
        }));

        const userOnly = userEmail
          ? mapped.filter((c) => c.email?.toLowerCase?.() === userEmail)
          : mapped;

        setReports(userOnly);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail !== "") {
      fetchReports();
    }
  }, [userEmail]);

  const total = reports.length;
  const solved = reports.filter((r) => r.status === "solved").length;
  const inprogress = reports.filter((r) => r.status === "inprogress").length;
  const pending = reports.filter((r) => r.status === "pending").length;
  const rejected = reports.filter((r) => r.status === "rejected").length;

  const pct = total ? Math.round((solved / total) * 100) : 0;

  const monthlyByMonth = {};
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleDateString("bn-BD", { month: "short" });
    monthlyByMonth[month] = { month, রিপোর্ট: 0, সমাধান: 0 };
  }

  reports.forEach((report) => {
    if (!report.createdAt) return;
    const month = report.createdAt.toLocaleDateString("bn-BD", { month: "short" });
    if (monthlyByMonth[month]) {
      monthlyByMonth[month].রিপোর্ট += 1;
      if (report.status === "solved") monthlyByMonth[month].সমাধান += 1;
    }
  });

  const dynamicMonthly = Object.values(monthlyByMonth);

  const weekCount = {
    সোম: 0, মঙ্গল: 0, বুধ: 0, বৃহস্পতি: 0, শুক্র: 0, শনি: 0, রবি: 0,
  };

  reports.forEach((report) => {
    if (!report.createdAt) return;
    const now = new Date();
    const diffDays = Math.floor((now - report.createdAt) / (1000 * 60 * 60 * 24));
    if (diffDays <= 6) {
      const day = report.createdAt.toLocaleDateString("bn-BD", { weekday: "short" });
      if (weekCount[day] !== undefined) weekCount[day] += 1;
    }
  });

  const dynamicWeekly = Object.entries(weekCount).map(([day, count]) => ({ day, রিপোর্ট: count }));

  const categoryMap = {};
  reports.forEach((report) => {
    const cat = report.category || "অন্যান্য";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const dynamicCategory = Object.entries(categoryMap).map(([name, value], idx) => ({
    name,
    value,
    percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    color: ["#f59e0b", "#3b82f6", "#06b6d4", "#10b981", "#8b5cf6"][idx % 5],
  }));
  const displayCategory = reports.length > 0 ? dynamicCategory : CATEGORY_DATA.map(c => ({ ...c, percentage: c.value }));

  const resolutionMap = {};
  reports.forEach((report) => {
    if (report.status === "solved" && report.createdAt && report.updatedAt) {
      const cat = report.category || "অন্যান্য";
      const start = new Date(report.createdAt);
      const end = new Date(report.updatedAt);
      let diffDays = (end - start) / (1000 * 60 * 60 * 24);
      if (diffDays < 0.1) diffDays = 0.1;
      if (!resolutionMap[cat]) resolutionMap[cat] = { totalDays: 0, count: 0 };
      resolutionMap[cat].totalDays += diffDays;
      resolutionMap[cat].count += 1;
    }
  });
  const dynamicResolutionTime = Object.entries(resolutionMap).map(([name, data], idx) => ({
    name,
    সময়: Number((data.totalDays / data.count).toFixed(1)),
    fill: ["#f59e0b", "#3b82f6", "#06b6d4", "#10b981", "#ef4444"][idx % 5],
  }));
  const displayResolutionTime = dynamicResolutionTime.length > 0 ? dynamicResolutionTime : RESOLUTION_TIME;

  const getCategoryEmoji = (cat) => {
    switch (cat) {
      case "রাস্তা": return "🛣️";
      case "বিদ্যুৎ": return "⚡";
      case "পানি": return "💧";
      case "বর্জ্য": return "🗑️";
      case "স্বাস্থ্য": return "🏥";
      default: return "📌";
    }
  };
  const dynamicRecentReports = reports
    .slice()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 4)
    .map(r => {
      const days = r.createdAt ? Math.floor((new Date() - r.createdAt) / (1000 * 60 * 60 * 24)) : 0;
      const timeStr = days === 0 ? "আজ" : `${days} দিন আগে`;
      return {
        id: r._id ? r._id.substring(0, 6).toUpperCase() : (r.id ? String(r.id).substring(0, 6) : "N/A"),
        title: r.title || "শিরোনাম নেই",
        status: STATUS_CFG[r.status] ? r.status : "pending",
        cat: getCategoryEmoji(r.category),
        time: timeStr
      };
    });
  const displayRecentReports = dynamicRecentReports.length > 0 ? dynamicRecentReports : RECENT_REPORTS;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{ background: "linear-gradient(135deg,#0f2250 0%,#1d4ed8 50%,#2563eb 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle,#fff,transparent)" }} />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle,#fff,transparent)" }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">স্বাগতম, {session?.user?.name || "নাগরিক বন্ধু"} 👋</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">আপনার ড্যাশবোর্ড</h1>
            <p className="text-blue-200 text-sm">আজ পর্যন্ত আপনি <strong className="text-white">{total}টি</strong> রিপোর্ট করেছেন, {solved}টি সমাধান হয়েছে।</p>

            {/* User Info Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-[11px] text-white flex items-center gap-2">
                <span className="text-blue-300 font-bold uppercase tracking-wider">NID:</span>
                <span className="font-mono">{session?.user?.nid || "প্রদান করা হয়নি"}</span>
              </div>
              <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-[11px] text-white flex items-center gap-2">
                <span className="text-blue-300 font-bold uppercase tracking-wider">এলাকা:</span>
                <span>{session?.user?.area || "প্রদান করা হয়নি"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Mini ring */}
            <div className="text-center">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#fff" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 32 * pct / 100} ${2 * Math.PI * 32}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{pct}%</span>
                </div>
              </div>
              <p className="text-blue-200 text-xs mt-1">সমাধান হার</p>
            </div>
            <a href="/dashboard/users/newComplaints"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-blue-700 bg-white hover:bg-blue-50 transition-all hover:-translate-y-0.5 shadow-lg whitespace-nowrap"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              + নতুন রিপোর্ট
            </a>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="মোট রিপোর্ট" value={total} sub={`এই মাসে ${reports.filter((r) => r.createdAt && new Date(r.createdAt).getMonth() === new Date().getMonth()).length} টি`} color="#2563eb" trend="up" trendVal={`${total ? Math.round((total / (total || 1)) * 100) : 0}%`} />
        <StatCard icon={CheckCircle2} label="সমাধান হয়েছে" value={solved} sub={`জরিপ সমাধান হার ${pct}%`} color="#16a34a" trend="up" trendVal={`${pct}%`} />
        <StatCard icon={Clock} label="অপেক্ষমাণ" value={pending} sub={`সমসাময়িক ${pending} টি`} color="#d97706" trend="down" trendVal={`${pending ? '-' : '0'}টি`} />
        <StatCard icon={Clock} label="বাতিল" value={rejected} sub={`বাতিল ${rejected} টি`} color="#ef4444" trend="down" trendVal={`${rejected ? '-' : '0'}টি`} />
      </div>

      {/* ── Row 2: Area Chart + Pie ── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Area Chart — 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">রিপোর্ট ও সমাধান ট্রেন্ড</h3>
              <p className="text-xs text-slate-400 mt-0.5">মাসিক তুলনামূলক চিত্র</p>
            </div>
            <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl w-fit">
              {["3m", "6m", "1y"].map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                  style={{ background: range === r ? "#2563eb" : "transparent", color: range === r ? "#fff" : "#94a3b8" }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={reports.length ? dynamicMonthly : MONTHLY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="রিপোর্ট" stroke="#2563eb" strokeWidth={2.5} fill="url(#blueGrad)" dot={{ fill: "#2563eb", r: 3 }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="সমাধান" stroke="#16a34a" strokeWidth={2.5} fill="url(#greenGrad)" dot={{ fill: "#16a34a", r: 3 }} activeDot={{ r: 5 }} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: "#64748b" }}>{v}</span>} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — 1/3 width */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100">
          <SectionHead title="ক্যাটাগরি বিভাজন" sub="মোট রিপোর্ট অনুযায়ী" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={displayCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                paddingAngle={3} dataKey="value">
                {displayCategory.map((c, i) => (
                  <Cell key={i} fill={c.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v, "পরিমাণ"]} contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1 px-2">
            {displayCategory.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-xs text-slate-600 truncate max-w-[80px]" title={c.name}>{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.percentage}%`, background: c.color }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-8 text-right">{c.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3 ── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Recent Reports (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 border border-slate-100">
          <SectionHead
            title="সাম্প্রতিক রিপোর্ট"
            sub="আপনার সর্বশেষ অভিযোগ"
            action={{ label: "সব দেখুন", href: "/dashboard/reports" }}
          />

          <div className="space-y-2">
            {displayRecentReports.map((r, i) => {
              const s = STATUS_CFG[r.status] || STATUS_CFG["pending"];
              return (
                <div key={i}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer">

                  <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                    {r.cat}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600">
                      {r.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">#{r.id}</span>
                      <span className="text-[10px] text-slate-400">{r.time}</span>
                    </div>
                  </div>

                  <ArrowUpRight size={14} className="shrink-0 text-slate-300 group-hover:text-blue-400" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Resolution Time (1/3 width) */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 overflow-hidden">
          <SectionHead title="গড় সমাধান সময়" sub="ক্যাটাগরি অনুযায়ী (দিনে)" />

          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={displayResolutionTime}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={60} />

              <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v} দিন`, "সময়"]} />

              <Bar dataKey="সময়" radius={[0, 8, 8, 0]} maxBarSize={20}>
                {displayResolutionTime.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}