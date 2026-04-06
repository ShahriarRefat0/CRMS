"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  MapPin, Clock, CheckCircle2, AlertCircle, Loader2,
  Filter, Search, LayoutGrid, List, ChevronRight,
  ThumbsUp, MessageSquare, Eye, Calendar, Tag,
  TrendingUp, FileText, Zap, RotateCcw
} from "lucide-react";
import Link from "next/link";
import ReportDetailModal from "@/shared/ReportDetailModal";

// NOTE: the dashboard now fetches reports from the backend.
// The mock data below is kept only as a fallback for very early rendering.
const REPORTS = [];

/* ── Status config ── */
const STATUS = {
  solved: { label: "সমাধান হয়েছে", en: "Solved", icon: CheckCircle2, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  inprogress: { label: "কাজ চলছে", en: "In Progress", icon: Loader2, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  pending: { label: "অপেক্ষমাণ", en: "Pending", icon: AlertCircle, color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  rejected: { label: "বাতিল", en: "Rejected", icon: AlertCircle, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

const PRIORITY = {
  high: { label: "জরুরি", color: "#ef4444", bg: "#fef2f2" },
  medium: { label: "মাঝারি", color: "#f59e0b", bg: "#fffbeb" },
  low: { label: "সাধারণ", color: "#6b7280", bg: "#f9fafb" },
};

/* ── Timeline mini ── */
function TimelineMini({ steps }) {
  return (
    <div className="flex items-center gap-0 mt-3">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all"
              style={{
                background: s.done ? "#2563eb" : "#e2e8f0",
                color: s.done ? "#fff" : "#94a3b8",
                boxShadow: s.done ? "0 0 0 3px rgba(37,99,235,0.15)" : "none",
              }}
            >
              {s.done ? "✓" : i + 1}
            </div>
            <span className="text-[9px] text-slate-400 whitespace-nowrap hidden sm:block">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-1 rounded-full"
              style={{ background: steps[i + 1].done ? "#2563eb" : "#e2e8f0" }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Report Card ── */
function ReportCard({ report, view, expanded, onToggle, onViewDetails }) {
  const st = STATUS[report.status];
  const pr = PRIORITY[report.priority];
  const StIcon = st.icon;

  if (view === "list") {
    return (
      <div
        className="group bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 p-4 sm:p-5">
          {/* Emoji */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: "#eff6ff" }}>
            {report.emoji}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                <StIcon size={9} className="inline mr-1" />
                {st.label}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: pr.bg, color: pr.color }}>
                {pr.label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{report.id}</span>
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors">
              {report.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1"><MapPin size={10} />{report.location}</span>
              <span className="flex items-center gap-1"><Calendar size={10} />{report.date}</span>
              <span className="flex items-center gap-1"><Tag size={10} />{report.category}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><ThumbsUp size={11} />{report.votes}</span>

          </div>

          <ChevronRight size={16} className={`text-slate-300 transition-transform flex-shrink-0 ${expanded ? "rotate-90" : ""}`} />
        </div>

        {/* Expanded timeline */}
        {expanded && (
          <div className="border-t border-slate-100 px-5 pb-5 pt-4 bg-slate-50/50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">অগ্রগতি ট্র্যাকার</p>
            <TimelineMini steps={report.timeline} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {/* Map embedded */}
              {(report.lat || report.location) && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">সংযুক্ত ম্যাপ</p>
                  <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <iframe
                      title="report-location-map"
                      src={report.lat ? `https://maps.google.com/maps?q=${report.lat},${report.lng}&output=embed&z=15&hl=bn` : `https://maps.google.com/maps?q=${encodeURIComponent(report.location + ', Bangladesh')}&output=embed&z=15&hl=bn`}
                      width="100%"
                      height="100%"
                      className="border-0 relative z-0"
                      loading="lazy"
                      allowFullScreen
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-slate-700 shadow-sm z-10 pointer-events-none">
                      লোকেশন ভিউ
                    </div>
                  </div>
                </div>
              )}

              {/* Photos Gallery */}
              {report.photos && report.photos.length > 0 && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 truncate">সংযুক্ত ছবি ({report.photos.length}টি)</p>
                  <div className="flex gap-2 overflow-x-auto snap-x pb-2 w-full custom-scrollbar">
                    {report.photos.map((src, i) => (
                      <img key={i} src={src} className="h-28 sm:h-32 w-auto aspect-video object-cover rounded-xl border border-slate-200 snap-center shrink-0 shadow-sm" alt="report image" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-blue-600 border-2 border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
              >
                বিস্তারিত দেখুন
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div
      className="group bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
      onClick={onToggle}
    >
      {/* Top color bar */}
      <div className="h-1 w-full" style={{ background: st.color }} />

      <div className="p-5 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: "#eff6ff" }}>
            {report.emoji}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
              {st.en}
            </span>
            <span className="text-[10px] font-mono text-slate-400">{report.id}</span>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {report.title}
        </h3>

        <div className="space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5"><MapPin size={11} />{report.location}</div>
          <div className="flex items-center gap-1.5"><Calendar size={11} />{report.date}</div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: pr.bg, color: pr.color }}>
              {pr.label}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-500">{report.category}</span>
          </div>
        </div>

        {/* Timeline */}
        <TimelineMini steps={report.timeline} />
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><ThumbsUp size={10} />{report.votes}</span>

        </div>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1" onClick={(e) => { e.stopPropagation(); onViewDetails(); }}>
          দেখুন <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

/*  MAIN PAGE */
export default function MyReportsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email?.toLowerCase() || "";

  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [reports, setReports] = useState(REPORTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetails = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const deleteReport = async (dbId) => {
    if (!dbId) return;
    const confirmed = window.confirm("আপনি কি নিশ্চিত যে রিপোর্ট মুছতে চান? এটি স্থায়ীভাবে চলে যাবে।");
    if (!confirmed) return;

    try {
      setLoading(true);
      const res = await fetch("/api/complaints", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dbId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "রিপোর্ট মুছতে ব্যর্থ হয়েছে");
      }

      setReports((prev) => prev.filter((report) => report.dbId !== dbId));
      closeDetails();
    } catch (err) {
      console.error("Failed to delete report:", err);
      setError(err.message || "রিপোর্ট মুছতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const mapComplaint = (complaint) => {
    const date = complaint.createdAt
      ? new Date(complaint.createdAt).toLocaleDateString("bn-BD", { day: "2-digit", month: "2-digit", year: "numeric" })
      : "—";

    const location = [complaint.address, complaint.upazila, complaint.district]
      .filter(Boolean)
      .join(", ");

    const rawStatus = complaint.status?.toString?.().toLowerCase?.() || "pending";
    
    // Map backend statuses to frontend representation
    let status = "pending";
    if (rawStatus === "resolved" || rawStatus === "solved") status = "solved";
    else if (rawStatus === "in_review" || rawStatus === "action_taken" || rawStatus === "inprogress") status = "inprogress";
    else if (rawStatus === "rejected") status = "rejected";
    else status = "pending";

    const priority = complaint.severity || "medium";

    return {
      dbId: String(complaint._id),
      id: complaint.ticketId || complaint._id,
      title: complaint.title,
      description: complaint.description || "",
      category: complaint.category || "অন্যান্য",
      location: location || "—",
      date,
      status,
      priority,
      votes: 0,
      emoji: "📝",
      authorEmail: complaint.email?.toLowerCase?.() || "",
      photos: complaint.photos || [],
      lat: complaint.lat || null,
      lng: complaint.lng || null,
      address: complaint.address || "",
      upazila: complaint.upazila || "",
      district: complaint.district || "",
      adminFeedback: complaint.adminFeedback || "",
      statusHistory: complaint.statusHistory || [],
      timeline: [
        { label: "রিপোর্ট জমা", done: true, date },
        { label: "পর্যালোচনা", done: ["inprogress", "solved", "rejected"].includes(status), date: "—" },
        { label: "কাজ চলছে", done: ["inprogress", "solved"].includes(status), date: "—" },
        { label: "সমাধান", done: status === "solved", date: "—" },
        { label: "বাতিল", done: status === "rejected", date: "—" },
      ],
    };
  };

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/complaints");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch reports");
      const mapped = (json.data || []).map(mapComplaint);
      setReports(mapped);
    } catch (err) {
      console.error("Failed to load reports:", err);
      setError(err.message || "Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const userReports = userEmail
    ? reports.filter((r) => r.authorEmail === userEmail)
    : reports;

  const filtered = userReports.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const searchLower = search.toLowerCase();
    const matchSearch =
      r.title.toLowerCase().includes(searchLower) ||
      r.location.toLowerCase().includes(searchLower) ||
      r.id.toLowerCase().includes(searchLower);
    return matchStatus && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "views") return b.views - a.views;
    return 0;
  });

  const counts = {
    all: userReports.length,
    solved: userReports.filter((r) => r.status === "solved").length,
    inprogress: userReports.filter((r) => r.status === "inprogress").length,
    pending: userReports.filter((r) => r.status === "pending").length,
    rejected: userReports.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-blue-600" size={24} />
            আমার রিপোর্টসমূহ
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            আপনার সকল অভিযোগের তালিকা ও অগ্রগতি
          </p>
        </div>
        <Link
          href="/dashboard/users/newComplaints"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", boxShadow: "0 6px 20px rgba(37,99,235,0.3)" }}
        >
          + নতুন রিপোর্ট
        </Link>
      </div>


      {/* ── Filter + Search + View Toggle ── */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="রিপোর্ট খুঁজুন..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-8 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-blue-400 bg-white cursor-pointer"
            >
              <option value="date">তারিখ অনুযায়ী</option>
              <option value="votes">ভোট অনুযায়ী</option>
              <option value="views">ভিউ অনুযায়ী</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white shadow text-blue-600" : "text-slate-400"}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white shadow text-blue-600" : "text-slate-400"}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {[
            { key: "all", label: `সব (${counts.all})` },
            { key: "solved", label: `✅ সমাধান (${counts.solved})` },
            { key: "inprogress", label: `🔄 চলছে (${counts.inprogress})` },
            { key: "pending", label: `⏳ অপেক্ষা (${counts.pending})` },
            { key: "rejected", label: `❌ বাতিল  (${counts.rejected})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background: filter === f.key ? "#2563eb" : "#f1f5f9",
                color: filter === f.key ? "#fff" : "#64748b",
                boxShadow: filter === f.key ? "0 4px 12px rgba(37,99,235,0.25)" : "none",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Reports List/Grid ── */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-100 p-16 text-center">
          <Loader2 size={32} className="animate-spin mx-auto text-slate-400" />
          <p className="text-slate-500 font-medium mt-3">রিপোর্টগুলি লোড হচ্ছে...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-red-200 p-16 text-center">
          <p className="text-red-600 font-bold">ত্রুটি: {error}</p>
          <button
            onClick={loadReports}
            className="mt-4 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-500 font-medium">কোনো রিপোর্ট পাওয়া যায়নি</p>
        </div>
      ) : view === "list" ? (
        <div className="space-y-3">
          {filtered.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              view="list"
              expanded={expandedId === r.id}
              onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
              onViewDetails={() => openDetails(r)}
            />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              view="grid"
              expanded={false}
              onToggle={() => { }}
              onViewDetails={() => openDetails(r)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <ReportDetailModal
          report={selectedReport}
          onClose={closeDetails}
          onDelete={() => deleteReport(selectedReport?.dbId)}
        />
      )}

    </div>
  );
}