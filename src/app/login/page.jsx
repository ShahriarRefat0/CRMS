'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, Loader2,
  Shield, CheckCircle2, Zap, Users, Phone,
  ChevronRight, AlertCircle, Fingerprint,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { signIn, getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';


// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target.replace(/\D/g, ''));
    if (start === end) return;
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString('bn-BD')}{suffix}</span>;
}

// ─── Tab toggle ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'email', label: 'ইমেইল', icon: <Mail size={14} /> },
  { id: 'phone', label: 'মোবাইল', icon: <Phone size={14} /> },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'admin') {
        router.replace('/dashboard/admin/overview')
      } else {
        router.replace('/dashboard/users/reports')
      }
    }
  }, [status, session, router])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();


  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    )
  }

  if (status === "authenticated") {
    return null
  }

  // =======================================================================================================
  // const onSubmit = async (data) => {
  //   setServerError('');
  //   await new Promise((r) => setTimeout(r, 1300));

  //   // Demo: wrong password simulation
  //   if (data.password === 'wrong') {
  //     setServerError('ইমেইল বা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।');
  //     return;
  //   }

  //   toast.success('লগইন সফল! স্বাগতম 🎉', {
  //     style: {
  //       background: '#0f766e',
  //       color: '#fff',
  //       fontWeight: '700',
  //       borderRadius: '12px',
  //       padding: '14px 20px',
  //     },
  //   });
  // };

  // login/page.jsx এ


  const onSubmit = async (data) => {
    setServerError('')

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: data.identifier, password: data.password }),
      })

      const result = await res.json()

      if (!res.ok) {
        setServerError(result.error || "ইমেইল বা পাসওয়ার্ড সঠিক নয়")
        return
      }

      toast.success("OTP পাঠানো হয়েছে")
      router.push(`/auth/verify-otp?email=${encodeURIComponent(result.email || data.identifier)}`)
    } catch (error) {
      setServerError("সার্ভার সমস্যা, আবার চেষ্টা করুন")
    }
  }

  // Reset form when tab changes
  const switchTab = (tab) => {
    setActiveTab(tab);
    setServerError('');
    reset();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-blue-50 to-slate-100 flex items-center justify-center p-4 md:p-8">
      <Toaster position="top-center" />

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-5 rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50">

        {/* ── Left Panel ──────────────────────────────────────────────────── */}
        <div className="hidden md:flex md:col-span-2 flex-col bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">

          {/* Top accent strip */}
          <div className="h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-violet-500 w-full" />

          {/* Grid bg pattern */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Glow orbs */}
          <div className="absolute top-20 -left-10 w-40 h-40 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full p-8">

            {/* Brand */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">
                🛡️
              </div>
              <div>
                <p className="font-extrabold text-lg leading-tight bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  নাগরিক বন্ধু
                </p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Civic Tech</p>
              </div>
            </div>

            {/* Welcome text */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white leading-tight mb-3">
                আবার স্বাগতম!<br />
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  আপনার শহর আপনার হাতে
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                লগইন করে আপনার অভিযোগের অগ্রগতি ট্র্যাক করুন এবং নতুন সমস্যা জানান।
              </p>
            </div>

            {/* Live stats */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { target: '1247', suffix: '+', label: 'আজকের রিপোর্ট', icon: <Zap size={13} /> },
                { target: '983', suffix: '', label: 'সমস্যা সমাধান', icon: <CheckCircle2 size={13} /> },
                { target: '10000', suffix: '+', label: 'নিবন্ধিত নাগরিক', icon: <Users size={13} /> },
                { target: '32', suffix: 'টি', label: 'সংযুক্ত দপ্তর', icon: <Shield size={13} /> },
              ].map(({ target, suffix, label, icon }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="flex justify-center text-teal-400 mb-1">{icon}</div>
                  <p className="text-lg font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent leading-none">
                    <AnimCounter target={target} suffix={suffix} />
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent success pill */}
            <div className="space-y-2.5 mt-auto">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">সাম্প্রতিক সাফল্য</p>
              {[
                { icon: '🛣️', text: 'মিরপুর ১০-এ রাস্তার গর্ত মেরামত', time: '৩ ঘন্টা আগে' },
                { icon: '💧', text: 'গুলশান পানির লাইন সংস্কার', time: '৫ ঘন্টা আগে' },
                { icon: '⚡', text: 'উত্তরায় বিদ্যুৎ সমস্যা সমাধান', time: '১ দিন আগে' },
              ].map(({ icon, text, time }) => (
                <div key={text} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                  <span className="text-base shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-300 font-semibold truncate">{text}</p>
                    <p className="text-[10px] text-slate-600">{time}</p>
                  </div>
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                </div>
              ))}
            </div>

            {/* System status */}
            <div className="mt-5 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-xs text-slate-400 font-semibold">সিস্টেম সচল</span>
              <span className="ml-auto text-[10px] text-slate-600 font-mono">99.9% uptime</span>
            </div>
          </div>
        </div>






        {/* ── Right Panel (Form) ───────────────────────────────────────────── */}
        <div className="md:col-span-3 bg-white flex flex-col justify-center p-8 md:p-10">

          {/* Mobile brand */}
          <div className="flex md:hidden items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-lg">🛡️</div>
            <p className="font-extrabold text-base bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent">নাগরিক বন্ধু</p>
          </div>

          {/* Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Fingerprint size={11} />
              নিরাপদ লগইন
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-1.5">
              আপনার একাউন্টে<br />প্রবেশ করুন
            </h1>
            <p className="text-sm text-slate-500">আপনার তথ্য দিয়ে লগইন করুন</p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {tab.icon}
                {tab.label} দিয়ে
              </button>
            ))}
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-semibold">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                {activeTab === 'email' ? 'ইমেইল ঠিকানা' : 'মোবাইল নম্বর'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  {activeTab === 'email' ? <Mail size={16} /> : <Phone size={16} />}
                </div>
                <input
                  type={activeTab === 'email' ? 'email' : 'tel'}
                  placeholder={activeTab === 'email' ? 'আপনার ইমেইল লিখুন' : '01XXXXXXXXX'}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${errors.identifier
                      ? 'border-red-300 bg-red-50/30 focus:border-red-400'
                      : 'border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:shadow-sm focus:shadow-teal-100'
                    }`}
                  {...register('identifier', {
                    required: activeTab === 'email' ? 'ইমেইল প্রয়োজন' : 'মোবাইল নম্বর প্রয়োজন',
                    pattern:
                      activeTab === 'email'
                        ? { value: /^\S+@\S+\.\S+$/, message: 'সঠিক ইমেইল দিন' }
                        : { value: /^01[3-9]\d{8}$/, message: 'সঠিক মোবাইল নম্বর দিন' },
                  })}
                />
              </div>
              {errors.identifier && (
                <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold flex items-center gap-1">
                  ⚠ {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">পাসওয়ার্ড</label>
                <a href="/auth/forgot-password" className="text-xs text-teal-600 font-bold hover:underline">
                  পাসওয়ার্ড ভুলে গেছেন?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  className={`w-full pl-11 pr-11 py-3.5 rounded-xl border-2 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${errors.password
                      ? 'border-red-300 bg-red-50/30 focus:border-red-400'
                      : 'border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:shadow-sm focus:shadow-teal-100'
                    }`}
                  {...register('password', {
                    required: 'পাসওয়ার্ড প্রয়োজন',
                    minLength: { value: 6, message: 'কমপক্ষে ৬ অক্ষর' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold flex items-center gap-1">
                  ⚠ {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register('remember')}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <span className="text-sm text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                আমাকে মনে রাখুন
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm text-white transition-all mt-1 ${isSubmitting
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95'
                }`}
            >
              {isSubmitting ? (
                <><Loader2 size={18} className="animate-spin" /> যাচাই করা হচ্ছে...</>
              ) : (
                <><ArrowRight size={18} /> লগইন করুন</>
              )}
            </button>

            <button type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50 transition-all"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                height={20}
                width={20}
              />
              <span className="text-sm font-bold text-slate-700">
                Google দিয়ে লগইন করুন
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-semibold">বা</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Anonymous complaint shortcut */}
          <button className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/50 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <Shield size={16} className="text-violet-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-700 group-hover:text-teal-700 transition-colors">বেনামে অভিযোগ করুন</p>
                <p className="text-[11px] text-slate-400">লগইন ছাড়াই পরিচয় গোপন রেখে</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
          </button>

          {/* Register link */}
          <p className="text-center mt-5 text-sm text-slate-500">
            অ্যাকাউন্ট নেই?{' '}
            <a href="/register" className="text-teal-600 font-extrabold hover:underline ml-1 inline-flex items-center gap-1">
              এখনই নিবন্ধন করুন <ArrowRight size={13} />
            </a>
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-6 pt-5 border-t border-slate-100">
            {[
              { icon: <Shield size={12} />, label: 'SSL সুরক্ষিত' },
              { icon: <CheckCircle2 size={12} />, label: 'সরকার অনুমোদিত' },
              { icon: <Lock size={12} />, label: 'তথ্য গোপনীয়' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5"
              >
                <span className="text-teal-500">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


