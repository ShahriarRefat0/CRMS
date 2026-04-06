"use client";

import React, { useState, useEffect } from 'react';
import {
  User, Shield, Camera, Lock,
  MapPin, Save, Loader
} from 'lucide-react';
import { useSession } from "next-auth/react";
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/lib/imageUpload';
import axios from 'axios';

const SettingsPage = () => {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    area: '',
    image: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
        area: session.user.area || '',
        image: session.user.image || ''
      }));
    }
  }, [session]);

  const tabs = [
    { id: 'profile', name: 'প্রোফাইল', icon: <User size={18} /> },
    { id: 'security', name: 'সিকিউরিটি', icon: <Shield size={18} /> },
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      toast.success("ছবি আপলোড সফল হয়েছে!");
    } catch (error) {
      toast.error("ছবি আপলোড ব্যর্থ হয়েছে।");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/user/settings", {
        action: "updateProfile",
        ...formData
      });

      if (res.data.success) {
        toast.success(res.data.message);
        await update({
          ...session,
          user: { ...session.user, ...res.data.user }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "সেভ করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword) {
      return toast.error("সবগুলো ঘর পূরণ করুন!");
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("নতুন পাসওয়ার্ড দুটি মিলছে না!");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/user/settings", {
        action: "changePassword",
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "পাসওয়ার্ড পরিবর্তনে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-bangla animate-in fade-in duration-700 text-slate-600">

      {/* হেডার */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">সেটিংস</h1>
        <p className="text-slate-500 mt-2 font-medium">আপনার অ্যাকাউন্ট এবং ব্যক্তিগত পছন্দগুলো এখান থেকে নিয়ন্ত্রণ করুন।</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* বাম পাশের নেভিগেশন (Tabs) */}
        <div className="w-full md:w-64 space-y-2.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3.5 px-6 py-4.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border ${activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 border-indigo-600'
                : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200 hover:text-indigo-600'
                }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* ডান পাশের কন্টেন্ট */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/40 p-5 sm:p-8 md:p-10 relative overflow-hidden min-h-[500px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

          {/* ১. প্রোফাইল সেটিংস */}
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 relative">
              <div className="flex flex-col items-center md:items-start gap-8">
                <div className="relative group">
                  <div className="w-36 h-36 rounded-xl bg-slate-50 border-4 border-white shadow-2xl overflow-hidden relative group-hover:border-indigo-100 transition-all ring-8 ring-slate-50/50">
                    {uploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <Loader className="animate-spin text-indigo-600" />
                      </div>
                    ) : null}
                    <img
                      src={formData.image || `https://ui-avatars.com/api/?name=${formData.name}&background=6366f1&color=fff`}
                      alt="Avatar"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-3.5 bg-indigo-600 text-white rounded-xl shadow-xl hover:scale-110 transition-transform border border-indigo-400 cursor-pointer">
                    <Camera size={18} />
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">প্রোফাইল ছবি</h3>
                  <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">আপনার পরিচয় আপলোড করুন</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">আপনার নাম</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full p-4.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10 font-bold text-slate-800 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    readOnly
                    value={formData.email}
                    className="w-full p-4.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-bold text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">লোকেশন/এলাকা</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData(p => ({ ...p, area: e.target.value }))}
                      className="w-full pl-12 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10 font-bold text-slate-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* সেভ বাটন */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end relative">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading || uploading}
                  className="bg-indigo-600 text-white px-12 py-4.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all active:scale-95 border border-indigo-500 disabled:opacity-50"
                >
                  {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />} সেভ করুন
                </button>
              </div>
            </div>
          )}

          {/* ২. সিকিউরিটি সেটিংস */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 relative">
              <div className="flex items-center gap-5 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm border border-indigo-50"><Shield size={24} /></div>
                <div>
                  <p className="text-sm text-indigo-900 font-bold">পাসওয়ার্ড সিকিউরিটি</p>
                  <p className="text-[11px] text-indigo-400 font-black uppercase tracking-widest mt-0.5">আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করুন</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">বর্তমান পাসওয়ার্ড</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(p => ({ ...p, currentPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full p-4.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10 text-slate-800 placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">নতুন পাসওয়ার্ড</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(p => ({ ...p, newPassword: e.target.value }))}
                    placeholder="কমপক্ষে ৬ অক্ষরের"
                    className="w-full p-4.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10 text-slate-800 placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">পাসওয়ার্ড নিশ্চিত করুন</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="আবার টাইপ করুন"
                    className="w-full p-4.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10 text-slate-800 placeholder:text-slate-300"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={loading || !formData.currentPassword || !formData.newPassword}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-indigo-700 shadow-xl transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader className="animate-spin" size={16} /> : <Lock size={16} />} পাসওয়ার্ড পরিবর্তন করুন
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
