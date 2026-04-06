"use client";

import { useState } from "react";
import {
  Search, ChevronDown, ChevronRight, BookOpen,
  Zap, MessageSquare, FileText, MapPin, Trophy,
  Shield, Bell, Phone, Mail, ExternalLink,
  PlayCircle, CheckCircle2, AlertCircle, Lightbulb,
  ArrowRight, Star, Clock, Users
} from "lucide-react";

/* ─────────────────────────────────────
   DATA
───────────────────────────────────── */
const CATEGORIES = [
  {
    id: "start",
    icon: "🚀",
    label: "শুরু করুন",
    color: "#2563eb",
    bg: "#eff6ff",
    count: 5,
  },
  {
    id: "report",
    icon: "📋",
    label: "রিপোর্ট করুন",
    color: "#10b981",
    bg: "#f0fdf4",
    count: 7,
  },
  {
    id: "track",
    icon: "📡",
    label: "ট্র্যাক করুন",
    color: "#f59e0b",
    bg: "#fffbeb",
    count: 4,
  },
  {
    id: "points",
    icon: "🏆",
    label: "পয়েন্ট ও ব্যাজ",
    color: "#8b5cf6",
    bg: "#faf5ff",
    count: 4,
  },
  {
    id: "privacy",
    icon: "🛡",
    label: "গোপনীয়তা",
    color: "#ef4444",
    bg: "#fef2f2",
    count: 3,
  },
  {
    id: "account",
    icon: "⚙️",
    label: "অ্যাকাউন্ট",
    color: "#64748b",
    bg: "#f8fafc",
    count: 4,
  },
];

