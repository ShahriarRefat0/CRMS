import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";

export async function POST(req, context) {
  try {
    const params = await Promise.resolve(context.params);
    const { id } = params;
    const body = await req.json();
    const identifier = body.identifier; // email or deviceId

    if (!identifier) {
      return NextResponse.json({ success: false, message: "Identifier required" }, { status: 400 });
    }

    await dbConnect();

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json({ success: false, message: "Complaint not found" }, { status: 404 });
    }

    const hasVoted = complaint.voters && complaint.voters.includes(identifier);
    let updateQuery = {};
    
    if (hasVoted) {
      // Already voted, do not unvote
      return NextResponse.json({ success: true, message: "Already voted", upvotes: complaint.vote || 0, hasVoted: true }, { status: 200 });
    } else {
      // Toggle on (Vote)
      updateQuery = {
        $addToSet: { voters: identifier },
        $inc: { vote: 1 }
      };
    }

    // Use findByIdAndUpdate with strict: false to bypass Next.js HMR Mongoose Schema caching issues
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id, 
      updateQuery, 
      { new: true, strict: false }
    );

    return NextResponse.json({ success: true, upvotes: updatedComplaint.vote || 0, hasVoted: !hasVoted }, { status: 200 });
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
