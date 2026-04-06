
// src/app/api/auth/verify-otp/route.js
import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export async function POST(req) {
  await dbConnect()

  const { email, otp } = await req.json()

  const user = await User.findOne({ email })
  if (!user) {
    return NextResponse.json({ error: "User পাওয়া যায়নি" }, { status: 404 })
  }

if (!user.otpexp || Date.now() > new Date(user.otpexp).getTime()) {
    return NextResponse.json({ error: "OTP এর মেয়াদ শেষ" }, { status: 400 })
  }

  if (user.otp !== otp) {
    return NextResponse.json({ error: "OTP সঠিক নয়" }, { status: 400 })
  }

  user.otp = null
  user.otpexp = null
  await user.save()

  return NextResponse.json({ success: true })
}

