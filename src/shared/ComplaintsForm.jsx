"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin, User, EyeOff, Eye, ChevronDown, ChevronRight,
  ChevronLeft, Camera, Upload, CheckCircle2, AlertCircle,
  Navigation, Loader2, Shield, Phone, Mail, X, Plus,
  FileText, Send, ArrowRight, Lock, Unlock, Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage } from "@/lib/imageUpload";

// Static Data 

const BD_DATA = {
  "ঢাকা": ["আদাবর", "বাড্ডা", "বনানী", "ডেমরা", "ধানমন্ডি", "গুলশান", "হাজারীবাগ", "খিলগাঁও", "কোতোয়ালি", "লালবাগ", "মিরপুর", "মোহাম্মদপুর", "মতিঝিল", "পল্লবী", "রমনা", "সবুজবাগ", "তেজগাঁও", "উত্তরা", "ওয়ারী"],
  "চট্টগ্রাম": ["আকবরশাহ", "বাকলিয়া", "বন্দর", "চান্দগাঁও", "ডাবলমুরিং", "হালিশহর", "কোতোয়ালি", "খুলশি", "পাঁচলাইশ", "পতেঙ্গা", "রাঙ্গুনিয়া", "রাউজান", "সীতাকুন্ড"],
  "রাজশাহী": ["বোয়ালিয়া", "চারঘাট", "দুর্গাপুর", "গোদাগাড়ী", "মোহনপুর", "পবা", "পুঠিয়া", "তানোর"],
  "খুলনা": ["বটিয়াঘাটা", "দাকোপ", "দিঘলিয়া", "দুমুরিয়া", "ফুলতলা", "কয়রা", "পাইকগাছা", "রূপসা", "তেরখাদা"],
  "বরিশাল": ["আগৈলঝাড়া", "বাকেরগঞ্জ", "বানারীপাড়া", "গৌরনদী", "হিজলা", "মেহেন্দিগঞ্জ", "উজিরপুর"],
  "সিলেট": ["বালাগঞ্জ", "বিয়ানীবাজার", "বিশ্বনাথ", "ছাতক", "দক্ষিণ সুরমা", "গোয়াইনঘাট", "জকিগঞ্জ", "সিলেট সদর"],
  "রংপুর": ["বদরগঞ্জ", "গঙ্গাচড়া", "কাউনিয়া", "মিঠাপুকুর", "পীরগঞ্জ", "রংপুর সদর", "তারাগঞ্জ"],
  "ময়মনসিংহ": ["ভালুকা", "ধোবাউড়া", "গফরগাঁও", "গৌরীপুর", "ঈশ্বরগঞ্জ", "ময়মনসিংহ সদর", "মুক্তাগাছা", "ত্রিশাল"],
  "কুমিল্লা": ["বরুড়া", "চান্দিনা", "চৌদ্দগ্রাম", "দাউদকান্দি", "দেবীদ্বার", "কুমিল্লা সদর", "লাকসাম", "মুরাদনগর"],
  "গাইবান্ধা": ["ফুলছড়ি", "গোবিন্দগঞ্জ", "পলাশবাড়ী", "সাদুল্লাপুর", "সাঘাটা", "সুন্দরগঞ্জ", "গাইবান্ধা সদর"],
};

