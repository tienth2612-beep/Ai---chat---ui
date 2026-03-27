"use client";
import React, { useState } from "react";
import { 
  Search, Bell, Settings, Plus, Home, Calendar, Mail, 
  Users, FileText, Briefcase, CreditCard, BarChart3, 
  ChevronDown, HelpCircle, LogOut, User as UserIcon, X, Check
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen z-40">
        
        {/* VỊ TRÍ 1: "tien - Basic Plan" THAY THẾ HOÀN TOÀN LOGO */}
        <div className="p-4 border-b border-slate-50">
          <div 
            onClick={() => setIsCompanyOpen(true)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all group border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00a3ff] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-100">T</div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-800">tien</p>
                <p className="text-[11px] text-slate-400 font-medium">Basic Plan</p>
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1 overflow-y-auto">
          {/* VỊ TRÍ 2: ĐƯA MENU LÊN TRÊN NÚT QUICK CREATE (Theo mũi tên từ menu chỉ lên) */}
          <nav className="space-y-1 mb-6">
            <SidebarItem icon={<Home size={19}/>} label="Home" active />
            <SidebarItem icon={<Calendar size={19}/>} label="Schedule" />
            <SidebarItem icon={<Mail size={19}/>} label="Inbox" />
          </nav>

          {/* NÚT QUICK CREATE GIỜ NẰM DƯỚI CỤM MENU ĐẦU TIÊN */}
          <button className="w-full bg-[#00a3ff] hover:bg-[#0092e6] text-white rounded-xl py-2.5 px-4 flex items-center gap-3 mb-6 transition-all shadow-md shadow-blue-100 font-semibold text-sm">
            <Plus size={18} strokeWidth={3} /> Quick Create
          </button>

          {/* PHẦN MENU CÒN LẠI */}
          <nav className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-3 ml-4">Business</p>
            <SidebarItem icon={<Users size={19}/>} label="Clients" />
            <SidebarItem icon={<FileText size={19}/>} label="Quotes" />
            <SidebarItem icon={<Briefcase size={19}/>} label="Jobs" />
            <SidebarItem icon={<BarChart3 size={19}/>} label="Expenses" />
          </nav>
        </div>

        {/* VỊ TRÍ 3: ADMIN TỪ HEADER BỐC XUỐNG THAY THẾ GÓC DƯỚI SIDEBAR */}
        <div className="p-4 border-t border-slate-100">
           <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-100">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">a</div>
              <div className="flex-1 leading-tight text-left overflow-hidden">
                <p className="text-xs font-bold text-slate-800">admin</p>
                <p className="text-[10px] text-slate-400 truncate">hitradiesadmin@gmail.com</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
           </div>
        </div>
      </aside>

      {/* --- PHẦN BÊN PHẢI --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex-1 flex justify-center max-w-xl mx-auto px-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search clients, jobs, quotes..." 
                className="w-full bg-slate-50 border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600"><HelpCircle size={20}/></button>
            <button className="p-2 text-slate-400 hover:text-slate-600"><Settings size={20}/></button>
            
            {/* VỊ TRÍ 4: ADMIN TỪ DƯỚI SIDEBAR BỐC LÊN THAY THẾ GÓC PHẢI HEADER */}
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1 pl-3 rounded-full bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all"
            >
              <div className="text-right hidden md:block leading-tight">
                <p className="text-[11px] font-bold text-slate-800">admin</p>
                <p className="text-[9px] text-slate-400">hitradiesadmin@gmail.com</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 font-bold border border-slate-200 shadow-sm">a</div>
              <ChevronDown size={12} className="text-slate-400 mr-2" />
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* MODAL & DROPDOWNS (Giữ nguyên logic hiệu ứng) */}
      {/* ... (Các phần modal chọn công ty giữ nguyên như code trước của bạn) ... */}
    </div>
  );
}

// --- SIDEBAR ITEM (Giữ nguyên hiệu ứng vệt xanh và hover) ---
function SidebarItem({ icon, label, active = false }: any) {
  return (
    <div className={`
      relative flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-all group
      ${active ? 'bg-slate-50 text-[#00a3ff] font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
    `}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00a3ff] rounded-r-md"></div>}
      <span className={`${active ? 'text-[#00a3ff]' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
      <span className="text-sm tracking-tight">{label}</span>
    </div>
  );
}