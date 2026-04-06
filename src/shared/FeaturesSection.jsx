'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ThumbsUp, ArrowRight, Droplets, Zap, Trash2, Construction, ShieldAlert, WifiOff } from 'lucide-react';

const FeaturesSection = () => {
  // ১. এই ডাটা অ্যারেটি অবশ্যই কম্পোনেন্টের ভেতরে থাকতে হবে
  const reports = [
    {
      id: 1,
      title: "রাস্তায় বড় গর্ত",
      category: "Road",
      location: "নোয়াখালী",
      description: "রাস্তার মাঝখানে বড় গর্তের কারণে প্রতিনিয়ত দুর্ঘটনা ঘটছে। দ্রুত মেরামত প্রয়োজন।",
      status: "Resolved",
      priority: "Normal",
      votes: 12,
      image: "https://i.postimg.cc/m26ZM4QG/b98febbe9e356fa2b7e4486afa2e7009-687c778f305e4.webp", 
      icon: <Construction size={18} className="text-blue-600" />
    },
    {
      id: 2,
      title: "পানির তীব্র সংকট",
      category: "Water",
      location: "সিলেট",
      description: "গত ৩ দিন ধরে এলাকায় পানি নেই। ওয়াসার লাইনে সমস্যা দেখা দিয়েছে।",
      status: "Pending",
      priority: "High",
      votes: 45,
      image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?q=80&w=1000&auto=format&fit=crop",
      icon: <Droplets size={18} className="text-cyan-600" />
    },
    {
      id: 3,
      title: "গ্যাস লাইন লিক",
      category: "Safety",
      location: "মিরপুর, ঢাকা",
      description: "মেন রোডের পাশে গ্যাসের গন্ধ পাওয়া যাচ্ছে, যা বড় ধরনের দুর্ঘটনার ঝুঁকি তৈরি করছে।",
      status: "In Progress",
      priority: "Critical",
      votes: 89,
      image: "https://i.postimg.cc/vHjgyf2n/images-1.jpg",
      icon: <ShieldAlert size={18} className="text-red-600" />
    }
    // আপনি চাইলে আরও ডাটা এখানে যোগ করতে পারেন...
  ];

  return (
    <section className="py-12 md:py-16 bg-white font-bangla">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">সাম্প্রতিক <span className="text-blue-600">রিপোর্টসমূহ</span></h2>
            <p className="text-slate-500 mt-2">নাগরিকদের করা সর্বশেষ অভিযোগ এবং সেগুলোর বর্তমান অবস্থা</p>
          </div>
          <Link href="/reports" className="text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            সব দেখুন <ArrowRight size={16}/>
          </Link>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* ২. এখন 'reports' ভেরিয়েবলটি ডিফাইন করা আছে, তাই map কাজ করবে */}
          {reports.map((report) => (
            <Link href={`/reports/${report.id}`} key={report.id} className="block group">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase ${
                      report.status === 'Resolved' ? 'bg-green-500' : 
                      report.status === 'In Progress' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <Image 
                    src={report.image} 
                    alt={report.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-50 rounded-lg">{report.icon}</div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider">{report.category}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {report.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {report.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1 text-slate-400">
                      <MapPin size={14} className="text-blue-500"/>
                      {report.location}
                    </div>
                    <span className="font-bold text-blue-600">DETAILS →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;