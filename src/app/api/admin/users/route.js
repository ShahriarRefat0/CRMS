import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 }).select("-password");
    return new Response(JSON.stringify({ success: true, data: users }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
