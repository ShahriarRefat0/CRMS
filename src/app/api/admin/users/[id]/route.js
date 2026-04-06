import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Notification from "@/models/Notification";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { role, status } = await request.json();
    await dbConnect();
    
    const updateData = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    
    const userBefore = await User.findById(id);
    const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!updated) {
        return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    // Create Notification if status changed
    if (status && status !== userBefore.status) {
      let title = "অ্যাকাউন্ট স্ট্যাটাস আপডেট";
      let message = "";
      let type = "info";

      if (status === "warned") {
        message = "আপনাকে সিস্টেম থেকে সতর্ক করা হয়েছে। অনুগ্রহ করে নিয়ম মেনে কাজ করুন।";
        type = "warning";
      } else if (status === "banned") {
        message = "আপনার অ্যাকাউন্টটি নিষিদ্ধ করা হয়েছে। বিস্তারিত জানতে অ্যাডমিনের সাথে যোগাযোগ করুন।";
        type = "alert";
      } else if (status === "active") {
        message = "আপনার অ্যাকাউন্টটি এখন পুনরায় সক্রিয়।";
        type = "success";
      }

      if (message) {
        await Notification.create({
          recipient: id,
          title,
          message,
          type
        });
      }
    }

    return new Response(JSON.stringify({ success: true, data: updated }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
