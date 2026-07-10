import { useState } from "react";
import { MergedCharacter, CharacterStatus, CharacterSkill, CharacterBag } from "./types";
import LoginScreen from "./components/LoginScreen";
import StatusWindow from "./components/StatusWindow";
import SkillWindow from "./components/SkillWindow";
import BagWindow from "./components/BagWindow";
import { LogOut, RefreshCw, Star, Compass, Shield, Briefcase, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1eGVzeG12dXJpYXptc2tubWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NDc4MDIsImV4cCI6MjA5OTIyMzgwMn0.iIamj4gmQiblS3rsEU7281nzXGZwl6iBfe7L5tA_CWE";
const SUPABASE_URL = "https://tuxesxmvuriazmsknmfg.supabase.co/rest/v1";

export default function App() {
  const [character, setCharacter] = useState<MergedCharacter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"status" | "skill" | "bag">("status");
  const [isAllocating, setIsAllocating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "loading", duration = 3000) => {
    setToast({ message, type });
    if (type !== "loading") {
      setTimeout(() => {
        setToast((current) => current?.message === message ? null : current);
      }, duration);
    }
  };

  const handleAllocateAttribute = async (attrKey: "S" | "D" | "I" | "W" | "C" | "L") => {
    if (!character) return;
    
    const currentAtb = character.skill.ATB ?? 0;
    if (currentAtb <= 0) {
      showToast("คุณไม่มีแต้ม ATB Point เหลืออยู่", "error");
      return;
    }

    const currentValue = character.skill[attrKey] ?? 0;
    const newAtb = currentAtb - 1;
    const newValue = currentValue + 1;

    setIsAllocating(true);
    showToast(`กำลังเพิ่มแต้ม ${attrKey}...`, "loading");

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    };

    try {
      const response = await fetch(
        `${SUPABASE_URL}/${encodeURIComponent("Player's Skill")}?discord-id=eq.${encodeURIComponent(character.status["discord-id"])}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            "ATB": newAtb,
            [attrKey]: newValue
          })
        }
      );

      if (!response.ok) {
        throw new Error("ไม่สามารถบันทึกแต้มลงในฐานข้อมูลได้");
      }

      // Success! Update local state
      setCharacter(prev => {
        if (!prev) return null;
        return {
          ...prev,
          skill: {
            ...prev.skill,
            "ATB": newAtb,
            [attrKey]: newValue
          }
        };
      });
      showToast(`เพิ่มแต้มทักษะ ${attrKey} สำเร็จ!`, "success");
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาดกรุณาลองใหม่", "error");
    } finally {
      setIsAllocating(false);
    }
  };

  const handleLogin = async (discordId: string) => {
    setIsLoading(true);
    setError(null);

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    };

    try {
      // Fetch status, skill, and bag concurrently
      const [statusRes, skillRes, bagRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/${encodeURIComponent("Player's Status")}?discord-id=eq.${encodeURIComponent(discordId)}`, { headers }),
        fetch(`${SUPABASE_URL}/${encodeURIComponent("Player's Skill")}?discord-id=eq.${encodeURIComponent(discordId)}`, { headers }),
        fetch(`${SUPABASE_URL}/${encodeURIComponent("Player's Bag")}?discord-id=eq.${encodeURIComponent(discordId)}`, { headers }),
      ]);

      if (!statusRes.ok || !skillRes.ok || !bagRes.ok) {
        throw new Error("ระบบฐานข้อมูลขัดข้อง กรุณาลองใหม่อีกครั้งในภายหลัง");
      }

      const [statusData, skillData, bagData] = await Promise.all([
        statusRes.json() as Promise<CharacterStatus[]>,
        skillRes.json() as Promise<CharacterSkill[]>,
        bagRes.json() as Promise<CharacterBag[]>,
      ]);

      // Check if we found matching data in at least one table
      const hasStatus = statusData && statusData.length > 0;
      const hasSkill = skillData && skillData.length > 0;
      const hasBag = bagData && bagData.length > 0;

      if (!hasStatus && !hasSkill && !hasBag) {
        throw new Error("ไม่พบรหัสตัวละครนี้ในระบบประวัติการผจญภัย กรุณาตรวจสอบรหัส Discord ID อีกครั้ง");
      }

      // Merge data, using mock fallback values if some sections are missing
      const statusObj: CharacterStatus = hasStatus ? statusData[0] : {
        "discord-id": discordId,
        tarot: "The Mystic",
        "char-name": "ไม่ระบุชื่อตัวละคร",
        "char-call": "ไม่มี",
        age: 0,
        class: "นักเดินทาง",
        background: "พเนจร",
        room: "-",
        address: "ไม่ทราบที่อยู่แน่ชัด",
        keyword: "ความลึกลับ",
        Level: 1,
        "สำรวจ": 0,
        EXP: 0,
        FR: 0,
        Health: "ปกติ",
        HP: 100,
        Sanity: "ปกติ",
        SP: 100,
      };

      const skillObj: CharacterSkill = hasSkill ? skillData[0] : {
        "discord-id": discordId,
        tarot: statusObj.tarot,
        "char-name": statusObj["char-name"],
        "char-call": statusObj["char-call"],
        class: statusObj.class,
        background: statusObj.background,
        ATB: 0,
        S: 0, "S1-1": null, "S1-2": null, "S1-3": null, "S2-1": null, "S2-2": null, "S2-3": null, "S3-1": null, "S3-2": null, "S3-3": null,
        D: 0, "D1-1": null, "D1-2": null, "D1-3": null, "D2-1": null, "D2-2": null, "D2-3": null, "D3-1": null, "D3-2": null, "D3-3": null,
        I: 0, "I1-1": null, "I1-2": null, "I1-3": null, "I2-1": null, "I2-2": null, "I2-3": null, "I3-1": null, "I3-2": null, "I3-3": null,
        W: 0, "W1-1": null, "W1-2": null, "W1-3": null, "W2-1": null, "W2-2": null, "W2-3": null, "W3-1": null, "W3-2": null, "W3-3": null,
        C: 0, "C1-1": null, "C1-2": null, "C1-3": null, "C2-1": null, "C2-2": null, "C2-3": null, "C3-1": null, "C3-2": null, "C3-3": null,
        L: 0, "L1-1": null, "L1-2": null, "L1-3": null, "L2-1": null, "L2-2": null, "L2-3": null, "L3-1": null, "L3-2": null, "L3-3": null,
      };

      const bagObj: CharacterBag = hasBag ? bagData[0] : {
        "discord-id": discordId,
        tarot: statusObj.tarot,
        "char-name": statusObj["char-name"],
        "char-call": statusObj["char-call"],
        class: statusObj.class,
        background: statusObj.background,
        "1": null, "2": null, "3": null, "4": null, "5": null, "6": null,
        Slot: 5,
        "Add-Ons": 0,
      };

      setCharacter({
        status: statusObj,
        skill: skillObj,
        bag: bagObj,
      });
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCharacter(null);
    setError(null);
  };

  if (!character) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-300 p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden flex flex-col">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(22,25,32,0.6)_0%,rgba(10,11,14,1)_90%)] z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.01)_1px,transparent_1px)] bg-[size:40px_40px] z-0 opacity-40" />

      {/* Decorative filigree at page top */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between mb-8 pb-5 border-b border-white/5 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Star className="w-4 h-4 text-[#C5A059] animate-pulse" />
            <span className="text-[10px] font-serif tracking-widest text-[#C5A059] uppercase">
              Chronicle of Spirit
            </span>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif" }} className="text-2xl font-bold tracking-wider text-white">
            สมุดวิญญาณคนบาป
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right text-xs">
            <span className="text-slate-500 font-medium">เข้าสู่ระบบด้วย ID</span>
            <span className="text-[#C5A059] font-mono font-semibold">{character.status["discord-id"]}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F1117] hover:bg-[#161920] border border-[#C5A059]/20 hover:border-[#C5A059]/50 rounded-xl text-xs text-[#C5A059] font-semibold transition-all duration-300 shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>ค้นหาใหม่</span>
          </button>
        </div>
      </div>

      {/* Character Overview Card */}
      <div className="w-full max-w-7xl mx-auto mb-6 relative z-10 bg-[#0F1117] border border-white/5 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-[#C5A059]/30 bg-[#0A0B0E] flex items-center justify-center font-serif text-[#C5A059] font-bold text-lg shadow-inner">
            {character.status["char-name"] ? character.status["char-name"].charAt(0) : "M"}
          </div>
          <div>
            <h3 style={{ fontFamily: "Georgia, serif" }} className="text-lg font-bold text-white leading-tight">
              {character.status["char-name"]}
            </h3>
            <p className="text-xs text-[#C5A059]/80 font-serif tracking-wider uppercase mt-0.5">
              {character.status.class} • {character.status.background}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-serif">
          <div className="bg-[#161920] border border-white/5 px-3.5 py-1.5 rounded-lg">
            <span className="text-slate-500 uppercase block text-[9px] tracking-wider">อายุ</span>
            <span className="text-slate-200 font-bold">{character.status.age} ปี</span>
          </div>
          <div className="bg-[#161920] border border-white/5 px-3.5 py-1.5 rounded-lg">
            <span className="text-slate-500 uppercase block text-[9px] tracking-wider">พลังชีวิต (HP)</span>
            <span className="text-red-400 font-bold">{character.status.HP}</span>
          </div>
          <div className="bg-[#161920] border border-white/5 px-3.5 py-1.5 rounded-lg">
            <span className="text-slate-500 uppercase block text-[9px] tracking-wider">พลังจิต (SP)</span>
            <span className="text-blue-400 font-bold">{character.status.SP}</span>
          </div>
          <div className="bg-[#161920] border border-white/5 px-3.5 py-1.5 rounded-lg">
            <span className="text-slate-500 uppercase block text-[9px] tracking-wider">ไพ่ทาโรต์</span>
            <span className="text-[#C5A059] font-bold">{character.status.tarot}</span>
          </div>
        </div>
      </div>

      {/* Tab Selectors for Mobile / Small Screens */}
      <div className="w-full max-w-7xl mx-auto mb-6 lg:hidden relative z-10 flex gap-2 p-1.5 bg-[#0F1117] border border-white/5 rounded-xl">
        <button
          onClick={() => setActiveTab("status")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-serif font-bold transition-all duration-300 ${
            activeTab === "status"
              ? "bg-[#C5A059] text-[#0A0B0E] shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>STATUS</span>
        </button>
        <button
          onClick={() => setActiveTab("skill")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-serif font-bold transition-all duration-300 ${
            activeTab === "skill"
              ? "bg-[#C5A059] text-[#0A0B0E] shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>SKILL</span>
        </button>
        <button
          onClick={() => setActiveTab("bag")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-serif font-bold transition-all duration-300 ${
            activeTab === "bag"
              ? "bg-[#C5A059] text-[#0A0B0E] shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>BAG</span>
        </button>
      </div>

      {/* Main Grid / Windows */}
      <div className="w-full max-w-7xl mx-auto flex-1 relative z-10">
        {/* Desktop Layout: 3 Columns side-by-side as elegant separate windows */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 h-full items-stretch">
          <StatusWindow status={character.status} />
          <SkillWindow
            skill={character.skill}
            onAllocateAttribute={handleAllocateAttribute}
            isAllocating={isAllocating}
          />
          <BagWindow bag={character.bag} />
        </div>

        {/* Mobile Layout: Animated Tabs Switcher */}
        <div className="lg:hidden h-full">
          <AnimatePresence mode="wait">
            {activeTab === "status" && (
              <motion.div
                key="status"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
              >
                <StatusWindow status={character.status} />
              </motion.div>
            )}
            {activeTab === "skill" && (
              <motion.div
                key="skill"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
              >
                <SkillWindow
                  skill={character.skill}
                  onAllocateAttribute={handleAllocateAttribute}
                  isAllocating={isAllocating}
                />
              </motion.div>
            )}
            {activeTab === "bag" && (
              <motion.div
                key="bag"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
              >
                <BagWindow bag={character.bag} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold ${
              toast.type === "success"
                ? "bg-emerald-950/95 border-emerald-500/30 text-emerald-300"
                : toast.type === "error"
                ? "bg-red-950/95 border-red-500/30 text-red-300"
                : "bg-slate-900/95 border-[#C5A059]/30 text-slate-300"
            }`}
          >
            {toast.type === "loading" && (
              <div className="w-3.5 h-3.5 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mr-1" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
