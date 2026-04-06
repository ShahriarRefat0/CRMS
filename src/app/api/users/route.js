
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export async function POST(req) {
  try {
    await dbConnect()

    const body = await req.json()

    const user = await User.create(body)

    return Response.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error("/api/users POST error:", error)

    return new Response(
      JSON.stringify({ error: "Failed to create user" }),
      { status: 500 }
    )
  }
}