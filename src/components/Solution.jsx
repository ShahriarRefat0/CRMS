"use client";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

function Solution() {
  const [active, setActive] = useState(0);



  const steps = [
    {
      num: "০১",
      title: "ডিজিটাল রিপোর্টিং",
      en: "Digital Reporting",
      icon: "📱",
      color: "#2563eb",
      desc: "নাগরিকরা অ্যাপের মাধ্যমে সমস্যার ছবি তুলবেন। GPS ব্যবহার করে স্বয়ংক্রিয়ভাবে লোকেশন ট্যাগ হয়ে যাবে।",
      features: ["ছবি ও ভিডিও আপলোড", "GPS অটো-লোকেশন", "ভয়েস রিপোর্ট সুবিধা"],
    },
    {
      num: "০২",
      title: "স্মার্ট অ্যালার্ট",
      en: "Smart Alert",
      icon: "🔔",
      color: "#8b5cf6",
      desc: "AI স্বয়ংক্রিয়ভাবে অভিযোগটি সংশ্লিষ্ট দপ্তরে পাঠিয়ে দেবে।",
      features: ["AI-ভিত্তিক ক্যাটাগরি", "স্বয়ংক্রিয় রাউটিং", "তাৎক্ষণিক নোটিফিকেশন"],
    },
    {
      num: "০৩",
      title: "দ্রুত পদক্ষেপ",
      en: "Action Phase",
      icon: "⚙️",
      color: "#f59e0b",
      desc: "কর্তৃপক্ষ তাদের ড্যাশবোর্ডে অভিযোগটি দেখবে।",
      features: ["In Progress স্ট্যাটাস", "টেকনিশিয়ান অ্যাসাইন", "সময়সীমা নির্ধারণ"],
    },
    {
      num: "০৪",
      title: "সমাধান ও রেটিং",
      en: "Resolution & Rating",
      icon: "⭐",
      color: "#16a34a",
      desc: "কাজ শেষ হলে নোটিফিকেশন পাঠানো হবে।",
      features: ["সমাধান নিশ্চিতকরণ", "১-৫ স্টার রেটিং", "জনপ্রতিনিধির পারফরম্যান্স"],
    },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-[#f8faff]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-blue-100 text-blue-600 border border-blue-200">
            আমাদের সমাধান
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            ৪-ধাপের ডিজিটাল সাইকেল
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left steps */}
          <div className="flex lg:flex-col gap-3 lg:w-64 overflow-x-auto">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="flex-shrink-0 flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                style={{
                  background: active === i ? "white" : "transparent",
                  border:
                    active === i
                      ? `2px solid ${s.color}`
                      : "2px solid rgba(0,0,0,0.06)",
                  boxShadow: active === i ? `0 4px 20px ${s.color}25` : "none",
                }}
              >
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: s.color,
                    }}
                  >
                    ধাপ {s.num}
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {s.title}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right card */}
          <div
            className="flex-1 p-8 rounded-3xl bg-white"
            key={active}
            style={{
              border: `2px solid ${steps[active].color}20`,
              boxShadow: `0 20px 60px ${steps[active].color}15`,
            }}
          >
            <div className="flex items-start gap-5 mb-6">
              <div className="text-5xl">{steps[active].icon}</div>
              <div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: steps[active].color,
                  }}
                >
                  Step {steps[active].num} · {steps[active].en}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {steps[active].title}
                </h3>
              </div>
            </div>

            <p className="text-slate-600 w-full md:w-3/4 lg:w-1/2 mb-6">{steps[active].desc}</p>

            <div className="flex flex-col gap-3">
              {steps[active].features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle
                    size={18}
                    style={{ color: steps[active].color }}
                  />
                  <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-8">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === active ? "32px" : "8px",
                    background:
                      i === active
                        ? steps[active].color
                        : "rgba(0,0,0,0.1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Solution;