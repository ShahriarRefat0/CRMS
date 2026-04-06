"use client";
import { useState } from "react";
import {
  MapPin, Bell, Zap, CheckCircle2, Star, ArrowRight,
  ArrowDown, Shield, Clock, Users, BarChart3, Eye,
  Smartphone, Server, Building2, UserCheck, Navigation,
  FileText, Cpu, Send, RefreshCw, TrendingUp, Lock,
  Unlock, Camera, MessageSquare, Award, ChevronDown,
  PlayCircle, Radio, Wifi,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

//  Data 

const MAIN_STEPS = [
  {
    id: 1,
    icon: <Smartphone size={28} />,
    emoji: "📱",
    title: "নাগরিক অভিযোগ করেন",
    subtitle: "Digital Reporting",
    color: "teal",
    gradFrom: "from-teal-500",
    gradTo: "to-cyan-500",
    bgLight: "bg-teal-50",
    border: "border-teal-200",
    textColor: "text-teal-700",
    ring: "ring-teal-300",
    desc: "নাগরিক মোবাইল বা ওয়েব থেকে সমস্যার ছবি, অবস্থান ও বিবরণ দিয়ে অভিযোগ জমা দেন। পরিচয় গোপন রাখার সুযোগও আছে।",
    substeps: [
      { icon: <Camera size={14} />, label: "ছবি তুলুন বা আপলোড করুন" },
      { icon: <Navigation size={14} />, label: "GPS বা ম্যানুয়ালি অবস্থান দিন" },
      { icon: <FileText size={14} />, label: "সমস্যার বিবরণ লিখুন" },
      { icon: <Lock size={14} />, label: "পরিচয় গোপন বা প্রকাশ বেছে নিন" },
    ],
    fact: "গড়ে ২ মিনিটেই একটি অভিযোগ জমা দেওয়া যায়",
  },
  {
    id: 2,
    icon: <Cpu size={28} />,
    emoji: "🤖",
    title: "AI বিশ্লেষণ করে",
    subtitle: "Smart AI Routing",
    color: "blue",
    gradFrom: "from-blue-500",
    gradTo: "to-indigo-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    textColor: "text-blue-700",
    ring: "ring-blue-300",
    desc: "আমাদের AI ইঞ্জিন অভিযোগটি বিশ্লেষণ করে সঠিক বিভাগ নির্ধারণ করে এবং স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট সরকারি দপ্তরে পাঠায়।",
    substeps: [
      { icon: <Zap size={14} />, label: "স্বয়ংক্রিয় ক্যাটাগরি নির্ধারণ" },
      { icon: <Building2 size={14} />, label: "সঠিক দপ্তর চিহ্নিতকরণ" },
      { icon: <Bell size={14} />, label: "তাৎক্ষণিক নোটিফিকেশন পাঠানো" },
      { icon: <BarChart3 size={14} />, label: "অগ্রাধিকার স্তর নির্ধারণ" },
    ],
    fact: "AI ৯৪% নির্ভুলতায় সঠিক দপ্তরে পাঠায়",
  },
  {
    id: 3,
    icon: <Building2 size={28} />,
    emoji: "🏛️",
    title: "কর্তৃপক্ষ ব্যবস্থা নেয়",
    subtitle: "Swift Action",
    color: "violet",
    gradFrom: "from-violet-500",
    gradTo: "to-purple-600",
    bgLight: "bg-violet-50",
    border: "border-violet-200",
    textColor: "text-violet-700",
    ring: "ring-violet-300",
    desc: "সংশ্লিষ্ট সরকারি দপ্তর অভিযোগটি তাদের ড্যাশবোর্ডে পায়। নির্ধারিত কর্মকর্তা মাঠ পর্যায়ে যাচাই করে পদক্ষেপ নেন।",
    substeps: [
      { icon: <Eye size={14} />, label: "দপ্তর অভিযোগ পর্যালোচনা করে" },
      { icon: <UserCheck size={14} />, label: "কর্মকর্তা মাঠে পরিদর্শন করেন" },
      { icon: <RefreshCw size={14} />, label: "কাজের অগ্রগতি আপডেট দেন" },
      { icon: <MessageSquare size={14} />, label: "নাগরিককে জানানো হয়" },
    ],
    fact: "৩২টি সরকারি সংস্থা এই পোর্টালে যুক্ত",
  },
  {
    id: 4,
    icon: <CheckCircle2 size={28} />,
    emoji: "✅",
    title: "সমাধান ও মূল্যায়ন",
    subtitle: "Resolution & Rating",
    color: "emerald",
    gradFrom: "from-emerald-500",
    gradTo: "to-teal-500",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    textColor: "text-emerald-700",
    ring: "ring-emerald-300",
    desc: "সমস্যা সমাধানের পর নাগরিককে জানানো হয়। তিনি রেটিং ও মতামত দিয়ে কর্তৃপক্ষের কার্যকারিতা মূল্যায়ন করেন।",
    substeps: [
      { icon: <CheckCircle2 size={14} />, label: "সমাধান সম্পন্ন হওয়ার নিশ্চিতকরণ" },
      { icon: <Star size={14} />, label: "নাগরিক রেটিং প্রদান করেন" },
      { icon: <TrendingUp size={14} />, label: "পারফরম্যান্স ড্যাশবোর্ড আপডেট" },
      { icon: <Award size={14} />, label: "সাফল্যের গল্প প্রকাশিত হয়" },
    ],
    fact: "৭৯% নাগরিক সমাধানে সন্তুষ্ট",
  },
];

const FEATURES = [
  {
    icon: <Shield size={22} />,
    title: "সম্পূর্ণ নিরাপদ",
    desc: "আপনার তথ্য এন্ড-টু-এন্ড এনক্রিপ্টেড। বেনামে অভিযোগের ক্ষেত্রে কোনো তথ্যই সংরক্ষণ হয় না।",
    cls: "from-slate-700 to-slate-800",
    iconBg: "bg-slate-600",
  },
  {
    icon: <Wifi size={22} />,
    title: "রিয়েল-টাইম ট্র্যাকিং",
    desc: "অভিযোগ কোথায় আছে, কে দেখছেন, কী পদক্ষেপ নেওয়া হচ্ছে — সব লাইভ দেখতে পাবেন।",
    cls: "from-teal-600 to-cyan-600",
    iconBg: "bg-teal-500",
  },
  {
    icon: <Radio size={22} />,
    title: "AI স্মার্ট রাউটিং",
    desc: "মেশিন লার্নিং অ্যালগরিদম অভিযোগ বিশ্লেষণ করে মিলিসেকেন্ডে সঠিক দপ্তরে পাঠায়।",
    cls: "from-blue-600 to-indigo-700",
    iconBg: "bg-blue-500",
  },
  {
    icon: <Users size={22} />,
    title: "কমিউনিটি ভোটিং",
    desc: "একই সমস্যায় ভুক্তভোগীরা একসাথে ভোট দিলে অভিযোগ গণদাবিতে পরিণত হয়।",
    cls: "from-violet-600 to-purple-700",
    iconBg: "bg-violet-500",
  },
];

const FLOW_NODES = [
  { label: "নাগরিক", icon: "👤", pos: "left" },
  { label: "Nagarik Bondhu App", icon: "📱", pos: "center-top" },
  { label: "AI Engine", icon: "🤖", pos: "center" },
  { label: "DNCC", icon: "🏙️", pos: "right-top" },
  { label: "WASA", icon: "💧", pos: "right-mid" },
  { label: "DPDC", icon: "⚡", pos: "right-bot" },
];

const FAQ = [
  {
    q: "অভিযোগ করতে কি নিবন্ধন করতে হবে?",
    a: "না। আপনি বিনা নিবন্ধনে বেনামে অভিযোগ করতে পারবেন। তবে আপডেট পেতে হলে ফোন নম্বর বা ইমেইল দেওয়া সুবিধাজনক।",
  },
  {
    q: "অভিযোগ করার পর কতদিনে সমাধান হয়?",
    a: "গড়ে ৪৮ ঘন্টা। তবে জরুরি সমস্যায় ২৪ ঘন্টার মধ্যেও সমাধান হয়েছে। সমস্যার ধরন ও মাত্রার উপর সময় নির্ভর করে।",
  },
  {
    q: "আমার অভিযোগ কি সত্যিই কর্তৃপক্ষ দেখে?",
    a: "হ্যাঁ। AI সরাসরি সংশ্লিষ্ট দপ্তরের কর্মকর্তার ড্যাশবোর্ডে পাঠায়। অভিযোগ \"দেখা হয়েছে\" স্ট্যাটাস আপনি রিয়েল-টাইমে দেখতে পাবেন।",
  },
  {
    q: "সমাধান না হলে কী করব?",
    a: "সমাধান না হলে অভিযোগ স্বয়ংক্রিয়ভাবে উচ্চতর কর্তৃপক্ষে এস্কেলেট হয়। আপনিও ম্যানুয়ালি ফলো-আপ করতে পারবেন।",
  },
];

// Sub-components 

function StepCard({ step, index, active, onClick }) {
  const colorMap = {
    teal: { grad: "from-teal-500 to-cyan-500", num: "bg-teal-500", pulse: "bg-teal-400" },
    blue: { grad: "from-blue-500 to-indigo-600", num: "bg-blue-500", pulse: "bg-blue-400" },
    violet: { grad: "from-violet-500 to-purple-600", num: "bg-violet-500", pulse: "bg-violet-400" },
    emerald: { grad: "from-emerald-500 to-teal-500", num: "bg-emerald-500", pulse: "bg-emerald-400" },
  };
  const c = colorMap[step.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex flex-col"
    >
      {/* Step card */}
      <motion.button
        onClick={onClick}
        whileHover={{ y: -3 }}
        className={`text-left w-full rounded-xl border-2 transition-all overflow-hidden ${active
            ? `${step.border} ${step.bgLight} shadow-lg`
            : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
          }`}
      >
        {/* Top gradient bar */}
        <div className={`h-1 bg-gradient-to-r ${c.grad}`} />

        <div className="p-5">
          {/* Number + icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${c.grad} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
              {step.icon}
              {active && (
                <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${c.pulse} animate-ping`} />
              )}
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step.textColor}`}>
                ধাপ {["০১", "০২", "০৩", "০৪"][index]} · {step.subtitle}
              </span>
              <h3 className="text-sm font-extrabold text-slate-800 leading-tight">{step.title}</h3>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-4">{step.desc}</p>

          {/* Sub-steps */}
          <div className="space-y-2">
            {step.substeps.map((sub, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${c.grad} flex items-center justify-center text-white flex-shrink-0`}>
                  {sub.icon}
                </div>
                <span className="text-xs text-slate-600 font-medium">{sub.label}</span>
              </div>
            ))}
          </div>

          {/* Fact pill */}
          <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-xl ${step.bgLight} ${step.border} border`}>
            <Zap size={12} className={step.textColor} />
            <span className={`text-[11px] font-bold ${step.textColor}`}>{step.fact}</span>
          </div>
        </div>
      </motion.button>

      {/* Arrow connector */}
      {index < MAIN_STEPS.length - 1 && (
        <div className="flex flex-col items-center py-3 text-slate-300">
          <div className="w-0.5 h-4 bg-slate-200" />
          <ArrowDown size={18} className="text-slate-300" />
          <div className="w-0.5 h-4 bg-slate-200" />
        </div>
      )}
    </motion.div>
  );
}

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-xl border-2 overflow-hidden transition-all ${open ? "border-teal-300 shadow-md" : "border-slate-200 bg-white"
        }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left"
      >
        <span className="text-sm font-bold text-slate-700">{item.q}</span>
        <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Flow Diagram 

function FlowDiagram() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 overflow-hidden relative">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <p className="text-xs font-black text-teal-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Radio size={13} />
        সিস্টেম আর্কিটেকচার
      </p>

      {/* Flow boxes */}
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Citizen */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-xl bg-teal-500/20 border-2 border-teal-500/40 flex items-center justify-center text-2xl">
            👤
          </div>
          <span className="text-xs font-bold text-teal-300 text-center">নাগরিক</span>
          <div className="w-px h-6 bg-teal-500/30" />
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg">
            📱
          </div>
          <span className="text-[10px] text-slate-400 font-semibold text-center">App / Web</span>
        </div>

        {/* AI Engine center */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
            <Cpu size={28} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-400 animate-ping opacity-75" />
          </div>
          <span className="text-xs font-black text-blue-300">AI Engine</span>
          <div className="flex gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <div className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 mt-1">
            <p className="text-[10px] text-slate-400 text-center font-semibold">বিশ্লেষণ → রাউটিং</p>
          </div>
        </div>

        {/* Authorities */}
        <div className="flex flex-col gap-2">
          {[
            { name: "DNCC", color: "bg-orange-500/20 border-orange-500/40 text-orange-300", icon: "🏙️" },
            { name: "WASA", color: "bg-blue-500/20 border-blue-500/40 text-blue-300", icon: "💧" },
            { name: "DPDC", color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300", icon: "⚡" },
            { name: "CCC", color: "bg-teal-500/20 border-teal-500/40 text-teal-300", icon: "🏛️" },
          ].map((a) => (
            <div key={a.name} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${a.color}`}>
              <span className="text-sm">{a.icon}</span>
              <span className="text-[10px] font-black">{a.name}</span>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Arrow indicators */}
      <div className="absolute top-1/2 left-[30%] -translate-y-1/2 flex items-center gap-0.5">
        {[0, 1, 2].map(i => (
          <ArrowRight key={i} size={12} className="text-teal-400/60" style={{ animationDelay: `${i * 200}ms` }} />
        ))}
      </div>
      <div className="absolute top-1/2 left-[58%] -translate-y-1/2 flex items-center gap-0.5">
        {[0, 1, 2].map(i => (
          <ArrowRight key={i} size={12} className="text-blue-400/60" />
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
        {[
          { num: "< 1s", label: "AI রাউটিং সময়" },
          { num: "99.9%", label: "আপটাইম" },
          { num: "৩২টি", label: "সংযুক্ত দপ্তর" },
        ].map(({ num, label }) => (
          <div key={label} className="text-center">
            <p className="text-lg font-black bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">{num}</p>
            <p className="text-[10px] text-slate-500 font-semibold">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

//  Timeline comparison 

function BeforeAfter() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Before */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center">
            <span className="text-white text-base">😔</span>
          </div>
          <div>
            <p className="text-xs font-black text-red-600 uppercase tracking-wider">আগে ছিল</p>
            <p className="text-sm font-extrabold text-red-700">ঐতিহ্যগত পদ্ধতি</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {[
            "থানায় বা অফিসে সশরীরে যেতে হতো",
            "কাগজে লিখে আবেদন জমা দিতে হতো",
            "কোথায় গেল কেউ জানত না",
            "মাসের পর মাস অপেক্ষা",
            "পরিচয় প্রকাশ ছাড়া অভিযোগ ছিল না",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-[10px] font-black">✕</span>
              </div>
              <span className="text-xs text-red-700 font-medium leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* After */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
            <span className="text-white text-base">✅</span>
          </div>
          <div>
            <p className="text-xs font-black text-emerald-600 uppercase tracking-wider">এখন আছে</p>
            <p className="text-sm font-extrabold text-emerald-700">নাগরিক বন্ধু</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {[
            "মোবাইল থেকে ২ মিনিটেই অভিযোগ",
            "GPS ও ছবিসহ ডিজিটাল জমা",
            "রিয়েল-টাইমে ট্র্যাকিং করা যায়",
            "গড়ে ৪৮ ঘন্টায় সমাধান",
            "বেনামে অভিযোগের সুযোগ",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-black">✓</span>
              </div>
              <span className="text-xs text-emerald-700 font-medium leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Component 

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-slate-50">



      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">

        {/* Hero  */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <PlayCircle size={13} />
            কিভাবে কাজ করে
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
            একটি অভিযোগ থেকে{" "}
            <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              সমাধানের পথ
            </span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            নাগরিক বন্ধু পোর্টালে আপনার অভিযোগ কীভাবে AI প্রযুক্তির মাধ্যমে সরকারি কর্তৃপক্ষের কাছে পৌঁছায় এবং সমাধান হয় — তার পুরো প্রক্রিয়া জানুন।
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: "⚡", val: "২ মিনিট", label: "অভিযোগ করতে" },
              { icon: "🤖", val: "< ১ সেকেন্ড", label: "AI রাউটিং" },
              { icon: "🏛️", val: "৩২টি", label: "সংযুক্ত দপ্তর" },
              { icon: "✅", val: "৪৮ ঘন্টা", label: "গড় সমাধান" },
            ].map(({ icon, val, label }) => (
              <div key={label} className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                <span className="text-xl">{icon}</span>
                <div className="text-left">
                  <p className="text-sm font-extrabold text-slate-800">{val}</p>
                  <p className="text-[11px] text-slate-500 font-semibold">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Grid  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* Left — 4 steps */}
          <div className="lg:col-span-2 space-y-0">
            {/* Before/After comparison */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp size={13} className="text-teal-500" />
                পরিবর্তনের চিত্র
              </p>
              <BeforeAfter />
            </motion.div>

            {/* Section title */}
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <RefreshCw size={13} className="text-teal-500" />
              ৪-ধাপের প্রক্রিয়া
            </p>

            {/* Steps */}
            <div className="flex flex-col">
              {MAIN_STEPS.map((step, i) => (
                <StepCard
                  key={step.id}
                  step={step}
                  index={i}
                  active={activeStep === step.id}
                  onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                />
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">

            {/* Flow Diagram */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FlowDiagram />
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Zap size={13} className="text-amber-500" />
                মূল বৈশিষ্ট্যসমূহ
              </p>
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl ${f.iconBg} bg-gradient-to-br ${f.cls} flex items-center justify-center text-white flex-shrink-0`}>
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-800">{f.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Privacy highlight */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl p-5 text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="text-xs text-violet-200 font-bold uppercase tracking-wider">গোপনীয়তা</p>
                  <p className="font-extrabold text-sm">আপনার পরিচয় সুরক্ষিত</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  "বেনামে অভিযোগ করা যায়",
                  "তথ্য এন্ড-টু-এন্ড এনক্রিপ্টেড",
                  "তৃতীয় পক্ষে শেয়ার হয় না",
                  "ISO 27001 সিকিউরিটি স্ট্যান্ডার্ড",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-violet-200">
                    <CheckCircle2 size={12} className="text-violet-300 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tracking Timeline section */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <Clock size={13} className="text-teal-500" />
              একটি অভিযোগের জীবনচক্র
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              ০ থেকে সমাধান —{" "}
              <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">ধাপে ধাপে</span>
            </h2>
          </div>

          {/* Horizontal timeline */}
          <div className="relative">
            {/* Line */}
            <div className="hidden sm:block absolute top-8 left-12 right-12 h-0.5 bg-gradient-to-r from-teal-300 via-blue-300 via-violet-300 to-emerald-300" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { time: "০ মিনিট", icon: "📱", label: "অভিযোগ জমা", sub: "নাগরিক অ্যাপে রিপোর্ট করেন", cls: "bg-teal-500", ring: "ring-teal-200" },
                { time: "< ১ সেকেন্ড", icon: "🤖", label: "AI প্রক্রিয়াকরণ", sub: "AI বিশ্লেষণ করে দপ্তরে পাঠায়", cls: "bg-blue-500", ring: "ring-blue-200" },
                { time: "১-২৪ ঘন্টা", icon: "🏛️", label: "কর্তৃপক্ষ গ্রহণ", sub: "দায়িত্বপ্রাপ্ত কর্মকর্তা দেখেন", cls: "bg-violet-500", ring: "ring-violet-200" },
                { time: "গড়ে ৪৮ঘন্টা", icon: "✅", label: "সমাধান সম্পন্ন", sub: "নাগরিক নিশ্চিতকরণ পান", cls: "bg-emerald-500", ring: "ring-emerald-200" },
              ].map(({ time, icon, label, sub, cls, ring }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className={`w-16 h-16 rounded-xl ${cls} flex items-center justify-center text-2xl shadow-lg ring-4 ${ring} mb-3 relative z-10`}>
                    {icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1`}>{time}</span>
                  <p className="text-sm font-extrabold text-slate-800 mb-1">{label}</p>
                  <p className="text-xs text-slate-500 leading-snug">{sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/*  Smart City Sectors  */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">কোন বিষয়ে অভিযোগ করা যায়</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              স্মার্ট সিটির{" "}
              <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">সব সমস্যায়</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "🛣️", label: "রাস্তা ও অবকাঠামো", count: "২৮৩", cls: "from-orange-400 to-amber-500" },
              { icon: "💧", label: "পানি সরবরাহ", count: "১৯৮", cls: "from-blue-400 to-cyan-500" },
              { icon: "⚡", label: "বিদ্যুৎ ব্যবস্থা", count: "১৭৬", cls: "from-yellow-400 to-amber-500" },
              { icon: "🗑️", label: "বর্জ্য ব্যবস্থাপনা", count: "১৩৪", cls: "from-green-500 to-emerald-500" },
              { icon: "🌊", label: "জলাবদ্ধতা", count: "৯৭", cls: "from-cyan-500 to-blue-500" },
              { icon: "💡", label: "স্ট্রিট লাইট", count: "৯৫", cls: "from-amber-400 to-orange-400" },
            ].map(({ icon, label, count, cls }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                whileHover={{ y: -4 }}
                className="bg-white border-2 border-slate-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cls} flex items-center justify-center text-2xl mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <p className="text-xs font-extrabold text-slate-700 leading-tight mb-1">{label}</p>
                <p className={`text-base font-black bg-gradient-to-br ${cls} bg-clip-text text-transparent`}>{count}</p>
                <p className="text-[10px] text-slate-400 font-semibold">সমাধান</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <MessageSquare size={13} className="text-teal-500" />
                সাধারণ প্রশ্ন
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-6">
                আপনার{" "}
                <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">জিজ্ঞাসা</span>
              </h2>
              <div className="space-y-3">
                {FAQ.map((item, i) => <FaqItem key={i} item={item} index={i} />)}
              </div>
            </div>

            {/* CTA side */}
            <div className="flex flex-col gap-5">
              {/* Main CTA */}
              <div className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-3xl p-8 text-white text-center shadow-xl shadow-teal-200">

                <h3 className="text-xl font-extrabold mb-2">এখনই শুরু করুন</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  মাত্র ২ মিনিটে আপনার এলাকার সমস্যা রিপোর্ট করুন। কোনো নিবন্ধন ছাড়াই।
                </p>
                <div className="flex flex-col gap-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-white text-teal-700 font-extrabold py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-transform text-sm shadow-lg">
                    <Send size={16} />
                    অভিযোগ করুন
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors text-sm">
                    <Eye size={16} />
                    সাফল্যের গল্প দেখুন
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">বিশ্বাসযোগ্যতা</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <Shield size={16} />, label: "সরকার অনুমোদিত", cls: "text-teal-600 bg-teal-50 border-teal-200" },
                    { icon: <Lock size={16} />, label: "SSL এনক্রিপ্টেড", cls: "text-blue-600 bg-blue-50 border-blue-200" },
                    { icon: <Users size={16} />, label: "১০,০০০+ ব্যবহারকারী", cls: "text-violet-600 bg-violet-50 border-violet-200" },
                    { icon: <Award size={16} />, label: "ডিজিটাল বাংলাদেশ", cls: "text-amber-600 bg-amber-50 border-amber-200" },
                  ].map(({ icon, label, cls }, i) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold ${cls}`}>
                      {icon}
                      <span className="leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}