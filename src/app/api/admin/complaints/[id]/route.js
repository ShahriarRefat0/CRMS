import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import Notification from "@/models/Notification";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminFeedback, priority } = body;

    await dbConnect();

    const updateData = {};
    if (status) updateData.status = status;
    if (adminFeedback !== undefined) updateData.adminFeedback = adminFeedback;
    if (priority) updateData.priority = priority;

    const query = { _id: id };
    
    // Also push to statusHistory if status changed
    const complaint = await Complaint.findById(id);
    if (!complaint) {
        return new Response(JSON.stringify({ success: false, message: "Complaint not found" }), { status: 404 });
    }

    if (status && status !== complaint.status) {
        updateData.$push = {
            statusHistory: {
                status,
                updatedAt: new Date(),
                comment: adminFeedback || `Status updated to ${status}`,
            }
        };

        // Create notification for user if userId exists
        if (complaint.userId) {
          let statusBn = status === "resolved" ? "সমাধান করা হয়েছে" : status === "action_taken" ? "ব্যবস্থা নেওয়া হয়েছে" : "পর্যালোচনা করা হচ্ছে";
          await Notification.create({
            recipient: complaint.userId,
            title: "অভিযোগের স্ট্যাটাস আপডেট",
            message: `আপনার অভিযোগ (${complaint.ticketId}) এখন '${statusBn}' অবস্থায় আছে।`,
            type: status === "resolved" ? "success" : "info",
            link: "/dashboard/users/reports"
          });
        }
    }

    const updated = await Complaint.findByIdAndUpdate(query, updateData, { new: true });

    return new Response(
      JSON.stringify({ success: true, data: updated }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Complaint update error:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), { status: 500 });
  }
}
