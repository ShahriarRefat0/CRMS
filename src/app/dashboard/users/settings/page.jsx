'use client';

import { Camera, Check, Loader2, Mail, MapPin, Phone, Save, User as UserIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { uploadImage } from '@/lib/imageUpload';
import { updateProfile } from '@/actions/userActions';
import toast from 'react-hot-toast';
import axios from 'axios';

/* ── Input কম্পোনেন্ট ── */
function SettingInput({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          {...props}
          className="w-full py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
          style={{
            paddingLeft: Icon ? '38px' : '14px',
            paddingRight: '14px',
          }}
        />
      </div>
    </div>
  );
}

/* ── Section card কম্পোনেন্ট ── */
function Section({ title, sub, icon: Icon, color, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

/* ── Tabs ── */
const TABS = [
  { id: 'profile', label: 'প্রোফাইল', icon: UserIcon, color: '#2563eb' },
  { id: 'security', label: 'পাসওয়ার্ড', icon: Check, color: '#f59e0b' },
];

// লোডিং কম্পোনেন্ট
function SettingsPageLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 p-2">
            <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-xl bg-slate-200 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-48 bg-slate-200 rounded-lg mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const [tab, setTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      nid: '',
      bio: '',
      area: '',
      image: '',
    },
    mode: 'onChange',
  });

  // সেশন আসার পর ফর্মের ডাটা সেট করুন
  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
        nid: session.user.nid || '',
        bio: session.user.bio || '',
        area: session.user.area || '',
        image: session.user.image || '',
      });
      setImagePreview(session.user.image);
    }
  }, [session, reset]);

  // লোডিং অবস্থা
  if (status === 'loading') {
    return <SettingsPageLoading />;
  }

  // লগইন না থাকলে
  if (!session?.user) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600 font-semibold">আপনি লগইন করেননি। দয়া করে লগইন করুন।</p>
        </div>
      </div>
    );
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      setValue('image', imageUrl);
      toast.success('ছবি আপলোড সফল হয়েছে!');
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('ছবি আপলোড ব্যর্থ হয়েছে।');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      setIsSaving(true);

      const result = await updateProfile(data);

      if (result.success) {
        toast.success(result.message);
        // NextAuth সেশন আপডেট করুন
        await update({
          ...session,
          user: {
            ...session.user,
            ...result.user
          }
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSave)}
      className="max-w-4xl mx-auto space-y-6 pt-4 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">সেটিংস</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            আপনার প্রোফাইল এবং পছন্দসমূহ পরিচালনা করুন
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
            boxShadow: '0 6px 18px rgba(37,99,235,0.3)',
          }}
        >
          {isSaving ? (
            <>
              <Loader2 size={15} className="animate-spin" /> সংরক্ষণ করা হচ্ছে...
            </>
          ) : (
            <>
              <Save size={15} /> পরিবর্তন সংরক্ষণ করুন
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-0">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible shadow-sm">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all whitespace-nowrap w-full group"
                style={{
                  background: tab === t.id ? `${t.color}12` : 'transparent',
                  color: tab === t.id ? t.color : '#64748b',
                  fontWeight: tab === t.id ? 700 : 500,
                }}
              >
                <t.icon size={17} className={tab === t.id ? '' : 'group-hover:text-slate-600'} />
                <span className="text-sm">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">
          {tab === 'profile' && (
            <>
              {/* Avatar Section */}
              <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden border-4 border-white">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        session.user.name?.charAt(0).toUpperCase() || 'ন'
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 size={24} className="text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute -bottom-2 -right-2 w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all"
                    >
                      <Camera size={16} />
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="text-center sm:text-left">
                    <p className="font-bold text-slate-800 text-xl">
                      {watch('name') || session.user.name}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {session.user.email}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tight">
                        Verified User
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Info Section */}
              <Section
                title="ব্যক্তিগত তথ্য"
                sub="আপনার মৌলিক পরিচিতি তথ্য সম্পাদন করুন"
                icon={UserIcon}
                color="#2563eb"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <SettingInput
                    label="পুরো নাম"
                    icon={UserIcon}
                    placeholder="আপনার নাম"
                    {...register('name')}
                  />
                  <SettingInput
                    label="ইমেইল (অপরিবর্তনীয়)"
                    icon={Mail}
                    placeholder="email@example.com"
                    readOnly
                    {...register('email')}
                    className="w-full py-3 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-400 cursor-not-allowed focus:outline-none"
                  />
                  <SettingInput
                    label="মোবাইল নম্বর"
                    icon={Phone}
                    placeholder="০১XXXXXXXXX"
                    {...register('phone')}
                  />
                  <SettingInput
                    label="এলাকা / জেলা"
                    icon={MapPin}
                    placeholder="আপনার এলাকা"
                    {...register('area')}
                  />
                  <SettingInput
                    label="ন্যাশনাল আইডি (NID)"
                    icon={Check}
                    placeholder="প্রদানকৃত NID নম্বর"
                    {...register('nid')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    আপনার সম্পর্কে (Bio)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="আপনার সম্পর্কে কিছু লিখুন যা আপনার প্রোফাইলে প্রদর্শিত হবে..."
                    {...register('bio')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all shadow-sm"
                  />
                </div>
              </Section>
            </>
          )}

          {tab === 'security' && (
            <Section
              title="পাসওয়ার্ড পরিবর্তন"
              sub="আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করুন"
              icon={Check}
              color="#f59e0b"
            >
              <div className="space-y-4 max-w-md">
                <SettingInput
                  label="বর্তমান পাসওয়ার্ড"
                  type="password"
                  placeholder="••••••••"
                  name="currentPassword"
                />
                <SettingInput
                  label="নতুন পাসওয়ার্ড"
                  type="password"
                  placeholder="কমপক্ষে ৬ অক্ষরের"
                  name="newPassword"
                />
                <SettingInput
                  label="পাসওয়ার্ড নিশ্চিত করুন"
                  type="password"
                  placeholder="আবার টাইপ করুন"
                  name="confirmPassword"
                />
                
                <button
                  type="button"
                  onClick={async () => {
                    const cp = document.getElementsByName('currentPassword')[0].value;
                    const np = document.getElementsByName('newPassword')[0].value;
                    const conp = document.getElementsByName('confirmPassword')[0].value;

                    if (!cp || !np) return toast.error("সবগুলো ঘর পূরণ করুন!");
                    if (np !== conp) return toast.error("নতুন পাসওয়ার্ড দুটি মিলছে না!");
                    
                    try {
                      setIsSaving(true);
                      const res = await axios.post("/api/user/settings", {
                        action: "changePassword",
                        currentPassword: cp,
                        newPassword: np
                      });
                      if (res.data.success) {
                        toast.success(res.data.message);
                        document.getElementsByName('currentPassword')[0].value = '';
                        document.getElementsByName('newPassword')[0].value = '';
                        document.getElementsByName('confirmPassword')[0].value = '';
                      }
                    } catch (err) {
                      toast.error(err.response?.data?.message || "পাসওয়ার্ড পরিবর্তনে সমস্যা হয়েছে।");
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className="w-full mt-4 py-3 rounded-xl bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-200 transition-all hover:bg-amber-700 disabled:opacity-50"
                >
                  {isSaving ? "প্রসেসিং..." : "পাসওয়ার্ড পরিবর্তন করুন"}
                </button>
              </div>
            </Section>
          )}
        </div>
      </div>
    </form>
  );
}

// 'use client';

// import {
//   Bell,
//   Camera,
//   Check,
//   Eye,
//   EyeOff,
//   Mail,
//   MapPin,
//   Phone,
//   Save,
//   User,
// } from 'lucide-react';
// import { useState } from 'react';
// import {  useForm } from 'react-hook-form';

// /* ── Toggle ── */
// function Toggle({ value, onChange, color = '#2563eb' }) {
//   return (
//     <button
//       onClick={() => onChange(!value)}
//       className="w-11 h-6 rounded-full relative transition-all duration-300 flex-shrink-0"
//       style={{ background: value ? color : '#e2e8f0' }}
//     >
//       <div
//         className="w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-all duration-300"
//         style={{ left: value ? '26px' : '4px' }}
//       />
//     </button>
//   );
// }

// /* ── Input ── */
// function SettingInput({
//   label,
//   value,
//   onChange,
//   type = 'text',
//   placeholder,
//   icon: Icon,
//   hint,
// }) {
//   const [show, setShow] = useState(false);
//   const isPass = type === 'password';
//   return (
//     <div className="space-y-1.5">
//       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
//         {label}
//       </label>
//       <div className="relative">
//         {Icon && (
//           <Icon
//             size={15}
//             className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//           />
//         )}
//         <input
//           type={isPass && !show ? 'password' : 'text'}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className="w-full py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
//           style={{
//             paddingLeft: Icon ? '38px' : '14px',
//             paddingRight: isPass ? '42px' : '14px',
//           }}
//         />
//         {isPass && (
//           <button
//             onClick={() => setShow(!show)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
//           >
//             {show ? <EyeOff size={15} /> : <Eye size={15} />}
//           </button>
//         )}
//       </div>
//       {hint && <p className="text-xs text-slate-400">{hint}</p>}
//     </div>
//   );
// }

// /* ── Section card ── */
// function Section({ title, sub, icon: Icon, color, children }) {
//   return (
//     <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
//       <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
//         <div
//           className="w-9 h-9 rounded-xl flex items-center justify-center"
//           style={{ background: `${color}18` }}
//         >
//           <Icon size={18} style={{ color }} />
//         </div>
//         <div>
//           <h3 className="text-sm font-bold text-slate-800">{title}</h3>
//           {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
//         </div>
//       </div>
//       <div className="px-6 py-5 space-y-5">{children}</div>
//     </div>
//   );
// }

// /* ── Row item ── */
// function SettingRow({ label, sub, children }) {
//   return (
//     <div className="flex items-center justify-between gap-4">
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-slate-700">{label}</p>
//         {sub && (
//           <p className="text-xs text-slate-400 mt-0.5 leading-snug">{sub}</p>
//         )}
//       </div>
//       <div className="flex-shrink-0">{children}</div>
//     </div>
//   );
// }

// /* ── Divider ── */
// const Div = () => <div className="h-px bg-slate-100" />;

// /* ── Nav Tab ── */
// const TABS = [
//   { id: 'profile', label: 'প্রোফাইল', icon: User, color: '#2563eb' },
//   // { id: "notif",    label: "বিজ্ঞপ্তি", icon: Bell,       color: "#f59e0b" },
//   // { id: "privacy",  label: "গোপনীয়তা", icon: Shield,     color: "#8b5cf6" },
//   // { id: "app",      label: "অ্যাপ",      icon: Smartphone, color: "#10b981" },
//   // { id: "account",  label: "অ্যাকাউন্ট", icon: Lock,       color: "#ef4444" },
// ];

// /* ══════════════════════════════
//    SETTINGS PAGE
// ══════════════════════════════ */
// export default function SettingsPage() {
//   const [tab, setTab] = useState('profile');
//   const [saved, setSaved] = useState(false);

//   const from = useForm({
//     defaultValues: {
//       name: '',
//       email: '',
//       mobile: '',
//       nid: '',
//       bio: '',
//       area: ''
//     },
//     mode:'onChange'
//   })

//   /* Profile */
//   // const [name, setName]         = useState("নাগরিক ব্যবহারকারী");
//   // const [email, setEmail]       = useState("user@nagrikbondhu.com");
//   // const [phone, setPhone]       = useState("০১৭XXXXXXXX");
//   // const [area, setArea]         = useState("মিরপুর, ঢাকা");
//   // const [bio, setBio]           = useState("");

//   /* Notifications===============================*/
//   const [notifStatus, setNotifStatus] = useState(true);
//   const [notifUpvote, setNotifUpvote] = useState(true);
//   const [notifNews, setNotifNews] = useState(false);
//   const [notifSMS, setNotifSMS] = useState(false);
//   const [notifEmail, setNotifEmail] = useState(true);
//   const [notifSound, setNotifSound] = useState(true);

//   /* Privacy =============================*/
//   // const [anonymous,  setAnonymous]  = useState(false);
//   // const [showProfile,setShowProfile]= useState(true);
//   // const [shareLocation, setShareLocation] = useState(true);
//   // const [twoFA,  setTwoFA]      = useState(false);

//   /* App ============================== */
//   // const [theme, setTheme]       = useState("light");
//   // const [lang,  setLang]        = useState("bn");
//   // const [compact, setCompact]   = useState(false);
//   // const [autoGPS, setAutoGPS]   = useState(true);

//   /* Password ============================= */
//   // const [oldPass, setOldPass]   = useState("");
//   // const [newPass, setNewPass]   = useState("");
//   // const [confPass, setConfPass] = useState("");

//   const handleSave = (data) => {
//     console.log(data)
//     setTimeout(() => setSaved(false), 2500);
//   };

//   return (
//     <form
//       onSubmit={from.handleSubmit(handleSave)}
//       className="max-w-4xl mx-auto space-y-6"
//     >
//       {/* ── Header ── */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800">সেটিংস</h1>
//           <p className="text-sm text-slate-500 mt-0.5">
//             আপনার অ্যাকাউন্ট ও অ্যাপ পছন্দ পরিচালনা করুন
//           </p>
//         </div>
//         <button
//           className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
//           style={{
//             background: saved
//               ? 'linear-gradient(135deg,#16a34a,#22c55e)'
//               : 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
//             boxShadow: `0 6px 18px ${saved ? 'rgba(22,163,74,0.3)' : 'rgba(37,99,235,0.3)'}`,
//           }}
//         >
//           {saved ? (
//             <>
//               <Check size={15} /> সংরক্ষিত হয়েছে!
//             </>
//           ) : (
//             <>
//               <Save size={15} /> সংরক্ষণ করুন
//             </>
//           )}
//         </button>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* ── Sidebar Nav ── */}
//         <div className="lg:w-56 shrink-0">
//           <div className="bg-white rounded-xl border border-slate-100 p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
//             {TABS.map((t) => (
//               <button
//                 key={t.id}
//                 onClick={() => setTab(t.id)}
//                 className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all whitespace-nowrap w-full"
//                 style={{
//                   background: tab === t.id ? `${t.color}12` : 'transparent',
//                   color: tab === t.id ? t.color : '#64748b',
//                   fontWeight: tab === t.id ? 700 : 500,
//                 }}
//               >
//                 <t.icon size={17} />
//                 <span className="text-sm">{t.label}</span>
//                 {tab === t.id && (
//                   <div
//                     className="ml-auto w-1.5 h-1.5 rounded-full hidden lg:block"
//                     style={{ background: t.color }}
//                   />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── Content ── */}
//         <div className="flex-1 space-y-4">
//           {/* ══ PROFILE ══ */}
//           {tab === 'profile' && (
//             <>
//               {/* Avatar */}
//               <div className="bg-white rounded-xl border border-slate-100 p-6">
//                 <div className="flex items-center gap-5">
//                   <div className="relative">
//                     <div className="w-20 h-20 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
//                       ন
//                     </div>
//                     <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white shadow hover:bg-blue-700 transition-colors">
//                       <Camera size={13} />
//                     </button>
//                   </div>
//                   <div>
//                     <p className="font-bold text-slate-800 text-lg">urmi</p>
//                     <p className="text-sm text-slate-500">'urmiemail'</p>
//                     <div className="flex items-center gap-2 mt-1.5">
//                       <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
//                         Verified ✓
//                       </span>
//                       <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">
//                         সক্রিয় নাগরিক
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <Section
//                 title="ব্যক্তিগত তথ্য"
//                 sub="আপনার মূল পরিচয় তথ্য"
//                 icon={User}
//                 color="#2563eb"
//               >
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <SettingInput
//                     label="পুরো নাম"
//                     onChange={(e) => from.setValue('name', e.target.value)}
//                     icon={User}
//                     placeholder="আপনার নাম"
//                   />
//                   <SettingInput
//                     label="ইমেইল"
//                     onChange={(e) => from.setValue('email', e.target.value)}
//                     icon={Mail}
//                     placeholder="email@example.com"
//                   />
//                   <SettingInput
//                     label="মোবাইল"
//                     onChange={(e) => from.setValue('mobile', e.target.value)}
//                     icon={Phone}
//                     placeholder="০১XXXXXXXXX"
//                   />
//                   <SettingInput
//                     label="এলাকা"
//                     onChange={(e) => from.setValue('area', e.target.value)}
//                     icon={MapPin}
//                     placeholder="আপনার এলাকা"
//                   />
//                   <SettingInput
//                     label="NID"
//                     onChange={(e) => from.setValue('nid', e.target.value)}
//                     icon={MapPin}
//                     placeholder=" Enter NID Number"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
//                     সংক্ষিপ্ত পরিচয়
//                   </label>
//                   <textarea
//                     onChange={(e) => from.setValue('bio', e.target.value)}
//                     rows={3}
//                     placeholder="আপনার সম্পর্কে কিছু লিখুন..."
//                     className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
//                   />
//                 </div>
//               </Section>
//             </>
//           )}

//           {/* ══ NOTIFICATIONS ══  aitay toggle use korse */}
//           {tab === 'notif' && (
//             <Section
//               title="বিজ্ঞপ্তি সেটিংস"
//               sub="কোন ধরনের নোটিফিকেশন পাবেন তা বেছে নিন"
//               icon={Bell}
//               color="#f59e0b"
//             >
//               <SettingRow
//                 label="রিপোর্টের স্ট্যাটাস আপডেট"
//                 sub="রিপোর্টে কোনো পরিবর্তন হলে জানাবে"
//               >
//                 <Toggle value={notifStatus} onChange={setNotifStatus} />
//               </SettingRow>
//               <Div />
//               <SettingRow
//                 label="Upvote বিজ্ঞপ্তি"
//                 sub="কেউ আপনার রিপোর্টে ভোট দিলে"
//               >
//                 <Toggle value={notifUpvote} onChange={setNotifUpvote} />
//               </SettingRow>
//               <Div />
//               <SettingRow
//                 label="সংবাদ ও আপডেট"
//                 sub="নাগরিক বন্ধুর নতুন ফিচার ও খবর"
//               >
//                 <Toggle
//                   value={notifNews}
//                   onChange={setNotifNews}
//                   color="#f59e0b"
//                 />
//               </SettingRow>
//               <Div />
//               <SettingRow
//                 label="SMS বিজ্ঞপ্তি"
//                 sub="মোবাইলে SMS এর মাধ্যমে আপডেট"
//               >
//                 <Toggle
//                   value={notifSMS}
//                   onChange={setNotifSMS}
//                   color="#f59e0b"
//                 />
//               </SettingRow>
//               <Div />
//               <SettingRow
//                 label="ইমেইল বিজ্ঞপ্তি"
//                 sub="ইমেইলে সাপ্তাহিক সারসংক্ষেপ"
//               >
//                 <Toggle value={notifEmail} onChange={setNotifEmail} />
//               </SettingRow>
//               <Div />
//               <SettingRow
//                 label="বিজ্ঞপ্তি শব্দ"
//                 sub="নতুন বিজ্ঞপ্তি এলে শব্দ বাজাবে"
//               >
//                 <Toggle value={notifSound} onChange={setNotifSound} />
//               </SettingRow>

//               {/* Quiet hours */}
//               <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 mt-2">
//                 <div className="flex items-center gap-2 mb-3">
//                   <Bell size={14} className="text-amber-600" />
//                   <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
//                     নিরব সময় (Quiet Hours)
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-xs text-amber-600 font-medium block mb-1">
//                       শুরু
//                     </label>
//                     <select className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm bg-white focus:outline-none focus:border-amber-400">
//                       {['রাত ১০:০০', 'রাত ১১:০০', 'রাত ১২:০০'].map((t) => (
//                         <option key={t}>{t}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-xs text-amber-600 font-medium block mb-1">
//                       শেষ
//                     </label>
//                     <select className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm bg-white focus:outline-none focus:border-amber-400">
//                       {['সকাল ৬:০০', 'সকাল ৭:০০', 'সকাল ৮:০০'].map((t) => (
//                         <option key={t}>{t}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </Section>
//           )}

//           {/* nicher gula apatoto use kortasi na tai just ui cmnt kore raklm==================================================== */}

//           {/* ══ PRIVACY ══ */}
//           {/* {tab === "privacy" && (
//             <>
//               <Section title="গোপনীয়তা নিয়ন্ত্রণ" sub="আপনার তথ্য কে কীভাবে দেখতে পাবে" icon={Shield} color="#8b5cf6">
//                 <SettingRow label="Anonymous মোড" sub="রিপোর্টে নাম প্রকাশ না করে পরিচয় গোপন রাখুন">
//                   <Toggle value={anonymous} onChange={setAnonymous} color="#8b5cf6" />
//                 </SettingRow>
//                 <Div />
//                 <SettingRow label="পাবলিক প্রোফাইল" sub="অন্য নাগরিকরা আপনার প্রোফাইল দেখতে পাবেন">
//                   <Toggle value={showProfile} onChange={setShowProfile} color="#8b5cf6" />
//                 </SettingRow>
//                 <Div />
//                 <SettingRow label="লোকেশন শেয়ার" sub="রিপোর্টে সঠিক GPS অবস্থান শেয়ার করুন">
//                   <Toggle value={shareLocation} onChange={setShareLocation} color="#8b5cf6" />
//                 </SettingRow>
//                 <Div />
//                 <SettingRow label="দুই-ধাপ যাচাইকরণ (2FA)" sub="লগইনে OTP দিয়ে অতিরিক্ত নিরাপত্তা">
//                   <Toggle value={twoFA} onChange={setTwoFA} color="#8b5cf6" />
//                 </SettingRow>
//               </Section>

//               <Section title="পাসওয়ার্ড পরিবর্তন" sub="নিয়মিত পাসওয়ার্ড পরিবর্তন করুন" icon={Lock} color="#8b5cf6">
//                 <SettingInput label="বর্তমান পাসওয়ার্ড" value={oldPass} onChange={setOldPass} type="password" icon={Lock} />
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <SettingInput label="নতুন পাসওয়ার্ড" value={newPass} onChange={setNewPass} type="password" icon={Lock}
//                     hint="কমপক্ষে ৮ অক্ষর" />
//                   <SettingInput label="নিশ্চিত পাসওয়ার্ড" value={confPass} onChange={setConfPass} type="password" icon={Lock} />
//                 </div>
//                 {newPass && confPass && newPass !== confPass && (
//                   <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
//                     <AlertTriangle size={13} /> পাসওয়ার্ড মিলছে না
//                   </div>
//                 )}
//                 {newPass && confPass && newPass === confPass && newPass.length >= 8 && (
//                   <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-xl">
//                     <Check size={13} /> পাসওয়ার্ড মিলেছে ✓
//                   </div>
//                 )}
//                 <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 w-full sm:w-auto"
//                   style={{ background: "linear-gradient(135deg,#7c3aed,#8b5cf6)", boxShadow: "0 4px 14px rgba(139,92,246,0.35)" }}>
//                   পাসওয়ার্ড পরিবর্তন করুন
//                 </button>
//               </Section>
//             </>
//           )} */}

//           {/* ══ APP ══ */}
//           {/* {tab === "app" && (
//             <>
//               <Section title="থিম" sub="অ্যাপের রঙ ও চেহারা পরিবর্তন করুন" icon={Palette} color="#10b981">
//                 <div className="grid grid-cols-3 gap-3">
//                   {[
//                     { id: "light",  label: "লাইট",  icon: Sun,     bg: "#ffffff", border: "#e2e8f0" },
//                     { id: "dark",   label: "ডার্ক",  icon: Moon,    bg: "#0f172a", border: "#1e293b" },
//                     { id: "system", label: "সিস্টেম",icon: Monitor, bg: "linear-gradient(135deg,#fff 50%,#0f172a 50%)", border: "#94a3b8" },
//                   ].map(t => (
//                     <button key={t.id} onClick={() => setTheme(t.id)}
//                       className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
//                       style={{
//                         borderColor: theme === t.id ? "#2563eb" : "#e2e8f0",
//                         background: theme === t.id ? "#eff6ff" : "#f8fafc",
//                       }}>
//                       <div className="w-10 h-10 rounded-xl border-2 border-slate-200 overflow-hidden"
//                         style={{ background: t.bg }} />
//                       <span className="text-xs font-bold" style={{ color: theme === t.id ? "#2563eb" : "#64748b" }}>{t.label}</span>
//                       {theme === t.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
//                     </button>
//                   ))}
//                 </div>
//               </Section>

//               <Section title="ভাষা ও অঞ্চল" sub="অ্যাপের ভাষা নির্বাচন করুন" icon={Globe} color="#10b981">
//                 <div className="grid sm:grid-cols-2 gap-3">
//                   {[
//                     { id: "bn", label: "বাংলা", flag: "🇧🇩" },
//                     { id: "en", label: "English", flag: "🇬🇧" },
//                   ].map(l => (
//                     <button key={l.id} onClick={() => setLang(l.id)}
//                       className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left"
//                       style={{
//                         borderColor: lang === l.id ? "#10b981" : "#e2e8f0",
//                         background: lang === l.id ? "#f0fdf4" : "#f8fafc",
//                       }}>
//                       <span className="text-2xl">{l.flag}</span>
//                       <div>
//                         <p className="text-sm font-bold" style={{ color: lang === l.id ? "#16a34a" : "#334155" }}>{l.label}</p>
//                         {lang === l.id && <p className="text-xs text-green-600">নির্বাচিত ✓</p>}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </Section>

//               <Section title="অ্যাপ পছন্দ" sub="ব্যবহারের অভিজ্ঞতা কাস্টমাইজ করুন" icon={Smartphone} color="#10b981">
//                 <SettingRow label="কম্প্যাক্ট ভিউ" sub="কার্ডগুলো ছোট করে বেশি তথ্য দেখান">
//                   <Toggle value={compact} onChange={setCompact} color="#10b981" />
//                 </SettingRow>
//                 <Div />
//                 <SettingRow label="স্বয়ংক্রিয় GPS" sub="রিপোর্টের সময় অটো-লোকেশন চালু রাখুন">
//                   <Toggle value={autoGPS} onChange={setAutoGPS} color="#10b981" />
//                 </SettingRow>
//               </Section>
//             </>
//           )} */}

//           {/* ══ ACCOUNT ══ */}
//           {/* {tab === "account" && (
//             <>

//               <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
//                 <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
//                 <div className="text-xs text-blue-700 leading-relaxed">
//                   আপনার অ্যাকাউন্ট তথ্য সুরক্ষিত। অ্যাকাউন্ট মুছে ফেললে সমস্ত রিপোর্ট ও পয়েন্ট স্থায়ীভাবে মুছে যাবে।
//                 </div>
//               </div>

//               <Section title="অ্যাকাউন্ট তথ্য" sub="আপনার অ্যাকাউন্টের মূল তথ্য" icon={User} color="#ef4444">
//                 <div className="space-y-3">
//                   {[
//                     ["অ্যাকাউন্ট ID", "NB-2025-0001"],
//                     ["নিবন্ধন তারিখ", "১ জানুয়ারি ২০২৫"],
//                     ["সর্বশেষ লগইন", "আজ, সকাল ১০:৩২"],
//                     ["মোট রিপোর্ট", "১২টি"],
//                     ["অ্যাকাউন্ট ধরন", "সাধারণ নাগরিক"],
//                   ].map(([k,v]) => (
//                     <div key={k} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
//                       <span className="text-sm text-slate-500 font-medium">{k}</span>
//                       <span className="text-sm text-slate-800 font-bold">{v}</span>
//                     </div>
//                   ))}
//                 </div>
//               </Section>

//               <Section title="বিপজ্জনক অঞ্চল" sub="এই পদক্ষেপগুলো ফেরত নেওয়া যাবে না" icon={AlertTriangle} color="#ef4444">
//                 <div className="space-y-3">
//                   <button className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 border-orange-200 hover:border-orange-400 bg-orange-50 hover:bg-orange-100 transition-all group">
//                     <div className="flex items-center gap-3">
//                       <LogOut size={18} className="text-orange-500" />
//                       <div className="text-left">
//                         <p className="text-sm font-bold text-orange-700">সব ডিভাইস থেকে লগআউট</p>
//                         <p className="text-xs text-orange-500">সমস্ত সক্রিয় সেশন শেষ করুন</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={16} className="text-orange-400 group-hover:translate-x-0.5 transition-transform" />
//                   </button>

//                   <button className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 transition-all group">
//                     <div className="flex items-center gap-3">
//                       <Trash2 size={18} className="text-red-500" />
//                       <div className="text-left">
//                         <p className="text-sm font-bold text-red-700">অ্যাকাউন্ট মুছে ফেলুন</p>
//                         <p className="text-xs text-red-400">সমস্ত ডেটা স্থায়ীভাবে মুছে যাবে</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={16} className="text-red-400 group-hover:translate-x-0.5 transition-transform" />
//                   </button>
//                 </div>
//               </Section>
//             </>
//           )} */}
//         </div>
//       </div>
//     </form>
//   );
// }

// 'use client';

// import {
//   Bell,
//   Camera,
//   Check,
//   Eye,
//   EyeOff,
//   Mail,
//   MapPin,
//   Phone,
//   Save,
//   User,
// } from 'lucide-react';
// import { useState } from 'react';
// import {  useForm } from 'react-hook-form';

// /* ── Toggle ── */
// function Toggle({ value, onChange, color = '#2563eb' }) {
//   return (
//     <button
//       onClick={() => onChange(!value)}
//       className="w-11 h-6 rounded-full relative transition-all duration-300 flex-shrink-0"
//       style={{ background: value ? color : '#e2e8f0' }}
//     >
//       <div
//         className="w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-all duration-300"
//         style={{ left: value ? '26px' : '4px' }}
//       />
//     </button>
//   );
// }

// /* ── Input ── */
// function SettingInput({
//   label,
//   value,
//   onChange,
//   type = 'text',
//   placeholder,
//   icon: Icon,
//   hint,
// }) {
//   const [show, setShow] = useState(false);
//   const isPass = type === 'password';
//   return (
//     <div className="space-y-1.5">
//       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
//         {label}
//       </label>
//       <div className="relative">
//         {Icon && (
//           <Icon
//             size={15}
//             className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//           />
//         )}
//         <input
//           type={isPass && !show ? 'password' : 'text'}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className="w-full py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
//           style={{
//             paddingLeft: Icon ? '38px' : '14px',
//             paddingRight: isPass ? '42px' : '14px',
//           }}
//         />
//         {isPass && (
//           <button
//             onClick={() => setShow(!show)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
//           >
//             {show ? <EyeOff size={15} /> : <Eye size={15} />}
//           </button>
//         )}
//       </div>
//       {hint && <p className="text-xs text-slate-400">{hint}</p>}
//     </div>
//   );
// }

// /* ── Section card ── */
// function Section({ title, sub, icon: Icon, color, children }) {
//   return (
//     <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
//       <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
//         <div
//           className="w-9 h-9 rounded-xl flex items-center justify-center"
//           style={{ background: `${color}18` }}
//         >
//           <Icon size={18} style={{ color }} />
//         </div>
//         <div>
//           <h3 className="text-sm font-bold text-slate-800">{title}</h3>
//           {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
//         </div>
//       </div>
//       <div className="px-6 py-5 space-y-5">{children}</div>
//     </div>
//   );
// }

// /* ── Row item ── */
// function SettingRow({ label, sub, children }) {
//   return (
//     <div className="flex items-center justify-between gap-4">
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-slate-700">{label}</p>
//         {sub && (
//           <p className="text-xs text-slate-400 mt-0.5 leading-snug">{sub}</p>
//         )}
//       </div>
//       <div className="flex-shrink-0">{children}</div>
//     </div>
//   );
// }

// /* ── Divider ── */
// const Div = () => <div className="h-px bg-slate-100" />;

// /* ── Nav Tab ── */
// const TABS = [
//   { id: 'profile', label: 'প্রোফাইল', icon: User, color: '#2563eb' },
//   // { id: "notif",    label: "বিজ্ঞপ্তি", icon: Bell,       color: "#f59e0b" },
//   // { id: "privacy",  label: "গোপনীয়তা", icon: Shield,     color: "#8b5cf6" },
//   // { id: "app",      label: "অ্যাপ",      icon: Smartphone, color: "#10b981" },
//   // { id: "account",  label: "অ্যাকাউন্ট", icon: Lock,       color: "#ef4444" },
// ];

// /* ══════════════════════════════
//    SETTINGS PAGE
// ══════════════════════════════ */
// export default function SettingsPage() {
//   const [tab, setTab] = useState('profile');
//   const [saved, setSaved] = useState(false);

//   const from = useForm({
//     defaultValues: {
//       name: '',
//       email: '',
//       mobile: '',
//       nid: '',
//       bio: '',
//       area: ''
//     },
//     mode:'onChange'
//   })

//   /* Profile */
//   // const [name, setName]         = useState("নাগরিক ব্যবহারকারী");
//   // const [email, setEmail]       = useState("user@nagrikbondhu.com");
//   // const [phone, setPhone]       = useState("০১৭XXXXXXXX");
//   // const [area, setArea]         = useState("মিরপুর, ঢাকা");
//   // const [bio, setBio]           = useState("");

//   /* Notifications===============================*/
//   const [notifStatus, setNotifStatus] = useState(true);
//   const [notifUpvote, setNotifUpvote] = useState(true);
//   const [notifNews, setNotifNews] = useState(false);
//   const [notifSMS, setNotifSMS] = useState(false);
//   const [notifEmail, setNotifEmail] = useState(true);
//   const [notifSound, setNotifSound] = useState(true);

//   /* Privacy =============================*/
//   // const [anonymous,  setAnonymous]  = useState(false);
//   // const [showProfile,setShowProfile]= useState(true);
//   // const [shareLocation, setShareLocation] = useState(true);
//   // const [twoFA,  setTwoFA]      = useState(false);

//   /* App ============================== */
//   // const [theme, setTheme]       = useState("light");
//   // const [lang,  setLang]        = useState("bn");
//   // const [compact, setCompact]   = useState(false);
//   // const [autoGPS, setAutoGPS]   = useState(true);

//   /* Password ============================= */
//   // const [oldPass, setOldPass]   = useState("");
//   // const [newPass, setNewPass]   = useState("");
//   // const [confPass, setConfPass] = useState("");

//   const handleSave = (data) => {
//     console.log(data)
//     setTimeout(() => setSaved(false), 2500);
//   };

//   return (
//     <form
//       onSubmit={from.handleSubmit(handleSave)}
//       className="max-w-4xl mx-auto space-y-6"
//     >
//       {/* ── Header ── */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800">সেটিংস</h1>
//           <p className="text-sm text-slate-500 mt-0.5">
//             আপনার অ্যাকাউন্ট ও অ্যাপ পছন্দ পরিচালনা করুন
//           </p>
//         </div>
//         <button
//           className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
//           style={{
//             background: saved
//               ? 'linear-gradient(135deg,#16a34a,#22c55e)'
//               : 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
//             boxShadow: `0 6px 18px ${saved ? 'rgba(22,163,74,0.3)' : 'rgba(37,99,235,0.3)'}`,
//           }}
//         >
//           {saved ? (
//             <>
//               <Check size={15} /> সংরক্ষিত হয়েছে!
//             </>
//           ) : (
//             <>
//               <Save size={15} /> সংরক্ষণ করুন
//             </>
//           )}
//         </button>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* ── Sidebar Nav ── */}
//         <div className="lg:w-56 shrink-0">
//           <div className="bg-white rounded-xl border border-slate-100 p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
//             {TABS.map((t) => (
//               <button
//                 key={t.id}
//                 onClick={() => setTab(t.id)}
//                 className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all whitespace-nowrap w-full"
//                 style={{
//                   background: tab === t.id ? `${t.color}12` : 'transparent',
//                   color: tab === t.id ? t.color : '#64748b',
//                   fontWeight: tab === t.id ? 700 : 500,
//                 }}
//               >
//                 <t.icon size={17} />
//                 <span className="text-sm">{t.label}</span>
//                 {tab === t.id && (
//                   <div
//                     className="ml-auto w-1.5 h-1.5 rounded-full hidden lg:block"
//                     style={{ background: t.color }}
//                   />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── Content ── */}
//         <div className="flex-1 space-y-4">
//           {/* ══ PROFILE ══ */}
//           {tab === 'profile' && (
//             <>
//               {/* Avatar */}
//               <div className="bg-white rounded-xl border border-slate-100 p-6">
//                 <div className="flex items-center gap-5">
//                   <div className="relative">
//                     <div className="w-20 h-20 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
//                       ন
//                     </div>
//                     <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white shadow hover:bg-blue-700 transition-colors">
//                       <Camera size={13} />
//                     </button>
//                   </div>
//                   <div>
//                     <p className="font-bold text-slate-800 text-lg">urmi</p>
//                     <p className="text-sm text-slate-500">'urmiemail'</p>
//                     <div className="flex items-center gap-2 mt-1.5">
//                       <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
//                         Verified ✓
//                       </span>
//                       <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">
//                         সক্রিয় নাগরিক
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <Section
//                 title="ব্যক্তিগত তথ্য"
//                 sub="আপনার মূল পরিচয় তথ্য"
//                 icon={User}
//                 color="#2563eb"
//               >
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <SettingInput
//                     label="পুরো নাম"
//                     onChange={(e) => from.setValue('name', e.target.value)}
//                     icon={User}
//                     placeholder="আপনার নাম"
//                   />
//                   <SettingInput
//                     label="ইমেইল"
//                     onChange={(e) => from.setValue('email', e.target.value)}
//                     icon={Mail}
//                     placeholder="email@example.com"
//                   />
//                   <SettingInput
//                     label="মোবাইল"
//                     onChange={(e) => from.setValue('mobile', e.target.value)}
//                     icon={Phone}
//                     placeholder="০১XXXXXXXXX"
//                   />
//                   <SettingInput
//                     label="এলাকা"
//                     onChange={(e) => from.setValue('area', e.target.value)}
//                     icon={MapPin}
//                     placeholder="আপনার এলাকা"
//                   />
//                   <SettingInput
//                     label="NID"
//                     onChange={(e) => from.setValue('nid', e.target.value)}
//                     icon={MapPin}
//                     placeholder=" Enter NID Number"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
//                     সংক্ষিপ্ত পরিচয়
//                   </label>
//                   <textarea
//                     onChange={(e) => from.setValue('bio', e.target.value)}
//                     rows={3}
//                     placeholder="আপনার সম্পর্কে কিছু লিখুন..."
//                     className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
//                   />
//                 </div>
//               </Section>
//             </>
//           )}

//           {/* ══ NOTIFICATIONS ══  aitay toggle use korse */}
//           {tab === 'notif' && (
//             <Section
//               title="বিজ্ঞপ্তি সেটিংস"
//               sub="কোন ধরনের নোটিফিকেশন পাবেন তা বেছে নিন"
//               icon={Bell}
//               color="#f59e0b"
//             >
//               <SettingRow
//                 label="রিপোর্টের স্ট্যাটাস আপডেট"
//                 sub="রিপোর্টে কোনো পরিবর্তন হলে জানাবে"
//               >
//                 <Toggle value={notifStatus} onChange={setNotifStatus} />
//               </SettingRow>
//               <Div />
//               <SettingRow
//                 label="Upvote বিজ্ঞপ্তি"
//                 sub="কেউ আপনার রিপোর্টে ভোট দিলে"
//               >
//                 <Toggle value={notifUpvote} onChange={setNotifUpvote} />
//               </SettingRow>
//               <Div />
//               <SettingRow
//                 label="সংবাদ ও আপডেট"
//                 sub="নাগরিক বন্ধুর নতুন ফিচার ও খবর"
//               >
//                 <Toggle
//                   value={notifNews}
//                   onChange={setNotifNews}
//                   color="#f59e0b"
//                 />
//               </SettingRow>
//               <Div />
//               <SettingRow
//                 label="SMS বিজ্ঞপ্তি"
//                 sub="মোবাইলে SMS এর মাধ্যমে আপডেট"
//               >
//                 <Toggle
//                   value={notifSMS}
//                   onChange={setNotifSMS}
//                   color="#f59e0b"
//                 />
//               </SettingRow>
//               <Div />
//               <SettingRow
//                 label="ইমেইল বিজ্ঞপ্তি"
//                 sub="ইমেইলে সাপ্তাহিক সারসংক্ষেপ"
//               >
//                 <Toggle value={notifEmail} onChange={setNotifEmail} />
//               </SettingRow>
//               <Div />
//               <SettingRow
//                 label="বিজ্ঞপ্তি শব্দ"
//                 sub="নতুন বিজ্ঞপ্তি এলে শব্দ বাজাবে"
//               >
//                 <Toggle value={notifSound} onChange={setNotifSound} />
//               </SettingRow>

//               {/* Quiet hours */}
//               <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 mt-2">
//                 <div className="flex items-center gap-2 mb-3">
//                   <Bell size={14} className="text-amber-600" />
//                   <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
//                     নিরব সময় (Quiet Hours)
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-xs text-amber-600 font-medium block mb-1">
//                       শুরু
//                     </label>
//                     <select className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm bg-white focus:outline-none focus:border-amber-400">
//                       {['রাত ১০:০০', 'রাত ১১:০০', 'রাত ১২:০০'].map((t) => (
//                         <option key={t}>{t}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-xs text-amber-600 font-medium block mb-1">
//                       শেষ
//                     </label>
//                     <select className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm bg-white focus:outline-none focus:border-amber-400">
//                       {['সকাল ৬:০০', 'সকাল ৭:০০', 'সকাল ৮:০০'].map((t) => (
//                         <option key={t}>{t}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </Section>
//           )}

//           {/* nicher gula apatoto use kortasi na tai just ui cmnt kore raklm==================================================== */}

//           {/* ══ PRIVACY ══ */}
//           {/* {tab === "privacy" && (
//             <>
//               <Section title="গোপনীয়তা নিয়ন্ত্রণ" sub="আপনার তথ্য কে কীভাবে দেখতে পাবে" icon={Shield} color="#8b5cf6">
//                 <SettingRow label="Anonymous মোড" sub="রিপোর্টে নাম প্রকাশ না করে পরিচয় গোপন রাখুন">
//                   <Toggle value={anonymous} onChange={setAnonymous} color="#8b5cf6" />
//                 </SettingRow>
//                 <Div />
//                 <SettingRow label="পাবলিক প্রোফাইল" sub="অন্য নাগরিকরা আপনার প্রোফাইল দেখতে পাবেন">
//                   <Toggle value={showProfile} onChange={setShowProfile} color="#8b5cf6" />
//                 </SettingRow>
//                 <Div />
//                 <SettingRow label="লোকেশন শেয়ার" sub="রিপোর্টে সঠিক GPS অবস্থান শেয়ার করুন">
//                   <Toggle value={shareLocation} onChange={setShareLocation} color="#8b5cf6" />
//                 </SettingRow>
//                 <Div />
//                 <SettingRow label="দুই-ধাপ যাচাইকরণ (2FA)" sub="লগইনে OTP দিয়ে অতিরিক্ত নিরাপত্তা">
//                   <Toggle value={twoFA} onChange={setTwoFA} color="#8b5cf6" />
//                 </SettingRow>
//               </Section>

//               <Section title="পাসওয়ার্ড পরিবর্তন" sub="নিয়মিত পাসওয়ার্ড পরিবর্তন করুন" icon={Lock} color="#8b5cf6">
//                 <SettingInput label="বর্তমান পাসওয়ার্ড" value={oldPass} onChange={setOldPass} type="password" icon={Lock} />
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <SettingInput label="নতুন পাসওয়ার্ড" value={newPass} onChange={setNewPass} type="password" icon={Lock}
//                     hint="কমপক্ষে ৮ অক্ষর" />
//                   <SettingInput label="নিশ্চিত পাসওয়ার্ড" value={confPass} onChange={setConfPass} type="password" icon={Lock} />
//                 </div>
//                 {newPass && confPass && newPass !== confPass && (
//                   <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
//                     <AlertTriangle size={13} /> পাসওয়ার্ড মিলছে না
//                   </div>
//                 )}
//                 {newPass && confPass && newPass === confPass && newPass.length >= 8 && (
//                   <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-xl">
//                     <Check size={13} /> পাসওয়ার্ড মিলেছে ✓
//                   </div>
//                 )}
//                 <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 w-full sm:w-auto"
//                   style={{ background: "linear-gradient(135deg,#7c3aed,#8b5cf6)", boxShadow: "0 4px 14px rgba(139,92,246,0.35)" }}>
//                   পাসওয়ার্ড পরিবর্তন করুন
//                 </button>
//               </Section>
//             </>
//           )} */}

//           {/* ══ APP ══ */}
//           {/* {tab === "app" && (
//             <>
//               <Section title="থিম" sub="অ্যাপের রঙ ও চেহারা পরিবর্তন করুন" icon={Palette} color="#10b981">
//                 <div className="grid grid-cols-3 gap-3">
//                   {[
//                     { id: "light",  label: "লাইট",  icon: Sun,     bg: "#ffffff", border: "#e2e8f0" },
//                     { id: "dark",   label: "ডার্ক",  icon: Moon,    bg: "#0f172a", border: "#1e293b" },
//                     { id: "system", label: "সিস্টেম",icon: Monitor, bg: "linear-gradient(135deg,#fff 50%,#0f172a 50%)", border: "#94a3b8" },
//                   ].map(t => (
//                     <button key={t.id} onClick={() => setTheme(t.id)}
//                       className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
//                       style={{
//                         borderColor: theme === t.id ? "#2563eb" : "#e2e8f0",
//                         background: theme === t.id ? "#eff6ff" : "#f8fafc",
//                       }}>
//                       <div className="w-10 h-10 rounded-xl border-2 border-slate-200 overflow-hidden"
//                         style={{ background: t.bg }} />
//                       <span className="text-xs font-bold" style={{ color: theme === t.id ? "#2563eb" : "#64748b" }}>{t.label}</span>
//                       {theme === t.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
//                     </button>
//                   ))}
//                 </div>
//               </Section>

//               <Section title="ভাষা ও অঞ্চল" sub="অ্যাপের ভাষা নির্বাচন করুন" icon={Globe} color="#10b981">
//                 <div className="grid sm:grid-cols-2 gap-3">
//                   {[
//                     { id: "bn", label: "বাংলা", flag: "🇧🇩" },
//                     { id: "en", label: "English", flag: "🇬🇧" },
//                   ].map(l => (
//                     <button key={l.id} onClick={() => setLang(l.id)}
//                       className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left"
//                       style={{
//                         borderColor: lang === l.id ? "#10b981" : "#e2e8f0",
//                         background: lang === l.id ? "#f0fdf4" : "#f8fafc",
//                       }}>
//                       <span className="text-2xl">{l.flag}</span>
//                       <div>
//                         <p className="text-sm font-bold" style={{ color: lang === l.id ? "#16a34a" : "#334155" }}>{l.label}</p>
//                         {lang === l.id && <p className="text-xs text-green-600">নির্বাচিত ✓</p>}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </Section>

//               <Section title="অ্যাপ পছন্দ" sub="ব্যবহারের অভিজ্ঞতা কাস্টমাইজ করুন" icon={Smartphone} color="#10b981">
//                 <SettingRow label="কম্প্যাক্ট ভিউ" sub="কার্ডগুলো ছোট করে বেশি তথ্য দেখান">
//                   <Toggle value={compact} onChange={setCompact} color="#10b981" />
//                 </SettingRow>
//                 <Div />
//                 <SettingRow label="স্বয়ংক্রিয় GPS" sub="রিপোর্টের সময় অটো-লোকেশন চালু রাখুন">
//                   <Toggle value={autoGPS} onChange={setAutoGPS} color="#10b981" />
//                 </SettingRow>
//               </Section>
//             </>
//           )} */}

//           {/* ══ ACCOUNT ══ */}
//           {/* {tab === "account" && (
//             <>

//               <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
//                 <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
//                 <div className="text-xs text-blue-700 leading-relaxed">
//                   আপনার অ্যাকাউন্ট তথ্য সুরক্ষিত। অ্যাকাউন্ট মুছে ফেললে সমস্ত রিপোর্ট ও পয়েন্ট স্থায়ীভাবে মুছে যাবে।
//                 </div>
//               </div>

//               <Section title="অ্যাকাউন্ট তথ্য" sub="আপনার অ্যাকাউন্টের মূল তথ্য" icon={User} color="#ef4444">
//                 <div className="space-y-3">
//                   {[
//                     ["অ্যাকাউন্ট ID", "NB-2025-0001"],
//                     ["নিবন্ধন তারিখ", "১ জানুয়ারি ২০২৫"],
//                     ["সর্বশেষ লগইন", "আজ, সকাল ১০:৩২"],
//                     ["মোট রিপোর্ট", "১২টি"],
//                     ["অ্যাকাউন্ট ধরন", "সাধারণ নাগরিক"],
//                   ].map(([k,v]) => (
//                     <div key={k} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
//                       <span className="text-sm text-slate-500 font-medium">{k}</span>
//                       <span className="text-sm text-slate-800 font-bold">{v}</span>
//                     </div>
//                   ))}
//                 </div>
//               </Section>

//               <Section title="বিপজ্জনক অঞ্চল" sub="এই পদক্ষেপগুলো ফেরত নেওয়া যাবে না" icon={AlertTriangle} color="#ef4444">
//                 <div className="space-y-3">
//                   <button className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 border-orange-200 hover:border-orange-400 bg-orange-50 hover:bg-orange-100 transition-all group">
//                     <div className="flex items-center gap-3">
//                       <LogOut size={18} className="text-orange-500" />
//                       <div className="text-left">
//                         <p className="text-sm font-bold text-orange-700">সব ডিভাইস থেকে লগআউট</p>
//                         <p className="text-xs text-orange-500">সমস্ত সক্রিয় সেশন শেষ করুন</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={16} className="text-orange-400 group-hover:translate-x-0.5 transition-transform" />
//                   </button>

//                   <button className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 transition-all group">
//                     <div className="flex items-center gap-3">
//                       <Trash2 size={18} className="text-red-500" />
//                       <div className="text-left">
//                         <p className="text-sm font-bold text-red-700">অ্যাকাউন্ট মুছে ফেলুন</p>
//                         <p className="text-xs text-red-400">সমস্ত ডেটা স্থায়ীভাবে মুছে যাবে</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={16} className="text-red-400 group-hover:translate-x-0.5 transition-transform" />
//                   </button>
//                 </div>
//               </Section>
//             </>
//           )} */}
//         </div>
//       </div>
//     </form>
//   );
// }
