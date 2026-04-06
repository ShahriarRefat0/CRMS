"use client";
import { useState } from "react";
import {
  CheckCircle2, MapPin, Clock, ThumbsUp, Star,
  ChevronDown, Filter, TrendingUp, Award, Users,
  Calendar, ArrowRight, Quote, Eye, Share2, Search,
  Zap, Shield, BarChart3, BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATS = [
  { num: "৯৮৩", label: "সমাধান হয়েছে", icon: <CheckCircle2 size={20} />, cls: "from-teal-500 to-emerald-500" },
  { num: "৪৮ঘ", label: "গড় সমাধানের সময়", icon: <Clock size={20} />, cls: "from-blue-500 to-cyan-500" },
  { num: "৩২টি", label: "সক্রিয় দপ্তর", icon: <Shield size={20} />, cls: "from-violet-500 to-purple-600" },
  { num: "৭৯%", label: "সন্তুষ্টির হার", icon: <Star size={20} />, cls: "from-amber-400 to-orange-500" },
];

const CATEGORIES = ["সব", "রাস্তা", "পানি", "বিদ্যুৎ", "বর্জ্য", "জলাবদ্ধতা", "আলো"];

const SUCCESS_STORIES = [
  {
    id: 1,
    trackingId: "NB-4A2F91",
    title: "মিরপুর ১০-এর ৩ বছরের পুরনো গর্ত মেরামত",
    category: "রাস্তা",
    icon: "🛣️",
    location: "মিরপুর ১০, ঢাকা",
    district: "ঢাকা",
    reportedDate: "১৫ জানুয়ারি ২০২৫",
    resolvedDate: "১৮ জানুয়ারি ২০২৫",
    daysToResolve: 3,
    votes: 312,
    views: 1840,
    authority: "ঢাকা উত্তর সিটি কর্পোরেশন",
    authorityShort: "DNCC",
    anonymous: false,
    reporterName: "রাহেলা বেগম",
    reporterArea: "মিরপুর",
    story: "মিরপুর ১০ নম্বর বাস স্ট্যান্ডের সামনে বছরের পর বছর ধরে বড় গর্ত ছিল। প্রতিদিন শত শত মানুষ দুর্ভোগ পোহাচ্ছিলেন, দুর্ঘটনাও ঘটছিল। নাগরিক বন্ধুতে ছবিসহ অভিযোগ করার মাত্র ৩ দিনের মধ্যে DNCC মেরামত কাজ শেষ করে।",
    beforeImg: null,
    afterImg: null,
    quote: "এই অ্যাপ না থাকলে আরও বছরখানেক এভাবেই পড়ে থাকত।",
    rating: 5,
    tags: ["দ্রুত সমাধান", "গণদাবি", "AI রাউটিং"],
    featured: true,
    impact: "প্রতিদিন ৫০০০+ মানুষের উপকার",
  },
  {
    id: 2,
    trackingId: "NB-7C1D44",
    title: "গুলশান ২-এর ফাটা পানির লাইন দ্রুত মেরামত",
    category: "পানি",
    icon: "💧",
    location: "গুলশান ২, ঢাকা",
    district: "ঢাকা",
    reportedDate: "২২ জানুয়ারি ২০২৫",
    resolvedDate: "২৩ জানুয়ারি ২০২৫",
    daysToResolve: 1,
    votes: 187,
    views: 920,
    authority: "ঢাকা ওয়াসা",
    authorityShort: "WASA",
    anonymous: true,
    reporterName: null,
    reporterArea: "গুলশান",
    story: "পানির লাইন ফেটে রাস্তায় পানি জমে যানজটের সৃষ্টি হয়েছিল। বেনামে অভিযোগ করা হয়। মাত্র ২৪ ঘন্টার মধ্যে WASA টিম এসে লাইন মেরামত করে।",
    quote: "পরিচয় না দিয়েও অভিযোগ করতে পারলাম, সমাধানও হল।",
    rating: 5,
    tags: ["বেনামে অভিযোগ", "২৪ঘ সমাধান"],
    featured: false,
    impact: "৩টি ব্লকের পানি সরবরাহ স্বাভাবিক",
  },
  {
    id: 3,
    trackingId: "NB-9E5B22",
    title: "উত্তরায় ৬ মাসের লোডশেডিং সমস্যার সমাধান",
    category: "বিদ্যুৎ",
    icon: "⚡",
    location: "উত্তরা সেক্টর ৭, ঢাকা",
    district: "ঢাকা",
    reportedDate: "৫ ফেব্রুয়ারি ২০২৫",
    resolvedDate: "১২ ফেব্রুয়ারি ২০২৫",
    daysToResolve: 7,
    votes: 534,
    views: 3200,
    authority: "ডিপিডিসি",
    authorityShort: "DPDC",
    anonymous: false,
    reporterName: "মোঃ আরিফুল ইসলাম",
    reporterArea: "উত্তরা",
    story: "উত্তরা সেক্টর ৭-এ দীর্ঘ ৬ মাস ধরে দিনে ৮-১০ ঘন্টা বিদ্যুৎ থাকত না। ৫০০ এরও বেশি মানুষ একসাথে অভিযোগ করেন। AI রাউটিং সরাসরি DPDC-র উচ্চপদস্থ কর্মকর্তার কাছে পাঠায়। পুরনো ট্রান্সফর্মার বদলে সমস্যার স্থায়ী সমাধান হয়।",
    quote: "৫০০ জন মিলে অভিযোগ করে ৬ মাসের সমস্যা ৭ দিনে সমাধান করেছি।",
    rating: 5,
    tags: ["গণঅভিযোগ", "স্থায়ী সমাধান", "ট্রান্সফর্মার"],
    featured: true,
    impact: "৫০০+ পরিবারের বিদ্যুৎ সমস্যা সমাধান",
  },
  {
    id: 4,
    trackingId: "NB-2K8R73",
    title: "চট্টগ্রামের বন্দর এলাকার জলাবদ্ধতা নিরসন",
    category: "জলাবদ্ধতা",
    icon: "🌊",
    location: "বন্দর, চট্টগ্রাম",
    district: "চট্টগ্রাম",
    reportedDate: "১০ ফেব্রুয়ারি ২০২৫",
    resolvedDate: "২০ ফেব্রুয়ারি ২০২৫",
    daysToResolve: 10,
    votes: 289,
    views: 1560,
    authority: "চট্টগ্রাম সিটি কর্পোরেশন",
    authorityShort: "CCC",
    anonymous: false,
    reporterName: "সাকিব হোসেন",
    reporterArea: "বন্দর",
    story: "বন্দর এলাকার প্রধান ড্রেনটি বছরের পর বছর পরিষ্কার না হওয়ায় বৃষ্টি হলেই হাঁটুপানি জমে যেত। অভিযোগের পর CCC ড্রেন পরিষ্কার ও সংস্কার করে।",
    quote: "বন্যার মৌসুমে এই কাজ না হলে পুরো এলাকা ডুবে যেত।",
    rating: 4,
    tags: ["ড্রেন সংস্কার", "বন্যা প্রতিরোধ"],
    featured: false,
    impact: "২টি ওয়ার্ডের জলাবদ্ধতা নিরসন",
  },
  {
    id: 5,
    trackingId: "NB-5P3M16",
    title: "রাজশাহীর নন্দন কাননে স্ট্রিট লাইট পুনঃস্থাপন",
    category: "আলো",
    icon: "💡",
    location: "নন্দন কানন, রাজশাহী",
    district: "রাজশাহী",
    reportedDate: "১ ফেব্রুয়ারি ২০২৫",
    resolvedDate: "৬ ফেব্রুয়ারি ২০২৫",
    daysToResolve: 5,
    votes: 143,
    views: 780,
    authority: "রাজশাহী সিটি কর্পোরেশন",
    authorityShort: "RCC",
    anonymous: false,
    reporterName: "নুসরাত জাহান",
    reporterArea: "নন্দন কানন",
    story: "পুরো পাড়ায় রাস্তার আলো নষ্ট ছিল। রাতে চলাফেরা বিপজ্জনক হয়ে পড়েছিল। ৫ দিনের মধ্যে RCC ৮টি নতুন এলইডি বাতি লাগিয়ে দেয়।",
    quote: "এখন রাতে নিরাপদে বাড়ি ফিরতে পারি।",
    rating: 5,
    tags: ["নিরাপত্তা", "LED আলো"],
    featured: false,
    impact: "১ কি.মি. রাস্তায় ৮টি LED বাতি",
  },
  {
    id: 6,
    trackingId: "NB-8T6V39",
    title: "সিলেটের আম্বরখানায় বর্জ্য ব্যবস্থাপনা উন্নয়ন",
    category: "বর্জ্য",
    icon: "🗑️",
    location: "আম্বরখানা, সিলেট",
    district: "সিলেট",
    reportedDate: "৮ ফেব্রুয়ারি ২০২৫",
    resolvedDate: "১৫ ফেব্রুয়ারি ২০২৫",
    daysToResolve: 7,
    votes: 201,
    views: 1120,
    authority: "সিলেট সিটি কর্পোরেশন",
    authorityShort: "SCC",
    anonymous: false,
    reporterName: "তামান্না আক্তার",
    reporterArea: "আম্বরখানা",
    story: "বাজার এলাকায় ময়লার স্তূপ পরিবেশ দূষণ করছিল। অভিযোগের পর SCC ৩টি নতুন ডাস্টবিন স্থাপন করে এবং নিয়মিত পরিষ্কারের রুটিন চালু করে।",
    quote: "এখন বাজারে আসতে আর নাক চেপে ধরতে হয় না।",
    rating: 4,
    tags: ["পরিবেশ", "ডাস্টবিন", "নিয়মিত পরিষ্কার"],
    featured: false,
    impact: "৩টি নতুন ডাস্টবিন, দৈনিক পরিষ্কার",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RatingStars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}
        />
      ))}
    </div>
  );
}

