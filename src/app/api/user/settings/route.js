import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();
    const { action, ...data } = await req.json();
    const userId = session.user.id;

    if (action === "updateProfile") {
      const { name, area, phone, bio, image, nid } = data;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, area, phone, bio, image, nid },
        { new: true }
      ).select("-password");

      return new Response(JSON.stringify({ success: true, message: "প্রোফাইল আপডেট সফল হয়েছে!", user: updatedUser }), { status: 200 });
    }

    if (action === "changePassword") {
      const { currentPassword, newPassword } = data;
      const user = await User.findById(userId);

      if (!user.password) {
        // Handle users who logged in via OAuth but now want a password? 
        // For now, assume traditional login.
        return new Response(JSON.stringify({ success: false, message: "পাসওয়ার্ড সেট করতে সমস্যা হচ্ছে।" }), { status: 400 });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return new Response(JSON.stringify({ success: false, message: "বর্তমান পাসওয়ার্ডটি সঠিক নয়।" }), { status: 400 });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      await user.save();

      return new Response(JSON.stringify({ success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!" }), { status: 200 });
    }

    return new Response(JSON.stringify({ success: false, message: "Invalid action" }), { status: 400 });
  } catch (error) {
    console.error("Settings API error:", error);
    return new Response(JSON.stringify({ success: false, message: "সার্ভারে সমস্যা হয়েছে।" }), { status: 500 });
  }
}
