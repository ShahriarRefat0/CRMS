"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  MapPin,
  ThumbsUp,
  ChevronDown,
  Users,
  Clock,
  CheckCircle2,
  Zap,
  Camera,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Static Data ---
const BD_DATA = {
  ঢাকা: [
    "আদাবর", "বাড্ডা", "বনানী", "ডেমরা", "ধানমন্ডি", "গুলশান", "হাজারীবাগ",
    "কামরাঙ্গীরচর", "খিলগাঁও", "খিলক্ষেত", "কোতোয়ালি", "লালবাগ", "মিরপুর",
    "মোহাম্মদপুর", "মতিঝিল", "নিউ মার্কেট", "পল্লবী", "রমনা", "সবুজবাগ",
    "শাহজাহানপুর", "শ্যামপুর", "সূত্রাপুর", "তেজগাঁও", "উত্তরা", "ওয়ারী",
  ],
  চট্টগ্রাম: [
    "আকবরশাহ", "বাকলিয়া", "বায়েজিদ বোস্তামী", "বন্দর", "চান্দগাঁও",
    "ডাবলমুরিং", "হালিশহর", "কোতোয়ালি", "খুলশি", "পাঁচলাইশ", "পতেঙ্গা",
    "রাঙ্গুনিয়া", "রাউজান", "সন্দ্বীপ", "সীতাকুন্ড",
  ],
  রাজশাহী: [
    "বোয়ালিয়া", "চারঘাট", "দুর্গাপুর", "গোদাগাড়ী", "মোহনপুর", "পবা", "পুঠিয়া", "তানোর",
  ],
  খুলনা: [
    "বটিয়াঘাটা", "দাকোপ", "দিঘলিয়া", "দুমুরিয়া", "ফুলতলা", "কয়রা", "পাইকগাছা", "রূপসা", "তেরখাদা",
  ],
  বরিশাল: [
    "আগৈলঝাড়া", "বাকেরগঞ্জ", "বানারীপাড়া", "বাউফল", "গৌরনদী", "হিজলা", "মেহেন্দিগঞ্জ", "মুলাদী", "উজিরপুর",
  ],
  সিলেট: [
    "বালাগঞ্জ", "বিয়ানীবাজার", "বিশ্বনাথ", "ছাতক", "দক্ষিণ সুরমা", "ফেঞ্চুগঞ্জ",
    "গোয়াইনঘাট", "গোলাপগঞ্জ", "জকিগঞ্জ", "কানাইঘাট", "কোম্পানীগঞ্জ", "ওসমানীনগর", "সিলেট সদর",
  ],
  রংপুর: [
    "বদরগঞ্জ", "গঙ্গাচড়া", "কাউনিয়া", "মিঠাপুকুর", "পীরগঞ্জ", "পীরগাছা", "রংপুর সদর", "তারাগঞ্জ",
  ],
  ময়মনসিংহ: [
    "ভালুকা", "ধোবাউড়া", "ফুলবাড়িয়া", "গফরগাঁও", "গৌরীপুর", "হালুয়াঘাট",
    "ঈশ্বরগঞ্জ", "ময়মনসিংহ সদর", "মুক্তাগাছা", "নান্দাইল", "ফুলপুর", "তারাকান্দা", "ত্রিশাল",
  ],
  কুমিল্লা: [
    "বরুড়া", "ব্রাহ্মণপাড়া", "চান্দিনা", "চৌদ্দগ্রাম", "দাউদকান্দি", "দেবীদ্বার",
    "হোমনা", "কুমিল্লা সদর", "লাকসাম", "মেঘনা", "মুরাদনগর", "নাঙ্গলকোট", "তিতাস",
  ],
  গাইবান্ধা: [
    "ফুলছড়ি", "গোবিন্দগঞ্জ", "পলাশবাড়ী", "সাদুল্লাপুর", "সাঘাটা", "সুন্দরগঞ্জ", "গাইবান্ধা সদর",
  ],
};