const ISSUE_CATEGORIES = [
  { id: "road", label: "ভাঙা রাস্তা", icon: "🛣️", desc: "রাস্তার গর্ত, ভাঙা পিচ, ফুটপাত সমস্যা" },
  { id: "water", label: "পানি সমস্যা", icon: "💧", desc: "পানির লাইন ফাটা, সরবরাহ বন্ধ, দূষণ" },
  { id: "electricity", label: "বিদ্যুৎ বিভ্রাট", icon: "⚡", desc: "লোডশেডিং, তার ঝুলে পড়া, ট্রান্সফর্মার" },
  { id: "waste", label: "বর্জ্য ব্যবস্থাপনা", icon: "🗑️", desc: "ময়লা জমে থাকা, ডাস্টবিন না থাকা" },
  { id: "drainage", label: "জলাবদ্ধতা", icon: "🌊", desc: "ড্রেন বন্ধ, বৃষ্টির পানি জমে থাকা" },
  { id: "streetlight", label: "রাস্তার আলো", icon: "💡", desc: "স্ট্রিট লাইট নষ্ট বা অনুপস্থিত" },
  { id: "tree", label: "গাছ/পরিবেশ", icon: "🌳", desc: "বিপজ্জনক গাছ, পার্ক সমস্যা" },
  { id: "noise", label: "শব্দ দূষণ", icon: "🔊", desc: "অতিরিক্ত শব্দ, মাইকের উপদ্রব" },
  { id: "other", label: "অন্যান্য", icon: "📋", desc: "উপরের বিভাগে পড়ে না এমন সমস্যা" },
];

const SEVERITY_LEVELS = [
  { id: "low", label: "স্বাভাবিক", desc: "সমস্যা আছে, জরুরি নয়", cls: "border-emerald-300 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  { id: "medium", label: "মাঝারি", desc: "দ্রুত সমাধান প্রয়োজন", cls: "border-amber-300 bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  { id: "high", label: "জরুরি", desc: "অবিলম্বে পদক্ষেপ দরকার", cls: "border-red-300 bg-red-50 text-red-700", dot: "bg-red-500" },
];

const STEPS = [
  { id: 1, label: "পরিচয়", icon: <User size={14} /> },
  { id: 2, label: "সমস্যা", icon: <AlertCircle size={14} /> },
  { id: 3, label: "অবস্থান", icon: <MapPin size={14} /> },
  { id: 4, label: "বিবরণ", icon: <FileText size={14} /> },
  { id: 5, label: "পর্যালোচনা", icon: <CheckCircle2 size={14} /> },
];

// Reusable sub-components 

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-20 mt-30">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{
                scale: current === step.id ? 1.1 : 1,
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${current > step.id
                ? "bg-teal-500 text-white shadow-md shadow-teal-200"
                : current === step.id
                  ? "bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-slate-100 text-slate-400"
                }`}
            >
              {current > step.id ? <CheckCircle2 size={16} /> : step.icon}
            </motion.div>
            <span className={`text-[10px] font-semibold hidden sm:block ${current >= step.id ? "text-teal-600" : "text-slate-400"
              }`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 sm:w-14 h-0.5 mb-4 mx-1 transition-colors duration-300 ${current > step.id ? "bg-teal-400" : "bg-slate-200"
              }`} />
          )}
        </div>
      ))}
    </div>
  );
}

