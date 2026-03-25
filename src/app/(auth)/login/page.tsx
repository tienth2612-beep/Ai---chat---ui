"use client";

import React, { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Users, 
  Settings, 
  Activity,
  Star,
  FileText,
  Calendar,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FEATURES = [
  {
    id: 1,
    icon: <Star />,
    title: "Review Management",
    desc: "Collect and manage client reviews efficiently to enhance your company's reputation. Reviews can be linked directly to your profile."
  },
  {
    id: 2,
    icon: <FileText />,
    title: "Smart Quoting",
    desc: "Create professional quotes in seconds. Track when clients view them and allow them to accept digitally."
  },
  {
    id: 3,
    icon: <Calendar />,
    title: "Scheduling",
    desc: "Organize your team with an intuitive calendar. Assign tasks, set reminders, and track job progress."
  },
  {
    id: 4,
    icon: <MessageSquare />,
    title: "Communication",
    desc: "Keep all client interactions in one place. Automated updates and reminders make it easy for clients to stay informed."
  }
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  // Logic tính toán vị trí mũi tên dựa trên ID của icon (1-4)
  const getArrowPosition = (id: number) => {
    const positions: Record<number, string> = {
      1: "left-[12.5%]",
      2: "left-[37.5%]",
      3: "left-[62.5%]",
      4: "left-[87.5%]",
    };
    return positions[id] || "left-1/2";
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full font-sans bg-white">
      
      <div className="w-full lg:w-1/2 flex flex-col p-6 py-12 border-r border-slate-100 min-h-screen text-slate-900">
        <div className="my-auto w-full max-w-[380px] mx-auto flex flex-col">
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Backoffice login
              </h1>
              <ShieldCheck className="w-5 h-5 text-[#0066FF] shrink-0" />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Internal system for HiTradies administrators.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] font-semibold text-slate-900">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="m@example.com" 
                className="h-10 border-slate-300 rounded-md shadow-sm focus-visible:ring-1 focus-visible:ring-slate-400 text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[13px] font-semibold text-slate-900">Password</Label>
                <a href="#" className="text-[13px] hover:underline cursor-pointer">Forgot your password?</a>
              </div>
              <div className="relative group">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  className="h-10 border-slate-300 rounded-md shadow-sm pr-11 focus-visible:ring-1 focus-visible:ring-slate-400 text-sm"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[hsl(240,4%,46%)] hover:opacity-80 transition-opacity cursor-pointer outline-none"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 border border-slate-200 rounded-[4px] bg-[#fdfdfd] shadow-sm min-h-[65px]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#228b4e] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-[16px] font-normal text-[#313131]">Thành công!</span>
              </div>
              
              <div className="flex flex-col items-end pt-1">
                <div className="flex flex-col items-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg" 
                    alt="Cloudflare" 
                    className="h-[14px] mb-[1px]" 
                    style={{ filter: 'invert(52%) sepia(91%) saturate(2855%) hue-rotate(360deg) brightness(101%) contrast(105%)' }}
                  />
                  <span className="text-[9px] font-black tracking-tight text-black leading-none uppercase">Cloudflare</span>
                </div>
                <div className="text-[10px] text-slate-600 mt-1 flex gap-1">
                  <a href="#" className="underline decoration-slate-400 cursor-pointer">Quyền riêng tư</a>
                  <span className="no-underline text-slate-400">•</span>
                  <a href="#" className="underline decoration-slate-400 cursor-pointer">Giúp đỡ</a>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-[#00A3FF] hover:bg-[#0086d1] text-white font-semibold rounded-md shadow-sm text-sm cursor-pointer"
            >
              Login
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-[13px]">
              <span className="bg-white px-3 text-[hsl(240,4%,46%)] font-medium">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-11 border-slate-200 rounded-md font-medium text-slate-700 flex items-center justify-center relative hover:bg-slate-50 transition-colors text-[14px] shadow-sm cursor-pointer">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google" className="absolute left-4" />
            <span>Đăng nhập bằng Google</span>
          </Button>

          <div className="text-center mt-8 text-sm text-slate-600">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="font-semibold text-slate-900 underline underline-offset-4 cursor-pointer">Sign up</Link>
          </div>
        </div>
      </div>

      {/* BRANDING & FEATURES */}
      <div className="hidden lg:flex w-1/2 min-h-screen bg-gradient-to-tr from-[#007bff] via-[#bfe1ff] to-[#4298f5] flex-col p-8 relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} 
        />

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
                  <div className={`w-20 h-20 rounded-[24px] transition-all duration-300 shadow-lg flex items-center justify-center 
                    ${hoveredFeature?.id === feat.id ? 'bg-[#007bff] text-white scale-105' : 'bg-white/60 text-blue-900 hover:bg-white/90'}`}
                  >
                    {React.cloneElement(feat.icon as React.ReactElement, { size: 28, strokeWidth: 2.2 })}
                  </div>
                  <span className="text-[10px] font-black text-blue-900 uppercase tracking-tighter opacity-70">
                    {feat.title.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full h-[130px] flex items-center justify-center">
              {hoveredFeature && (
                <div className="w-full max-w-md bg-white rounded-[28px] p-6 shadow-xl shadow-blue-900/10 border border-white/50 animate-in fade-in zoom-in duration-200 text-left relative">
                  {/* Mũi tên đã được sửa logic để di chuyển theo icon */}
                  <div className={`absolute -top-1.5 w-3 h-3 bg-white rotate-45 -translate-x-1/2 transition-all duration-300 ${getArrowPosition(hoveredFeature.id)}`} />
                  
                  <h4 className="text-blue-900 font-bold text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 className="text-[#007bff]" size={16} />
                    {hoveredFeature.title}
                  </h4>
                  <p className="text-slate-600 text-[13px] leading-relaxed italic">
                    "{hoveredFeature.desc}"
                  </p>
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
    </div>
  );
}