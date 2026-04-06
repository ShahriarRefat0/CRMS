'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  Eye, EyeOff, User, Mail, Phone, CreditCard,
  MapPin, Lock, ChevronDown, CheckCircle2, Shield,
  ArrowRight, Loader2, Zap, Users, Award,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { signIn, getSession, useSession } from "next-auth/react";

// ─── BD Area Data ─────────────────────────────────────────────────────────────

const AREAS = [
  { value: "dncc", label: "ঢাকা উত্তর সিটি কর্পোরেশন" },
  { value: "dscc", label: "ঢাকা দক্ষিণ সিটি কর্পোরেশন" },
  { value: "chattogram", label: "চট্টগ্রাম সিটি কর্পোরেশন" },
  { value: "rajshahi", label: "রাজশাহী সিটি কর্পোরেশন" },
  { value: "khulna", label: "খুলনা সিটি কর্পোরেশন" },
  { value: "sylhet", label: "সিলেট সিটি কর্পোরেশন" },
  { value: "barishal", label: "বরিশাল সিটি কর্পোরেশন" },
  { value: "mymensingh", label: "ময়মনসিংহ সিটি কর্পোরেশন" },
];

// ─── Custom Select ────────────────────────────────────────────────────────────

function CustomSelect({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = AREAS.find((a) => a.value === value);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 bg-white text-sm font-medium text-left transition-all focus:outline-none ${error
            ? 'border-red-300 focus:border-red-400'
            : open
              ? 'border-teal-500 shadow-sm shadow-teal-100'
              : 'border-slate-200 hover:border-teal-300'
          }`}
      >
        <MapPin size={16} className={selected ? 'text-teal-500' : 'text-slate-400'} />
        <span className={selected ? 'text-slate-800 flex-1' : 'text-slate-400 flex-1'}>
          {selected ? selected.label : 'আপনার এলাকা নির্বাচন করুন'}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-2xl border border-slate-100 overflow-y-auto max-h-52">
          {AREAS.map((area) => (
            <button
              key={area.value}
              type="button"
              onClick={() => { onChange(area.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 ${value === area.value ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700'
                }`}
            >
              {value === area.value && <CheckCircle2 size={13} className="text-teal-500 shrink-0" />}
              {area.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────

function InputField({ icon, placeholder, error, type = 'text', rightEl, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full pl-11 pr-${rightEl ? '11' : '4'} py-3.5 rounded-xl border-2 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${error
            ? 'border-red-300 focus:border-red-400 bg-red-50/30'
            : 'border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:shadow-sm focus:shadow-teal-100'
          }`}
        {...props}
      />
      {rightEl && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'admin') {
        router.replace('/dashboard/admin/overview');
      } else {
        router.replace('/dashboard/users/reports');
      }
    }
  }, [status, session, router]);

  const {
    register,
    handleSubmit,
    setValue,
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


  // ======================================================================================================
  // const onSubmit = async (data) => {
  //   await new Promise((r) => setTimeout(r, 1200));
  //   toast.success('রেজিস্ট্রেশন সফল হয়েছে! স্বাগতম ', {
  //     style: {
  //       background: '#0f766e',
  //       color: '#fff',
  //       fontWeight: '700',
  //       borderRadius: '12px',
  //       padding: '14px 20px',
  //     },
  //     iconTheme: { primary: '#fff', secondary: '#0f766e' },
  //   });
  // };

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error || "কিছু একটা সমস্যা হয়েছে")
        return
      }

      toast.success("রেজিস্ট্রেশন সফল হয়েছে! 🎉")
      router.push("/")

    } catch (err) {
      toast.error("সার্ভার সমস্যা, আবার চেষ্টা করুন")
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-blue-50 to-slate-100 flex items-center justify-center p-4 md:p-8">
      <Toaster position="top-center" />

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-5 rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50">

        {/* ── Left Panel ──────────────────────────────────────────────────── */}
        <div className="hidden md:flex md:col-span-2 flex-col bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">

          {/* Top gradient strip */}
          <div className="h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-violet-500 w-full" />

          {/* Grid bg */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10 flex flex-col h-full p-8">

            {/* Brand */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">
                🛡️
              </div>
              <div>
                <p className="font-extrabold text-white text-lg leading-tight bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  নাগরিক বন্ধু
                </p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Civic Tech</p>
              </div>
            </div>

            {/* Headline */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white leading-tight mb-3">
                একটি অ্যাকাউন্ট,<br />
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  অসীম সম্ভাবনা
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                নিবন্ধিত নাগরিক হিসেবে আপনার অভিযোগ সরাসরি কর্তৃপক্ষের কাছে পৌঁছাবে।
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { num: "১০,০০০+", label: "নিবন্ধিত নাগরিক", icon: <Users size={14} /> },
                { num: "৯৮৩", label: "সমস্যা সমাধান", icon: <CheckCircle2 size={14} /> },
                { num: "৩২টি", label: "সংযুক্ত দপ্তর", icon: <Award size={14} /> },
                { num: "৭৯%", label: "সন্তুষ্টির হার", icon: <Zap size={14} /> },
              ].map(({ num, label, icon }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-teal-400 mb-1">{icon}</div>
                  <p className="text-lg font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent leading-none">
                    {num}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-3 mt-auto">
              {[
                { icon: <Shield size={14} />, text: "আপনার তথ্য সম্পূর্ণ সুরক্ষিত" },
                { icon: <Zap size={14} />, text: "AI-চালিত স্মার্ট রাউটিং" },
                { icon: <MapPin size={14} />, text: "GPS লোকেশন ট্র্যাকিং" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-slate-400">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    {icon}
                  </div>
                  {text}
                </div>
              ))}
            </div>

            {/* Live badge */}
            <div className="mt-6 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-xs text-slate-400 font-semibold">সিস্টেম সচল আছে</span>
              <span className="ml-auto text-xs text-slate-500 font-mono">আজকের রিপোর্ট: ১,২৪৭</span>
            </div>
          </div>
        </div>

        {/* ── Right Panel (Form) ───────────────────────────────────────────── */}
        <div className="md:col-span-3 bg-white flex flex-col justify-center p-8 md:p-10 overflow-y-auto">

          {/* Mobile brand */}
          <div className="flex md:hidden items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-lg">🛡️</div>
            <p className="font-extrabold text-base bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent">নাগরিক বন্ধু</p>
          </div>

          {/* Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Users size={11} />
              নতুন নিবন্ধন
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-1.5">
              একাউন্ট তৈরি করুন
            </h1>
            <p className="text-sm text-slate-500">সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন</p>
          </div>

          {/* Top gradient strip (mobile) */}
          <div className="md:hidden h-0.5 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full mb-6" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Full Name */}
            <div>
              <InputField
                icon={<User size={16} />}
                placeholder="আপনার পুরো নাম"
                error={errors.fullName}
                {...register('fullName', { required: 'নাম প্রয়োজন' })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold flex items-center gap-1">
                  ⚠ {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <InputField
                icon={<Mail size={16} />}
                type="email"
                placeholder="ইমেইল ঠিকানা"
                error={errors.email}
                {...register('email', {
                  required: 'ইমেইল প্রয়োজন',
                  pattern: { value: /^\S+@\S+$/i, message: 'সঠিক ইমেইল দিন' },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold flex items-center gap-1">
                  ⚠ {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone + NID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <InputField
                  icon={<Phone size={16} />}
                  placeholder="মোবাইল নম্বর"
                  error={errors.phone}
                  {...register('phone', {
                    required: 'নম্বর প্রয়োজন',
                    pattern: { value: /^01[3-9]\d{8}$/, message: 'সঠিক নম্বর দিন' },
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold">⚠ {errors.phone.message}</p>
                )}
              </div>
              <div>
                <InputField
                  icon={<CreditCard size={16} />}
                  placeholder="এনআইডি নম্বর"
                  error={errors.nid}
                  {...register('nid', {
                    required: 'এনআইডি প্রয়োজন',
                    minLength: { value: 10, message: 'কমপক্ষে ১০ সংখ্যা' },
                  })}
                />
                {errors.nid && (
                  <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold">⚠ {errors.nid.message}</p>
                )}
              </div>
            </div>

            {/* Area select */}
            <div>
              <CustomSelect
                value={selectedArea}
                onChange={(val) => {
                  setSelectedArea(val);
                  setValue('area', val, { shouldValidate: true });
                }}
                error={errors.area}
              />
              <input
                type="hidden"
                {...register('area', { required: 'এলাকা নির্বাচন করুন' })}
                value={selectedArea}
              />
              {errors.area && (
                <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold flex items-center gap-1">
                  ⚠ {errors.area.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <InputField
                icon={<Lock size={16} />}
                type={showPassword ? 'text' : 'password'}
                placeholder="পাসওয়ার্ড তৈরি করুন (কমপক্ষে ৬ অক্ষর)"
                error={errors.password}
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
                {...register('password', {
                  required: 'পাসওয়ার্ড প্রয়োজন',
                  minLength: { value: 6, message: 'কমপক্ষে ৬ অক্ষর দিন' },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold flex items-center gap-1">
                  ⚠ {errors.password.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register('terms', { required: 'শর্তাবলী মেনে নিন' })}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <span className="text-xs text-slate-500 leading-relaxed">
                আমি{' '}
                <a href="#" className="text-teal-600 font-bold hover:underline">ব্যবহারের শর্তাবলী</a>
                {' '}ও{' '}
                <a href="#" className="text-teal-600 font-bold hover:underline">গোপনীয়তা নীতি</a>
                {' '}পড়েছি এবং মেনে নিচ্ছি।
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-[11px] ml-1 font-semibold">⚠ {errors.terms.message}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm text-white transition-all mt-2 ${isSubmitting
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95'
                }`}
            >
              {isSubmitting ? (
                <><Loader2 size={18} className="animate-spin" /> প্রসেসিং হচ্ছে...</>
              ) : (
                <><ArrowRight size={18} /> রেজিস্ট্রেশন করুন</>
              )}
            </button>
            <button
              type='button'
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50 transition-all"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                height={20}
                width={20}
              />

              <span className="text-sm font-bold text-slate-700">
                Google দিয়ে নিবন্ধন করুন
              </span>
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-semibold">অথবা</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
            <a href="/login" className="text-teal-600 font-extrabold hover:underline ml-1 inline-flex items-center gap-1">
              লগইন করুন <ArrowRight size={13} />
            </a>
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 pt-5 border-t border-slate-100">
            {[
              { icon: <Shield size={12} />, label: "SSL এনক্রিপ্টেড" },
              { icon: <CheckCircle2 size={12} />, label: "সরকার অনুমোদিত" },
              { icon: <Lock size={12} />, label: "তথ্য সুরক্ষিত" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
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