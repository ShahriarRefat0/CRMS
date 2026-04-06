"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, RefreshCw, Radio, FileText, CheckCircle2, Zap } from "lucide-react";
import axios from "axios";
import Link from "next/link";

export default function AdminNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/stats");
      if (res.data.success) {
        setActivities(res.data.recentActivity || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin activities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all group border border-indigo-100/50 shadow-sm"
      >
        <Bell size={18} className={isOpen ? 'animate-none' : 'group-hover:rotate-12 transition-transform'} />
        {activities.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[110] animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">অ্যাডমিন অ্যাক্টিভিটি</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">সাম্প্রতিক আপডেট</p>
            </div>
            <button 
              onClick={fetchActivities}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="max-h-[350px] overflow-y-auto custom-scrollbar bg-white">
            {activities.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Bell size={32} className="opacity-20 mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest text-center">কোনো অ্যাক্টিভিটি নেই</p>
              </div>
            ) : (
              activities.map((n, i) => (
                <div key={i} className="p-4 border-b border-slate-50 hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-[10px] shadow-sm ${
                      n.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      n.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                      {n.user.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                        <span className="text-indigo-600">@{n.user}</span> {n.type}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 opacity-60">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{n.id}</span>
                         <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                         <span className="text-[9px] font-bold text-indigo-600">{n.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
            <Link 
              href="/dashboard/admin/broadcast" 
              className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-200 transition-all"
              onClick={() => setIsOpen(false)}
            >
              সকল রিপোর্ট দেখুন <Radio size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
