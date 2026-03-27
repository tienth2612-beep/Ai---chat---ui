"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, ShoppingCart, Calendar } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Title & Filter Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Soft UI Statistics</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 text-sm font-bold text-slate-500">
           <Calendar size={16} className="text-blue-500"/> Last 30 days
        </div>
      </div>

      {/* 4 Stat Cards (Theo Ảnh 3) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SoftStatCard title="Today's Money" value="$53,000" change="+55%" icon={<Wallet size={18}/>} color="bg-gradient-to-tr from-pink-500 to-rose-400" />
        <SoftStatCard title="Today's Users" value="2,300" change="+3%" icon={<Users size={18}/>} color="bg-gradient-to-tr from-purple-600 to-indigo-400" />
        <SoftStatCard title="New Clients" value="+3,462" change="-2%" icon={<ShoppingCart size={18}/>} color="bg-gradient-to-tr from-emerald-500 to-teal-400" isNegative />
        <SoftStatCard title="Sales" value="$103,430" change="+5%" icon={<TrendingUp size={18}/>} color="bg-gradient-to-tr from-orange-500 to-amber-400" />
      </div>

      {/* Charts / Activity Grid (Bố cục Ảnh 3) */}
      <div className="grid gap-8 md:grid-cols-7">
        
        {/* Biểu đồ Active Users (Chiếm 4 cột) */}
        <Card className="col-span-4 border-none shadow-2xl shadow-slate-200/50 rounded-[30px] bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-slate-800">Sales Overview</CardTitle>
            <p className="text-[11px] font-bold text-green-500 uppercase tracking-tighter">(+23%) <span className="text-slate-400">than last week</span></p>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Giả lập biểu đồ của Ảnh 3 */}
            <div className="h-64 w-full bg-slate-900 rounded-[24px] p-6 flex flex-col justify-between shadow-2xl shadow-slate-900/20">
               <div className="flex items-end justify-between gap-1.5 h-36 px-2">
                  {[30, 60, 45, 80, 50, 95, 40, 75, 60].map((h, i) => (
                    <div key={i} style={{height: `${h}%`}} className="flex-1 bg-white/20 hover:bg-white/40 rounded-full transition-all cursor-pointer" />
                  ))}
               </div>
               <div className="grid grid-cols-4 gap-4 mt-4">
                  <MiniStat label="Users" val="36K" />
                  <MiniStat label="Clicks" val="2m" />
                  <MiniStat label="Sales" val="435$" />
                  <MiniStat label="Items" val="43" />
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity / Orders (Chiếm 3 cột) */}
        <Card className="col-span-3 border-none shadow-2xl shadow-slate-200/50 rounded-[30px] bg-white/90">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Orders overview</CardTitle>
            <p className="text-[11px] font-bold text-green-500 uppercase tracking-tighter">+24% <span className="text-slate-400">this month</span></p>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <OrderItem text="Payment received" time="2 hours ago" color="text-blue-500" />
            <OrderItem text="New user registered" time="5 hours ago" color="text-purple-500" />
            <OrderItem text="Membership upgraded" time="1 day ago" color="text-emerald-500" />
            <OrderItem text="Server maintenance" time="2 days ago" color="text-orange-500" />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function SoftStatCard({ title, value, change, icon, color, isNegative = false }: any) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/40 rounded-[24px] bg-white transition-all hover:-translate-y-1">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-800 leading-none">{value}</h3>
            <span className={`text-[10px] font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>{change}</span>
          </div>
        </div>
        <div className={`w-11 h-11 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-inner`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, val }: any) {
  return (
    <div>
      <p className="text-[10px] font-bold text-white/50 uppercase">{label}</p>
      <p className="text-sm font-black text-white">{val}</p>
    </div>
  );
}

function OrderItem({ text, time, color }: any) {
  return (
    <div className="flex gap-4">
      <div className={`mt-1 w-2 h-2 rounded-full ${color.replace('text', 'bg')} shadow-lg shadow-current/20 flex-shrink-0`}></div>
      <div>
        <p className="text-sm font-bold text-slate-700 leading-none mb-1">{text}</p>
        <p className="text-[11px] font-bold text-slate-300 uppercase">{time}</p>
      </div>
    </div>
  );
}