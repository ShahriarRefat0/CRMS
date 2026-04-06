import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "ইমেইল, OTP এবং নতুন পাসওয়ার্ড প্রয়োজন" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: "ইউজার পাওয়া যায়নি" }, { status: 404 })
    }

    if (!user.otpexp || Date.now() > new Date(user.otpexp).getTime()) {
      return NextResponse.json({ error: "OTP এর মেয়াদ শেষ" }, { status: 400 })
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: "OTP সঠিক নয়" }, { status: 400 })
    }

    // Hash the new password and update user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    user.otp = null
    user.otpexp = null
    await user.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset Password error:", error)
    return NextResponse.json({ error: "সার্ভার সমস্যা, আবার চেষ্টা করুন" }, { status: 500 })
  }
}
