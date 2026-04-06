"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Loader, RefreshCw,
  CheckCircle2, AlertTriangle,
  Ban, ShieldCheck, Mail, Phone,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

// ── BENGALI UTILS ──────────────────────────────────────────────────────
const convertToBN = (num) => {
  if (num === null || num === undefined) return "০";
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num?.toString().split("").map(d => {
    const p = parseInt(d);
    return (isNaN(p) || d === " ") ? d : bn[p];
  }).join("") || "০";
};

// ── USER ROW ───────────────────────────────────────────────────────────
const UserRow = ({ user, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const statusCls = {
    active: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warned: "bg-amber-50 text-amber-600 border-amber-100",
    banned: "bg-red-50 text-red-600 border-red-100",
  };
  const statusBN = { active: "সক্রিয়", warned: "সতর্কিত", banned: "নিষিদ্ধ" };

  const handleStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await axios.patch(`/api/admin/users/${user._id}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`ইউজার স্ট্যাটাস পরিবর্তন সফল!`);
        onUpdate();
      }
    } catch (error) { toast.error("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে"); }
    finally { setUpdating(false); }
  };

  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 bg-white">
      <td className="px-7 py-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center font-black text-slate-400 overflow-hidden border border-slate-200 shadow-sm ring-4 ring-slate-50">
            {user.image ? <img src={user.image} className="w-full h-full object-cover" alt="" /> : user.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900 tracking-tight">{user.name}</p>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-1">{user.role}</p>
          </div>
        </div>
      </td>
      <td className="px-7 py-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium tracking-tight"><Mail size={12} className="text-indigo-500" /> {user.email}</div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold"><Phone size={12} className="text-slate-400" /> {user.phone || "তথ্য নেই"}</div>
        </div>
      </td>
      <td className="px-7 py-5">
        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border shadow-sm ${statusCls[user.status || 'active']}`}>
          {statusBN[user.status || 'active']}
        </span>
      </td>
      <td className="px-7 py-5">
        <div className="flex items-center justify-center gap-2.5">
          {user.status !== 'active' && <button onClick={() => handleStatus('active')} disabled={updating} className="w-9 h-9 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-emerald-100 shadow-sm" title="সক্রিয় করুন"><ShieldCheck size={16} /></button>}
          {user.status !== 'warned' && <button onClick={() => handleStatus('warned')} disabled={updating} className="w-9 h-9 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-amber-100 shadow-sm" title="সতর্ক করুন"><AlertTriangle size={16} /></button>}
          {user.status !== 'banned' && <button onClick={() => handleStatus('banned')} disabled={updating} className="w-9 h-9 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-100 shadow-sm" title="নিষিদ্ধ করুন"><Ban size={16} /></button>}
        </div>
      </td>
    </tr>
  );
};

// ── MAIN ───────────────────────────────────────────────────────────────
export default function AdminControl() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/users");
      if (res.data.success) setUsers(res.data.data);
    } catch (e) { toast.error("ডেটা লোড করতে সমস্যা হয়েছে"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredUsers = useMemo(() => users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  ), [users, search]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size={40} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-800" style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali',sans-serif" }}>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">কন্ট্রোল প্যানেল</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium font-bangla">ইউজার ম্যানেজমেন্ট ও সিস্টেম কন্ট্রোল ব্যবস্থা</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="ইউজার সার্চ করুন…"
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl w-full text-sm outline-none focus:ring-2 ring-indigo-500/10 transition text-slate-800 font-bold placeholder:text-slate-400 shadow-sm" />
          </div>
          <button onClick={fetchData} className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition shadow-sm"><RefreshCw size={20} /></button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-7 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-black text-slate-900 text-lg tracking-tight">নিবন্ধিত ইউজারের তালিকা</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-7 py-5">ইউজার</th>
                <th className="px-7 py-5">যোগাযোগ</th>
                <th className="px-7 py-5">স্ট্যাটাস</th>
                <th className="px-7 py-5 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center text-slate-400 font-black uppercase tracking-widest">
                    ইউজার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => <UserRow key={u._id} user={u} onUpdate={fetchData} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-in { animation: modalIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}</style>
    </div>
  );
}