const FAQS = [
  // শুরু করুন
  {
    cat: "start",
    q: "নাগরিক বন্ধু কী এবং এটি কীভাবে কাজ করে?",
    a: "নাগরিক বন্ধু বাংলাদেশের প্রথম AI-চালিত সিভিক টেক প্ল্যাটফর্ম। আপনি রাস্তার গর্ত, বিদ্যুৎ বিভ্রাট, পানির সমস্যা সহ যেকোনো নাগরিক সমস্যা রিপোর্ট করতে পারবেন। AI স্বয়ংক্রিয়ভাবে সেটি সঠিক দপ্তরে পাঠাবে এবং আপনি রিয়েল-টাইমে সমাধানের অগ্রগতি দেখতে পাবেন।",
    tag: "জনপ্রিয়",
  },
  {
    cat: "start",
    q: "অ্যাকাউন্ট খুলতে কি লাগে?",
    a: "শুধু একটি সক্রিয় মোবাইল নম্বর বা ইমেইল ঠিকানা দরকার। OTP দিয়ে যাচাই করলেই অ্যাকাউন্ট তৈরি হয়ে যাবে। কোনো কাগজপত্র বা ফি লাগে না।",
  },
  {
    cat: "start",
    q: "অ্যাপটি কি বিনামূল্যে?",
    a: "হ্যাঁ, নাগরিক বন্ধু সম্পূর্ণ বিনামূল্যে। রিপোর্ট করা, ট্র্যাক করা, কমিউনিটিতে অংশ নেওয়া — সবই ফ্রি।",
    tag: "জনপ্রিয়",
  },
  {
    cat: "start",
    q: "কোন কোন ডিভাইসে ব্যবহার করা যাবে?",
    a: "যেকোনো স্মার্টফোন, ট্যাবলেট বা কম্পিউটার থেকে ব্রাউজারে ব্যবহার করা যাবে। Android ও iOS অ্যাপও শীঘ্রই আসছে।",
  },
  {
    cat: "start",
    q: "বাংলাদেশের কোন কোন জেলায় সেবা পাওয়া যাবে?",
    a: "বর্তমানে ঢাকা, চট্টগ্রাম, রাজশাহী, খুলনা, সিলেট, বরিশাল, রংপুর ও ময়মনসিংহ — সব বিভাগে সেবা চালু আছে। ধীরে ধীরে সারা দেশে বিস্তার করা হচ্ছে।",
  },

  // রিপোর্ট করুন
  {
    cat: "report",
    q: "কীভাবে প্রথম রিপোর্ট করব?",
    a: "'নতুন রিপোর্ট' বাটনে ক্লিক করুন → সমস্যার ধরন বেছে নিন → শিরোনাম ও বিবরণ লিখুন → GPS বা ম্যানুয়ালি অবস্থান দিন → ছবি বা ভয়েস যোগ করুন → জমা দিন। মাত্র ২ মিনিটের কাজ!",
    tag: "জনপ্রিয়",
  },
  {
    cat: "report",
    q: "রিপোর্টে কোন কোন ধরনের সমস্যা দেওয়া যাবে?",
    a: "রাস্তা ও যোগাযোগ, বিদ্যুৎ বিভ্রাট, পানি ও স্যানিটেশন, বর্জ্য ব্যবস্থাপনা, স্বাস্থ্য, শিক্ষা, দুর্নীতি এবং অন্যান্য নাগরিক সমস্যা রিপোর্ট করা যাবে।",
  },
  {
    cat: "report",
    q: "ছবি না দিলে কি রিপোর্ট গ্রহণ হবে?",
    a: "হ্যাঁ, ছবি ঐচ্ছিক। তবে ছবি থাকলে কর্তৃপক্ষ দ্রুত বুঝতে পারে এবং সমাধান তাড়াতাড়ি হয়। চেষ্টা করুন অন্তত একটি স্পষ্ট ছবি দিতে।",
  },
  {
    cat: "report",
    q: "Anonymous রিপোর্ট কি নিরাপদ?",
    a: "একদম নিরাপদ। Anonymous মোডে রিপোর্ট করলে আপনার নাম বা পরিচয় কোনোভাবেই প্রকাশ পাবে না। কর্তৃপক্ষ শুধু সমস্যার তথ্য দেখতে পাবে।",
    tag: "নতুন",
  },
  {
    cat: "report",
    q: "একদিনে কতটা রিপোর্ট করা যাবে?",
    a: "Verified অ্যাকাউন্টে দিনে সর্বোচ্চ ১০টি রিপোর্ট করা যাবে। স্প্যাম রোধে এই সীমা রাখা হয়েছে।",
  },
  {
    cat: "report",
    q: "ভুল রিপোর্ট দিলে কী করব?",
    a: "'আমার রিপোর্ট' পেজে গিয়ে সংশ্লিষ্ট রিপোর্টটি খুলুন। যদি এখনো Pending থাকে তাহলে Edit বা Delete করতে পারবেন। In Progress বা Solved অবস্থায় আর পরিবর্তন করা যাবে না।",
  },
  {
    cat: "report",
    q: "Voice দিয়ে রিপোর্ট করা কীভাবে?",
    a: "রিপোর্ট ফর্মের ৩য় ধাপে Microphone বাটন চাপুন এবং বাংলায় কথা বলুন। AI স্বয়ংক্রিয়ভাবে টেক্সটে রূপান্তর করবে।",
  },

  // ট্র্যাক করুন
  {
    cat: "track",
    q: "রিপোর্টের অগ্রগতি কোথায় দেখব?",
    a: "'আমার রিপোর্ট' পেজে সব রিপোর্টের স্ট্যাটাস দেখা যাবে। অথবা 'লাইভ ট্র্যাকার'-এ গিয়ে রিপোর্ট ID দিয়ে সরাসরি ট্র্যাক করুন।",
    tag: "জনপ্রিয়",
  },
  {
    cat: "track",
    q: "রিপোর্টের স্ট্যাটাসগুলো কী কী মানে?",
    a: "Pending = রিপোর্ট জমা হয়েছে, পর্যালোচনা বাকি। In Progress = কর্তৃপক্ষ কাজ শুরু করেছে। Solved = সমস্যা সমাধান হয়েছে। Rejected = যথেষ্ট তথ্য না থাকায় গ্রহণ করা হয়নি।",
  },
  {
    cat: "track",
    q: "সমাধান হতে কতদিন লাগে?",
    a: "ধরন ও জরুরি অবস্থার উপর নির্ভর করে। বিদ্যুৎ সমস্যা গড়ে ১-২ দিনে, রাস্তার সমস্যা ৩-৭ দিনে এবং বড় অবকাঠামো সমস্যা ২-৪ সপ্তাহে সমাধান হয়।",
  },
  {
    cat: "track",
    q: "রিপোর্টে কেউ সাড়া না দিলে কী করব?",
    a: "৭ দিনের বেশি Pending থাকলে 'Escalate' বাটনে ক্লিক করুন। এটি উচ্চতর কর্তৃপক্ষের নজরে আসবে এবং Community Voting-এ তুলুন যাতে বেশি মানুষ Upvote দেয়।",
  },

  // পয়েন্ট ও ব্যাজ
  {
    cat: "points",
    q: "পয়েন্ট কীভাবে পাই?",
    a: "প্রথম রিপোর্ট = ৫০ পয়েন্ট, প্রতিটি রিপোর্ট = ২০ পয়েন্ট, রিপোর্ট সমাধান হলে = ৩০ পয়েন্ট, কেউ Upvote দিলে = ৫ পয়েন্ট, দৈনিক লগইন = ৫ পয়েন্ট।",
    tag: "জনপ্রিয়",
  },
  {
    cat: "points",
    q: "পয়েন্ট দিয়ে কী পাব?",
    a: "পয়েন্ট দিয়ে লেভেল আপ হয়, বিশেষ ব্যাজ পাওয়া যায়। ভবিষ্যতে পয়েন্ট দিয়ে পুরস্কার ও কর ছাড়ের সুবিধা পাওয়া যাবে (Roadmap Q2 2026)।",
  },
  {
    cat: "points",
    q: "লেভেলগুলো কী কী?",
    a: "নতুন নাগরিক (০-১০০) → সক্রিয় নাগরিক (১০১-৫০০) → অগ্রদূত (৫০১-১০০০) → চ্যাম্পিয়ন (১০০১-২০০০) → পরিবর্তনকারী (২০০১+)।",
  },
  {
    cat: "points",
    q: "পয়েন্ট কি হারিয়ে যায়?",
    a: "মিথ্যা রিপোর্ট দিলে বা রিপোর্ট Rejected হলে পয়েন্ট কাটা যেতে পারে। এছাড়া সাধারণত পয়েন্ট কমে না।",
  },

  // গোপনীয়তা
  {
    cat: "privacy",
    q: "আমার ব্যক্তিগত তথ্য কি নিরাপদ?",
    a: "হ্যাঁ। আপনার তথ্য SSL এনক্রিপ্টেড সার্ভারে সংরক্ষিত। তৃতীয় পক্ষের সাথে কোনো তথ্য শেয়ার করা হয় না। বিস্তারিত আমাদের Privacy Policy দেখুন।",
    tag: "গুরুত্বপূর্ণ",
  },
  {
    cat: "privacy",
    q: "GPS ডেটা কি সংরক্ষিত হয়?",
    a: "শুধু রিপোর্টের অবস্থান তথ্য সংরক্ষিত হয়। আপনার রিয়েল-টাইম মুভমেন্ট ট্র্যাক করা হয় না। Settings থেকে GPS শেয়ার বন্ধ করতে পারবেন।",
  },
  {
    cat: "privacy",
    q: "অ্যাকাউন্ট মুছলে কি সব ডেটা যাবে?",
    a: "হ্যাঁ। অ্যাকাউন্ট ডিলিট করলে আপনার সব ব্যক্তিগত তথ্য মুছে যাবে। তবে পাবলিক রিপোর্টগুলো Anonymous হিসেবে থেকে যেতে পারে।",
  },

  // অ্যাকাউন্ট
  {
    cat: "account",
    q: "পাসওয়ার্ড ভুলে গেলে কী করব?",
    a: "লগইন পেজে 'পাসওয়ার্ড ভুলে গেছি' তে ক্লিক করুন। মোবাইল নম্বর বা ইমেইল দিলে OTP আসবে, সেটি দিয়ে নতুন পাসওয়ার্ড সেট করুন।",
  },
  {
    cat: "account",
    q: "ইমেইল বা মোবাইল পরিবর্তন করব কীভাবে?",
    a: "Settings → প্রোফাইল ট্যাবে গিয়ে ইমেইল বা মোবাইল নম্বর পরিবর্তন করুন। নতুন নম্বরে OTP যাচাই করতে হবে।",
  },
  {
    cat: "account",
    q: "একাধিক ডিভাইসে ব্যবহার করা যাবে?",
    a: "হ্যাঁ, একই অ্যাকাউন্টে যতগুলো ডিভাইসে চাইবেন লগইন করতে পারবেন। Settings → অ্যাকাউন্ট থেকে সব সেশন দেখতে ও লগআউট করতে পারবেন।",
  },
  {
    cat: "account",
    q: "Verified ব্যাজ কীভাবে পাব?",
    a: "জাতীয় পরিচয়পত্র (NID) বা জন্ম নিবন্ধন দিয়ে যাচাই করলে Verified ব্যাজ পাওয়া যাবে। এই ফিচার শীঘ্রই চালু হবে।",
    tag: "শীঘ্রই",
  },
];

