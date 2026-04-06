"use client";

import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ThumbsUp, Calendar, ArrowLeft, Share2, ShieldAlert, Construction, Droplets, Zap, Trash2, WifiOff } from 'lucide-react';

const ReportDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // এটি আপনার মেইন লিস্ট। বাস্তব প্রজেক্টে এটি আসবে API থেকে।
  const reports = [
    {
      id: "1",
      title: "রাস্তায় বড় গর্ত",
      location: "নোয়াখালী",
      description: "রাস্তার মাঝখানে বড় গর্তের কারণে প্রতিনিয়ত দুর্ঘটনা ঘটছে। দ্রুত মেরামত প্রয়োজন।",
      status: "Resolved",
      priority: "Normal",
      votes: 12,
      date: "০৫ মার্চ, ২০২৬",
      image: "https://i.postimg.cc/m26ZM4QG/b98febbe9e356fa2b7e4486afa2e7009-687c778f305e4.webp",
    },
    {
      id: "2",
      title: "পানির তীব্র সংকট",
      location: "সিলেট",
      description: "গত ৩ দিন ধরে এলাকায় পানি নেই। ওয়াসার লাইনে সমস্যা দেখা দিয়েছে।",
      status: "Pending",
      priority: "High",
      votes: 45,
      date: "০৬ মার্চ, ২০২৬",
      image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "গ্যাস লাইন লিক",
      location: "মিরপুর, ঢাকা",
      description: "মেন রোডের পাশে গ্যাসের গন্ধ পাওয়া যাচ্ছে, যা বড় ধরনের দুর্ঘটনার ঝুঁকি তৈরি করছে। দ্রুত পদক্ষেপ নেওয়া প্রয়োজন। এলাকাবাসী আতঙ্কিত অবস্থায় আছে।",
      status: "In Progress",
      priority: "Critical",
      votes: 89,
      date: "০৮ মার্চ, ২০২৬",
      image: "https://i.postimg.cc/vHjgyf2n/images-1.jpg",
    }
    // ... আপনার বাকি ডাটাগুলো এখানে দিন
  ];

  // URL-এর ID অনুযায়ী সঠিক রিপোর্টটি খুঁজে বের করা
  const report = reports.find((r) => r.id === id);

  // যদি আইডি খুঁজে না পাওয়া যায়
  if (!report) {
    return (
      <div className="h-screen flex flex-col items-center justify-center font-bangla">
        <h2 className="text-2xl font-bold text-slate-800">দুঃখিত, রিপোর্টটি পাওয়া যায়নি!</h2>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 underline">ফিরে যান</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-bangla">
      <div className="max-w-4xl mx-auto px-4">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-8 transition-colors font-semibold"
        >
          <ArrowLeft size={20} /> ফিরে যান
        </button>

        <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-100">
          {/* Image Section */}
          <div className="relative h-[400px] w-full bg-slate-200">
            <Image
              src={report.image}
              alt={report.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-6 left-6 flex gap-3">
              <span className={`px-4 py-1.5 text-white rounded-full text-xs font-bold shadow-lg ${report.priority === 'Critical' ? 'bg-red-600' : 'bg-orange-500'
                }`}>
                {report.priority} Priority
              </span>
              <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg">
                {report.status}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-3">{report.title}</h1>
                <div className="flex flex-wrap gap-4 text-slate-500 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><MapPin size={18} className="text-blue-500" /> {report.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={18} className="text-slate-400" /> {report.date}</span>
                </div>
              </div>
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-all active:scale-95">
                <Share2 size={20} />
              </button>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 mb-8">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <ShieldAlert size={18} className="text-blue-600" /> অভিযোগের বিবরণ
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg font-medium">
                {report.description}
              </p>
            </div>

            {/* Action Section */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-8">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                  <ThumbsUp size={20} /> একমত ({report.votes})
                </button>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 font-display">REPORT ID</p>
                <p className="font-mono font-bold text-slate-900 text-lg">#{report.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;