import React, { useState } from "react";
import { Sparkles, Terminal, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface LoginScreenProps {
  onLogin: (discordId: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function LoginScreen({ onLogin, isLoading, error }: LoginScreenProps) {
  const [inputId, setInputId] = useState("");

  const demoAccounts = [
    { id: "784820301904478200", name: "Adaline Galtier", class: "แพทย์", tarot: "The Moon" },
    { id: "528580869154275300", name: "Johannes Vries / Célestine", class: "นักผจญภัย", tarot: "The Star" },
    { id: "1217441823702651000", name: "Eilidh Hortense Boisclair", class: "นักบวช", tarot: "The High Priestess" },
    { id: "938010423175815200", name: "Willow", class: "ผู้รักษา", tarot: "The Empress" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.trim()) {
      onLogin(inputId.trim());
    }
  };

  const selectDemo = (id: string) => {
    setInputId(id);
    onLogin(id);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-300 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,25,32,0.6)_0%,rgba(10,11,14,0.95)_80%)] z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.015)_1px,transparent_1px)] bg-[size:24px_24px] z-0 opacity-40" />

      {/* Main Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg bg-[#0F1117]/90 backdrop-blur-md border border-[#C5A059]/30 rounded-2xl p-8 shadow-2xl relative z-10 mystic-border-pulse overflow-hidden"
      >
        {/* Decorative corner borders */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#C5A059]/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#C5A059]/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#C5A059]/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#C5A059]/50 rounded-br-lg" />

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#C5A059]/40 bg-[#0A0B0E]/80 mb-4 shadow-inner"
          >
            <Sparkles className="w-8 h-8 text-[#C5A059]" />
          </motion.div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-white mb-2 glow-text">
            CHARACTER SHEETS
          </h1>
          <p className="text-sm text-[#C5A059]/70 font-serif tracking-widest uppercase">
            ระบบตรวจสอบและแสดงผลข้อมูลตัวละคร
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-serif tracking-widest text-[#C5A059] uppercase">
              ระบุรหัสตัวละคร (Discord ID)
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="กรอกรหัสตัวละคร เช่น 784820301904478200"
                disabled={isLoading}
                className="w-full bg-[#0A0B0E]/80 border border-slate-800 focus:border-[#C5A059] text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3.5 pl-11 text-sm outline-none transition-all duration-300 shadow-inner font-mono tracking-wide"
              />
              <Terminal className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-950/30 border border-red-800/40 text-red-300 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5"
            >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading || !inputId.trim()}
            className="w-full relative overflow-hidden group py-3.5 bg-gradient-to-r from-[#947640] to-[#C5A059] text-[#0A0B0E] font-serif font-bold tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0A0B0E] border-t-transparent rounded-full animate-spin" />
                กำลังเปิดบันทึกวิญญาณ...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                เรียกดูข้อมูลตัวละคร
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>

        {/* Demo Accounts Quick Select */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-serif tracking-widest text-[#C5A059]/70 uppercase">
            <HelpCircle className="w-4 h-4 text-[#C5A059]/60" />
            บัญชีตัวละครเพื่อใช้ทดสอบด่วน (Demo)
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {demoAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => selectDemo(account.id)}
                disabled={isLoading}
                className="text-left bg-[#0A0B0E]/40 hover:bg-[#0A0B0E]/90 border border-slate-800/60 hover:border-[#C5A059]/40 p-2.5 rounded-xl transition-all duration-300 text-xs group disabled:opacity-50"
              >
                <div className="font-semibold text-slate-300 group-hover:text-[#C5A059] font-serif truncate">
                  {account.name}
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between items-center mt-1">
                  <span>{account.class}</span>
                  <span className="text-[#C5A059]/50">{account.tarot}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
