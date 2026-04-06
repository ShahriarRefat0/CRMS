import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { sendVerificationMail } from "@/config/emailConfig"

export async function POST(req) {
  try {
    const { identifier, password } = await req.json()

    if (!identifier || !password) {
      return NextResponse.json({ error: "ইমেইল/মোবাইল এবং পাসওয়ার্ড উভয় প্রয়োজন" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    })

    if (!user) {
      return NextResponse.json({ error: "ইমেইল বা পাসওয়ার্ড সঠিক নয়" }, { status: 400 })
    }

    if (!user.password) {
      return NextResponse.json({ error: "Google দিয়ে লগইন করুন" }, { status: 400 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "ইমেইল বা পাসওয়ার্ড সঠিক নয়" }, { status: 400 })
    }

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await User.findByIdAndUpdate(user._id, {
      otp: otp,
      otpexp: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    }, { strict: false });

    try {
      if (user.email) {
        await sendVerificationMail({ email: user.email, otp })
        console.log("OTP successfully sent to:", user.email, "OTP is:", otp)
      } else {
        return NextResponse.json({ error: "এই অ্যাকাউন্টের সাথে কোনো ইমেইল যুক্ত নেই।" }, { status: 400 })
      }
    } catch (err) {
      console.error("Mail error details:", err)
      return NextResponse.json({ error: "ইমেইল পাঠাতে সমস্যা হয়েছে: " + (err.message || "Unknown error") }, { status: 500 })
    }

    return NextResponse.json({ success: true, email: user.email })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "সার্ভার সমস্যা, আবার চেষ্টা করুন" }, { status: 500 })
  }
}
