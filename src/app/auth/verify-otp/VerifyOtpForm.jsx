'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, signIn } from 'next-auth/react'
import { Loader2, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react'

export default function VerifyOtpForm({ email }) {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleVerify = async () => {
    if (otp.length < 6) return
    setLoading(true)
    setError('')

    const res = await signIn("credentials", {
      identifier: email,
      otp: otp,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError(res.error || "OTP সঠিক নয়")
      return
    }

    const session = await getSession()
    const role = session?.user?.role

    if (role === 'admin') {
      router.push('/dashboard/admin/overview')
    } else {
      router.push('/dashboard/users')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-slate-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-300/50 p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
            <ShieldCheck size={32} className="text-teal-600" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 text-center mb-2">
          ইমেইল যাচাই করুন
        </h1>
        <p className="text-sm text-slate-500 text-center mb-1">
          নিচের ঠিকানায় OTP পাঠানো হয়েছে
        </p>
        <p className="text-sm font-bold text-teal-600 text-center mb-7">
          {email}
        </p>

        <input
          type="text"
          maxLength={8}
          placeholder="OTP কোড লিখুন"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none focus:shadow-sm focus:shadow-teal-100 transition-all mb-4"
        />

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <AlertCircle size={15} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-extrabold text-sm shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {loading
            ? <><Loader2 size={18} className="animate-spin" /> যাচাই হচ্ছে...</>
            : <><ArrowRight size={18} /> নিশ্চিত করুন</>
          }
        </button>

        <p className="text-center text-xs text-slate-400 mt-5">
          OTP 10 মিনিটের মধ্যে মেয়াদ শেষ হয়ে যাবে
        </p>
      </div>
    </div>
  )
}
