import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { sendVerificationMail } from "@/config/emailConfig"

export async function POST(req) {
  try {
    const { identifier } = await req.json()

    if (!identifier) {
      return NextResponse.json({ error: "ইমেইল বা মোবাইল নম্বর প্রয়োজন" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    })

    if (!user) {
      return NextResponse.json({ error: "এই ইমেইল বা মোবাইল নম্বরের কোনো অ্যাকাউন্ট পাওয়া যায়নি" }, { status: 404 })
    }

    if (!user.password && user.provider === 'google') {
      return NextResponse.json({ error: "এটি একটি Google অ্যাকাউন্ট। অনুগ্রহ করে Google দিয়ে লগইন করুন।" }, { status: 400 })
    }

    // Generate and send OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otp = otp
    user.otpexp = new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    await user.save()

    try {
      if (user.email) {
        await sendVerificationMail({ email: user.email, otp })
      }
    } catch (err) {
      console.error("Mail error:", err)
      return NextResponse.json({ error: "ইমেইল পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" }, { status: 500 })
    }

    return NextResponse.json({ success: true, email: user.email })
  } catch (error) {
    console.error("Forgot Password error:", error)
    return NextResponse.json({ error: "সার্ভার সমস্যা, আবার চেষ্টা করুন" }, { status: 500 })
  }
}
