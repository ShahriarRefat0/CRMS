"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FaBars, FaBell } from "react-icons/fa";
import {
  LayoutDashboard, Users, Map, FileText,
  ShieldAlert, Settings, Radio, BarChart3, BellRing,
  Shield, X
} from "lucide-react";
import { HiOutlineLogout } from "react-icons/hi";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoadingNotif(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.recentActivity || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoadingNotif(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const adminMenuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", labelBn: "ওভারভিউ", path: "/dashboard/admin/overview" },
    { icon: <BellRing size={20} />, label: "Reports", labelBn: "রিপোর্ট ম্যানেজমেন্ট", path: "/dashboard/admin/broadcast" },
    { icon: <ShieldAlert size={20} />, label: "Control", labelBn: "কন্ট্রোল প্যানেল", path: "/dashboard/admin/control" },
    { icon: <Settings size={20} />, label: "Settings", labelBn: "সেটিংস", path: "/dashboard/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-600">
      {/* --- Sidebar (Desktop) --- */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0a1628] text-slate-300 h-screen sticky top-0 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />

        <div className="relative">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-950/40">
                  <Shield size={22} className="text-white" />
                </div>
                <h1 className="text-xl font-black text-white tracking-tight">নাগরিক বন্ধু</h1>
              </div>
              <p className="text-[10px] text-indigo-400 uppercase tracking-[0.2em] font-black ml-12">
                CIVIC TECH BD
              </p>
            </Link>
          </div>
        </div>

        <nav className="flex-1 p-5 space-y-2 overflow-y-auto custom-scrollbar relative">
          {adminMenuItems.map((item, idx) => {
            const active = pathname === item.path;
            return (
              <Link
                key={idx}
                href={item.path}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all group relative ${active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 translate-x-1"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-full translate-x-[-15px]" />}
                <span className={`transition-colors ${active ? "text-white" : "text-slate-500 group-hover:text-indigo-400"}`}>{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold leading-none tracking-tight">{item.labelBn}</p>
                  <p className={`text-[10px] mt-1 font-black uppercase tracking-wider ${active ? "text-indigo-200" : "text-slate-600"}`}>{item.label}</p>
                </div>
                {active && <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} className="w-full h-full object-cover" alt="" />
                ) : "অ"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">{session?.user?.name || "অ্যাডমিন ইউজার"}</p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{session?.user?.role || "Administrator"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Mobile Sidebar Overlay --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)} 
          />
          <aside className="relative w-72 max-w-[85%] bg-[#0a1628] text-slate-300 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="absolute top-6 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full z-50 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="relative">
              {/* Logo */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <Link href="/" className="flex flex-col gap-1" onClick={() => setIsSidebarOpen(false)}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-950/40">
                      <Shield size={22} className="text-white" />
                    </div>
                    <h1 className="text-xl font-black text-white tracking-tight">নাগরিক বন্ধু</h1>
                  </div>
                  <p className="text-[10px] text-indigo-400 uppercase tracking-[0.2em] font-black ml-12">
                    CIVIC TECH BD
                  </p>
                </Link>
              </div>
            </div>

            <nav className="flex-1 p-5 space-y-2 overflow-y-auto custom-scrollbar relative">
              {adminMenuItems.map((item, idx) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={idx}
                    href={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all group relative ${active
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 translate-x-1"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                  >
                    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-full translate-x-[-15px]" />}
                    <span className={`transition-colors ${active ? "text-white" : "text-slate-500 group-hover:text-indigo-400"}`}>{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold leading-none tracking-tight">{item.labelBn}</p>
                      <p className={`text-[10px] mt-1 font-black uppercase tracking-wider ${active ? "text-indigo-200" : "text-slate-600"}`}>{item.label}</p>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-900/40">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm overflow-hidden">
                    {session?.user?.image ? (
                      <img src={session.user.image} className="w-full h-full object-cover" alt="" />
                    ) : "অ"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-white truncate">{session?.user?.name || "অ্যাডমিন ইউজার"}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{session?.user?.role || "Administrator"}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm shadow-slate-100/50">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"><FaBars size={20} /></button>
            <h1 className="font-black text-slate-900 text-lg">নাগরিক বন্ধু</h1>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            অ্যাডমিন প্যানেল
            </h2>
            {/* <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5 ml-4">রেসপনসিভ ড্যাশবোর্ড সিস্টেম</p> */}
          </div>

          <div className="flex items-center gap-5 relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-xl transition-all relative ${showNotifications ? 'ring-2 ring-indigo-100 border-indigo-200 text-indigo-600 bg-indigo-50' : ''}`}
            >
              <FaBell size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                ></div>
                <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">নোটিফিকেশন</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">সাম্প্রতিক কার্যক্রম</p>
                    </div>
                    <button
                      onClick={fetchNotifications}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                    >
                      <BellRing size={14} className={loadingNotif ? "animate-spin" : ""} />
                    </button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FaBell className="text-slate-200" size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-400">কোনো নোটিফিকেশন নেই</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {notifications.map((n, i) => (
                          <div key={i} className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                            <div className="flex gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs shadow-sm ${n.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                  n.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                }`}>
                                {n.user.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                                  <span className="text-indigo-600">@{n.user}</span> {n.type}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.id}</span>
                                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                  <span className="text-[10px] font-bold text-indigo-400">{n.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100">
                    <Link
                      href="/dashboard/admin/broadcast"
                      onClick={() => setShowNotifications(false)}
                      className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-100 hover:shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      সব রিপোর্ট দেখুন <Radio size={12} />
                    </Link>
                  </div>
                </div>
              </>
            )}

            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <div className="relative group">

              <button className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full hover:border-indigo-200 transition-all shadow-sm group">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-600 shadow-sm overflow-hidden group-hover:shadow-indigo-100 transition-all">
                  {session?.user?.image ? (
                    <img src={session.user.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    session?.user?.name?.charAt(0) || <Shield size={20} />
                  )}
                </div>
              </button>

              {/* DROPDOWN */}
              <div className="absolute top-full right-0 mt-3 w-60 bg-white border border-slate-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50 p-3">
                <div className="flex flex-col items-center text-center mb-2">
                  <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xl shadow-lg shadow-indigo-100/50 mb-3 overflow-hidden">
                    {session?.user?.image ? <img src={session.user.image} className="w-full h-full object-cover" alt="" /> : session?.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 tracking-tight">{session?.user?.name || "অ্যাডমিন ইউজার"}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{session?.user?.email || "admin@civictic.bd"}</p>
                  </div>
                </div>

                <div className="">

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-sm">
                    <HiOutlineLogout size={16} /> লগ আউট
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-[#fbfcfd]">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}