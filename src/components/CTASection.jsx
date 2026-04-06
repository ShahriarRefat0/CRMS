'use client';
import React from 'react';
import { PlusCircle, ArrowRight, ShieldCheck, Globe } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
        {/* আপনি যে ইমেজটি ডাউনলোড করেছেন তার পাথ এখানে দিন */}
        <img
          src="/cta.png"
          alt="Smart Bangladesh Vision"
          className="w-full h-full object-cover"
        />
        {/* ব্লু এবং ডার্ক গ্রাডিয়েন্ট ওভারলে যাতে টেক্সট পড়তে সুবিধা হয় */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-blue-900/60" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side: Text Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm">
              <Globe size={16} className="text-teal-400" />
              স্মার্ট সিটিজেন, স্মার্ট বাংলাদেশ
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.2] md:leading-[1.1]">
              আপনার একটি রিপোর্ট <br />
              আনবে <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">বিরাট পরিবর্তন</span>
            </h2>

            <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
              রাস্তাঘাট, ড্রেনেজ বা বিদ্যুৎ—যেকোনো নাগরিক সমস্যায় চুপ না থেকে রিপোর্ট করুন। আপনার সচেতনতাই বদলে দেবে আপনার এলাকা।
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <button
                className="group flex items-center justify-center gap-3 px-6 py-4 md:px-10 md:py-5 rounded-xl font-black text-base md:text-lg transition-all active:scale-95 bg-white text-blue-700 hover:bg-teal-50 shadow-2xl w-full sm:w-auto"
              >
                <PlusCircle size={24} className="shrink-0" />
                এখনই শুরু করুন
              </button>

              <button
                className="group flex items-center justify-center gap-3 px-6 py-4 md:px-10 md:py-5 rounded-xl font-black text-base md:text-lg border-2 border-white/40 text-white hover:bg-white/10 transition-all w-full sm:w-auto"
              >
                পদ্ধতি দেখুন
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>
          </div>

          {/* Right Side: Trust Info Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[30px] border border-white/10 mt-8">
              <ShieldCheck className="text-teal-400 mb-4" size={32} />
              <h4 className="text-white font-bold text-xl mb-1">নিরাপদ তথ্য</h4>
              <p className="text-white/60 text-sm">আপনার ব্যক্তিগত তথ্য সম্পূর্ণ গোপন রাখা হবে।</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[30px] border border-white/10">
              <div className="text-3xl mb-4">⚡</div>
              <h4 className="text-white font-bold text-xl mb-1">দ্রুত সমাধান</h4>
              <p className="text-white/60 text-sm">সরাসরি সংশ্লিষ্ট দপ্তরে অভিযোগ পৌঁছে যাবে।</p>
            </div>
          </div>

        </div>

        {/* Footer line for CTA */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-sm font-medium">
          <p>© ২০২৬ নাগরিক বন্ধু - সকল নাগরিকের কণ্ঠস্বর</p>
          <div className="flex gap-6">
            <span>গোপনীয়তা নীতি</span>
            <span>ব্যবহারের শর্তাবলী</span>
          </div>
        </div>
      </div>
    </section>
  );
}