const QUICK_STEPS = [
  { step: "১", title: "অ্যাকাউন্ট খুলুন", desc: "মোবাইল নম্বর দিয়ে ৩০ সেকেন্ডে নিবন্ধন করুন", icon: "📱", color: "#2563eb" },
  { step: "২", title: "সমস্যা দেখুন", desc: "আপনার এলাকায় কোনো সমস্যা চোখে পড়লে ছবি তুলুন", icon: "👀", color: "#10b981" },
  { step: "৩", title: "রিপোর্ট করুন", desc: "ফর্ম পূরণ করুন, GPS লোকেশন দিন, জমা দিন", icon: "📋", color: "#f59e0b" },
  { step: "৪", title: "ট্র্যাক করুন", desc: "রিয়েল-টাইমে অগ্রগতি দেখুন ও রেটিং দিন", icon: "📡", color: "#8b5cf6" },
];

/* ─────────────────────────────────────
   FAQ ITEM
───────────────────────────────────── */
function FaqItem({ faq, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className="rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden"
      style={{
        borderColor: open ? "#bfdbfe" : "#f1f5f9",
        background: open ? "#f8fbff" : "#fff",
        boxShadow: open ? "0 4px 20px rgba(37,99,235,0.08)" : "none",
      }}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: open ? "#2563eb" : "#f1f5f9", color: open ? "#fff" : "#94a3b8" }}>
          {idx + 1}
        </div>
        <p className="flex-1 text-sm font-bold text-slate-700">{faq.q}</p>
        {faq.tag && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: faq.tag === "জনপ্রিয়" ? "#eff6ff" : faq.tag === "নতুন" ? "#f0fdf4" : faq.tag === "গুরুত্বপূর্ণ" ? "#fef2f2" : "#faf5ff",
              color: faq.tag === "জনপ্রিয়" ? "#2563eb" : faq.tag === "নতুন" ? "#16a34a" : faq.tag === "গুরুত্বপূর্ণ" ? "#ef4444" : "#8b5cf6",
            }}>
            {faq.tag}
          </span>
        )}
        <ChevronDown size={16} className="text-slate-400 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </div>
      {open && (
        <div className="px-5 pb-5 pt-1">
          <div className="flex gap-3">
            <div className="w-px bg-blue-200 ml-3.5 flex-shrink-0 rounded-full" />
            <p className="text-sm text-slate-600 leading-relaxed pl-3">{faq.a}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   HELP PAGE
══════════════════════════════════════ */
export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  const filtered = FAQS.filter(f => {
    const matchCat = activeCat === "all" || f.cat === activeCat;
    const matchQ = f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const isSearching = search.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl"
        style={{ background: "linear-gradient(135deg,#0f2250 0%,#1e3a8a 40%,#2563eb 100%)" }}>

        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle,#60a5fa,transparent)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle,#a5b4fc,transparent)", transform: "translateY(40%)" }} />

        {/* dot grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative px-6 sm:px-10 py-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">সাহায্য কেন্দ্র</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
            কীভাবে সাহায্য করতে<br />পারি? 🤝
          </h1>
          <p className="text-blue-200 text-sm mb-8 max-w-md">
            নাগরিক বন্ধু ব্যবহার করতে গিয়ে কোনো প্রশ্ন থাকলে এখানেই উত্তর খুঁজে পাবেন।
          </p>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="প্রশ্ন লিখুন যেমন: রিপোর্ট কীভাবে করব..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
            />
            {search && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
                {filtered.length}টি ফলাফল
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { icon: FileText, label: `${FAQS.length}টি প্রশ্নোত্তর`, color: "#93c5fd" },
              { icon: Clock, label: "গড় পড়ার সময় ২ মিনিট", color: "#6ee7b7" },
              { icon: Star, label: "৯৮% সমস্যা সমাধান", color: "#fcd34d" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: s.color }}>
                <s.icon size={13} />
                <span className="font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK START STEPS ── */}
      {!isSearching && activeCat === "all" && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">দ্রুত শুরু করুন</h2>
          </div>
          <div className="grid sm:grid-cols-4 gap-3">
            {QUICK_STEPS.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{s.icon}</div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
                    style={{ background: `${s.color}18`, color: s.color }}>
                    {s.step}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CATEGORY FILTER ── */}
      {!isSearching && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">বিষয় অনুযায়ী খুঁজুন</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
            {/* All */}
            <button
              onClick={() => setActiveCat("all")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center"
              style={{
                borderColor: activeCat === "all" ? "#2563eb" : "#f1f5f9",
                background: activeCat === "all" ? "#eff6ff" : "#fff",
              }}>
              <span className="text-2xl">📚</span>
              <span className="text-[11px] font-bold" style={{ color: activeCat === "all" ? "#2563eb" : "#64748b" }}>সব</span>
            </button>
            {CATEGORIES.map(c => (
              <button key={c.id}
                onClick={() => setActiveCat(c.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center"
                style={{
                  borderColor: activeCat === c.id ? c.color : "#f1f5f9",
                  background: activeCat === c.id ? c.bg : "#fff",
                }}>
                <span className="text-2xl">{c.icon}</span>
                <span className="text-[11px] font-bold leading-tight" style={{ color: activeCat === c.id ? c.color : "#64748b" }}>
                  {c.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── FAQ LIST ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">
              {isSearching ? `"${search}" এর ফলাফল` : activeCat === "all" ? "সকল প্রশ্নোত্তর" : CATEGORIES.find(c => c.id === activeCat)?.label}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">{filtered.length}টি প্রশ্ন</span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 py-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-700 font-bold text-lg mb-2">কোনো ফলাফল পাওয়া যায়নি</p>
            <p className="text-slate-400 text-sm mb-6">অন্য শব্দ দিয়ে চেষ্টা করুন বা সরাসরি সাপোর্টে যোগাযোগ করুন</p>
            <button onClick={() => setSearch("")}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-blue-600 border-2 border-blue-200 hover:bg-blue-50 transition-colors">
              সব প্রশ্ন দেখুন
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((faq, i) => <FaqItem key={i} faq={faq} idx={i} />)}
          </div>
        )}
      </div>

      {/* ── CONTACT SUPPORT ── */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3 bg-white rounded-3xl border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb size={18} className="text-amber-500" />
            <h2 className="text-lg font-bold text-slate-800">এখনো প্রশ্ন আছে?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                icon: MessageSquare,
                title: "লাইভ চ্যাট",
                desc: "সরাসরি আমাদের টিমের সাথে কথা বলুন",
                action: "চ্যাট শুরু করুন",
                color: "#2563eb",
                bg: "#eff6ff",
                badge: "● অনলাইন",
                badgeColor: "#16a34a",
              },
              {
                icon: Mail,
                title: "ইমেইল সাপোর্ট",
                desc: "support@nagrikbondhu.com — ২৪ ঘন্টার মধ্যে উত্তর",
                action: "ইমেইল পাঠান",
                color: "#10b981",
                bg: "#f0fdf4",
                badge: "২৪ ঘন্টা",
                badgeColor: "#10b981",
              },
              {
                icon: Phone,
                title: "হেল্পলাইন",
                desc: "১৬১২৩ — সকাল ৯টা থেকে রাত ৯টা",
                action: "কল করুন",
                color: "#f59e0b",
                bg: "#fffbeb",
                badge: "রবি-বৃহস্পতি",
                badgeColor: "#f59e0b",
              },
            ].map((c, i) => (
              <div key={i} className="flex flex-col gap-4 p-5 rounded-xl border border-slate-100 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: c.bg }}>
                    <c.icon size={20} style={{ color: c.color }} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ background: `${c.badgeColor}18`, color: c.badgeColor }}>
                    {c.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{c.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
                </div>
                <button className="flex items-center gap-2 text-xs font-bold mt-auto group-hover:gap-3 transition-all"
                  style={{ color: c.color }}>
                  {c.action} <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER NOTE ── */}
      <div className="flex items-center justify-center gap-3 py-2 text-center">
        <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
        <p className="text-xs text-slate-400">
          এই পেজটি কি সাহায্যকারী ছিল? &nbsp;
          <button className="font-bold text-blue-600 hover:underline">হ্যাঁ 👍</button>
          &nbsp;/&nbsp;
          <button className="font-bold text-slate-500 hover:underline">না 👎</button>
        </p>
      </div>

    </div>
  );
}