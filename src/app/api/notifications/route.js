import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();
    const notifications = await Notification.find({ recipient: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return new Response(JSON.stringify({ success: true, data: notifications }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();
    const { id, readAll } = await request.json();

    if (readAll) {
      await Notification.updateMany({ recipient: session.user.id }, { read: true });
    } else if (id) {
      await Notification.findByIdAndUpdate(id, { read: true });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
