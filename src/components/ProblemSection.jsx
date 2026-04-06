'use client';
import { AlertTriangle, Clock, Eye } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: <AlertTriangle size={32} className="text-amber-400" />,
    title: "জবাবদিহিতার অভাব",
    desc: "অভিযোগ কোথায় করতে হবে তা অনেকেই জানেন না, ফলে সাধারণ মানুষ ভোগান্তিতে পড়েন।",
    gradient: "from-amber-500/20 to-transparent"
  },
  {
    icon: <Clock size={32} className="text-blue-400" />,
    title: "আমলাতান্ত্রিক জটিলতা",
    desc: "একটি ছোট সমস্যা সমাধানেও অনেক টেবিল ঘুরতে হয় এবং দীর্ঘ সময় ব্যয় হয়।",
    gradient: "from-blue-500/20 to-transparent"
  },
  {
    icon: <Eye size={32} className="text-emerald-400" />,
    title: "স্বচ্ছতার অভাব",
    desc: "অভিযোগ করার পর সেটির বর্তমান অবস্থা বা অগ্রগতি সম্পর্কে কোনো তথ্য পাওয়া যায় না।",
    gradient: "from-emerald-500/20 to-transparent"
  },
];

export default function ProblemSection() {
  return (
    <section className="py-24 px-6  text-black overflow-hidden">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-400"
        >
          বর্তমান ব্যবস্থার প্রধান চ্যালেঞ্জসমূহ
        </motion.h2>
        <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {problems.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            whileHover={{ y: -10 }}
            className={`relative p-8 bg-gray-600/50  rounded-3xl overflow-hidden group hover:border-gray-700 transition-all shadow-2xl`}
          >
            {/* Background Gradient Effct */}
            <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10">
              <div className="mb-6 inline-flex p-4 bg-gray-800/80 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {p.icon}
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">{p.title}</h3>
              <p className="text-gray-900 leading-relaxed text-base">
                {p.desc}
              </p>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}