const ISSUE_TYPES = [
  { id: "road", label: "ভাঙা রাস্তা", icon: "🛣️" },
  { id: "water", label: "পানি সমস্যা", icon: "💧" },
  { id: "electricity", label: "বিদ্যুৎ বিভ্রাট", icon: "⚡" },
  { id: "waste", label: "বর্জ্য ব্যবস্থাপনা", icon: "🗑️" },
  { id: "drainage", label: "জলাবদ্ধতা", icon: "🌊" },
  { id: "streetlight", label: "রাস্তার আলো", icon: "💡" },
  { id: "tree", label: "গাছ/পরিবেশ", icon: "🌳" },
  { id: "noise", label: "শব্দ দূষণ", icon: "🔊" },
  { id: "other", label: "অন্যান্য", icon: "📋" },
];

const PROCESS_STEPS = [
  { num: "০১", title: "ডিজিটাল রিপোর্টিং", desc: "নাগরিক সমস্যা রিপোর্ট করুন", numCls: "bg-teal-600" },
  { num: "০২", title: "স্মার্ট অ্যালার্ট", desc: "AI স্বয়ংক্রিয়ভাবে দপ্তরে পাঠাবে", numCls: "bg-blue-600" },
  { num: "০৩", title: "দ্রুত পদক্ষেপ", desc: "সংশ্লিষ্ট কর্তৃপক্ষ ব্যবস্থা নেবে", numCls: "bg-violet-600" },
  { num: "০৪", title: "সমাধান ও রেটিং", desc: "নাগরিক প্রতিক্রিয়া ও মূল্যায়ন", numCls: "bg-amber-500" },
];

