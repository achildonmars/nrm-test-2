import { CharacterStatus } from "../types";
import { User, Shield, Compass, Sparkles, Heart, Activity, MapPin, Award } from "lucide-react";
import { motion } from "motion/react";

interface StatusWindowProps {
  status: CharacterStatus;
}

export default function StatusWindow({ status }: StatusWindowProps) {
  // Convert keyword string to tags
  const keywords = status.keyword
    ? status.keyword.split(",").map((k) => k.trim())
    : [];

  // Define some gradient colors based on tarot card
  const getTarotGradient = (tarot: string) => {
    const t = tarot.toLowerCase();
    if (t.includes("moon")) return "from-purple-950/40 via-[#0F1117] to-blue-950/40";
    if (t.includes("star")) return "from-blue-950/40 via-[#0F1117] to-emerald-950/40";
    if (t.includes("empress") || t.includes("emperor")) return "from-amber-950/40 via-[#0F1117] to-red-950/40";
    if (t.includes("magician")) return "from-indigo-950/40 via-[#0F1117] to-purple-950/40";
    return "from-[#161920] via-[#0A0B0E] to-[#161920]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0F1117] border border-white/5 rounded-xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-full font-sans"
    >
      {/* Sophisticated Dark Header Pattern */}
      <div className="h-12 bg-[#161920] border-b border-white/5 flex items-center px-4 justify-between -mx-6 -mt-6 mb-5 shrink-0">
        <span style={{ fontFamily: "Georgia, serif" }} className="italic text-[#C5A059] font-bold">I. Status</span>
        <span className="text-[10px] text-slate-500 uppercase font-mono">LEVEL {status.Level}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Tarot Card Illustration */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className={`w-full max-w-[180px] aspect-[2/3] rounded-2xl border border-[#C5A059]/30 bg-gradient-to-b ${getTarotGradient(status.tarot)} p-4 flex flex-col justify-between items-center relative overflow-hidden shadow-2xl group`}>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C5A059]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            
            <div className="text-[10px] font-serif tracking-widest text-[#C5A059]/70 uppercase text-center">
              Tarot Sign
            </div>
            
            {/* Tarot Card Graphic Representing */}
            <div className="my-auto flex flex-col items-center justify-center relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full border border-[#C5A059]/20 flex items-center justify-center bg-[#0A0B0E]/80 shadow-lg"
              >
                <Sparkles className="w-8 h-8 text-[#C5A059]/80" />
              </motion.div>
              <span className="text-[9px] font-mono text-slate-500 mt-3 tracking-widest">
                ID: {status["discord-id"]}
              </span>
            </div>

            <div className="text-center w-full">
              <div style={{ fontFamily: "Georgia, serif" }} className="text-xs font-bold text-[#C5A059] tracking-wider uppercase border-t border-[#C5A059]/20 pt-1.5 italic">
                {status.tarot || "The Mystic"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Character Info & Vitals */}
        <div className="md:col-span-8 space-y-5 flex flex-col justify-between">
          {/* Main Info */}
          <div>
            <h3 style={{ fontFamily: "Georgia, serif" }} className="text-2xl font-black text-white leading-tight">
              {status["char-name"]}
            </h3>
            <p className="text-xs text-[#C5A059] font-medium mt-0.5 font-serif uppercase tracking-widest">
              ฉายา: {status["char-call"] || "ไม่มี"}
            </p>
          </div>

          {/* Vitals (HP & SP) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* HP Bar */}
            <div className="bg-[#161920] border border-white/5 p-3 rounded-xl">
              <div className="flex justify-between items-center text-[11px] mb-1.5">
                <span className="font-semibold text-slate-400">HEALTH POINTS</span>
                <span className="text-[#C5A059] font-mono">{status.HP} / 100</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(status.HP, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-red-900 to-red-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] mt-1.5 text-slate-500">
                <span>สภาพร่างกาย:</span>
                <span className="text-red-400 font-semibold">{status.Health || "ปกติ"}</span>
              </div>
            </div>

            {/* SP Bar */}
            <div className="bg-[#161920] border border-white/5 p-3 rounded-xl">
              <div className="flex justify-between items-center text-[11px] mb-1.5">
                <span className="font-semibold text-slate-400">SANITY ENERGY (SP)</span>
                <span className="text-blue-400 font-mono">{status.SP} / 100</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(status.SP, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-900 to-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.2)]"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] mt-1.5 text-slate-500">
                <span>สภาพจิตใจ:</span>
                <span className="text-blue-400 font-semibold">{status.Sanity || "ปกติ"}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#161920] p-2.5 rounded border border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase">อายุ</span>
              <span className="font-mono text-white">{status.age} ปี</span>
            </div>
            <div className="bg-[#161920] p-2.5 rounded border border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase">อาชีพ / คลาส</span>
              <span className="font-mono text-[#C5A059]">{status.class}</span>
            </div>
            <div className="bg-[#161920] p-2.5 rounded border border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase">ภูมิหลัง</span>
              <span className="font-mono text-white truncate max-w-[100px]" title={status.background}>{status.background}</span>
            </div>
            <div className="bg-[#161920] p-2.5 rounded border border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase">ห้องพัก</span>
              <span className="font-mono text-white">{status.room || "-"}</span>
            </div>
          </div>

          {/* Address */}
          <div className="bg-[#161920] p-3 rounded border border-white/5 text-xs">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> ที่อยู่ / ที่พักอาศัย
            </div>
            <div className="text-slate-300 mt-1">{status.address || "ไม่ระบุ"}</div>
          </div>

          {/* Adventure / Progression stats (EXP, FR, exploration) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#161920] p-2 rounded border border-white/5 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 uppercase flex items-center gap-1">
                <Award className="w-3 h-3 text-[#C5A059]" /> EXP
              </span>
              <span className="text-sm font-bold text-[#C5A059] font-mono mt-0.5">{status.EXP}</span>
            </div>
            <div className="bg-[#161920] p-2 rounded border border-white/5 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 uppercase flex items-center gap-1">
                <Compass className="w-3 h-3 text-emerald-500" /> สำรวจ
              </span>
              <span className="text-sm font-bold text-emerald-500 font-mono mt-0.5">{status["สำรวจ"] || 0}</span>
            </div>
            <div className="bg-[#161920] p-2 rounded border border-white/5 flex flex-col justify-between">
              <span className="text-[9px] text-slate-500 uppercase flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-500" /> FR
              </span>
              <span className="text-sm font-bold text-amber-500 font-mono mt-0.5">{status.FR || 0}</span>
            </div>
          </div>

          {/* Keywords / Tags */}
          {keywords.length > 0 && (
            <div className="pt-2 border-t border-white/5">
              <div className="text-[10px] text-[#C5A059] uppercase tracking-tighter mb-1.5">
                Active Keywords
              </div>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-[#0A0B0E] text-slate-400 px-2.5 py-0.5 rounded border border-white/5 hover:border-[#C5A059]/30 transition-colors"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
