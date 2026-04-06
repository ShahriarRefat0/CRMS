'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ChevronRight, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <>

      <footer className="footer-glass font-bangla pt-16 pb-8 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* ── BRAND SECTION ── */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {/* লোগো কন্টেইনার */}
                <div className="shrink-0"> 
                  <Image 
                    src="/logo.png" 
                    alt="নাগরিক বন্ধু লোগো" 
                    width={50}   
                    height={50} 
                    priority 
                    className="object-contain" 
                  />
                </div>
                
                {/* logo*/}
                

                <div className="flex flex-col justify-center border-l-2 border-blue-500/20 pl-4 h-12">
                  <h2 className="text-2xl font-bold font-display tracking-tight text-blue-700 leading-none">
                    নাগরিক বন্ধু
                  </h2>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-blue-400 font-display mt-1 font-semibold">
                    Civic Tech Platform
                  </p>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-slate-600 max-w-xs">
                আপনার এলাকার সমস্যা সমাধানে প্রযুক্তির শক্তি। আমরা বিশ্বাস করি প্রতিটি নাগরিকের সচেতনতাই পারে একটি সুন্দর সমাজ গড়তে।
              </p>
              
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <Link key={i} href="#" className="social-btn p-2.5 rounded-xl text-blue-600 flex items-center justify-center">
                    <Icon size={18} />
                  </Link>
                ))}
              </div>
            </div>

            {/* ── QUICK LINKS ── */}
            <div>
              <h3 className="font-display font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Zap size={16} className="text-blue-500" /> লিংকসমূহ
              </h3>
              <ul className="space-y-3">
                {['মূলপাতা', 'অভিযোগ ম্যাপ', 'সাফল্য গাঁথা', 'ড্যাশবোর্ড'].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="footer-link-hover flex items-center gap-2 text-sm text-slate-500">
                      <ChevronRight size={14} className="text-blue-300" /> {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── SERVICES ── */}
            <div>
              <h3 className="font-display font-bold text-slate-800 mb-6">সেবাসমূহ</h3>
              <ul className="space-y-3">
                {['ডিজিটাল রিপোর্টিং', 'রিয়েল-টাইম ট্র্যাকিং', 'স্মার্ট ট্র্যাকিং', 'কমিউনিটি ভোটিং'].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="footer-link-hover flex items-center gap-2 text-sm text-slate-500">
                      <ChevronRight size={14} className="text-blue-300" /> {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── CONTACT ── */}
            <div className="space-y-6">
              <h3 className="font-display font-bold text-slate-800">যোগাযোগ</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-blue-600"><MapPin size={18} /></div>
                  <span className="text-sm text-slate-600">ঢাকা সিটি কর্পোরেশন এলাকা, ঢাকা।</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="text-blue-600"><Phone size={18} /></div>
                  <span className="text-sm font-display">+880 1234 567890</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="text-blue-600"><Mail size={18} /></div>
                  <span className="text-sm font-display text-blue-600">help@nagorikbondhu.com</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="pt-8 border-t border-blue-200/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[13px] text-slate-500 font-display">
              © ২০২৬ <span className="text-blue-600 font-bold">নাগরিক বন্ধু</span>. সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div className="flex gap-8 text-[12px] text-slate-400">
              <Link href="#" className="hover:text-blue-600 transition-colors">শর্তাবলী</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">প্রাইভেসি পলিসি</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;