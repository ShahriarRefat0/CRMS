'use client';
import { AlertTriangle, ChevronRight } from "lucide-react";

export default function Preventive() {

  const examples = [
    { icon: '🌉', label: 'নড়বড়ে কালভার্ট', tag: 'উচ্চ ঝুঁকি', tagColor: '#ef4444' },
    { icon: '🌳', label: 'ঝড়ে পড়ার আশঙ্কা — গাছ', tag: 'মাঝারি ঝুঁকি', tagColor: '#f59e0b' },
    { icon: '💡', label: 'নষ্ট ল্যাম্পপোস্ট', tag: 'কম ঝুঁকি', tagColor: '#16a34a' },
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-14">

        {/* Left */}
        <div className="flex-1">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-blue-600 mb-5 p-4 bg-blue-100">
            প্রিভেন্টিভ মেইনটেন্যান্স
          </span>

          <h2 className="text-3xl font-extrabold text-black leading-snug">
            সমস্যা হওয়ার <span className="text-blue-600">আগেই</span> সতর্ক করুন
          </h2>

          <p className="mt-5  text-base text-black/70">
            একটি কালভার্ট নড়বড়ে হয়ে আছে বা একটি গাছ ঝড়ে উপড়ে পড়তে পারে — এমন আগাম তথ্য দিলে বড় দুর্ঘটনা এড়ানো সম্ভব।
          </p>

          <button className="mt-8 flex items-center gap-2 px-6 py-3.5 bg-blue-100 text-blue-600 font-bold rounded-xl  border  border-blue-700 text-sm hover:-translate-y-1 transition"
          >
            <AlertTriangle size={18} /> সতর্কতা পাঠান <ChevronRight size={16} />
          </button>
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col gap-4 w-full max-w-sm">
          {examples.map((e, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)' }}>
              <span className="text-3xl">{e.icon}</span>

              <div className="flex-1 text-blue-500 font-semibold">
                {e.label}
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: `${e.tagColor}20`, color: e.tagColor, border: `1px solid ${e.tagColor}40` }}>
                {e.tag}
              </span>
            </div>
          ))}

          <div className="p-4 rounded-xl text-sm text-center text-blue-300"
            style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}>
            🛡️ AI স্বয়ংক্রিয়ভাবে Risk Level নির্ধারণ করে
          </div>
        </div>
      </div>
    </section>
  );
}