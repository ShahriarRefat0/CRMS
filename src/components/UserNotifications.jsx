"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Info, AlertTriangle, AlertCircle, RefreshCw, X, Eye } from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import Link from "next/link";

const NotificationItem = ({ notification, onRead }) => {
  const iconMap = {
    info: <Info className="text-blue-500" size={16} />,
    success: <Check className="text-emerald-500" size={16} />,
    warning: <AlertTriangle className="text-amber-500" size={16} />,
    alert: <AlertCircle className="text-red-500" size={16} />,
  };

  const bgMap = {
    info: "bg-blue-50/50",
    success: "bg-emerald-50/50",
    warning: "bg-amber-50/50",
    alert: "bg-red-50/50",
  };

  return (
    <div 
      className={`p-4 border-b border-slate-100 transition-all hover:bg-slate-50 relative group ${!notification.read ? bgMap[notification.type || "info"] : "bg-white"}`}
    >
      <div className="flex gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white shadow-sm ${!notification.read ? 'bg-white' : 'bg-slate-50'}`}>
          {iconMap[notification.type || "info"]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4 className={`text-xs font-bold truncate ${!notification.read ? 'text-slate-900' : 'text-slate-500'}`}>
              {notification.title}
            </h4>
            <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: bn })}
            </span>
          </div>
          <p className={`text-[11px] mt-1 leading-relaxed ${!notification.read ? 'text-slate-700' : 'text-slate-400'}`}>
            {notification.message}
          </p>
          
          {notification.link && (
            <Link 
              href={notification.link} 
              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-2 hover:underline"
            >
              বিস্তারিত দেখুন <Eye size={10} />
            </Link>
          )}
        </div>
      </div>
      
      {!notification.read && (
        <button 
          onClick={() => onRead(notification._id)}
          className="absolute right-2 bottom-2 p-1.5 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
          title="পঠিত হিসেবে চিহ্নিত করুন"
        >
          <Check size={14} />
        </button>
      )}
    </div>
  );
};

export default function UserNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/notifications");
      if (res.data.success) setNotifications(res.data.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await axios.patch("/api/notifications", { id });
      if (res.data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try {
      const res = await axios.patch("/api/notifications", { readAll: true });
      if (res.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-500 hover:bg-slate-100/80 rounded-xl transition-all group border border-transparent hover:border-slate-200"
      >
        <Bell size={18} className={`${isOpen ? 'text-blue-600' : 'group-hover:rotate-12'} transition-all`} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black border-2 border-white rounded-full flex items-center justify-center animate-bounce shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60] animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">নোটিফিকেশন</h3>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {unreadCount} নতুন
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchNotifications}
                className="text-slate-400 hover:text-blue-600 transition-colors"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700"
                >
                  সব পঠিত করুন
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
            {notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Bell size={32} className="opacity-20 mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest">কোনো নোটিফিকেশন নেই</p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem key={n._id} notification={n} onRead={markAsRead} />
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
            <Link 
              href="/dashboard/users/helps" 
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              সাহায্য প্রয়োজন? আমাদের জানান
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
