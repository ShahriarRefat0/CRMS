'use client';
import { BarChart2, Lock, Map, Mic, Shield, ThumbsUp, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Feature() {

  const features = [
    {
      icon: <Shield size={26} />,
      title: 'গোপন অভিযোগ ব্যবস্থা',
      desc: 'নাম প্রকাশ না করেও দুর্নীতি বা বিশেষ সমস্যার অভিযোগ করা যাবে।',
      color: '#6366f1',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format' // নিরাপত্তা/গোপনীয়তা থিম
    },
    {
      icon: <TrendingUp size={26} />,
      title: 'রিয়েল-টাইম অগ্রগতি ট্র্যাকিং',
      desc: 'কুরিয়ার সার্ভিসের মতো আপনার অভিযোগের অগ্রগতি ট্র্যাক করা যাবে।',
      color: "#2563eb",
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format' // ট্র্যাকিং/অ্যানালিটিক্স থিম
    },
    {
      icon: <BarChart2 size={26} />,
      title: 'কর্মদক্ষতা ড্যাশবোর্ড',
      desc: 'কোন কাউন্সিলর বা অফিস সবচেয়ে ভালো কাজ করছে তার ডাটা প্রকাশ্যে থাকবে।',
      color: '#16a34a',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format' // ড্যাশবোর্ড/ডাটা থিম
    },
    {
      icon: <Map size={26} />,
      title: 'সমস্যার তাপ মানচিত্র',
      desc: 'কোন এলাকায় কী ধরনের সমস্যা বেশি হচ্ছে তা ম্যাপে দেখা যাবে।',
      color: '#f59e0b',
      image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=500&auto=format' // ম্যাপ/হিটম্যাপ থিম
    },
    {
      icon: <Mic size={26} />,
      title: 'ভয়েস অভিযোগ সুবিধা',
      desc: 'শুধু ভয়েস মেসেজ পাঠিয়ে অভিযোগ করার সুবিধা — বয়স্ক ও নিরক্ষরদের জন্য।',
      color: '#ec4899',
      image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&auto=format' // ভয়েস/মাইক থিম
    },
    {
      icon: <ThumbsUp size={26} />,
      title: 'কমিউনিটি ভোটিং',
      desc: 'প্রতিবেশীরা Upvote দিলে সমস্যাটি গণদাবিতে রূপ নেয়, দ্রুত সমাধান হয়।',
      color: '#14b8a6',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format' // কমিউনিটি/ভোটিং থিম
    },
    {
      icon: <Zap size={26} />,
      title: 'স্মার্ট অগ্রাধিকার নির্ধারণ (AI)',
      desc: 'AI অ্যালগরিদম স্বয়ংক্রিয়ভাবে High/Medium/Low Priority নির্ধারণ করবে।',
      color: '#ef4444',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&auto=format' // AI/টেকনোলজি থিম
    },
    {
      icon: <Lock size={26} />,
      title: 'ব্লকচেইন নিরাপত্তা ব্যবস্থা',
      desc: 'তথ্য জালিয়াতি রোধে ডাটাবেসকে Blockchain দিয়ে সুরক্ষিত রাখা হবে।',
      color: '#8b5cf6',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format' // ব্লকচেইন/সিকিউরিটি থিম
    },
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10 md:mb-14">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(37,99,235,0.1)',
              color: '#2563eb',
              border: `1px solid rgba(37,99,235,0.2)`
            }}
          >
            মূল ফিচারসমূহ
          </span>

          <h2 className="text-3xl font-extrabold text-slate-900">
            যা আমাদের আলাদা করে
          </h2>

          <p className="mt-3 text-base max-w-xl mx-auto text-slate-500">
            সাধারণ অভিযোগ বাক্সের মতো নয় — এটি একটি সম্পূর্ণ স্মার্ট সিভিক ইকোসিস্টেম।
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="group relative p-6 rounded-xl overflow-hidden cursor-pointer"
              style={{
                border: '1px solid rgba(0,0,0,0.07)',
                background: '#fafbff',
                minHeight: '220px'
              }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* ব্যাকগ্রাউন্ড ইমেজ */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url(${f.image})`,
                  backgroundBlend: 'overlay'
                }}
              />

              {/* ওভারলে - হোভারে আরও ডার্ক হবে */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

              {/* কন্টেন্ট */}
              <div className="relative z-10 h-full flex flex-col justify-end">
                {/* আইকন */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:translate-y-[-4px]"
                  style={{
                    background: `${f.color}`,
                    color: 'white',
                    boxShadow: `0 4px 14px ${f.color}50`
                  }}
                >
                  {f.icon}
                </div>

                {/* টাইটেল */}
                <h3 className="font-bold text-white text-sm mb-1 transition-all duration-300 group-hover:translate-y-[-4px]">
                  {f.title}
                </h3>

                {/* ডেসক্রিপশন - হোভারে ওপরে উঠবে */}
                <p className="text-white/90 text-xs leading-relaxed transition-all duration-300 group-hover:translate-y-[-4px] opacity-90 group-hover:opacity-100">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}