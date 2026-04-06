'use client';

/**
 * ContactUs — React Hook Form + TanStack Query
 *
 * ─── Backend Integration ────────────────────────────────────────────
 *  POST /api/contact
 *  Body (JSON):
 *  {
 *    name?:      string   (anonymous হলে null)
 *    email?:     string   (anonymous হলে null)
 *    phone?:     string
 *    type:       'general' | 'complaint' | 'technical' | 'authority' | 'suggestion'
 *    subject:    string
 *    message:    string
 *    anonymous:  boolean
 *  }
 *
 *  Response (success):  { success: true,  ticketId: string }
 *  Response (error):    { success: false, message: string }
 * ────────────────────────────────────────────────────────────────────
 *
 * Dependencies:
 *   npm install react-hook-form @hookform/resolvers zod
 *   npm install @tanstack/react-query axios
 *   npm install react-hot-toast framer-motion lucide-react
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Mail, Phone, MapPin, Send, Loader2, CheckCircle2,
  MessageSquare, Clock, Shield, ChevronDown, ArrowRight,
  Facebook, Twitter, Youtube, Headphones, Building2,
  AlertCircle, Zap, Users, ExternalLink, Lock,
} from 'lucide-react';
import Link from 'next/link';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
//
//  anonymous: true  → name & email are optional
//  anonymous: false → name & email are required
//
const contactSchema = z
  .object({
    anonymous: z.boolean(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine((v) => !v || /^01[3-9]\d{8}$/.test(v), {
        message: 'সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)',
      }),
    type: z.string().min(1, 'বিষয়ের ধরন বেছে নিন'),
    subject: z.string().min(3, 'শিরোনাম কমপক্ষে ৩ অক্ষর'),
    message: z.string().min(20, 'কমপক্ষে ২০ অক্ষর লিখুন').max(1000, 'সর্বোচ্চ ১০০০ অক্ষর'),
  })
  .superRefine((data, ctx) => {
    if (!data.anonymous) {
      if (!data.name || data.name.trim().length < 2) {
        ctx.addIssue({ path: ['name'], code: z.ZodIssueCode.custom, message: 'নাম প্রয়োজন (কমপক্ষে ২ অক্ষর)' });
      }
      if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
        ctx.addIssue({ path: ['email'], code: z.ZodIssueCode.custom, message: 'সঠিক ইমেইল ঠিকানা দিন' });
      }
    }
  });

// API function 

async function submitContact(payload) {
  // ↓ Change this URL to your real backend endpoint
  const { data } = await axios.post('/api/contact', payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });
  return data; // expects { success: true, ticketId: string }
}

//  Static UI Data 

const CONTACT_TYPES = [
  { id: 'general', label: 'সাধারণ জিজ্ঞাসা', icon: <MessageSquare size={14} /> },
  { id: 'complaint', label: 'অভিযোগ সংক্রান্ত', icon: <AlertCircle size={14} /> },
  { id: 'technical', label: 'প্রযুক্তিগত সমস্যা', icon: <Zap size={14} /> },
  { id: 'authority', label: 'কর্তৃপক্ষ যোগাযোগ', icon: <Building2 size={14} /> },
  { id: 'suggestion', label: 'পরামর্শ / মতামত', icon: <Users size={14} /> },
];

const OFFICES = [
  {
    name: 'প্রধান কার্যালয়',
    address: 'আইসিটি টাওয়ার, আগারগাঁও, ঢাকা-১২০৭',
    phone: '+880 2-5566-7788',
    email: 'info@nagarikbondhu.gov.bd',
    hours: 'রবি–বৃহস্পতি: সকাল ৯টা – বিকাল ৫টা',
    map: 'আগারগাঁও, ঢাকা, Bangladesh',
    icon: '🏛️',
    primary: true,
  },
  {
    name: 'চট্টগ্রাম আঞ্চলিক অফিস',
    address: 'নাসিরাবাদ, চট্টগ্রাম-৪০০০',
    phone: '+880 31-111-2233',
    email: 'ctg@nagarikbondhu.gov.bd',
    hours: 'রবি–বৃহস্পতি: সকাল ৯টা – বিকাল ৫টা',
    map: 'Nasirabad, Chittagong, Bangladesh',
    icon: '🏢',
    primary: false,
  },
  {
    name: 'হেল্পলাইন',
    address: '২৪/৭ অনলাইন সহায়তা',
    phone: '১৬১২৩',
    email: 'support@nagarikbondhu.gov.bd',
    hours: 'সপ্তাহের সব দিন: ২৪ ঘন্টা',
    map: null,
    icon: '🎧',
    primary: false,
  },
];

const FAQ_DATA = [
  { q: 'অভিযোগের উত্তর কতদিনে পাব?', a: 'সাধারণত ২৪-৪৮ ঘন্টার মধ্যে। জরুরি সমস্যায় আরও দ্রুত।' },
  { q: 'বেনামে যোগাযোগ করা যাবে?', a: 'হ্যাঁ, বেনামে অভিযোগ ও মতামত পাঠানো যাবে।' },
  { q: 'হেল্পলাইনে কি বাংলায় কথা বলা যায়?', a: 'অবশ্যই। আমাদের সব সহায়তা বাংলায় পাওয়া যায়।' },
  { q: 'ট্র্যাকিং নম্বর হারিয়ে গেলে?', a: 'ইমেইল বা ফোনে যোগাযোগ করলে আমরা খুঁজে বের করে দেব।' },
];

//  Helpers 

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-red-500 text-[11px] mt-1 ml-1 font-semibold">
      <AlertCircle size={11} /> {message}
    </p>
  );
}

function InputWrap({ label, required, children, error }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      <FieldError message={error} />
    </div>
  );
}

function StyledInput({ icon, error, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 rounded-xl border-2 bg-white text-sm
          text-slate-800 placeholder-slate-400 focus:outline-none transition-all
          ${error
            ? 'border-red-300 bg-red-50/30 focus:border-red-400'
            : 'border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:shadow-sm focus:shadow-teal-100'
          }`}
        {...props}
      />
    </div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`rounded-xl border-2 overflow-hidden transition-all ${open ? 'border-teal-300 shadow-sm' : 'border-slate-200 bg-white'
        }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left"
      >
        <span className="text-sm font-bold text-slate-700">{item.q}</span>
        <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
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

// ─── Office Card ──────────────────────────────────────────────────────────────

function OfficeCard({ office, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl overflow-hidden border-2 transition-all ${office.primary ? 'border-teal-300 shadow-lg shadow-teal-100' : 'border-slate-200 bg-white shadow-sm'
        }`}
    >
      {office.primary && <div className="h-1 bg-gradient-to-r from-teal-400 to-blue-500" />}
      <div className={`p-5 ${office.primary ? 'bg-teal-50/40' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${office.primary ? 'bg-teal-100' : 'bg-slate-100'}`}>
            {office.icon}
          </div>
          <div>
            <p className="font-extrabold text-slate-800 text-sm">{office.name}</p>
            {office.primary && (
              <span className="text-[10px] font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full">প্রধান</span>
            )}
          </div>
        </div>
        <div className="space-y-2.5">
          {[
            { icon: <MapPin size={13} className="text-teal-500" />, text: office.address },
            { icon: <Phone size={13} className="text-blue-500" />, text: office.phone, href: `tel:${office.phone}` },
            { icon: <Mail size={13} className="text-violet-500" />, text: office.email, href: `mailto:${office.email}`, truncate: true },
            { icon: <Clock size={13} className="text-amber-500" />, text: office.hours },
          ].map(({ icon, text, href, truncate }, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
              <span className="shrink-0 mt-0.5">{icon}</span>
              {href ? (
                <a href={href} className={`font-semibold hover:text-teal-600 transition-colors ${truncate ? 'truncate' : ''}`}>{text}</a>
              ) : (
                <span>{text}</span>
              )}
            </div>
          ))}
        </div>
        {office.map && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(office.map)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-teal-200 text-teal-700 text-xs font-bold hover:bg-teal-50 transition-colors"
          >
            <MapPin size={13} /> ম্যাপে দেখুন <ExternalLink size={11} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ ticketId, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, type: 'spring' }}
      className="text-center py-10 px-4 space-y-5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-teal-200"
      >
        <CheckCircle2 size={40} className="text-white" />
      </motion.div>

      <div>
        <h3 className="text-2xl font-extrabold text-slate-800 mb-1">বার্তা পাঠানো হয়েছে!</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
          আমরা আপনার বার্তা পেয়েছি। সাধারণত ২৪ ঘন্টার মধ্যে উত্তর দেওয়া হবে।
        </p>
      </div>

      {ticketId && (
        <div className="inline-flex flex-col items-center gap-1 px-8 py-3.5 bg-teal-50 border-2 border-teal-200 rounded-xl">
          <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">টিকেট নম্বর</span>
          <span className="text-xl font-black text-teal-700 tracking-wider">{ticketId}</span>
          <span className="text-[11px] text-slate-400">এই নম্বর দিয়ে স্ট্যাটাস ট্র্যাক করুন</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '📧', label: 'ইমেইলে উত্তর' },
          { icon: '⏱️', label: '< ২৪ ঘন্টায়' },
          { icon: '✅', label: 'নিশ্চিত প্রাপ্তি' },
        ].map(({ icon, label }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xl mb-1">{icon}</p>
            <p className="text-[11px] text-slate-500 font-semibold">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-teal-300 text-teal-700 font-bold text-sm hover:bg-teal-50 transition-colors"
        >
          আবার বার্তা পাঠান
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          প্রচ্ছদে যান <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm({ onSuccess }) {
  const [ticketId, setTicketId] = useState(null);

  // ── React Hook Form ──────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting: rhfSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      anonymous: false,
      name: '',
      email: '',
      phone: '',
      type: '',
      subject: '',
      message: '',
    },
  });

  const isAnonymous = watch('anonymous');
  const messageVal = watch('message') ?? '';

  // ── TanStack Query mutation ──────────────────────────────────────
  const mutation = useMutation({
    mutationFn: submitContact,

    onSuccess: (data) => {
      setTicketId(data?.ticketId ?? null);
      toast.success('বার্তা সফলভাবে পাঠানো হয়েছে!', {
        style: { background: '#0f766e', color: '#fff', fontWeight: '700', borderRadius: '12px' },
      });
      onSuccess?.();
    },

    onError: (error) => {
      // Axios error → show server message or generic fallback
      const msg =
        error?.response?.data?.message ||
        'বার্তা পাঠাতে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।';
      toast.error(msg, {
        style: { background: '#dc2626', color: '#fff', fontWeight: '700', borderRadius: '12px' },
      });
    },
  });

  // ── Form submit ──────────────────────────────────────────────────
  const onSubmit = (formData) => {
    // Clean payload: strip empty optional fields
    const payload = {
      type: formData.type,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      anonymous: formData.anonymous,
      ...(formData.anonymous
        ? {}                                                           // no personal data
        : {
          name: formData.name?.trim(),
          email: formData.email?.trim(),
          phone: formData.phone?.trim() || undefined,
        }),
    };
    mutation.mutate(payload);
  };

  const isPending = mutation.isPending ?? mutation.isLoading;

  // ── Success state ────────────────────────────────────────────────
  if (mutation.isSuccess) {
    return (
      <SuccessScreen
        ticketId={ticketId}
        onReset={() => { mutation.reset(); reset(); setTicketId(null); }}
      />
    );
  }

  // ── Form UI ──────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">বার্তা পাঠান</h2>
        <p className="text-sm text-slate-500">আমরা সাধারণত ২৪ ঘন্টার মধ্যে উত্তর দিই।</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

        {/* ── Anonymous toggle ─────────────────────────────────── */}
        <Controller
          name="anonymous"
          control={control}
          render={({ field }) => (
            <label className="flex items-center justify-between p-4 bg-violet-50 border-2 border-violet-200 rounded-xl cursor-pointer hover:bg-violet-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center">
                  <Lock size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-violet-700">পরিচয় গোপন রেখে পাঠান</p>
                  <p className="text-[11px] text-violet-500">নাম ও ইমেইল ছাড়াই বার্তা পাঠাতে পারবেন</p>
                </div>
              </div>
              {/* Toggle pill */}
              <div
                className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${field.value ? 'bg-violet-500' : 'bg-slate-200'}`}
                onClick={() => field.onChange(!field.value)}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${field.value ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          )}
        />

        {/* ── Personal info (hidden when anonymous) ────────────── */}
        <AnimatePresence>
          {!isAnonymous && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden space-y-4"
            >
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWrap label="আপনার নাম" required error={errors.name?.message}>
                  <StyledInput
                    icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>}
                    placeholder="পুরো নাম লিখুন"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                </InputWrap>

                <InputWrap label="ইমেইল" required error={errors.email?.message}>
                  <StyledInput
                    icon={<Mail size={15} />}
                    type="email"
                    placeholder="আপনার ইমেইল"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </InputWrap>
              </div>

              {/* Phone */}
              <InputWrap label="মোবাইল নম্বর (ঐচ্ছিক)" error={errors.phone?.message}>
                <StyledInput
                  icon={<Phone size={15} />}
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </InputWrap>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact type */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
            বিষয়ের ধরন <span className="text-red-500">*</span>
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {CONTACT_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => field.onChange(t.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all ${field.value === t.id
                        ? 'border-teal-400 bg-teal-50 text-teal-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300'
                      }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            )}
          />
          <FieldError message={errors.type?.message} />
        </div>

        {/* ── Subject ──────────────────────────────────────────── */}
        <InputWrap label="শিরোনাম" required error={errors.subject?.message}>
          <StyledInput
            placeholder="সংক্ষেপে বিষয়টি লিখুন"
            error={errors.subject?.message}
            {...register('subject')}
          />
        </InputWrap>

        {/* ── Message ──────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
            বার্তা <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            maxLength={1000}
            placeholder="বিস্তারিত লিখুন..."
            className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white text-sm text-slate-800 placeholder-slate-400
              focus:outline-none transition-all resize-none
              ${errors.message?.message
                ? 'border-red-300 bg-red-50/30 focus:border-red-400'
                : 'border-slate-200 hover:border-teal-300 focus:border-teal-500'
              }`}
            {...register('message')}
          />
          <div className="flex items-center justify-between mt-1">
            <FieldError message={errors.message?.message} />
            <span className="text-[11px] text-slate-400 font-semibold ml-auto">
              {messageVal.length}/1000
            </span>
          </div>
        </div>

        {/* ── Network / server error from mutation ─────────────── */}
        {mutation.isError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-semibold">
              {mutation.error?.response?.data?.message ||
                'বার্তা পাঠাতে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।'}
            </p>
          </div>
        )}

        {/* ── Submit ───────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm text-white transition-all ${isPending
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95'
            }`}
        >
          {isPending
            ? <><Loader2 size={18} className="animate-spin" /> পাঠানো হচ্ছে...</>
            : <><Send size={16} /> বার্তা পাঠান</>
          }
        </button>

        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Shield size={11} className="text-teal-500" />
          আপনার তথ্য সম্পূর্ণ গোপনীয় ও সুরক্ষিত
        </p>
      </form>
    </motion.div>
  );
}

// Root Page 

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-slate-50">
      <Toaster position="top-center" />


      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">

        {/* Hero */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <Headphones size={13} /> আমাদের সাথে যোগাযোগ
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
            আমরা আপনার{' '}
            <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">পাশে আছি</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            যেকোনো প্রশ্ন, পরামর্শ বা সমস্যার জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-7">
            {[
              { icon: '⚡', val: '< ২৪ঘন্টা', label: 'উত্তরের সময়' },
              { icon: '🎧', val: '১৬১২৩', label: 'হেল্পলাইন' },
              { icon: '✅', val: '৯৮%', label: 'সমাধানের হার' },
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

        {/* ── Main Grid ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Form — 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/60 overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-violet-500" />
            <div className="p-6 sm:p-8">
              <ContactForm />
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">

            {/* Offices */}
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Building2 size={13} className="text-teal-500" /> আমাদের অফিস
              </p>
              <div className="flex flex-col gap-4">
                {OFFICES.map((o, i) => <OfficeCard key={o.name} office={o} index={i} />)}
              </div>
            </div>

            {/* Social */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5"
            >
              <div className="h-0.5 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full mb-4" />
              <p className="text-xs font-black text-teal-400 uppercase tracking-widest mb-3">সোশ্যাল মিডিয়া</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: <Facebook size={15} />, label: 'Facebook', handle: '@NagarikBondhu', color: 'bg-blue-600' },
                  { icon: <Twitter size={15} />, label: 'Twitter/X', handle: '@NagarikBondhu', color: 'bg-slate-700' },
                  { icon: <Youtube size={15} />, label: 'YouTube', handle: 'Nagarik Bondhu', color: 'bg-red-600' },
                ].map(({ icon, label, handle, color }) => (
                  <a key={label} href="#"
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-white`}>{icon}</div>
                    <div>
                      <p className="text-xs font-bold text-slate-300">{label}</p>
                      <p className="text-[10px] text-slate-500">{handle}</p>
                    </div>
                    <ExternalLink size={12} className="text-slate-600 group-hover:text-slate-400 ml-auto transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MessageSquare size={13} className="text-teal-500" /> সাধারণ প্রশ্ন
              </p>
              <div className="flex flex-col gap-2.5">
                {FAQ_DATA.map((item, i) => <FaqItem key={i} item={item} index={i} />)}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}