function DaysChip({ days }) {
  const cls =
    days <= 1 ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
      days <= 3 ? "bg-teal-100 text-teal-700 border-teal-200" :
        days <= 7 ? "bg-blue-100 text-blue-700 border-blue-200" :
          "bg-amber-100 text-amber-700 border-amber-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${cls}`}>
      <Zap size={11} />
      {days} দিনে সমাধান
    </span>
  );
}

function FeaturedCard({ story }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl"
    >
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400" />

      {/* Featured badge */}
      <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-amber-400 text-amber-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg">
        <Award size={13} />
        বিশেষ সাফল্য
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-3xl shrink-0">
            {story.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">{story.category}</span>
              <span className="text-slate-600">·</span>
              <DaysChip days={story.daysToResolve} />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug mb-2">
              {story.title}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <MapPin size={11} className="text-teal-400" />
              {story.location}
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-5 pl-4 border-l-2 border-teal-500">
          <Quote size={14} className="text-teal-400 mb-1" />
          <p className="text-slate-300 text-sm leading-relaxed italic">{story.quote}</p>
          <p className="text-xs text-slate-500 mt-1.5 font-semibold">
            — {story.anonymous ? "বেনামী নাগরিক" : story.reporterName}
          </p>
        </div>

        {/* Expand story */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">{story.story}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-teal-400 font-bold flex items-center gap-1 hover:text-teal-300 transition-colors"
        >
          {expanded ? "কম দেখুন" : "পুরো গল্প পড়ুন"}
          <ChevronDown size={13} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {/* Footer row */}
        <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {story.tags.map((t) => (
              <span key={t} className="text-[10px] font-bold bg-white/10 text-slate-300 px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1"><ThumbsUp size={11} />{story.votes}</span>
            <span className="flex items-center gap-1"><Eye size={11} />{story.views}</span>
            <RatingStars rating={story.rating} />
          </div>
        </div>

        {/* Impact pill */}
        <div className="mt-3 inline-flex items-center gap-2 bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold px-4 py-2 rounded-xl">
          <TrendingUp size={13} />
          {story.impact}
        </div>
      </div>
    </motion.div>
  );
}

function StoryCard({ story, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="bg-white rounded-xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
    >
      {/* Top color strip per category */}
      <div className={`h-1 ${story.category === "রাস্তা" ? "bg-orange-400" :
          story.category === "পানি" ? "bg-blue-400" :
            story.category === "বিদ্যুৎ" ? "bg-yellow-400" :
              story.category === "বর্জ্য" ? "bg-green-400" :
                story.category === "জলাবদ্ধতা" ? "bg-cyan-400" :
                  story.category === "আলো" ? "bg-amber-400" :
                    "bg-teal-400"
        }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-2xl shrink-0 border border-slate-200">
              {story.icon}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{story.title}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-teal-500 shrink-0" />
                <span className="text-xs text-slate-500">{story.location}</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
            <BadgeCheck size={13} />
            সমাধান
          </div>
        </div>

        {/* Days chip + authority */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <DaysChip days={story.daysToResolve} />
          <span className="text-xs text-slate-400 font-semibold bg-slate-100 px-2.5 py-1 rounded-full">
            {story.authorityShort}
          </span>
        </div>

        {/* Quote */}
        <div className="bg-slate-50 rounded-xl px-3.5 py-3 border-l-3 border-teal-400 mb-3">
          <p className="text-xs text-slate-600 leading-relaxed italic">“{story.quote}”</p>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold">
            — {story.anonymous ? "বেনামী নাগরিক" : story.reporterName}
          </p>
        </div>

        {/* Expand */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{story.story}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {story.tags.map((t) => (
                  <span key={t} className="text-[10px] font-bold bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full border border-teal-200">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="bg-teal-50 rounded-xl px-3.5 py-2.5 border border-teal-200 text-xs text-teal-700 font-bold flex items-center gap-2">
                <TrendingUp size={13} />
                প্রভাব: {story.impact}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1"><ThumbsUp size={11} />{story.votes}</span>
            <span className="flex items-center gap-1"><Eye size={11} />{story.views}</span>
            <RatingStars rating={story.rating} />
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-teal-600 font-bold flex items-center gap-1 hover:text-teal-700 transition-colors"
          >
            {expanded ? "কম দেখুন" : "বিস্তারিত"}
            <ChevronDown size={12} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Timeline component ───────────────────────────────────────────────────────

function SuccessTimeline() {
  const events = [
    { date: "জানুয়ারি ২০২৫", count: "১৪৫ টি", label: "অভিযোগ সমাধান" },
    { date: "ফেব্রুয়ারি ২০২৫", count: "২৩১ টি", label: "অভিযোগ সমাধান" },
    { date: "মার্চ ২০২৫", count: "৩০৮ টি", label: "অভিযোগ সমাধান" },
    { date: "এপ্রিল ২০২৫", count: "২৯৯ টি", label: "অভিযোগ সমাধান" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 overflow-hidden">
      <p className="font-extrabold text-slate-800 text-sm mb-5 flex items-center gap-2">
        <BarChart3 size={16} className="text-teal-500" />
        মাসওয়ারি সাফল্য
      </p>
      <div className="space-y-3">
        {events.map((e, i) => {
          const widths = ["w-[47%]", "w-[75%]", "w-[100%]", "w-[97%]"];
          return (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500 font-semibold">{e.date}</span>
                <span className="text-xs font-extrabold text-teal-700">{e.count}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500 ${widths[i]}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Authority Leaderboard ────────────────────────────────────────────────────

function AuthorityBoard() {
  const list = [
    { name: "DNCC", full: "ঢাকা উত্তর সিটি কর্পোরেশন", solved: 312, avg: "৩.২ দিন", cls: "from-teal-500 to-emerald-500" },
    { name: "WASA", full: "ঢাকা ওয়াসা", solved: 198, avg: "১.৮ দিন", cls: "from-blue-500 to-cyan-500" },
    { name: "DPDC", full: "ডিপিডিসি", solved: 176, avg: "৫.১ দিন", cls: "from-violet-500 to-purple-500" },
    { name: "CCC", full: "চট্টগ্রাম সিটি কর্প.", solved: 134, avg: "৬.৮ দিন", cls: "from-orange-400 to-amber-500" },
    { name: "RCC", full: "রাজশাহী সিটি কর্প.", solved: 89, avg: "৪.৫ দিন", cls: "from-rose-400 to-pink-500" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
      <p className="font-extrabold text-slate-800 text-sm mb-4 flex items-center gap-2">
        <Award size={16} className="text-amber-500" />
        দ্রুততম সংস্থা
      </p>
      <div className="space-y-3">
        {list.map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.cls} flex items-center justify-center text-white text-xs font-black shrink-0`}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">{a.full}</p>
              <p className="text-[10px] text-slate-400">{a.solved} সমাধান · গড় {a.avg}</p>
            </div>
            <span className="text-xs font-extrabold text-teal-600 shrink-0">{a.solved}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SafalyaGatha() {
  const [activeCategory, setActiveCategory] = useState("সব");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const featured = SUCCESS_STORIES.filter((s) => s.featured);
  const regular = SUCCESS_STORIES.filter((s) => !s.featured);

  const filtered = regular.filter((s) => {
    const matchCat = activeCategory === "সব" || s.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      s.title.includes(searchQuery) ||
      s.location.includes(searchQuery) ||
      s.district.includes(searchQuery);
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "fastest") return a.daysToResolve - b.daysToResolve;
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-slate-50">



      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/*Hero */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <Award size={13} />
            সাফল্য
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
            নাগরিকের কণ্ঠস্বর,{" "}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              সমস্যার সমাধান
            </span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            এখানে সেই সব সাফল্যের গল্প আছে যেখানে সাধারণ নাগরিকের একটি অভিযোগ বদলে দিয়েছে তাদের এলাকার চেহারা।
          </p>
        </motion.div>

        {/* Stats Bar  */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 text-center overflow-hidden relative group"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br ${s.cls}`} />
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.cls} flex items-center justify-center text-white mx-auto mb-3`}>
                {s.icon}
              </div>
              <p className={`text-3xl font-black bg-gradient-to-br ${s.cls} bg-clip-text text-transparent leading-none mb-1`}>
                {s.num}
              </p>
              <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Grid  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left — stories */}
          <div className="lg:col-span-2 space-y-8">

            {/* Featured stories */}
            {featured.map((s) => (
              <FeaturedCard key={s.id} story={s} />
            ))}

            {/* Filter & Search */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="এলাকা বা সমস্যা খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>

              {/* Category tabs */}
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeCategory === cat
                        ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-600"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500 font-semibold shrink-0">সাজান:</span>
                {[["recent", "সাম্প্র্রতিক"], ["votes", "সর্বোচ্চ ভোট"], ["fastest", "দ্রুততম"]].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setSortBy(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === val ? "bg-teal-100 text-teal-700" : "text-slate-500 hover:text-teal-600"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Story cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-2 text-center py-16 text-slate-400"
                  >
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-sm">এই ফিল্টারে কোনো সাফল্যের গল্প পাওয়া যায়নি</p>
                  </motion.div>
                ) : (
                  filtered.map((s, i) => <StoryCard key={s.id} story={s} index={i} />)
                )}
              </AnimatePresence>
            </div>
          </div>

          {/*  Sidebar */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">

            {/* Monthly chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SuccessTimeline />
            </motion.div>

            {/* Authority leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AuthorityBoard />
            </motion.div>

            {/* Citizen voice panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white"
            >
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">নাগরিকদের কথা</p>
              <div className="space-y-4">
                {[
                  { q: "আগে ভাবতাম অভিযোগ করে কোনো লাভ হয় না। এখন বিশ্বাস হয়।", name: "কামরুল হাসান, ঢাকা" },
                  { q: "বেনামে অভিযোগ করেছিলাম, সমাধানও হয়েছে। চমৎকার!", name: "অজ্ঞাতনামা, চট্টগ্রাম" },
                ].map(({ q, name }, i) => (
                  <div key={i} className="pl-3 border-l-2 border-teal-600">
                    <p className="text-xs text-slate-300 leading-relaxed italic">“{q}”</p>
                    <p className="text-[11px] text-slate-500 mt-1 font-semibold">— {name}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-xl p-6 text-white text-center shadow-lg shadow-teal-200"
            >
              <p className="text-3xl mb-2">📢</p>
              <p className="font-extrabold text-base mb-1.5">আপনিও পারবেন</p>
              <p className="text-xs text-white/80 mb-4 leading-relaxed">
                আপনার এলাকার সমস্যার কথা জানান — পরের সাফল্যের গল্পটা আপনার হোক।
              </p>
              <button className="inline-flex items-center gap-1.5 bg-white text-teal-700 font-extrabold text-sm px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-transform">
                <ArrowRight size={14} />
                অভিযোগ করুন
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}