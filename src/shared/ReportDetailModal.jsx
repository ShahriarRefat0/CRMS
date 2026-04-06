'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Calendar, Tag, ThumbsUp, AlertCircle,
  FileText, Camera, Clock, CheckCircle2, Circle,
  Navigation, ExternalLink, Hash, Zap, ChevronRight,
} from 'lucide-react';

// ─── Status & Priority config ─────────────────────────────────────────────────

const STATUS_CONFIG = {
  'চলমান': { cls: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500', icon: <AlertCircle size={12} /> },
  'প্রক্রিয়াধীন': { cls: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', icon: <Clock size={12} /> },
  'সমাধান হয়েছে': { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: <CheckCircle2 size={12} /> },
};

const PRIORITY_CONFIG = {
  'জরুরি': { cls: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' },
  'মাঝারি': { cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  'স্বাভাবিক': { cls: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

const CATEGORY_ICONS = {
  road: '🛣️', water: '💧', electricity: '⚡',
  waste: '🗑️', drainage: '🌊', streetlight: '💡',
  tree: '🌳', noise: '🔊', other: '📋',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ config, label }) {
  if (!config) return <span className="text-xs text-slate-500">{label || '—'}</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${config.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {label}
    </span>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-700 mt-0.5 wrap-break-word">{value || '—'}</p>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="text-teal-500">{icon}</div>
      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{title}</p>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function ReportDetailModal({ report, onClose, onDelete }) {
  if (!report) return null;

  const hasGPS = report.lat && report.lng;
  const mapSrc = hasGPS
    ? `https://maps.google.com/maps?q=${report.lat},${report.lng}&output=embed&z=16&hl=bn`
    : report.location
      ? `https://maps.google.com/maps?q=${encodeURIComponent(report.location + ', Bangladesh')}&output=embed&z=14&hl=bn`
      : null;

  const mapLink = hasGPS
    ? `https://www.google.com/maps?q=${report.lat},${report.lng}`
    : null;

  const statusCfg = STATUS_CONFIG[report.status] ?? null;
  const priorityCfg = PRIORITY_CONFIG[report.priority] ?? null;
  const catIcon = CATEGORY_ICONS[report.category] ?? '📋';

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, type: 'spring', stiffness: 280, damping: 28 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-slate-900/30 overflow-hidden max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Top accent ─────────────────────────────────────────── */}
          <div className="h-1 bg-linear-to-r from-teal-400 via-blue-500 to-violet-500 shrink-0" />

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-2xl shrink-0 border border-teal-100">
                {catIcon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">রিপোর্টের বিস্তারিত</p>
                <h2 className="text-base font-extrabold text-slate-800 leading-snug truncate">
                  {report.title || 'শিরোনাম নেই'}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 flex items-center justify-center transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* ── Scrollable body ─────────────────────────────────────── */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

            {/* ── Quick meta pills ─────────────────────────────────── */}
            <div className="flex flex-wrap gap-2">
              {/* ID */}
              <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full">
                <Hash size={11} /> {report.id}
              </div>
              {/* Date */}
              <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full">
                <Calendar size={11} /> {report.date}
              </div>
              {/* Votes */}
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-full">
                <ThumbsUp size={11} /> {report.votes} ভোট
              </div>
              {/* Status */}
              <Badge config={statusCfg} label={report.status} />
              {/* Priority */}
              <Badge config={priorityCfg} label={report.priority} />
            </div>

            {/* ── Description ──────────────────────────────────────── */}
            {report.description && (
              <div>
                <SectionTitle icon={<FileText size={14} />} title="বিবরণ" />
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {report.description}
                </p>
              </div>
            )}

            {/* ── Admin Feedback ───────────────────────────────────── */}
            {report.adminFeedback && (
              <div>
                <SectionTitle icon={<Zap size={14} />} title="অ্যাডমিন ফিডব্যাক" />
                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl"></div>
                  <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                    {report.adminFeedback}
                  </p>
                  <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                    Admin Status Update
                  </div>
                </div>
              </div>
            )}

            {/* ── Location + Map ────────────────────────────────────── */}
            <div>
              <SectionTitle icon={<MapPin size={14} />} title="অবস্থান" />

              {/* Location text */}
              {report.location && (
                <div className="flex items-start gap-2 mb-3">
                  <MapPin size={14} className="text-teal-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 font-medium">{report.location}</p>
                </div>
              )}

              {/* GPS coordinates pill */}
              {hasGPS && (
                <div className="flex items-center justify-between mb-3 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <Navigation size={13} className="text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">লাইভ GPS</span>
                    <span className="text-xs text-emerald-600 font-mono">
                      {Number(report.lat).toFixed(5)}, {Number(report.lng).toFixed(5)}
                    </span>
                  </div>
                  {mapLink && (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      Google Maps <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}

              {/* Live map embed */}
              {mapSrc && (
                <div className="relative w-full h-52 rounded-xl overflow-hidden border-2 border-teal-200 shadow-sm">
                  <iframe
                    title="report-location-map"
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    className="border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                  {/* Map overlay badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md pointer-events-none">
                    {hasGPS
                      ? <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-xs font-bold text-slate-700">লাইভ লোকেশন</span></>
                      : <><MapPin size={12} className="text-teal-600" /><span className="text-xs font-bold text-slate-700">এলাকার ম্যাপ</span></>
                    }
                  </div>
                </div>
              )}

              {!mapSrc && !report.location && (
                <p className="text-sm text-slate-400 italic">অবস্থান তথ্য পাওয়া যায়নি</p>
              )}
            </div>

            {/* ── Photos ───────────────────────────────────────────── */}
            <div>
              <SectionTitle icon={<Camera size={14} />} title={`ছবি (${report.photos?.length || 0}টি)`} />
              {report.photos && report.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {report.photos.map((src, idx) => (
                    <div key={idx} className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-200 group">
                      <Image
                        src={src}
                        alt={`Complaint image ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <Camera size={16} className="text-slate-300" />
                  কোনো ছবি আপলোড করা হয়নি
                </div>
              )}
            </div>

            {/* ── Timeline ─────────────────────────────────────────── */}
            {report.timeline && report.timeline.length > 0 && (
              <div>
                <SectionTitle icon={<Clock size={14} />} title="টাইমলাইন" />
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-3.5 top-2 bottom-2 w-px bg-slate-200" />

                  <div className="space-y-3">
                    {report.timeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 pl-1">
                        {/* Node */}
                        <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.done ? 'bg-teal-500' : 'bg-white border-2 border-slate-300'
                          }`}>
                          {item.done
                            ? <CheckCircle2 size={14} className="text-white" />
                            : <Circle size={10} className="text-slate-300" />
                          }
                        </div>
                        {/* Content */}
                        <div className={`flex-1 flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-colors ${item.done ? 'bg-teal-50 border border-teal-200' : 'bg-slate-50 border border-slate-200'
                          }`}>
                          <div className="flex items-center gap-2">
                            {item.done
                              ? <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                              : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                            }
                            <span className={`text-xs font-bold ${item.done ? 'text-teal-700' : 'text-slate-500'}`}>
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-semibold shrink-0">{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Extended History Logs */}
                {report.statusHistory && report.statusHistory.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">Detailed Logs</p>
                    {report.statusHistory.map((log, lIdx) => (
                      <div key={lIdx} className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm text-slate-700 ml-10 relative">
                        <div className="absolute -left-12 top-4 w-6 h-px bg-slate-200" />
                        <span className="block text-[10px] text-slate-400 font-bold mb-1 opacity-70">
                           {new Date(log.updatedAt).toLocaleString("bn-BD", { day:"numeric", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })}
                        </span>
                        {log.comment}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ── Footer ─────────────────────────────────────────────── */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50">
            <button
              onClick={() => onDelete && onDelete()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 active:scale-95 transition-all shadow-md shadow-red-200"
            >
              রিপোর্ট মুছুন
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-500 text-white font-bold text-sm hover:bg-slate-600 active:scale-95 transition-all shadow-md shadow-blue-200"
            >
              বন্ধ করুন <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}