// Status badge classes
function statusCls(status) {
  if (status === "solved") return { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", label: "সমাধান হয়েছে" };
  if (status === "inprogress") return { badge: "bg-amber-100 text-amber-600", dot: "bg-amber-500", label: "প্রক্রিয়াধীন" };
  if (status === "rejected") return { badge: "bg-red-100 text-red-600", dot: "bg-red-500", label: "বাতিল" };
  return { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400", label: "চলমান" };
}

// Map Complaint helper
const mapDataToIssue = (c, identifier) => {
  const votersArr = Array.isArray(c.voters) ? c.voters : [];
  const statusRaw = c.status?.toString?.().toLowerCase?.() || "pending";
  return {
    id: String(c._id),
    ticketId: c.ticketId || String(c._id),
    title: c.title,
    type: c.category,
    location: [c.address, c.upazila, c.district].filter(Boolean).join(", ") || "—",
    votes: c.vote || votersArr.length,
    hasVoted: votersArr.includes(identifier),
    status: statusRaw,
    time: new Date(c.createdAt).toLocaleDateString("bn-BD"),
    photos: c.photos || [],
  };
};

function BdSelect({ label, options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium hover:border-teal-400 focus:outline-none focus:border-teal-500 transition-colors"
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-2xl border border-slate-100 overflow-y-auto max-h-56"
          >
            {options.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400">কোনো বিকল্প নেই</p>
            ) : (
              options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-teal-50 hover:text-teal-700 ${value === opt ? "bg-teal-50 text-teal-700 font-semibold" : "text-slate-700"
                    }`}
                >
                  {opt}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MapEmbed({ location }) {
  if (!location || location === "—") {
    return <p className="text-xs text-slate-400 italic">ম্যাপ লোকেশন নেই</p>;
  }

  const query = encodeURIComponent(location + ", Bangladesh");
  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100 flex items-center justify-center">
      <iframe
        title="live-location"
        width="100%"
        height="100%"
        className="border-0 absolute inset-0 text-transparent"
        loading="lazy"
        allowFullScreen
        src={`https://maps.google.com/maps?q=${query}&output=embed&z=15&hl=bn`}
      />
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md pointer-events-none z-10">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[11px] font-bold text-slate-700">লাইভ ম্যাপ</span>
      </div>
    </div>
  );
}

// --- IssueCard Component ---
function IssueCard({ issue, active, onClick, identifier }) {
  const [votes, setVotes] = useState(issue.votes);
  const [voted, setVoted] = useState(issue.hasVoted);
  const [voting, setVoting] = useState(false);

  // Sync state if issue props change
  useEffect(() => {
    setVotes(issue.votes);
    setVoted(issue.hasVoted);
  }, [issue.votes, issue.hasVoted]);

  const typeDef = ISSUE_TYPES.find((t) => t.id === issue.type) || ISSUE_TYPES[5];
  const progress = Math.min((votes / 100) * 100, 100);
  const sc = statusCls(issue.status);

  const handleVote = async (e) => {
    e.stopPropagation();
    if (voting || voted) return;

    // Optimistic Update
    setVoted(true);
    setVotes((v) => v + 1);
    setVoting(true);

    try {
      const res = await fetch(`/api/complaints/${issue.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("ভোট গ্রহণে সমস্যা হয়েছে");
      }
      // Revert to server truth
      setVotes(data.upvotes);
      setVoted(data.hasVoted);
    } catch (err) {
      console.error(err);
      // Revert Optimistic
      setVoted(false);
      setVotes((v) => v - 1);
    } finally {
      setVoting(false);
    }
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={{ y: -2 }}
      className={`cursor-pointer rounded-xl overflow-hidden transition-shadow ${active
        ? "border-2 border-teal-400 shadow-lg shadow-teal-100 bg-teal-50/20"
        : "border-2 border-slate-100 shadow-sm bg-white hover:shadow-md"
        }`}
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none bg-slate-50 p-2 rounded-xl border border-slate-100">{typeDef.icon}</span>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-snug">{issue.title}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded mr-1">#{issue.ticketId}</span>
                <MapPin size={11} className="text-teal-500 shrink-0" />
                <span className="truncate max-w-[150px]">{issue.location}</span>
              </div>
            </div>
          </div>
          <span className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold ${sc.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
              <Users size={13} className="text-blue-500" />
              {votes} জন সমর্থন করেছেন
            </span>
            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">লক্ষ্য: ১০০</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-1">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
            <Clock size={12} />
            {issue.time}
          </span>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleVote}
            disabled={voting}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all border-2 ${voted
              ? "bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-300"
              : "bg-gradient-to-r from-teal-500 to-blue-600 border-transparent text-white shadow-md shadow-blue-200 hover:opacity-90"
              }`}
          >
            {voting ? <Loader2 size={14} className="animate-spin" /> : (voted ? <CheckCircle2 size={14} /> : <ThumbsUp size={14} />)}
            {voted ? "সমর্থিত" : "আমিও ভুক্তভোগী"}
          </motion.button>
        </div>
      </div>

      {/* Expandable Images and Map */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden bg-slate-50/50"
          >
            <div className="px-5 pb-5 pt-2 space-y-4 border-t border-slate-100">
              {/* Photos */}
              {issue.photos && issue.photos.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2.5 uppercase tracking-wide flex items-center gap-1.5">
                    <Camera size={14} /> সংযুক্ত ছবি
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {issue.photos.map((src, idx) => (
                      <div key={idx} className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-white shadow-sm hover:scale-105 transition-transform">
                        <img src={src} alt="Complaint view" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2.5 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin size={14} /> ম্যাপ অবস্থান
                </p>
                <MapEmbed location={issue.location} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Root Component ---
export default function Community() {
  const { data: session } = useSession();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [identifier, setIdentifier] = useState("");

  const [activeIssue, setActiveIssue] = useState(null);
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [issueType, setIssueType] = useState("");

  // Create a stable identifier (Email from session, or generate a random one locally for anon)
  useEffect(() => {
    if (session?.user?.email) {
      setIdentifier(session.user.email);
    } else {
      let lId = localStorage.getItem("anon_voter_id");
      if (!lId) {
        lId = "anon_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("anon_voter_id", lId);
      }
      setIdentifier(lId);
    }
  }, [session]);

  // Fetch Complaints
  useEffect(() => {
    if (!identifier) return; // Wait until local ID or email is ready

    const fetchComplaints = async () => {
      try {
        const res = await fetch("/api/complaints", { cache: "no-store" });
        const json = await res.json();
        if (res.ok && json.data) {
          const mapped = json.data.map(c => mapDataToIssue(c, identifier));
          // Sort basically pending/inprogress on top, or by votes
          mapped.sort((a, b) => b.votes - a.votes);
          setReports(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [identifier]);

  const upazilas = district ? BD_DATA[district] || [] : [];

  const filtered = reports.filter((issue) => {
    if (issueType) {
      // Find matching label to filter
      if (issue.type !== issueType && issue.type !== "other") { // Exact type string comparison is hard because issueType is Bengali Label, but mapping is needed. Wait, issue.type from server is 'road', 'water' etc.
        // Need to match issueType (Bangla Label) to id
        const selectedTypeObj = ISSUE_TYPES.find(t => t.label === issueType);
        if (selectedTypeObj && issue.type !== selectedTypeObj.id) return false;
      }
    }
    // Very Basic text filtering for location
    if (district && !issue.location.includes(district)) return false;
    if (upazila && !issue.location.includes(upazila)) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Users size={13} /> কমিউনিটি ভোটিং
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 leading-tight mb-4 tracking-tight">
            একসাথে দাবি করুন,<br />
            <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              দ্রুত সমাধান পান
            </span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-medium">
            ১০০ জন ভোট দিলে কর্তৃপক্ষ বুঝবে এটি গণদাবি — AI স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট দপ্তরে পাঠিয়ে দেবে।
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          className="bg-white rounded-3xl p-5 mb-8 shadow-xl shadow-slate-200/40 border border-slate-100"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <BdSelect
              label="জেলা"
              options={Object.keys(BD_DATA)}
              value={district}
              onChange={(v) => { setDistrict(v); setUpazila(""); }}
              placeholder="জেলা বেছে নিন"
            />
            <BdSelect
              label="উপজেলা / থানা"
              options={upazilas}
              value={upazila}
              onChange={setUpazila}
              placeholder={district ? "উপজেলা বেছে নিন" : "আগে জেলা বেছে নিন"}
            />
            <BdSelect
              label="সমস্যার ধরন"
              options={ISSUE_TYPES.map((t) => t.label)}
              value={issueType}
              onChange={setIssueType}
              placeholder="সব ধরন"
            />
            <button
              onClick={() => { setDistrict(""); setUpazila(""); setIssueType(""); }}
              className="w-full py-3.5 px-5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 text-sm font-bold flex flex-col items-center justify-center hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              রিসেট করুন
            </button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Issues list — 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5 px-1">
              <span className="text-lg font-black text-slate-800">অপেক্ষমাণ অভিযোগসমূহ</span>
              <span className="flex items-center gap-1.5 bg-red-50 text-red-600 text-[10px] uppercase font-extrabold px-3 py-1.5 rounded-full border border-red-200 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {loading ? (
                  <motion.div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                    <Loader2 size={32} className="animate-spin text-teal-500" />
                    <p className="text-sm font-semibold">তথ্য লোড হচ্ছে...</p>
                  </motion.div>
                ) : filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-20 text-slate-400 bg-white border border-slate-100 rounded-3xl"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <p className="text-base font-bold text-slate-600 mb-1">কোনো অভিযোগ পাওয়া যায়নি</p>
                    <p className="text-xs">আপনার ফিল্টার পরিবর্তন করে দেখতে পারেন</p>
                  </motion.div>
                ) : (
                  filtered.map((issue, i) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <IssueCard
                        issue={issue}
                        active={activeIssue === issue.id}
                        identifier={identifier}
                        onClick={() => setActiveIssue(activeIssue === issue.id ? null : issue.id)}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5 xl:sticky xl:top-24">

            {/* Stats */}
            <motion.div
              className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/30 border border-slate-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="flex items-center gap-2 font-black text-slate-800 text-sm mb-5 uppercase tracking-wide">
                <Zap size={16} className="text-teal-500" /> আজকের পরিসংখ্যান
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { num: "১,২৪৭", label: "মোট রিপোর্ট", color: "text-blue-600" },
                  { num: "৯৮৩", label: "সমাধান হয়েছে", color: "text-teal-600" },
                  { num: "৭৯%", label: "সমাধানের হার", color: "text-amber-500" },
                  { num: "৪৮ঘ", label: "গড় সময়", color: "text-violet-500" },
                ].map(({ num, label, color }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100/60 shadow-inner">
                    <span className={`block text-2xl font-black mb-1 ${color}`}>
                      {num}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 4-step */}
            <motion.div
              className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/30 border border-slate-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 }}
            >
              <p className="flex items-center gap-2 font-black text-slate-800 text-sm mb-5 uppercase tracking-wide">
                <CheckCircle2 size={16} className="text-emerald-500" /> ৪-ধাপের সাইকেল
              </p>
              <div className="flex flex-col gap-3.5">
                {PROCESS_STEPS.map((step) => (
                  <div key={step.num} className="flex items-start gap-3.5 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 ${step.numCls}`}>
                      {step.num}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-bold text-slate-800 leading-tight mb-0.5">{step.title}</p>
                      <p className="text-xs text-slate-500 leading-snug">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}