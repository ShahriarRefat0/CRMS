import { z } from "zod"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import bcrypt from "bcryptjs"

const registerSchema = z.object({
  fullName: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে"),
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"),
  phone: z
    .string()
    .refine((v) => /^01[3-9]\d{8}$/.test(v), {
      message: "সঠিক মোবাইল নম্বর দিন",
    }),
  nid: z.string().min(10, "এনআইডি কমপক্ষে ১০ সংখ্যা"),
  area: z.string().min(1, "এলাকা নির্বাচন করুন"),
})

 await dbConnect()

export async function POST(req) {
  let body

  try {
    body = await req.json()
  } catch {
    return Response.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    )
  }

  try {
    // Zod validation
    const parsed = registerSchema.parse(body)

   

    // Already exists check
    const existing = await User.findOne({ email: parsed.email }, {phone: parsed.phone})
    if (existing) {
      return Response.json(
        { error: "এই ইমেইল বা মোবাইল দিয়ে আগেই একাউন্ট আছে" },
        { status: 400 }
      )
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(parsed.password, 10)

    const user = await User.create({
      name: parsed.fullName,
      email: parsed.email,
      password: hashedPassword,
      phone: parsed.phone,
      nid: parsed.nid,
      area: parsed.area,
      provider: "credentials",
      role: "user",
    })

    return Response.json({
      success: true,
      data: { name: user.name, email: user.email },
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      )
    }

    console.log("Register error:", error)
    return Response.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}