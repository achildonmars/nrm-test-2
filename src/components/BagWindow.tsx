import { CharacterBag } from "../types";
import { Briefcase, Package, Sparkles, FolderLock, Plus, Info, ChevronRight, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface BagWindowProps {
  bag: CharacterBag;
}

export default function BagWindow({ bag }: BagWindowProps) {
  // All possible slots in the table are 1 to 6
  const slotKeys = ["1", "2", "3", "4", "5", "6"] as const;

  // Let's count how many items are currently in the bag
  const activeItemsCount = slotKeys.filter(key => bag[key] !== null && bag[key] !== undefined && bag[key] !== "").length;

  // Calculate total slot capacities
  const baseSlots = bag.Slot ?? 5;
  const addons = bag["Add-Ons"] ?? 0;
  const totalCapacity = baseSlots + addons;

  // Helper to get nice icon for items
  const getItemIcon = (itemName: string) => {
    const name = itemName.toLowerCase();
    if (name.includes("ยา") || name.includes("potion") || name.includes("remedy") || name.includes("รักษา") || name.includes("first-aid")) {
      return (
        <div className="p-2 bg-red-950/20 text-red-400 rounded-lg border border-red-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flask-conical">
            <path d="M10 2v7.51L4.39 17.61A1 1 0 0 0 5.24 19h13.52a1 1 0 0 0 .85-1.39L14 9.51V2Z" />
            <path d="M6 14h12" />
            <path d="M10 2h4" />
          </svg>
        </div>
      );
    }
    if (name.includes("เก็บ") || name.includes("ของป่า") || name.includes("ไม้") || name.includes("สมุนไพร") || name.includes("หิน")) {
      return (
        <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg border border-emerald-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 0 8-2 3-7 4-8 10Z" />
            <path d="M9 21c0-5 4.3-7 5-10" />
          </svg>
        </div>
      );
    }
    if (name.includes("ปืน") || name.includes("ดาบ") || name.includes("มีด") || name.includes("weapon") || name.includes("sword") || name.includes("gun") || name.includes("กระสุน")) {
      return (
        <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg border border-amber-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-swords">
            <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
            <line x1="13" y1="19" x2="19" y2="13" />
            <line x1="16" y1="16" x2="20" y2="20" />
            <polyline points="19 21 12 14" />
          </svg>
        </div>
      );
    }
    if (name.includes("สมุด") || name.includes("กระดาษ") || name.includes("แผนที่") || name.includes("book") || name.includes("note") || name.includes("map")) {
      return (
        <div className="p-2 bg-blue-950/20 text-blue-400 rounded-lg border border-blue-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scroll">
            <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14 3v5h5" />
          </svg>
        </div>
      );
    }
    // Generic
    return (
      <div className="p-2 bg-[#0A0B0E] text-slate-400 rounded-lg border border-white/5">
        <Package className="w-[18px] h-[18px]" />
      </div>
    );
  };

  // Helper to parse stack quantities from text (e.g. "1 (2/3)" -> returns { text: "1", qty: "2/3" })
  const parseItemName = (rawText: string | null) => {
    if (!rawText) return { name: "", qty: "" };
    
    // Check match for something like "Name (qty)"
    const match = rawText.match(/(.+?)\s*\((.+?)\)/);
    if (match) {
      return {
        name: match[1].trim(),
        qty: match[2].trim()
      };
    }
    return { name: rawText, qty: "" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#0F1117] border border-white/5 rounded-xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-full font-sans"
    >
      {/* Sophisticated Dark Header Pattern */}
      <div className="h-12 bg-[#161920] border-b border-white/5 flex items-center px-4 justify-between -mx-6 -mt-6 mb-5 shrink-0">
        <span style={{ fontFamily: "Georgia, serif" }} className="italic text-[#C5A059] font-bold">III. Satchel</span>
        <span className="text-[10px] text-slate-500 uppercase font-mono">ITEMS {activeItemsCount} / {totalCapacity}</span>
      </div>

      {/* Bag capacity indicator cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#161920] p-2.5 rounded border border-white/5 text-center">
          <div className="text-[9px] text-slate-500 uppercase">ช่องพื้นฐาน</div>
          <div className="text-sm font-bold text-slate-200 mt-0.5">{baseSlots} ช่อง</div>
        </div>
        <div className="bg-[#161920] p-2.5 rounded border border-white/5 text-center">
          <div className="text-[9px] text-slate-500 uppercase font-serif">ส่วนต่อขยาย</div>
          <div className="text-sm font-bold text-[#C5A059] mt-0.5">+{addons} ช่อง</div>
        </div>
        <div className="bg-[#161920] p-2.5 rounded border border-[#C5A059]/20 text-center relative overflow-hidden bg-gradient-to-br from-[#C5A059]/5 to-transparent">
          <div className="text-[9px] text-slate-500 uppercase">ความจุทั้งหมด</div>
          <div className="text-sm font-bold text-[#C5A059] mt-0.5">{totalCapacity} ช่อง</div>
        </div>
      </div>

      {/* Inventory Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {slotKeys.map((slotKey) => {
          const itemVal = bag[slotKey];
          const hasItem = itemVal !== null && itemVal !== undefined && itemVal !== "";
          const parsed = parseItemName(itemVal);

          return (
            <div
              key={slotKey}
              className={`rounded-lg p-3 flex items-center justify-between transition-all duration-300 border ${
                hasItem
                  ? "bg-[#161920] border-white/5 hover:border-[#C5A059]/30 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(197,160,89,0.1)] group"
                  : "bg-black/20 border-white/5 border-dashed hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                {/* Slot Number/Icon */}
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-600 w-4">
                    #{slotKey}
                  </span>
                  {hasItem ? (
                    getItemIcon(itemVal!)
                  ) : (
                    <div className="p-2 bg-[#0A0B0E]/30 text-slate-700 rounded-lg border border-white/5">
                      <Plus className="w-[18px] h-[18px]" />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="truncate">
                  {hasItem ? (
                    <>
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                        {parsed.name}
                      </h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-widest font-mono">
                        Soul Container Slot
                      </p>
                    </>
                  ) : (
                    <span className="text-xs text-slate-600 italic">ว่างเปล่า</span>
                  )}
                </div>
              </div>

              {/* Action / Quantity Badges */}
              {hasItem && parsed.qty && (
                <span className="shrink-0 text-[10px] font-mono bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded border border-[#C5A059]/20 font-bold ml-2">
                  {parsed.qty}
                </span>
              )}
            </div>
          );
        })}

        {/* Locked / Extra capacity indicators for Add-Ons */}
        {addons > 0 && (
          <div className="col-span-1 sm:col-span-2 mt-2 bg-[#161920]/40 border border-white/5 p-3 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Info className="w-4 h-4 text-[#C5A059]/70 shrink-0" />
              <span>ช่องเสริมวิเศษ (Add-On Slots) ขยายจำนวน {addons} ช่อง</span>
            </div>
            <span className="font-mono text-[10px] text-[#C5A059]/70 border border-[#C5A059]/20 px-2 py-0.5 bg-[#C5A059]/5 rounded">
              ACTIVE
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
