'use client';
import { useState } from "react";
import { MapPin, ThumbsUp } from "lucide-react";

export default function Community() {

  const [votes, setVotes] = useState(247);
  const [voted, setVoted] = useState(false);

  return (
    <section className="py-20 px-6 bg-[#f8faff]">
      <div className="max-w-6xl mx-auto">

        {/* header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-teal-100 text-teal-600 border border-teal-200">
            কমিউনিটি ভোটিং
          </span>

          <h2 className="text-3xl font-extrabold text-slate-900">
            একসাথে দাবি করুন
          </h2>

          <p className="mt-3 max-w-xl mx-auto text-slate-500">
            ১০০ জন ভোট দিলে কর্তৃপক্ষ বুঝবে এটি গণদাবি — দ্রুত সমাধান নিশ্চিত হবে।
          </p>
        </div>

        {/* card */}
        <div className="max-w-lg mx-auto rounded-3xl overflow-hidden bg-white shadow-xl border">

          <div className="p-6">

            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-orange-50">
                🕳️
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                    চলমান
                  </span>
                  <span className="text-xs text-slate-400">
                    ২ ঘন্টা আগে
                  </span>
                </div>

                <h3 className="font-bold text-slate-900">
                  মিরপুর ১০, মেইন রোডে বড় গর্ত
                </h3>

                <p className="text-sm text-slate-500">
                  <MapPin size={12} className="inline mr-1" />
                  মিরপুর, ঢাকা
                </p>
              </div>
            </div>

            {/* vote bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-500">কমিউনিটি সমর্থন</span>
                <span className="font-bold text-teal-600">{votes} ভোট</span>
              </div>

              <div className="h-2.5 rounded-full bg-teal-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-teal-500 to-blue-500"
                  style={{ width: `${Math.min((votes / 300) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* button */}
            <button
              onClick={() => {
                if (!voted) {
                  setVotes(v => v + 1);
                  setVoted(true);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition hover:-translate-y-0.5"
              style={{
                background: voted
                  ? 'rgba(20,184,166,0.1)'
                  : 'linear-gradient(135deg, #14b8a6, #2563eb)',
                color: voted ? '#14b8a6' : 'white',
                border: voted ? '2px solid #14b8a6' : 'none',
              }}
            >
              <ThumbsUp size={18} />
              {voted ? '✅ আপনি সমর্থন করেছেন!' : 'আমিও ভুক্তভোগী — Upvote করুন'}
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}