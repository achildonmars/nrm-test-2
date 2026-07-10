import React from "react";
import { CharacterSkill } from "../types";
import { Zap, Shield, Flame, Compass, Brain, Eye, Star, Award, Plus } from "lucide-react";
import { motion } from "motion/react";

interface SkillWindowProps {
  skill: CharacterSkill;
  onAllocateAttribute?: (attrKey: "S" | "D" | "I" | "W" | "C" | "L") => Promise<void>;
  isAllocating?: boolean;
}

interface AttributeDef {
  key: "S" | "D" | "I" | "W" | "C" | "L";
  name: string;
  engName: string;
  color: string;
  borderColor: string;
  bgGlow: string;
  icon: React.ComponentType<any>;
}

export default function SkillWindow({ skill, onAllocateAttribute, isAllocating = false }: SkillWindowProps) {
  // Core attributes definitions
  const attributes: AttributeDef[] = [
    {
      key: "S",
      name: "Strength (พละกำลัง)",
      engName: "STRENGTH",
      color: "text-red-400",
      borderColor: "border-red-900/20",
      bgGlow: "from-red-950/5 to-transparent",
      icon: Flame,
    },
    {
      key: "D",
      name: "Dexterity (ความว่องไว)",
      engName: "DEXTERITY",
      color: "text-emerald-400",
      borderColor: "border-emerald-900/20",
      bgGlow: "from-emerald-950/5 to-transparent",
      icon: WindIcon, // We'll define a simple wind icon helper or use Compass
    },
    {
      key: "I",
      name: "Intelligence (สติปัญญา)",
      engName: "INTELLIGENCE",
      color: "text-blue-400",
      borderColor: "border-blue-900/20",
      bgGlow: "from-blue-950/5 to-transparent",
      icon: Brain,
    },
    {
      key: "W",
      name: "Wisdom (ความรอบรู้/ปัญญาญาณ)",
      engName: "WISDOM",
      color: "text-purple-400",
      borderColor: "border-purple-900/20",
      bgGlow: "from-purple-950/5 to-transparent",
      icon: Eye,
    },
    {
      key: "C",
      name: "Charisma (เสน่ห์/ปฎิสัมพันธ์)",
      engName: "CHARISMA",
      color: "text-amber-400",
      borderColor: "border-amber-900/20",
      bgGlow: "from-amber-950/5 to-transparent",
      icon: Star,
    },
    {
      key: "L",
      name: "Luck (โชคชะตา)",
      engName: "LUCK",
      color: "text-teal-400",
      borderColor: "border-teal-900/20",
      bgGlow: "from-teal-950/5 to-transparent",
      icon: Award,
    },
  ];

  // Helper to extract active subskills for an attribute
  const getSubskillsForAttribute = (attrKey: string) => {
    const list: { slot: string; name: string }[] = [];
    // Slots are e.g. S1-1, S1-2, S1-3, S2-1, S2-2, S2-3, S3-1, S3-2, S3-3
    for (let tier = 1; tier <= 3; tier++) {
      for (let index = 1; index <= 3; index++) {
        const slotKey = `${attrKey}${tier}-${index}` as keyof CharacterSkill;
        const val = skill[slotKey];
        if (val) {
          list.push({
            slot: `${tier}-${index}`,
            name: String(val),
          });
        }
      }
    }
    return list;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-[#0F1117] border border-white/5 rounded-xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-full font-sans"
    >
      {/* Sophisticated Dark Header Pattern */}
      <div className="h-12 bg-[#161920] border-b border-white/5 flex items-center px-4 justify-between -mx-6 -mt-6 mb-5 shrink-0">
        <span style={{ fontFamily: "Georgia, serif" }} className="italic text-[#C5A059] font-bold">II. Skillset</span>
        <span className="text-[10px] text-slate-500 uppercase font-mono">ATB SCORE {skill.ATB ?? 0}</span>
      </div>

      {/* ATB Point allocation instructions */}
      {(skill.ATB ?? 0) > 0 && (
        <div className="mb-4 p-3 bg-[#C5A059]/10 border border-[#C5A059]/25 rounded-lg text-xs text-[#C5A059] flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 shrink-0" />
            <span>คุณมีแต้มว่างเหลืออยู่! กดปุ่ม <strong>+</strong> ในช่องที่คุณต้องการเพิ่ม</span>
          </div>
        </div>
      )}

      {/* Grid of Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {attributes.map((attr) => {
          const score = skill[attr.key] ?? 0;
          const subskills = getSubskillsForAttribute(attr.key);
          const AttrIcon = attr.icon;

          return (
            <div
               key={attr.key}
               className={`bg-[#161920] rounded-xl border border-white/5 ${attr.borderColor} p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${attr.bgGlow}`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-[#0A0B0E] border border-white/5 ${attr.color}`}>
                      <AttrIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-serif tracking-wider uppercase">
                        {attr.engName}
                      </div>
                      <h4 className="text-xs font-semibold text-slate-300">
                        {attr.name.split(" ")[0]}
                      </h4>
                    </div>
                  </div>
                  {/* Score & Allocate Button */}
                  <div className="flex items-center gap-2.5">
                    <div className="text-2xl font-serif font-black text-slate-200 tracking-wider">
                      {score}
                    </div>
                    {onAllocateAttribute && (skill.ATB ?? 0) > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAllocateAttribute(attr.key);
                        }}
                        disabled={isAllocating}
                        title={`ใช้แต้มเพื่อเพิ่ม ${attr.engName}`}
                        className="p-1 rounded bg-[#C5A059]/10 hover:bg-[#C5A059]/30 border border-[#C5A059]/30 text-[#C5A059] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer relative z-10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Subskills listing */}
                <div className="mt-4 space-y-2">
                  <div className="text-[9px] text-slate-500 font-serif uppercase tracking-widest border-b border-white/5 pb-1">
                    ทักษะย่อย / Subskills
                  </div>
                  {subskills.length > 0 ? (
                    <div className="space-y-1.5">
                      {subskills.map((sub, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs bg-[#0A0B0E]/60 p-2 rounded-lg border border-white/5 hover:border-[#C5A059]/20 transition-all group"
                        >
                          <span className="text-slate-300 font-medium group-hover:text-[#C5A059] transition-colors">
                            {sub.name}
                          </span>
                          <span className="text-[9px] font-mono bg-[#C5A059]/10 text-[#C5A059] px-1.5 py-0.5 rounded border border-[#C5A059]/20">
                            Slot {sub.slot}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-600 italic py-2">
                      ไม่มีการเรียนรู้ทักษะย่อยในตระกูลนี้
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative graphic background */}
              <div className="absolute right-2 bottom-1 text-slate-800/10 select-none font-serif text-5xl font-extrabold pointer-events-none">
                {attr.key}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Wind icon fallback for Dexterity
function WindIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.8 3a1.5 1.5 0 0 0-2.5 1.1c0 .8.5 1.4 1.2 1.9L18 10h-5.5" />
      <path d="M11 21a1.5 1.5 0 0 1-2.5-1.1c0-.8.5-1.4 1.2-1.9L16 14H6.5" />
      <path d="M20 14h-3" />
      <path d="M4 10h5" />
    </svg>
  );
}
