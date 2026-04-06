'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Menu, X, Bell, LogOut, UserPlus, LogIn, User, Shield } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { HiOutlineLogout } from 'react-icons/hi';
import UserNotifications from "@/components/UserNotifications";
import AdminNotifications from "@/components/AdminNotifications";
import { RxDashboard } from "react-icons/rx";

const navLinks = [
  { label: 'প্রচ্ছদ', href: '/' },
  { label: 'অভিযোগ', href: '/complaint' },
  { label: 'সাফল্য', href: '/success' },
  { label: 'কমিউনিটি ভোটিং', href: '/vote-complaint' },
  { label: 'যোগাযোগ', href: '/contact' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  const inkRef = useRef(null);
  const linkRefs = useRef([]);

  const visibleLinks = useMemo(() => {
    return navLinks.filter(link => !link.protected || session);
  }, [session]);

  const activeIndex = useMemo(() => {
    if (!pathname) return -1;
    const currentPath = pathname.toLowerCase();
    
    return visibleLinks.findIndex(link => {
      const linkPath = link.href.toLowerCase();
      
      if (linkPath === '/') {
        return currentPath === '/' || currentPath === '';
      }
      
      return currentPath === linkPath || currentPath.startsWith(linkPath + '/');
    });
  }, [pathname, visibleLinks]);

  useEffect(() => {
    const updateInk = () => {
      const currentIdx = hovered !== null ? hovered : (activeIndex !== -1 ? activeIndex : null);
      if (currentIdx !== null) {
        const el = linkRefs.current[currentIdx];
        const ink = inkRef.current;

        if (el && ink) {
          const { offsetLeft, offsetWidth } = el;
          ink.style.opacity = "1";
          ink.style.left = `${offsetLeft}px`;
          ink.style.width = `${offsetWidth}px`;
          ink.style.height = "2px"; 
          ink.style.bottom = "0";
          ink.style.backgroundColor = "#2563eb"; // blue-600
        }
      } else {
        const ink = inkRef.current;
        if (ink) ink.style.opacity = "0";
      }
    };

    updateInk();

    // Re-calculate the position correctly in case of window resize or late layout paints
    window.addEventListener('resize', updateInk);
    return () => window.removeEventListener('resize', updateInk);
  }, [hovered, activeIndex]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Image 
              src="/logo.png" 
              alt="নাগরিক বন্ধু লোগো" 
              width={48}
              height={48}
              priority 
              className="object-contain" 
            />
            <h2 className="text-xl font-bold font-display tracking-tight text-blue-700 leading-none">
              নাগরিক বন্ধু
            </h2>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2 relative h-full">
            <span
              ref={inkRef}
              className="absolute transition-all duration-300 ease-out pointer-events-none"
            />
            {visibleLinks.map((link, i) => {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  ref={el => linkRefs.current[i] = el}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`px-3 py-2 text-sm font-semibold transition-colors ${
                    activeIndex === i ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {session && (
              session.user?.role === 'admin' ? (
                <AdminNotifications />
              ) : (
                <UserNotifications />
              )
            )}

            {!session ? (
              <div className="flex items-center gap-2">
                <Link href="/login" className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <LogIn size={16} />
                  প্রবেশ
                </Link>
                <Link href="/register" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <UserPlus size={16} />
                  নিবন্ধন
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l pl-4 border-gray-100">
                <div className="relative group flex items-center">
                  <button className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full hover:border-indigo-200 transition-all shadow-sm group">
                    <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-600 shadow-sm overflow-hidden group-hover:shadow-indigo-100 transition-all">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                          unoptimized={session.user.image.startsWith('http')}
                        />
                      ) : (
                        session?.user?.name?.charAt(0) || <User size={18} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Desktop DROPDOWN */}
                  <div className="absolute top-full right-0 mt-3 w-60 bg-white border border-slate-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50 p-3 before:absolute before:-top-3 before:right-0 before:w-full before:h-4">
                    <div className="flex flex-col items-center text-center mb-2">
                      <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xl shadow-lg shadow-indigo-100/50 mb-3 overflow-hidden text-2xl">
                        {session?.user?.image ? (
                          <img src={session.user.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          session?.user?.name?.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight">{session?.user?.name || "নাগরিক বন্ধু"}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{session?.user?.email || "ইউজার"}</p>
                      </div>
                    </div>

                      <div className="space-y-2">
                        <Link 
                          href={session?.user?.role === 'admin' ? '/dashboard/admin/overview' : '/dashboard/users'} 
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white transition-all font-black text-[12px] uppercase tracking-widest shadow-sm"
                        >
                          <RxDashboard size={16} /> ড্যাশবোর্ড
                        </Link>

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black text-[12px] uppercase tracking-widest shadow-sm"
                      >
                        <HiOutlineLogout size={16} /> লগ আউট
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X size={24} className="text-gray-600" /> : <Menu size={24} className="text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 border-t bg-white p-4 flex flex-col gap-2 shadow-xl animate-in slide-in-from-top-2 duration-200">

          {session && (
            <div className="flex items-center gap-3 p-3 mb-2 bg-blue-50 rounded-xl border border-blue-100">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white flex items-center justify-center">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} className="text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-gray-800 leading-none">{session.user?.name}</p>
                <p className="text-xs text-gray-500 mt-1">{session.user?.email}</p>
              </div>
            </div>
          )}

          {visibleLinks.map((link) => {
            const isActive = pathname.toLowerCase() === link.href.toLowerCase();

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2.5 font-semibold rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-2 border-t mt-2">
            {!session ? (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setIsOpen(false)} className="py-2.5 text-center font-bold bg-blue-50 text-blue-600 rounded-lg">
                  প্রবেশ
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="py-2.5 text-center font-bold bg-blue-600 text-white rounded-lg shadow-sm">
                  নিবন্ধন
                </Link>
              </div>
            ) : (
                <div className="flex flex-col gap-2">
                  <Link 
                    href={session?.user?.role === 'admin' ? '/dashboard/admin/overview' : '/dashboard/users'}
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 hover:bg-gray-200 transition-all font-black text-[12px] uppercase tracking-widest shadow-sm"
                  >
                    <RxDashboard size={16} /> ড্যাশবোর্ড
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black text-[12px] uppercase tracking-widest shadow-sm"
                  >
                    <HiOutlineLogout size={16} /> লগ আউট
                  </button>
                </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}