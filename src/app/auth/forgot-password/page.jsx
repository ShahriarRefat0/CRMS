'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loader2, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [error, setError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: data.identifier }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || "কিছু একটা সমস্যা হয়েছে")
        return
      }

      toast.success("OTP পাঠানো হয়েছে")
      router.push(`/auth/reset-password?email=${encodeURIComponent(result.email || data.identifier)}`)
    } catch (err) {
      setError("সার্ভার সমস্যা, আবার চেষ্টা করুন")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-slate-100 p-4">
      <Toaster position="top-center" />
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-300/50 p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
            <ShieldCheck size={32} className="text-teal-600" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 text-center mb-2">
          পাসওয়ার্ড ভুলে গেছেন?
        </h1>
        <p className="text-sm text-slate-500 text-center mb-7">
          আপনার ইমেইল অথবা মোবাইল নম্বর দিন। আমরা একটি OTP পাঠাবো।
        </p>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <AlertCircle size={15} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Mail size={16} />
              </div>
              <input
                type="text"
                placeholder="আপনার ইমেইল বা মোবাইল নম্বর"
                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${errors.identifier
                    ? 'border-red-300 bg-red-50/30 focus:border-red-400'
                    : 'border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:shadow-sm focus:shadow-teal-100'
                  }`}
                {...register('identifier', {
                  required: 'ইমেইল বা মোবাইল নম্বর প্রয়োজন',
                })}
              />
            </div>
            {errors.identifier && (
              <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold flex items-center gap-1">
                ⚠ {errors.identifier.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm text-white transition-all mt-1 ${isSubmitting
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95'
              }`}
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> পাঠানো হচ্ছে...</>
            ) : (
              <><ArrowRight size={18} /> OTP পাঠান</>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/login" className="text-teal-600 font-bold hover:underline inline-flex items-center gap-1">
            লগইন পেজে ফিরে যান
          </Link>
        </p>
      </div>
    </div>
  )
}
