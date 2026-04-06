'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loader2, Lock, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'

export default function ResetPasswordForm({ email }) {
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const newPassword = watch('newPassword')

  const onSubmit = async (data) => {
    setError('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: data.otp,
          newPassword: data.newPassword,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || "কিছু একটা সমস্যা হয়েছে")
        return
      }

      toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! 🎉")
      router.push('/login')
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

        <h1 className="text-2xl font-black text-slate-900 text-center mb-1">
          নতুন পাসওয়ার্ড সেট করুন
        </h1>
        <p className="text-sm font-bold text-teal-600 text-center mb-4">
          {email}
        </p>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <AlertCircle size={15} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              maxLength={8}
              placeholder="OTP কোড লিখুন"
              className={`w-full text-center text-xl font-bold tracking-[0.5em] py-3.5 border-2 rounded-xl focus:outline-none transition-all ${errors.otp
                  ? 'border-red-300 bg-red-50/30 focus:border-red-400'
                  : 'border-slate-200 focus:border-teal-500 focus:shadow-sm focus:shadow-teal-100'
                }`}
              {...register('otp', {
                required: 'OTP প্রয়োজন',
                minLength: { value: 6, message: 'সঠিক OTP দিন' },
              })}
            />
            {errors.otp && (
              <p className="text-red-500 text-[11px] mt-1 text-center font-semibold">
                ⚠ {errors.otp.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="নতুন পাসওয়ার্ড"
                className={`w-full pl-11 pr-11 py-3.5 rounded-xl border-2 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${errors.newPassword
                    ? 'border-red-300 bg-red-50/30 focus:border-red-400'
                    : 'border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:shadow-sm focus:shadow-teal-100'
                  }`}
                {...register('newPassword', {
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
            {errors.newPassword && (
              <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold flex items-center gap-1">
                ⚠ {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                className={`w-full pl-11 pr-11 py-3.5 rounded-xl border-2 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${errors.confirmPassword
                    ? 'border-red-300 bg-red-50/30 focus:border-red-400'
                    : 'border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:shadow-sm focus:shadow-teal-100'
                  }`}
                {...register('confirmPassword', {
                  required: 'পাসওয়ার্ড পুনরায় লিখুন',
                  validate: (value) => value === newPassword || 'পাসওয়ার্ড মিলছে না',
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
            {errors.confirmPassword && (
              <p className="text-red-500 text-[11px] mt-1 ml-1 font-semibold flex items-center gap-1">
                ⚠ {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm text-white transition-all mt-2 ${isSubmitting
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95'
              }`}
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> পরিবর্তন হচ্ছে...</>
            ) : (
              <><ArrowRight size={18} /> পাসওয়ার্ড পরিবর্তন করুন</>
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
