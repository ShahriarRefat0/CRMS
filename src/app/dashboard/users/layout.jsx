"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import {
  LayoutDashboard,
  Settings,
  Shield,
  PlusCircle,
  MapPin,
  Bell,
  Trophy,
  Users,
  FileText,
  HelpCircle,
  Radio,
} from "lucide-react";

import UserNotifications from "@/components/UserNotifications";
import { HiOutlineLogout } from "react-icons/hi";

export default function NagrikDashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Overview",
      labelBn: "ওভারভিউ",
      path: "/dashboard/users",
    },
    {
      icon: <FileText size={20} />,
      label: "My Reports",
      labelBn: "আমার রিপোর্ট",
      path: "/dashboard/users/reports",
    },

    {
      icon: <Settings size={20} />,
      label: "Settings",
      labelBn: "সেটিংস",
      path: "/dashboard/users/settings",
    },
    {
      icon: <HelpCircle size={20} />,
      label: "Help & FAQ",
      labelBn: "সাহায্য",
      path: "/dashboard/users/helps",
    },
  ];

  const isActive = (path) => {
    if (!pathname) return false;

    const current = pathname.toLowerCase();
    const target = path.toLowerCase();

    // 🎯 Overview (exact match only)
    if (target === "/dashboard/users") {
      return current === target;
    }

    // 🎯 Others (nested routes support)
    return current.startsWith(target);
  };

  return (
    <div className="min-h-screen bg-slate-50 mx-auto font-bangla">

      {/* ── Mobile Header ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
            >
              <FaBars size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield size={14} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-blue-900">নাগরিক বন্ধু</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserNotifications />
          </div>
        </div>
      </div>

      <div className="flex pt-16 lg:pt-0">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-[#0a1628] text-slate-300 h-screen sticky top-0">

          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <Link href="/" className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <Shield size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">নাগরিক বন্ধু</h1>
              </div>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold ml-11">
                Civic Tech Bangladesh
              </p>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 overflow-y-auto space-y-0.5">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive(item.path)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
              >
                <span className={`${isActive(item.path) ? "text-white" : "text-slate-500 group-hover:text-blue-400"} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-[14px] flex-1">{item.labelBn}</span>
                <span className={`text-[10px] ${isActive(item.path) ? "text-blue-200" : "text-slate-600"}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Quick Report Card */}
            <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <PlusCircle size={13} /> দ্রুত রিপোর্ট
              </p>
              <p className="text-[11px] text-slate-400 leading-snug mb-3">
                সমস্যা দেখলেই তাৎক্ষণিক রিপোর্ট করুন
              </p>
              <Link
                href="/dashboard/users/newComplaints"
                className="block text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-xl transition"
              >
                + রিপোর্ট করুন
              </Link>
            </div>
          </nav>

          {/* Profile */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-between gap-2 overflow-hidden">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold overflow-hidden">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'ন'
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">
                    {session?.user?.name || "নাগরিক ব্যবহারকারী"}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{session?.user?.email || "..."}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-500 font-bold p-2 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-red-50/20 transition shrink-0"
              >
                <FaUserCircle size={18} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── Mobile Sidebar Overlay ── */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#0a1628] z-50 shadow-2xl flex flex-col">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-white">নাগরিক বন্ধু</h1>
                </div>
              </div>
              <nav className="flex-1 p-4 overflow-y-auto space-y-1">
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-semibold text-sm">{item.labelBn}</span>
                    {item.badge && (
                      <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
              {/* Mobile profile */}
              <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl overflow-hidden">
                  <div className="w-10 h-10 shrink-0 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden shadow-lg">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'ন'
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{session?.user?.name || "নাগরিক ব্যবহারকারী"}</p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">{session?.user?.email || "NB-2025-0001"}</p>
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0">

          {/* Desktop Top Header */}
          <div className="hidden lg:block sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="flex items-center justify-between px-8 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  নাগরিক ড্যাশবোর্ড
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-mono">
                    ● সচল
                  </span>
                </h2>

              </div>

              <div className="flex items-center gap-4">

                {/* Bell */}
                <UserNotifications />

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
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-8 bg-slate-50 min-h-[calc(100vh-80px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}