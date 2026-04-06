"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FileText, Clock, Eye, ShieldCheck, CheckCircle2,
  Search, MapPin, Calendar, Tag, ImageIcon,
  X, Send, ChevronLeft, ChevronRight,
  MessageSquare, RefreshCw, Check, Loader, User,
  AlertCircle, ThumbsUp,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const STATUSES = {
  pending: { label: "পেন্ডিং", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400", ring: "ring-amber-200" },
  in_review: { label: "পর্যালোচনায়", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400", ring: "ring-blue-200" },
  action_taken: { label: "ব্যবস্থা নেওয়া", bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-400", ring: "ring-violet-200" },
  resolved: { label: "সমাধান হয়েছে", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400", ring: "ring-emerald-200" },
};

const PRIORITY_STYLE = { high: "text-red-500 bg-red-50", medium: "text-amber-500 bg-amber-50", low: "text-slate-400 bg-slate-100" };
const PRIORITY_LABEL = { high: "জরুরি", medium: "মাঝারি", low: "সাধারণ" };
const CATEGORIES = ["সব ক্যাটাগরি", "রাস্তার সমস্যা", "বিদ্যুৎ সমস্যা", "পানি সমস্যা", "পরিবেশ দূষণ", "যানজট সমস্যা", "সড়ক বাতি", "ড্রেনেজ সমস্যা", "অন্যান্য"];
const STATUS_LIST = ["সব স্ট্যাটাস", "pending", "in_review", "action_taken", "resolved"];
const PER_PAGE = 5;

// ── BENGALI UTILS ──────────────────────────────────────────────────────
const convertToBN = (num) => {
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num?.toString().split("").map(d => isNaN(d) ? d : bn[parseInt(d)]).join("") || "০";
};

// ── STATUS BADGE ───────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = STATUSES[status] || STATUSES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

// ── EVIDENCE MODAL ─────────────────────────────────────────────────────
const EvidenceModal = ({ report, onClose }) => {
  const [active, setActive] = useState(0);
  const ev = report.photos || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden modal-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-7 py-6 border-b border-slate-100">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{report.ticketId}</p>
            <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2"><ImageIcon size={18} className="text-indigo-500" /> প্রমাণ দেখুন</h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition text-slate-500 hover:text-slate-900"><X size={18} /></button>
        </div>
        <div className="p-7">
          {ev.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-slate-400 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest opacity-40">কোনো প্রমাণ পাওয়া যায়নি</p>
            </div>
          ) : (
            <>
              <div className="relative rounded-3xl overflow-hidden bg-slate-900/5 mb-5 flex items-center justify-center" style={{ minHeight: 320 }}>
                <img src={ev[active]} alt="" className="max-w-full max-h-[400px] object-contain rounded-xl" />
                {ev.length > 1 && <>
                  <button onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg flex items-center justify-center disabled:opacity-20 hover:bg-white transition text-slate-600"><ChevronLeft size={20} /></button>
                  <button onClick={() => setActive(a => Math.min(ev.length - 1, a + 1))} disabled={active === ev.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg flex items-center justify-center disabled:opacity-20 hover:bg-white transition text-slate-600"><ChevronRight size={20} /></button>
                </>}
              </div>
              <div className="flex gap-3 pb-2 overflow-x-auto custom-scrollbar">
                {ev.map((pic, i) => (
                  <button key={i} onClick={() => setActive(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-4 transition-all flex-shrink-0 ${i === active ? "border-indigo-600 scale-105 shadow-xl shadow-indigo-100" : "border-slate-100 opacity-60 hover:opacity-100 shadow-sm"}`}>
                    <img src={pic} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── DETAIL & RESPONSE MODAL ────────────────────────────────────────────
const DetailModal = ({ report, onClose, onRefresh }) => {
  const [newStatus, setNewStatus] = useState(report.status);
  const [newPriority, setNewPriority] = useState(report.priority || "medium");
  const [message, setMessage] = useState(report.adminFeedback || "");
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const res = await axios.patch(`/api/admin/complaints/${report._id}`, {
        status: newStatus,
        adminFeedback: message,
        priority: newPriority
      });
      if (res.data.success) {
        toast.success("সফলভাবে আপডেট হয়েছে!");
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("আপডেট করা সম্ভব হয়নি");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl modal-in relative overflow-hidden" style={{ maxHeight: "92vh" }} onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-5 sm:px-8 sm:py-7 border-b border-slate-100 relative bg-slate-50/50">
          <div>
            <span className="inline-block text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg uppercase tracking-widest mb-2">{report.ticketId}</span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{report.category}</h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition text-slate-500 hover:text-slate-900 shadow-sm"><X size={18} /></button>
        </div>

        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(92vh-100px)] relative custom-scrollbar">
          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: User, label: "ইউজার", val: report.name || (report.anonymous ? "গোপন" : "অজ্ঞাত"), color: "text-indigo-600", bg: "bg-indigo-50" },
              { icon: Calendar, label: "তারিখ", val: new Date(report.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }), color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: MapPin, label: "লোকেশন", val: `${report.upazila}, ${report.district}`, color: "text-amber-600", bg: "bg-amber-50" },
              { icon: Tag, label: "ক্যাটাগরি", val: report.category, color: "text-pink-600", bg: "bg-pink-50" }
            ].map((m, i) => (
              <div key={i} className="flex items-start gap-3.5 p-4 rounded-[1.5rem] bg-white border border-slate-100 group hover:border-indigo-200 transition-colors shadow-sm shadow-slate-200/50">
                <div className={`mt-0.5 ${m.color} ${m.bg} p-2 rounded-xl border border-current/10`}><m.icon size={14} /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{m.label}</p>
                  <p className="text-xs font-bold text-slate-800 tracking-tight">{m.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 relative group hover:border-indigo-200 transition-all overflow-hidden font-bangla">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white blur-3xl rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-2"><FileText size={12} /> বিস্তারিত বিবরণ</p>
            <p className="text-[15px] text-slate-900 leading-relaxed font-bold tracking-tight mb-3">{report.title}</p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{report.description}</p>
          </div>

          {/* Priority Update */}
          <div className={`p-6 rounded-[1.5rem] bg-white border border-slate-100 shadow-inner ${["action_taken", "resolved"].includes(report.status) ? "opacity-60 grayscale-[0.3]" : ""}`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500" /> গুরুত্ব নির্ধারণ করুন {["action_taken", "resolved"].includes(report.status) && "(শুধুমাত্র পড়ার জন্য)"}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              {['low', 'medium', 'high'].map(p => {
                const isReadOnly = ["action_taken", "resolved"].includes(report.status);
                return (
                  <button key={p}
                    onClick={() => !isReadOnly && setNewPriority(p)}
                    disabled={isReadOnly}
                    className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isReadOnly ? "cursor-not-allowed" : ""} ${newPriority === p ? `bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-200` : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"}`}>
                    {PRIORITY_LABEL[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Update */}
          <div className="p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2"><RefreshCw size={14} /> স্ট্যাটাস আপডেট করুন</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              {Object.entries(STATUSES)
                .filter(([key]) => {
                  const statusOrder = ["pending", "in_review", "action_taken", "resolved"];
                  const currentIdx = statusOrder.indexOf(report.status);
                  const targetIdx = statusOrder.indexOf(key);
                  return targetIdx >= currentIdx;
                })
                .map(([key, s]) => (
                  <button key={key} onClick={() => setNewStatus(key)}
                    className={`flex items-center gap-3 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-left transition-all border ${newStatus === key ? `bg-white ${s.text} border-current ring-1 ring-slate-100 shadow-lg` : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${newStatus === key ? s.dot : "bg-slate-200"}`} />
                    <span className="flex-1">{s.label}</span>
                    {newStatus === key && <CheckCircle2 size={14} className="ml-auto opacity-70" />}
                  </button>
                ))}
            </div>
          </div>

          {/* Response System */}
          <div className="p-6 rounded-[1.5rem] bg-emerald-50 border border-emerald-100 relative">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2"><MessageSquare size={14} /> ইউজার ফিডব্যাক সিস্টেম</p>
            <div className="relative group">
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={`ইউজারকে একটি বার্তা লিখুন…`} rows={3}
                className="w-full text-sm text-slate-800 placeholder:text-slate-400 bg-white border border-emerald-200 rounded-xl p-5 resize-none outline-none focus:ring-2 focus:ring-emerald-500/20 transition shadow-inner shadow-emerald-500/5 font-bold font-bangla" />
              <div className="absolute bottom-4 right-4 text-[10px] font-black text-slate-300 tabular-nums">{message.length}/500</div>
            </div>
            <div className="flex items-center justify-end mt-4">
              <button onClick={handleUpdate} disabled={(newStatus === report.status && message === report.adminFeedback && newPriority === report.priority) || updating}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 shadow-xl shadow-emerald-200 border border-emerald-500">
                {updating ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                আপডেট ও সেন্ড করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MAIN ───────────────────────────────────────────────────────────────
export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("সব ক্যাটাগরি");
  const [statusFilter, setStatus] = useState("সব স্ট্যাটাস");
  const [page, setPage] = useState(1);
  const [evidenceRpt, setEvidence] = useState(null);
  const [detailRpt, setDetail] = useState(null);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get("/api/complaints");
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (error) {
      console.error("Fetch complaints error:", error);
      toast.error("ডেটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let list = [...reports];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(r =>
        (r.name && r.name.toLowerCase().includes(s)) ||
        (r.ticketId && r.ticketId.toLowerCase().includes(s)) ||
        (r.location && r.location.toLowerCase().includes(s)) ||
        (r.category && r.category.toLowerCase().includes(s)) ||
        (r.district && r.district.toLowerCase().includes(s)) ||
        (r.upazila && r.upazila.toLowerCase().includes(s)) ||
        (r.title && r.title.toLowerCase().includes(s))
      );
    }
    if (catFilter !== "সব ক্যাটাগরি") list = list.filter(r => r.category === catFilter);
    if (statusFilter !== "সব স্ট্যাটাস") list = list.filter(r => r.status === statusFilter);

    // Sort by date: Newest first
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reports, search, catFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const summary = [
    { label: "মোট রিপোর্ট", value: reports.length, Icon: FileText, bg: "bg-indigo-600", shadow: "shadow-indigo-200" },
    { label: "পেন্ডিং", value: reports.filter(r => r.status === "pending").length, Icon: Clock, bg: "bg-amber-500", shadow: "shadow-amber-200" },
    { label: "পর্যালোচনায়", value: reports.filter(r => r.status === "in_review").length, Icon: Eye, bg: "bg-slate-800", shadow: "shadow-slate-200" },
    { label: "সমাধান হয়েছে", value: reports.filter(r => r.status === "resolved").length, Icon: CheckCircle2, bg: "bg-emerald-600", shadow: "shadow-emerald-200" },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin text-indigo-500">
          <Loader size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-600" style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali',sans-serif" }}>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">রিপোর্ট ম্যানেজমেন্ট</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium tracking-tight">সকল অভিযোগ পর্যবেক্ষণ, স্ট্যাটাস আপডেট ও ফিডব্যাক আপডেট করুন</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} type="text" placeholder="সার্চ করুন (নাম, আইডি, এলাকা)…"
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl w-full text-sm outline-none focus:ring-2 ring-indigo-500/20 transition text-slate-800 placeholder:text-slate-400 font-medium shadow-sm" />
          </div>
          <button onClick={fetchData} disabled={refreshing} className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition shadow-sm">
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map(({ label, value, Icon, bg, shadow }, i) => (
          <div key={i} className="bg-white border border-slate-100 p-7 rounded-xl shadow-sm shadow-slate-200/50 transition-all hover:-translate-y-1 hover:border-indigo-200 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 blur-3xl rounded-full" />
            <div className="flex justify-between items-start mb-5 relative">
              <div className={`p-3 rounded-xl bg-slate-50 border border-slate-100 text-indigo-600 group-hover:scale-110 transition-transform`}><Icon size={22} /></div>
              <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">{convertToBN(value)}</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{convertToBN(value)}</h3>
            <p className="text-[11px] mt-2 text-slate-400 font-black uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      {/* FILTER ROW */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-200/40 p-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><Tag size={16} /></div>
          <select value={catFilter} onChange={e => { setCat(e.target.value); setPage(1); }}
            className="flex-1 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500/20 transition-all appearance-none cursor-pointer">
            {CATEGORIES.map(c => <option key={c} className="text-slate-700">{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><ShieldCheck size={16} /></div>
          <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="flex-1 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500/20 transition-all appearance-none cursor-pointer">
            {STATUS_LIST.map(s => <option key={s} value={s} className="text-slate-700">{s === "সব স্ট্যাটাস" ? s : STATUSES[s]?.label}</option>)}
          </select>
        </div>
        <div className="px-6 py-3.5 bg-indigo-50 border border-indigo-100 rounded-xl whitespace-nowrap">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{convertToBN(filtered.length)} Records Found</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/30 overflow-hidden">
        <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-extrabold text-slate-800 text-lg">রিপোর্টের তালিকা</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-bangla">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-7 py-5">ইউজার / আইডি</th>
                <th className="px-7 py-5">ক্যাটাগরি</th>
                <th className="px-7 py-5">লোকেশন</th>
                <th className="px-7 py-5">তারিখ</th>
                <th className="px-7 py-5">অগ্রাধিকার</th>
                <th className="px-7 py-5">ভোট</th>
                <th className="px-7 py-5">স্ট্যাটাস</th>
                <th className="px-7 py-5 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium">
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-24 text-slate-400">
                  <FileText size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="font-black text-xs uppercase tracking-[0.2em] opacity-40">কোনো রিপোর্ট পাওয়া যায়নি!</p>
                </td></tr>
              ) : paginated.map(report => (
                <tr key={report._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                        {(report.name || (report.anonymous ? "গ" : "অ")).charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{report.name || (report.anonymous ? "গোপন" : "অজ্ঞাত")}</p>
                        <p className="text-[10px] text-slate-400 font-black mt-1 tracking-widest uppercase">{report.ticketId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-7 py-5"><span className="text-slate-600 font-bold text-[11px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{report.category}</span></td>
                  <td className="px-7 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs">
                        <MapPin size={12} className="text-indigo-500 flex-shrink-0" />{report.upazila}
                      </div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider ml-4">{report.district}</div>
                    </div>
                  </td>
                  <td className="px-7 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold whitespace-nowrap">
                        <Calendar size={11} className="text-indigo-500" />
                        {new Date(report.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider ml-4">{new Date(report.createdAt).getFullYear()}</div>
                    </div>
                  </td>
                  <td className="px-7 py-5">
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${report.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                      report.priority === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                      {PRIORITY_LABEL[report.priority || 'medium']}
                    </span>
                  </td>
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <ThumbsUp size={12} />
                      </div>
                      <span className="text-sm font-black text-slate-700">{convertToBN(report.vote || report.voters?.length || 0)}</span>
                    </div>
                  </td>
                  <td className="px-7 py-5">
                    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${report.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      report.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-indigo-50 text-indigo-600 border-indigo-100'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${report.status === 'resolved' ? 'bg-emerald-500' :
                        report.status === 'pending' ? 'bg-amber-500' : 'bg-indigo-500'
                        }`} />
                      {STATUSES[report.status]?.label || "অন্যান্য"}
                    </div>
                  </td>
                  <td className="px-7 py-5">
                    <div className="flex items-center justify-center gap-2.5">
                      {report.photos && report.photos.length > 0 && (
                        <button onClick={() => setEvidence(report)} className="w-9 h-9 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all bg-white border border-slate-200 shadow-sm" title="প্রমাণ দেখুন"><ImageIcon size={16} /></button>
                      )}
                      <button onClick={() => setDetail(report)} className="w-9 h-9 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all bg-white border border-slate-200 shadow-sm" title="বিস্তারিত ও ফিডব্যাক"><MessageSquare size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-bangla">পৃষ্ঠা {convertToBN(page)} / {convertToBN(totalPages)}</p>
            <div className="flex items-center gap-2.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition active:scale-95 text-slate-500 shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border active:scale-95 ${n === page ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 shadow-sm"}`}>{convertToBN(n)}</button>
                ))}
              </div>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition active:scale-95 text-slate-500 shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {evidenceRpt && <EvidenceModal report={evidenceRpt} onClose={() => setEvidence(null)} />}
      {detailRpt && <DetailModal report={detailRpt} onClose={() => setDetail(null)} onRefresh={fetchData} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        @keyframes modalInAnim { from{opacity:0;transform:scale(.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .modal-in { animation: modalInAnim .25s cubic-bezier(.23,1,.32,1); }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1rem; padding-right: 2.5rem; }
      `}</style>
    </div>
  );
}