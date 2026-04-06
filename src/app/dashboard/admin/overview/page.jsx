"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  FileText, CheckCircle, Clock,
  TrendingUp, CalendarDays, Users,
  Activity, Layers, RefreshCw,
  ChevronDown, Bell, Search, Loader
} from "lucide-react";
import axios from "axios";

// ── BENGALI NUMBERS ──────────────────────────────────────────────
function convertToBengaliNumber(num) {
  if (num === null || num === undefined) return "০";
  const bengaliNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((d) => (isNaN(d) ? d : bengaliNumbers[parseInt(d)]))
    .join("");
}

// ── CUSTOM TOOLTIP ────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl p-4 text-sm shadow-2xl border bg-white/95 backdrop-blur-xl border-slate-200 min-w-[170px]"
    >
      <p className="font-bold text-slate-900 mb-3 flex items-center gap-1.5">
        <CalendarDays size={14} className="text-indigo-600" /> {label}বার
      </p>
      {payload.map((e, i) => (
        <div key={i} className="flex justify-between items-center gap-4 mb-1.5">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full" style={{ background: e.stroke }} />
            {e.name}
          </span>
          <span className="font-bold text-slate-900">{convertToBengaliNumber(e.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ── STAT CARD ─────────────────────────────────────────────────────
const StatCard = ({ item, idx }) => {
  const Icon = item.icon;
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 cursor-default group transition-all duration-300 hover:-translate-y-1 bg-white border-slate-100 shadow-sm shadow-slate-200/50`}
    >
      {/* Glow blob */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: item.glow }}
      />
      <div className="flex items-start justify-between mb-5 relative">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-black/5"
          style={{ background: `${item.accent}10`, border: `1px solid ${item.accent}15` }}
        >
          <Icon size={22} style={{ color: item.accent }} />
        </div>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest`}>
          <TrendingUp size={11} /> লাইভ
        </span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 relative">
        {item.label}
      </p>
      <h2 className="text-3xl font-black tracking-tight text-slate-900 relative">
        {convertToBengaliNumber(item.raw)}
      </h2>
    </div>
  );
};

const statusStyle = {
  pending: { label: "পেন্ডিং", cls: "bg-amber-50 text-amber-600 border border-amber-100 shadow-sm shadow-amber-200/20" },
  resolved: { label: "সমাধান", cls: "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-200/20" },
  progress: { label: "চলমান", cls: "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm shadow-blue-200/20" },
};

// ── MAIN COMPONENT ────────────────────────────────────────────────
export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [time, setTime] = useState("");

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get("/api/admin/stats");
      if (res.data.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin text-indigo-600">
          <Loader size={40} />
        </div>
      </div>
    );
  }

  const { stats: s, chartData, recentActivity } = data;

  const statsList = [
    { label: "মোট রিপোর্ট", raw: s.totalReports, icon: FileText, accent: "#4f46e5", glow: "rgba(79,70,229,0.3)", hideProgress: true },
    { label: "নতুন / পেন্ডিং", raw: s.pending, icon: Clock, accent: "#d97706", glow: "rgba(217,119,6,0.3)" },
    { label: "চলমান কাজ", raw: s.inProgress, icon: Activity, accent: "#2563eb", glow: "rgba(37,99,235,0.3)" },
    { label: "সমাধান হয়েছে", raw: s.resolved, icon: CheckCircle, accent: "#059669", glow: "rgba(5,150,105,0.3)" },
    { label: "নিবন্ধিত ইউজার", raw: s.totalUsers, icon: Users, accent: "#db2777", glow: "rgba(219,39,119,0.3)" },
  ];

  const maxVal = Math.max(...chartData.map(d => d.reports), 10);
  const avgVal = chartData.reduce((sum, d) => sum + d.reports, 0) / chartData.length;

  return (
    <div
      className="space-y-8 animate-in fade-in duration-700"
      style={{
        fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
      }}
    >
      {/* ─── STAT CARDS ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {statsList.map((item, i) => <StatCard key={i} item={item} idx={i} />)}
      </div>

      {/* ─── CHART + ACTIVITY ───────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <div
          className="xl:col-span-2 rounded-xl p-5 md:p-8 border bg-white border-slate-200 shadow-xl shadow-slate-200/30"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" /> সাপ্তাহিক এনালিটিক্স
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">রিপোর্ট, চলমান ও সমাধানের তুলনামূলক চিত্র</p>
            </div>
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-white transition-all shadow-sm"
            >
              <RefreshCw size={18} className={`${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-8">
            {[
              { color: "#4f46e5", label: "মোট রিপোর্ট" },
              { color: "#2563eb", label: "চলমান" },
              { color: "#059669", label: "সমাধান" },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-0.5 rounded-full" style={{ background: l.color }} />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>

          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  {[
                    { id: "gr", color: "#4f46e5" },
                    { id: "gb", color: "#2563eb" },
                    { id: "ge", color: "#059669" },
                  ].map(g => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={g.color} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} domain={[0, maxVal + 2]} tickCount={6} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }} />
                {avgVal > 0 && <ReferenceLine y={avgVal} stroke="#cbd5e1" strokeDasharray="5 5" />}
                <Area type="monotone" dataKey="reports" name="মোট রিপোর্ট" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#gr)" activeDot={{ r: 6, strokeWidth: 4, stroke: "#fff" }} />
                <Area type="monotone" dataKey="inProgress" name="চলমান" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#gb)" activeDot={{ r: 6, strokeWidth: 4, stroke: "#fff" }} />
                <Area type="monotone" dataKey="resolved" name="সমাধান" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#ge)" activeDot={{ r: 6, strokeWidth: 4, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="rounded-xl p-5 md:p-8 border bg-white border-slate-200 shadow-xl shadow-slate-200/30 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Layers size={18} className="text-indigo-600" /> সাম্প্রতিক কার্যক্রম
            </h3>
            <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest cursor-pointer hover:text-indigo-700">সব দেখুন →</span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[440px] pr-1 custom-scrollbar">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <FileText size={40} className="opacity-10 mb-3" />
                <p className="text-xs font-black uppercase tracking-widest opacity-40">কার্যক্রম নেই</p>
              </div>
            ) : recentActivity.map((act, i) => {
              const sStyle = statusStyle[act.status] || statusStyle.pending;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-[1.5rem] transition-all hover:bg-slate-50 cursor-pointer border border-slate-50 bg-slate-50/50 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 bg-white border border-slate-100 text-indigo-600 shadow-sm shadow-black/5"
                    >
                      {act.user.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{act.user}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{act.id} · {act.time}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black px-3.5 py-1.5 rounded-full flex-shrink-0 ml-3 uppercase tracking-widest ${sStyle.cls}`}>
                    {sStyle.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mini progress */}
          <div
            className="mt-6 p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner"
          >
            <p className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest flex items-center justify-between">
              সমাধানের হার <span>{convertToBengaliNumber(Math.round(s.totalReports > 0 ? (s.resolved / s.totalReports) * 100 : 0))}%</span>
            </p>
            <div className="h-2.5 rounded-full bg-white shadow-inner overflow-hidden border border-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${s.totalReports > 0 ? (s.resolved / s.totalReports) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}