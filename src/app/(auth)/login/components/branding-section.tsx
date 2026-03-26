"use client";

import React, { useState } from "react";
import { Star, FileText, Calendar, MessageSquare, CheckCircle2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  id: number;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  { id: 1, icon: Star, title: "Review Management", desc: "Collect and manage client reviews efficiently to enhance your company's reputation." },
  { id: 2, icon: FileText, title: "Smart Quoting", desc: "Create professional quotes in seconds. Track when clients view them." },
  { id: 3, icon: Calendar, title: "Scheduling", desc: "Organize your team with an intuitive calendar. Assign tasks and track progress." },
  { id: 4, icon: MessageSquare, title: "Communication", desc: "Keep all client interactions in one place with automated updates." }
];

export function BrandingSection() {
  const [hoveredFeature, setHoveredFeature] = useState<Feature | null>(null);

  const getArrowPosition = (id: number) => {
    const positions: Record<number, string> = {
      1: "left-[12.5%]", 2: "left-[37.5%]", 3: "left-[62.5%]", 4: "left-[87.5%]",
    };
    return positions[id] || "left-1/2";
  };

  return (
    <div className="hidden lg:flex w-1/2 min-h-screen bg-gradient-to-tr from-[#007bff] via-[#bfe1ff] to-[#4298f5] flex-col p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
      
      <div className="my-auto w-full max-w-xl mx-auto flex flex-col items-center text-center z-10">
        <img src="/logo-hitradies-standard-04.png" alt="HiTradies" className="w-[210px] h-auto object-contain drop-shadow-sm mb-6" />
        
        <div className="mb-8">
          <h2 className="text-2xl font-black text-blue-900 leading-tight tracking-tight uppercase italic">
            Empowering Tradies with <br/>
            <span className="text-blue-700/80">Smart Digital Tools</span>
          </h2>
        </div>

        <div className="relative w-full flex flex-col items-center">
          <div className="grid grid-cols-4 gap-4 w-full max-w-md mb-6">
            {FEATURES.map((feat) => (
              <div 
                key={feat.id}
                onMouseEnter={() => setHoveredFeature(feat)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className={cn(
                  "w-20 h-20 rounded-[24px] transition-all duration-300 shadow-lg flex items-center justify-center",
                  hoveredFeature?.id === feat.id ? 'bg-[#007bff] text-white scale-105' : 'bg-white/60 text-blue-900 hover:bg-white/90'
                )}>
                  <feat.icon size={28} strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-black text-blue-900 uppercase tracking-tighter opacity-70">
                  {feat.title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full h-[130px] flex items-center justify-center">
            {hoveredFeature && (
              <div className="w-full max-w-md bg-white rounded-[28px] p-6 shadow-xl border border-white/50 animate-in fade-in zoom-in duration-200 text-left relative">
                <div className={cn("absolute -top-1.5 w-3 h-3 bg-white rotate-45 -translate-x-1/2 transition-all duration-300", getArrowPosition(hoveredFeature.id))} />
                <h4 className="text-blue-900 font-bold text-sm mb-1 flex items-center gap-2">
                  <CheckCircle2 className="text-[#007bff]" size={16} />
                  {hoveredFeature.title}
                </h4>
                <p className="text-slate-600 text-[13px] italic leading-relaxed">"{hoveredFeature.desc}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 w-full max-w-sm grid grid-cols-3 gap-4 py-4 px-6 bg-white/30 backdrop-blur-xl border border-white/40 rounded-[24px] shadow-sm">
           <div className="flex flex-col">
              <span className="text-xl font-black text-blue-900 tracking-tighter">5K+</span>
              <span className="text-[9px] font-bold text-blue-900/50 uppercase">Tradies</span>
           </div>
           <div className="flex flex-col border-x border-blue-900/10">
              <span className="text-xl font-black text-blue-900 tracking-tighter">120K+</span>
              <span className="text-[9px] font-bold text-blue-900/50 uppercase">Quotes</span>
           </div>
           <div className="flex flex-col">
              <span className="text-xl font-black text-blue-900 tracking-tighter">99.9%</span>
              <span className="text-[9px] font-bold text-blue-900/50 uppercase">Uptime</span>
           </div>
        </div>
      </div>
    </div>
  );
}