function BdSelect({ label, options, value, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {label && <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">{label}</label>}
      <button
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all focus:outline-none ${disabled
          ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
          : "border-slate-200 bg-white text-slate-700 hover:border-teal-400 focus:border-teal-500"
          }`}
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>{value || placeholder}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-2xl border border-slate-100 overflow-y-auto max-h-56"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-teal-50 hover:text-teal-700 ${value === opt ? "bg-teal-50 text-teal-700 font-semibold" : "text-slate-700"
                  }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ label, placeholder, value, onChange, type = "text", icon, required, helper, readOnly = false }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={readOnly}
          className={`w-full py-3 pr-4 rounded-xl border-2 border-slate-200 ${readOnly ? "bg-slate-100 text-slate-500" : "bg-white text-slate-800"} text-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors ${icon ? "pl-10" : "pl-4"
            }`}
        />
      </div>
      {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

// Step 1  Identity 

function StepIdentity({ data, setData, readOnly = false }) {
  const isAnon = data.anonymous;
  const identityLocked = readOnly && !isAnon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">আপনার পরিচয়</h2>
        <p className="text-sm text-slate-500">আপনি চাইলে পরিচয় গোপন রেখে অভিযোগ করতে পারেন।</p>
      </div>

      {/* Toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setData({ ...data, anonymous: false })}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${!isAnon
            ? "border-teal-400 bg-teal-50 shadow-md shadow-teal-100"
            : "border-slate-200 bg-white hover:border-slate-300"
            }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!isAnon ? "bg-teal-500" : "bg-slate-100"}`}>
            <Unlock size={18} className={!isAnon ? "text-white" : "text-slate-400"} />
          </div>
          <div className="text-center">
            <p className={`text-sm font-bold ${!isAnon ? "text-teal-700" : "text-slate-600"}`}>পরিচয় প্রকাশ</p>
            <p className="text-xs text-slate-400 mt-0.5">নাম ও যোগাযোগ দেবেন</p>
          </div>
          {!isAnon && <span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full font-bold">নির্বাচিত</span>}
        </button>

        <button
          onClick={() => setData({ ...data, anonymous: true })}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${isAnon
            ? "border-violet-400 bg-violet-50 shadow-md shadow-violet-100"
            : "border-slate-200 bg-white hover:border-slate-300"
            }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAnon ? "bg-violet-500" : "bg-slate-100"}`}>
            <Lock size={18} className={isAnon ? "text-white" : "text-slate-400"} />
          </div>
          <div className="text-center">
            <p className={`text-sm font-bold ${isAnon ? "text-violet-700" : "text-slate-600"}`}>পরিচয় গোপন</p>
            <p className="text-xs text-slate-400 mt-0.5">সম্পূর্ণ বেনামে</p>
          </div>
          {isAnon && <span className="text-xs bg-violet-500 text-white px-2 py-0.5 rounded-full font-bold">নির্বাচিত</span>}
        </button>
      </div>

      {/* Anonymous info box */}
      <AnimatePresence mode="wait">
        {isAnon ? (
          <motion.div
            key="anon"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex gap-3 p-4 bg-violet-50 border border-violet-200 rounded-xl"
          >
            <Shield size={18} className="text-violet-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-violet-700 mb-0.5">পরিচয় সম্পূর্ণ সুরক্ষিত</p>
              <p className="text-xs text-violet-500 leading-relaxed">
                আপনার নাম, ফোন বা কোনো তথ্য সংরক্ষণ করা হবে না। অভিযোগটি বেনামে নথিভুক্ত হবে।
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="named"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <InputField
              label="পুরো নাম"
              placeholder="আপনার নাম লিখুন"
              value={data.name}
              onChange={(v) => setData({ ...data, name: v })}
              icon={<User size={15} />}
              required
              readOnly={identityLocked}
            />
            <InputField
              label="মোবাইল নম্বর"
              placeholder="01XXXXXXXXX"
              value={data.phone}
              onChange={(v) => setData({ ...data, phone: v })}
              icon={<Phone size={15} />}
              type="tel"
              helper="সমাধানের আপডেট পাঠানো হবে (ঐচ্ছিক)"
              readOnly={identityLocked}
            />
            <InputField
              label="ইমেইল"
              placeholder="email@example.com"
              value={data.email}
              onChange={(v) => setData({ ...data, email: v })}
              icon={<Mail size={15} />}
              type="email"
              helper="ঐচ্ছিক"
              readOnly={identityLocked}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Step 2 Issue Type 

function StepIssueType({ data, setData, sessiion }) {
  console.log("data-here-user:", sessiion)
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">সমস্যার ধরন</h2>
        <p className="text-sm text-slate-500">কোন ধরনের সমস্যার অভিযোগ করছেন?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ISSUE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setData({ ...data, category: cat.id })}
            className={`flex flex-col items-start gap-2 p-3.5 rounded-xl border-2 text-left transition-all ${data.category === cat.id
              ? "border-teal-400 bg-teal-50 shadow-md shadow-teal-100"
              : "border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/30"
              }`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <div>
              <p className={`text-xs font-bold leading-tight ${data.category === cat.id ? "text-teal-700" : "text-slate-700"}`}>
                {cat.label}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed hidden sm:block">{cat.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Severity */}
      {data.category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
            সমস্যার মাত্রা <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {SEVERITY_LEVELS.map((s) => (
              <button
                key={s.id}
                onClick={() => setData({ ...data, severity: s.id })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${data.severity === s.id ? s.cls + " shadow-sm" : "border-slate-200 bg-white"
                  }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${data.severity === s.id ? s.dot : "bg-slate-300"}`} />
                <p className="text-xs font-bold text-center">{s.label}</p>
                <p className="text-[10px] text-slate-400 text-center leading-tight hidden sm:block">{s.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Step 3 — Location ────────────────────────────────────────────────────────

function StepLocation({ data, setData }) {
  const [gpsStatus, setGpsStatus] = useState("idle"); // idle | loading | success | error
  const [gpsMapQuery, setGpsMapQuery] = useState("");

  const getGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatus("error");
      return;
    }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setData((d) => ({ ...d, lat: latitude, lng: longitude, gpsGranted: true }));
        setGpsMapQuery(`${latitude},${longitude}`);
        setGpsStatus("success");
      },
      () => setGpsStatus("error"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [setData]);

  const mapQuery = data.district
    ? data.upazila
      ? `${data.upazila}, ${data.district}, Bangladesh`
      : `${data.district}, Bangladesh`
    : gpsMapQuery;

  const upazilas = data.district ? BD_DATA[data.district] || [] : [];
  const mapSrc = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=15&hl=bn`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">অবস্থান নির্ধারণ</h2>
        <p className="text-sm text-slate-500">সমস্যার সঠিক স্থান জানান।</p>
      </div>

      {/* GPS Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={getGPS}
          disabled={gpsStatus === "loading"}
          className={`flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all flex-1 ${gpsStatus === "success"
            ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-300"
            : gpsStatus === "error"
              ? "bg-red-50 text-red-600 border-2 border-red-300"
              : "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md hover:opacity-90 active:scale-95"
            }`}
        >
          {gpsStatus === "loading" ? (
            <><Loader2 size={16} className="animate-spin" /> GPS লোড হচ্ছে...</>
          ) : gpsStatus === "success" ? (
            <><CheckCircle2 size={16} /> লাইভ লোকেশন সংযুক্ত</>
          ) : gpsStatus === "error" ? (
            <><AlertCircle size={16} /> আবার চেষ্টা করুন</>
          ) : (
            <><Navigation size={16} /> লাইভ GPS লোকেশন নিন</>
          )}
        </button>

        {gpsStatus === "success" && data.lat && (
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono">
            <MapPin size={13} className="text-teal-500 shrink-0" />
            {data.lat.toFixed(5)}, {data.lng.toFixed(5)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-semibold">অথবা এলাকা বেছে নিন</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* District / Upazila */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BdSelect
          label="জেলা"
          options={Object.keys(BD_DATA)}
          value={data.district}
          onChange={(v) => setData((d) => ({ ...d, district: v, upazila: "" }))}
          placeholder="জেলা বেছে নিন"
        />
        <BdSelect
          label="উপজেলা / থানা"
          options={upazilas}
          value={data.upazila}
          onChange={(v) => setData((d) => ({ ...d, upazila: v }))}
          placeholder={data.district ? "উপজেলা বেছে নিন" : "আগে জেলা বেছে নিন"}
          disabled={!data.district}
        />
      </div>

      {/* Address field */}
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
          সুনির্দিষ্ট ঠিকানা
        </label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => {
            setData((d) => ({ ...d, address: e.target.value }));
            if (e.target.value.length > 5) setMapQuery(e.target.value + " Bangladesh");
          }}
          placeholder="যেমন: মিরপুর ১০ নম্বর রোড, গেট নম্বর ৩-এর সামনে"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
        />
      </div>

      {/* Map Preview */}
      <AnimatePresence>
        {mapSrc && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative w-full h-56 rounded-xl overflow-hidden border-2 border-teal-200">
              <iframe
                title="map-preview"
                width="100%"
                height="100%"
                className="border-0"
                loading="lazy"
                allowFullScreen
                src={mapSrc}
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md pointer-events-none">
                {gpsStatus === "success" ? (
                  <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-xs font-bold text-slate-700">লাইভ লোকেশন</span></>
                ) : (
                  <><MapPin size={12} className="text-teal-600" /><span className="text-xs font-bold text-slate-700">ম্যাপ প্রিভিউ</span></>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Step 4 — Description ─────────────────────────────────────────────────────

function StepDescription({ data, setData }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    const arr = Array.from(files).slice(0, 4);
    if (arr.length === 0) return;

    const newPhotos = arr.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      url: null,
      status: "pending",
    }));

    setData((d) => {
      const combined = [...(d.photos || []), ...newPhotos].slice(0, 4);
      return { ...d, photos: combined };
    });

    setUploading(true);
    await Promise.all(
      newPhotos.map(async (photo) => {
        try {
          const url = await uploadImage(photo.file);
          setData((d) => ({
            ...d,
            photos: d.photos.map((p) =>
              p.id === photo.id ? { ...p, url, status: "done" } : p
            ),
          }));
        } catch (err) {
          console.error("Image upload failed", err);
          setData((d) => ({
            ...d,
            photos: d.photos.map((p) =>
              p.id === photo.id ? { ...p, status: "error" } : p
            ),
          }));
        }
      })
    );
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removePhoto = (i) =>
    setData((d) => {
      const toRemove = d.photos[i];
      if (toRemove?.preview) URL.revokeObjectURL(toRemove.preview);
      return { ...d, photos: d.photos.filter((_, idx) => idx !== i) };
    });

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">বিস্তারিত বিবরণ</h2>
        <p className="text-sm text-slate-500">সমস্যাটি সম্পর্কে বিস্তারিত জানান।</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
          অভিযোগের শিরোনাম <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
          placeholder="সংক্ষেপে সমস্যা বর্ণনা করুন"
          maxLength={100}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
        />
        <p className="mt-1 text-right text-xs text-slate-400">{data.title?.length || 0}/100</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
          বিস্তারিত বিবরণ <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
          placeholder="সমস্যাটি কখন থেকে চলছে, কীভাবে মানুষ ক্ষতিগ্রস্ত হচ্ছে, আগে কোনো অভিযোগ করা হয়েছিল কিনা..."
          rows={5}
          maxLength={1000}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors resize-none"
        />
        <p className="mt-1 text-right text-xs text-slate-400">{data.description?.length || 0}/1000</p>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
          ছবি সংযুক্ত করুন (সর্বোচ্চ ৪টি)
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Uploaded previews */}
          {(data.photos || []).map((photo, i) => {
            const src = photo.url || photo.preview;
            const isUploading = photo.status === "pending";
            const isError = photo.status === "error";

            return (
              <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 group">
                <img src={src} alt="" className="w-full h-full object-cover" />

                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-white" />
                  </div>
                )}

                {isError && (
                  <div className="absolute inset-0 bg-red-500/25 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-700">আপলোড ব্যর্থ</span>
                  </div>
                )}

                <button
                  onClick={() => removePhoto(i)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            );
          })}

          {/* Add button */}
          {(data.photos || []).length < 4 && (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={`aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50 transition-all flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-teal-500 ${uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <Plus size={20} />
              <span className="text-xs font-semibold">ছবি যোগ করুন</span>
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
          <Info size={11} /> ছবি থাকলে অভিযোগ দ্রুত প্রক্রিয়া হয়
        </p>
      </div>
    </motion.div>
  );
}

