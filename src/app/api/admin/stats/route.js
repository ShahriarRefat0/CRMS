import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    // 1. Complaint Statistics
    const totalReports = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "pending" });
    const inProgress = await Complaint.countDocuments({ 
      status: { $in: ["in_review", "action_taken"] } 
    });
    const resolved = await Complaint.countDocuments({ status: "resolved" });

    // 2. User Statistics
    const totalUsers = await User.countDocuments({ role: "user" });

    // 3. Weekly Analytics (Last 7 days)
    const chartData = [];
    const dayNames = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
    
    // Aggregate by date (YYYY-MM-DD)
    const weeklyStats = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          reports: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
          inProgress: {
            $sum: {
              $cond: [
                { $in: ["$status", ["in_review", "action_taken"]] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayData = weeklyStats.find((s) => s._id === dateStr) || {
        reports: 0,
        resolved: 0,
        inProgress: 0,
      };

      chartData.push({
        name: dayNames[date.getDay()],
        reports: dayData.reports,
        resolved: dayData.resolved,
        inProgress: dayData.inProgress,
      });
    }

    // 4. Recent Activity
    const recentActivity = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formattedActivity = recentActivity.map((r) => ({
      id: `#${r.ticketId || r._id.toString().slice(-4)}`,
      type: r.status === "pending" 
        ? "একটি নতুন অভিযোগ জমা দিয়েছেন" 
        : r.status === "resolved" 
          ? "অভিযোগটি সমাধান করেছেন" 
          : "অভিযোগটি পর্যালোচনা করছেন",
      user: r.name || (r.anonymous ? "গোপন ব্যবহারকারী" : "অজ্ঞাত"),
      time: formatRelativeTime(r.createdAt),
      status: r.status === "in_review" || r.status === "action_taken" ? "progress" : r.status,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalReports,
          pending,
          inProgress,
          resolved,
          totalUsers,
        },
        chartData,
        recentActivity: formattedActivity,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Admin stats error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "এই মাত্র";
  if (minutes < 60) return `${convertToBengaliNumber(minutes)} মিনিট আগে`;
  if (hours < 24) return `${convertToBengaliNumber(hours)} ঘণ্টা আগে`;
  return `${convertToBengaliNumber(days)} দিন আগে`;
}

function convertToBengaliNumber(num) {
  const bengaliNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((d) => (isNaN(d) ? d : bengaliNumbers[parseInt(d)]))
    .join("");
}
