"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">

      {/* Background Blur Circle */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-300 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-green-300 opacity-30 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            নাগরিক বন্ধু
            <span className="text-blue-600 block mt-2">
              আপনার সমস্যার ডিজিটাল সমাধান
            </span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            ভাঙা রাস্তা, পানির অপচয়, বিদ্যুৎ বিভ্রাট কিংবা বর্জ্য ব্যবস্থাপনা —
            এখন এক ক্লিকেই অভিযোগ জানান এবং রিয়েল-টাইমে সমাধান ট্র্যাক করুন।
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">


            <Link href='/HowItWorks' className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl transition">
              কিভাবে কাজ করে
            </Link>
          </div>

          {/* Features */}
          <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              ✅ রিয়েল-টাইম ট্র্যাকিং
            </div>
            <div className="flex items-center gap-2">
              🤖 স্মার্ট এআই রাউটিং
            </div>
            <div className="flex items-center gap-2">
              📊 পারফরম্যান্স ড্যাশবোর্ড
            </div>
            <div className="flex items-center gap-2">
              🔒 নিরাপদ ও স্বচ্ছ সিস্টেম
            </div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="bg-white p-6 rounded-3xl shadow-2xl">
            <Image
              src="/banner.png"  // public folder এ image রাখবে
              alt="Citizen Reporting System"
              width={600}
              height={400}
              className="rounded-xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}