// ─── Step 5 — Review & Submit ─────────────────────────────────────────────────

function StepReview({ data, onSubmit, loading, error }) {
  const category = ISSUE_CATEGORIES.find((c) => c.id === data.category);
  const severity = SEVERITY_LEVELS.find((s) => s.id === data.severity);

  const rows = [
    { label: "পরিচয়", value: data.anonymous ? "বেনামে (গোপন)" : (data.name || "—") },
    { label: "সমস্যার ধরন", value: category ? `${category.icon} ${category.label}` : "—" },
    { label: "মাত্রা", value: severity?.label || "—" },
    { label: "জেলা", value: data.district || "—" },
    { label: "উপজেলা", value: data.upazila || "—" },
    { label: "ঠিকানা", value: data.address || "—" },
    { label: "শিরোনাম", value: data.title || "—" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">পর্যালোচনা ও জমা দিন</h2>
        <p className="text-sm text-slate-500">সবকিছু ঠিক আছে কিনা দেখে নিন।</p>
      </div>

      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
        {rows.map(({ label, value }, i) => (
          <div key={label} className={`flex items-start gap-3 px-4 py-3 ${i < rows.length - 1 ? "border-b border-slate-200" : ""}`}>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide w-24 shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-slate-700 font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* Photo strip */}
      {data.photos?.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">সংযুক্ত ছবি</p>
          <div className="flex gap-2">
            {data.photos.map((photo) => {
              const src = photo.url || photo.preview;
              return (
                <img
                  key={photo.id}
                  src={src}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Description preview */}
      {data.description && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">বিবরণ</p>
          <p className="text-sm text-slate-700 leading-relaxed">{data.description}</p>
        </div>
      )}

      {/* GPS badge */}
      {data.gpsGranted && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <Navigation size={14} className="text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700">লাইভ GPS লোকেশন সংযুক্ত: {data.lat?.toFixed(5)}, {data.lng?.toFixed(5)}</span>
        </div>
      )}

      {error && (
        <p className="text-center text-sm text-red-600 font-medium">{error}</p>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-white font-extrabold text-base shadow-lg transition-all ${loading
          ? "bg-slate-200 text-slate-500 cursor-not-allowed"
          : "bg-gradient-to-r from-teal-500 to-blue-600 shadow-blue-200 hover:opacity-90 active:scale-95"
          }`}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {loading ? "জমা দেওয়া হচ্ছে..." : "অভিযোগ জমা দিন"}
      </button>

      <p className="text-center text-xs text-slate-400">
        জমা দেওয়ার পর একটি ট্র্যাকিং নম্বর পাবেন।
      </p>
    </motion.div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ trackingId, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="text-center py-8 px-4 space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-teal-200"
      >
        <CheckCircle2 size={40} className="text-white" />
      </motion.div>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">অভিযোগ সফলভাবে জমা হয়েছে!</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
          আপনার অভিযোগটি AI-এর মাধ্যমে সংশ্লিষ্ট কর্তৃপক্ষের কাছে পাঠানো হচ্ছে।
        </p>
      </div>

      <div className="inline-flex flex-col items-center gap-1 px-8 py-4 bg-teal-50 border-2 border-teal-200 rounded-xl">
        <span className="text-xs font-bold text-teal-500 uppercase tracking-widest">ট্র্যাকিং নম্বর</span>
        <span className="text-2xl font-black text-teal-700 tracking-wider">{trackingId}</span>
        <span className="text-xs text-slate-400">এই নম্বর দিয়ে অভিযোগের অগ্রগতি ট্র্যাক করুন</span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: "🔔", label: "কর্তৃপক্ষকে জানানো হচ্ছে" },
          { icon: "⏱️", label: "৪৮ ঘন্টার মধ্যে পদক্ষেপ" },
          { icon: "📱", label: "SMS আপডেট পাবেন" },
        ].map(({ icon, label }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xl mb-1">{icon}</p>
            <p className="text-[11px] text-slate-500 font-semibold leading-tight">{label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="w-full py-3.5 rounded-xl border-2 border-teal-300 text-teal-700 font-bold text-sm hover:bg-teal-50 transition-colors"
      >
        নতুন অভিযোগ করুন
      </button>
    </motion.div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

const INITIAL_DATA = {
  // identity
  anonymous: false, name: "", phone: "", email: "",
  // issue
  category: "", severity: "",
  // location
  district: "", upazila: "", address: "", lat: null, lng: null, gpsGranted: false,
  // description
  title: "", description: "", photos: [],
};

function canProceed(step, data) {
  if (step === 1) {
    if (data.anonymous) return true;
    return !!(
      (data.name && data.name.trim().length >= 2) ||
      (data.phone && data.phone.trim()) ||
      (data.email && data.email.trim())
    );
  }
  if (step === 2) return !!data.category && !!data.severity;
  if (step === 3) return !!(data.district || data.lat);
  if (step === 4) return !!data.title && !!data.description;
  return true;
}

export default function ComplaintsForm({ session }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user) return;

    setData((prev) => ({
      ...prev,
      anonymous: false,
      name: session.user.name || prev.name,
      email: session.user.email || prev.email,
      phone: session.user.phone || prev.phone,
    }));
  }, [session]);

  const next = () => { if (canProceed(step, data) && step < 5) setStep((s) => s + 1); };
  const prev = () => { if (step > 1) setStep((s) => s - 1); };

  const submit = async () => {
    setError("");

    const pendingUpload = (data.photos || []).some((p) => p?.status === "pending");
    if (pendingUpload) {
      setError("ছবি আপলোড হচ্ছে, অনুগ্রহ করে একটু অপেক্ষা করুন এবং তারপর আবার চেষ্টা করুন।");
      return;
    }

    setLoading(true);

    try {
      const photos = (data.photos || []).map((p) => {
        if (!p) return null;
        if (typeof p === "string") return p;
        return p.url || p.preview;
      }).filter(Boolean);

      const payload = { 
        ...data, 
        photos,
        userId: session?.user?.id || null 
      };

      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || "Submission failed");

      setTrackingId(result.ticketId || `NB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit complaint error:", err);
      setError(err?.message || "সর্বোচ্চ অনির্ধারিত ত্রুটি, আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setData(INITIAL_DATA); setStep(1); setSubmitted(false); setTrackingId(""); setError(""); };

  const ok = canProceed(step, data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-slate-50">


      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

          {/* Card top gradient strip */}
          <div className="h-1.5 bg-gradient-to-r from-teal-400 via-blue-500 to-violet-500" />

          <div className="p-6 sm:p-8">
            {submitted ? (
              <SuccessScreen trackingId={trackingId} onReset={reset} />
            ) : (
              <>
                <StepIndicator current={step} />

                <AnimatePresence mode="wait">
                  <div key={step}>
                    {step === 1 && <StepIdentity data={data} setData={setData} readOnly={Boolean(session?.user)} />}
                    {step === 2 && <StepIssueType data={data} setData={setData} />}
                    {step === 3 && <StepLocation data={data} setData={setData} />}
                    {step === 4 && <StepDescription data={data} setData={setData} />}
                    {step === 5 && <StepReview data={data} onSubmit={submit} loading={loading} error={error} />}
                  </div>
                </AnimatePresence>

                {/* Nav buttons */}
                {step < 5 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                    <button
                      onClick={prev}
                      disabled={step === 1}
                      className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${step === 1
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                      <ChevronLeft size={16} />
                      পিছনে
                    </button>

                    <span className="text-xs text-slate-400 font-semibold">
                      {step} / {STEPS.length}
                    </span>

                    <button
                      onClick={next}
                      disabled={!ok}
                      className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${ok
                        ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md hover:opacity-90 active:scale-95"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                      পরবর্তী
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer note */}
        {!submitted && (
          <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
            <Shield size={12} />
            আপনার তথ্য সম্পূর্ণ সুরক্ষিত ও গোপনীয়
          </p>
        )}
      </div>
    </div>
  );
}