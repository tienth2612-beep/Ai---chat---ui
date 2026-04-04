"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { 
  PanelLeft, Search, CircleHelp, Settings, ExternalLink, TrendingUp, TrendingDown, 
  Users, UserCheck, Clock, UserX, Building2, ShieldCheck, BarChart3, Receipt, 
  DollarSign, Wallet, ArrowUpRight, History, Calendar, ChevronDown 
} from "lucide-react";

/** 6 tháng gần nhất: nhãn T1…T12 (theo tháng thực), dùng cho biểu đồ xu hướng — không phụ thuộc bộ lọc ngày. */
function getRollingSixMonthLabels(): string[] {
  const now = new Date();
  const labels: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`T${d.getMonth() + 1}`);
  }
  return labels;
}

/**
 * Doanh thu MTD (cộng dồn trong tháng, reset tháng mới).
 * Mock: khi có API, thay bằng dữ liệu thật theo tháng hiện tại.
 */
function getMtdRevenueMock() {
  return { sub: 3200, comm: 5100, profit: 5600 };
}

export default function HitradiesDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  
  const [dateRange, setDateRange] = useState("This Month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /** Chỉ ảnh hưởng: 3 ô Đăng ký / Hoa hồng / Lợi nhuận + biểu đồ cột so sánh. */
  const dateFilteredData = useMemo(() => {
    const revenueData: Record<string, { sub: number; comm: number; profit: number; bars: [number, number, number] }> = {
      Today: { sub: 150, comm: 240, profit: 310, bars: [30, 50, 65] },
      Yesterday: { sub: 140, comm: 220, profit: 290, bars: [25, 45, 60] },
      "Last Week": { sub: 890, comm: 1200, profit: 1350, bars: [38, 55, 62] },
      "Last Month": { sub: 4100, comm: 6900, profit: 7200, bars: [42, 78, 85] },
      "Last Quarter": { sub: 12000, comm: 21000, profit: 24000, bars: [48, 80, 90] },
      "Last Year": { sub: 38000, comm: 65000, profit: 72000, bars: [55, 85, 92] },
      "This Week": { sub: 620, comm: 980, profit: 1100, bars: [35, 52, 58] },
      "This Month": { sub: 4500, comm: 7734, profit: 8450, bars: [45, 82, 88] },
      "This Quarter": { sub: 13200, comm: 22800, profit: 25100, bars: [50, 84, 91] },
      "This Year": { sub: 45000, comm: 72000, profit: 89000, bars: [52, 86, 93] },
      "All Time": { sub: 45000, comm: 72000, profit: 89000, bars: [50, 75, 95] },
    };
    return revenueData[dateRange] ?? revenueData["This Month"];
  }, [dateRange]);

  /** Xu hướng 6 tháng — cố định theo cửa sổ lăn, không đổi khi đổi date filter. */
  const sixMonthTrend = useMemo(() => {
    const values = [8.2, 9.1, 10.4, 11.2, 12.0, 12.8];
    const max = Math.max(...values, 0.001);
    return { values, labels: getRollingSixMonthLabels(), max };
  }, []);

  const mtdRevenue = useMemo(() => getMtdRevenueMock(), []);

  const dateOptions = [
    "Today", "Yesterday", "Last Week", "Last Month", "Last Quarter", 
    "Last Year", "This Week", "This Month", "This Quarter", "This Year", "All Time"
  ];

  return (
    <div className="group/sidebar-wrapper flex min-h-svh w-full bg-background">
      <main className="relative flex min-h-svh flex-1 flex-col">
        
        {/* 1. HEADER */}
        <header className="flex h-16 shrink-0 items-center border-b bg-white px-4 sticky top-0 z-20 shadow-sm">
          <div className="flex w-full items-center gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <button className="inline-flex items-center justify-center gap-2 rounded-md h-7 w-7 hover:bg-zinc-100 transition-colors">
                <PanelLeft className="size-5 text-zinc-600" />
              </button>
              <div className="shrink-0 bg-border w-[1px] mx-1 h-4 hidden lg:block"></div>
            </div>

            <div className="relative mx-auto hidden w-full max-w-xl md:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <input 
                className="flex w-full border px-3 py-1.5 h-10 rounded-full border-zinc-200 bg-zinc-50/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
                placeholder="Search analytics, users or transactions..."
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <CircleHelp className="size-4 text-zinc-400 cursor-pointer hover:text-zinc-800" />
              <Settings className="size-4 text-zinc-400 cursor-pointer hover:text-zinc-800" />
              <div className="size-9 rounded-full bg-[#0070f3] text-white flex items-center justify-center text-xs font-bold shadow-md shadow-blue-200 border-2 border-white">ĐT</div>
            </div>
          </div>
        </header>

        {/* 2. MAIN CONTENT */}
        <main className="p-6 space-y-6">
          
          {/* HÀNG TRÊN: 3 Ô THÔNG SỐ (STAT CARDS) */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard 
              title="Total users" value="25" trend="+12%" isUp={true} 
              isActive={activeTab === "users"} 
              onClick={() => setActiveTab("users")}
              detailHref="/admin/users"
              tooltipMsg="Đi đến quản lý người dùng"
              rows={[{ label: "Pro Tier", val: "15" }, { label: "Basic Tier", val: "10" }, { label: "Expiring soon", val: "5"}]} 
            />
            <StatCard 
              title="Business Entities" value="23" trend="-2%" isUp={false} 
              isActive={activeTab === "entities"} 
              onClick={() => setActiveTab("entities")}
              detailHref="/admin/companies"
              tooltipMsg="Xem danh sách doanh nghiệp"
              rows={[{ label: "Active", val: "12" }, { label: "Inactive", val: "6" }, { label:"Pending Review", val: "5"}]} 
            />
            <StatCard 
              title="Revenue" value={`$${(mtdRevenue.sub + mtdRevenue.comm).toLocaleString()}`} trend="+15%" isUp={true} 
              isActive={activeTab === "revenue"} 
              onClick={() => setActiveTab("revenue")}
              detailHref="/admin/finance"
              tooltipMsg="Tổng MTD trong tháng (cộng dồn theo ngày, reset tháng mới)"
              rows={[{ label: "Subscriptions", val: `$${mtdRevenue.sub.toLocaleString()}` }, { label: "Commissions", val: `$${mtdRevenue.comm.toLocaleString()}` }, { label: "Net Profit", val: `$${mtdRevenue.profit.toLocaleString()}`}]} 
            />
          </div>

          {/* HÀNG DƯỚI: NỘI DUNG CHI TIẾT THEO TAB */}
          <div className="grid gap-4 md:grid-cols-3">
            
            <div className="md:col-span-2 rounded-2xl border bg-white p-6 sm:p-8 shadow-sm min-h-[420px] min-w-0 overflow-hidden">
              
              {/* --- TAB 1: USERS ANALYTICS --- */}
              {activeTab === "users" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-blue-600">Users Engagement</h2>
                      <p className="text-xs text-zinc-500 font-medium">Comparison between account tiers and activity levels</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                    <div className="lg:col-span-2 bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50">
                      <div className="flex items-end justify-around h-48 gap-4 px-4 relative">
                        <div className="absolute inset-x-0 top-0 h-px bg-blue-200/20" />
                        <div className="absolute inset-x-0 top-2/4 h-px bg-blue-200/20" />
                        <BarColumn label="Pro" value={15} total={25} color="bg-blue-600" />
                        <BarColumn label="Regular" value={10} total={25} color="bg-zinc-400" />
                        <BarColumn label="Expiring" value={5} total={25} color="bg-amber-500" />
                        <BarColumn label="Inactive" value={12} total={25} color="bg-rose-500" />
                      </div>
                      <div className="mt-8 flex justify-center gap-4 flex-wrap">
                         <LegendItem color="bg-blue-600" label="PRO" />
                         <LegendItem color="bg-zinc-400" label="REGULAR" />
                         <LegendItem color="bg-amber-500" label="EXPIRING" />
                         <LegendItem color="bg-rose-500" label="INACTIVE" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">User Insights</h3>
                      <MiniMetricCard label="Active Now" value="12" sub="Online users" color="text-emerald-600" />
                      <MiniMetricCard label="New Signups" value="+4" sub="Last 24h" color="text-blue-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB 2: ENTITIES ANALYTICS --- */}
              {activeTab === "entities" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Entities Analytics</h2>
                      <p className="text-xs text-zinc-500 font-medium">Comparison of company statuses and verification queue</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                    <div className="lg:col-span-2 bg-zinc-50/50 p-6 rounded-2xl border border-zinc-100">
                      <div className="flex items-end justify-around h-48 gap-4 px-4 relative">
                        <div className="absolute inset-x-0 top-0 h-px bg-zinc-200/40" />
                        <div className="absolute inset-x-0 top-2/4 h-px bg-zinc-200/40" />
                        <BarColumn label="Active" value={12} total={23} color="bg-emerald-500" />
                        <BarColumn label="Inactive" value={6} total={23} color="bg-rose-400" />
                        <BarColumn label="Pending" value={5} total={23} color="bg-amber-400" />
                      </div>
                      <div className="mt-8 flex justify-center gap-6">
                         <LegendItem color="bg-emerald-500" label="ACTIVE" />
                         <LegendItem color="bg-rose-400" label="INACTIVE" />
                         <LegendItem color="bg-amber-400" label="PENDING" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Verify Queue</h3>
                      <QuickActionItem name="Sơn sửa ABC" desc="Business License" />
                      <QuickActionItem name="Điện nước 247" desc="Insurance Docs" />
                      <button className="w-full py-2 text-[10px] font-bold text-blue-600 bg-blue-50 rounded-lg">View Queue (5)</button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB 3: REVENUE ANALYTICS (PHẦN THAY ĐỔI THEO YÊU CẦU) --- */}
              {activeTab === "revenue" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-w-0">
                  {/* Header Phân tích doanh thu & Date Range */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900">Phân tích doanh thu</h2>
                      <p className="text-sm text-zinc-500">
                        Bộ lọc ngày chỉ áp dụng cho 3 ô (Đăng ký / Hoa hồng / Lợi nhuận) và biểu đồ cột. Ô Revenue phía trên = tổng MTD tháng hiện tại; biểu đồ 6 tháng luôn là 6 tháng lăn gần nhất.
                      </p>
                    </div>

                    {/* Bộ lọc Date Range (Image 2) */}
                    <div className="relative">
                      <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-full md:w-56 px-4 py-2 bg-white border rounded-lg shadow-sm text-sm hover:bg-zinc-50 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-zinc-500" />
                          <span className="font-medium">{dateRange}</span>
                        </div>
                        <ChevronDown className={`size-4 text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-full md:w-56 bg-white border rounded-xl shadow-xl z-50 overflow-hidden py-1">
                          {dateOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setDateRange(option);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${dateRange === option ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-zinc-50 text-zinc-700'}`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top 3 Summary Boxes — theo bộ lọc ngày */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 min-w-0">
                    <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-5 text-center shadow-sm min-w-0">
                      <span className="text-xl sm:text-2xl font-bold text-indigo-600 block mb-1 tabular-nums">${dateFilteredData.sub.toLocaleString()}.00</span>
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Đăng ký</span>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-5 text-center shadow-sm min-w-0">
                      <span className="text-xl sm:text-2xl font-bold text-emerald-500 block mb-1 tabular-nums">${dateFilteredData.comm.toLocaleString()}.00</span>
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Hoa hồng</span>
                    </div>
                    <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-5 text-center shadow-sm min-w-0">
                      <span className="text-xl sm:text-2xl font-bold text-amber-500 block mb-1 tabular-nums">${dateFilteredData.profit.toLocaleString()}.00</span>
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Lợi nhuận</span>
                    </div>
                  </div>

                  {/* Biểu đồ */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2 min-w-0">
                    
                    {/* Xu hướng 6 tháng — không phụ thuộc date filter */}
                    <div className="space-y-3 min-w-0">
                      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">XU HƯỚNG DOANH THU 6 THÁNG</h3>
                      <div className="rounded-xl border border-zinc-100 bg-zinc-50/30 p-4 pl-12 pr-3 pb-10 pt-2 min-w-0 overflow-hidden">
                        <div className="relative h-44 w-full">
                          <svg
                            className="h-full w-full"
                            viewBox="0 0 280 140"
                            preserveAspectRatio="xMidYMid meet"
                            role="img"
                            aria-label="Xu hướng doanh thu 6 tháng"
                          >
                            {(() => {
                              const pad = 12;
                              const w = 280 - pad * 2;
                              const h = 140 - pad * 2;
                              const vals = sixMonthTrend.values;
                              const maxV = sixMonthTrend.max;
                              const pts = vals.map((v, i) => {
                                const x = pad + (i / Math.max(vals.length - 1, 1)) * w;
                                const y = pad + h - (v / maxV) * h;
                                return `${x},${y}`;
                              });
                              return (
                                <>
                                  <polyline fill="none" stroke="#6366f1" strokeWidth="2" points={pts.join(" ")} vectorEffect="non-scaling-stroke" />
                                  {vals.map((v, i) => {
                                    const x = pad + (i / Math.max(vals.length - 1, 1)) * w;
                                    const y = pad + h - (v / maxV) * h;
                                    return (
                                      <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#6366f1" strokeWidth="2" />
                                    );
                                  })}
                                </>
                              );
                            })()}
                          </svg>
                          <div className="pointer-events-none absolute left-0 top-0 flex h-[calc(100%-2rem)] flex-col justify-between text-[10px] font-bold text-zinc-400 -translate-x-10 w-8 text-right">
                            <span>{`$${Math.ceil(sixMonthTrend.max)}k`}</span>
                            <span>{`$${Math.round(sixMonthTrend.max * 0.75)}k`}</span>
                            <span>{`$${Math.round(sixMonthTrend.max * 0.5)}k`}</span>
                            <span>{`$${Math.round(sixMonthTrend.max * 0.25)}k`}</span>
                            <span>$0k</span>
                          </div>
                          <div className="absolute bottom-0 left-12 right-2 flex justify-between text-[10px] font-bold text-zinc-400">
                            {sixMonthTrend.labels.map((lb) => (
                              <span key={lb} className="min-w-0 truncate text-center flex-1">{lb}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* So sánh nguồn thu — theo bộ lọc ngày */}
                    <div className="space-y-3 min-w-0">
                      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">SO SÁNH NGUỒN THU</h3>
                      <div className="rounded-xl border border-zinc-100 bg-zinc-50/30 p-4 pl-12 pr-4 pb-10 pt-2 min-h-[11rem] min-w-0 overflow-hidden">
                        <div className="relative flex h-44 items-end justify-around gap-2 px-1">
                          <div className="pointer-events-none absolute left-0 top-0 flex h-full flex-col justify-between text-[10px] font-bold text-zinc-400 -translate-x-10 w-8 text-right">
                            <span>$10k</span>
                            <span>$8k</span>
                            <span>$5k</span>
                            <span>$3k</span>
                            <span>$0k</span>
                          </div>
                          <div className="bg-indigo-500 w-[22%] max-w-16 min-w-10 rounded-t-sm transition-all duration-700" style={{ height: `${dateFilteredData.bars[0]}%` }} />
                          <div className="bg-emerald-500 w-[22%] max-w-16 min-w-10 rounded-t-sm transition-all duration-700" style={{ height: `${dateFilteredData.bars[1]}%` }} />
                          <div className="bg-amber-500 w-[22%] max-w-16 min-w-10 rounded-t-sm transition-all duration-700" style={{ height: `${dateFilteredData.bars[2]}%` }} />
                        </div>
                        <div className="mt-2 flex justify-around gap-1 text-[10px] font-bold text-zinc-400 px-1">
                          <span className="w-[22%] max-w-16 text-center truncate">Đăng ký</span>
                          <span className="w-[22%] max-w-16 text-center truncate">Hoa hồng</span>
                          <span className="w-[22%] max-w-16 text-center truncate">Lợi nhuận</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* ACTIVITY LOG */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Activity Log</h2>
                <History className="size-4 text-zinc-300" />
              </div>
              <div className="space-y-6 flex-1">
                <ActivityDot label="New user registered" time="2 hours ago" color="bg-blue-500" />
                <ActivityDot label="Membership upgraded" time="5 hours ago" color="bg-amber-500" />
                <ActivityDot label="Payment received" time="1 day ago" color="bg-emerald-500" />
                <ActivityDot label="Company reported" time="2 days ago" color="bg-rose-500" />
              </div>
              <button className="w-full mt-10 py-2.5 bg-zinc-50 text-[11px] font-bold text-zinc-500 rounded-xl hover:bg-zinc-100 transition-all border border-zinc-100">
                Download Logs (.csv)
              </button>
            </div>

          </div>
        </main>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS (GIỮ NGUYÊN) ---

type StatCardProps = {
  title: string;
  value: string;
  rows: Array<{ label: string; val: string }>;
  trend: string;
  isUp: boolean;
  isActive: boolean;
  onClick: () => void;
  detailHref: string;
  tooltipMsg?: string;
};

function StatCard({ title, value, rows, trend, isUp, isActive, onClick, detailHref, tooltipMsg }: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl border p-6 transition-all cursor-pointer relative active:scale-[0.98]
        ${isActive ? 'ring-2 ring-blue-500 bg-blue-50/40 border-transparent shadow-md' : 'bg-white border-zinc-100 hover:border-zinc-300 shadow-sm'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-zinc-400'}`}>{title}</span>
        
        <div className="relative group/btn">
          <Link 
            href={detailHref} 
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg bg-zinc-50 text-zinc-400 hover:text-blue-600 hover:bg-blue-100 transition-all block"
          >
            <ExternalLink className="size-3.5" />
          </Link>

          <div className="absolute bottom-full right-0 mb-2 hidden group-hover/btn:block z-50 animate-in fade-in slide-in-from-bottom-1 duration-200">
             <div className="bg-zinc-800 text-white text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap shadow-xl">
               {tooltipMsg || "Xem chi tiết"}
               <div className="absolute top-full right-2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-zinc-800"></div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-black tracking-tight">{value}</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
          {trend}
        </span>
      </div>
      <div className={`space-y-1.5 pt-3 border-t ${isActive ? 'border-blue-100' : 'border-zinc-100'}`}>
        {rows.map((row, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className={isActive ? 'text-blue-700/60' : 'text-zinc-500 font-medium'}>{row.label}</span>
            <span className="font-bold text-zinc-900">{row.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type BarColumnProps = {
  label: string;
  value: number;
  total: number;
  color: string;
};

function BarColumn({ label, value, total, color }: BarColumnProps) {
  const heightPercent = Math.min((value / total) * 180 * 1.2, 180); 

  return (
    <div className="relative flex flex-col items-center group w-full max-w-[50px]">
      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 rounded z-20 whitespace-nowrap shadow-xl">
        {value}
      </div>
      <div 
        className={`${color} w-full rounded-t-lg shadow-lg shadow-black/5 transition-all duration-1000 ease-out relative z-10`}
        style={{ height: `${heightPercent}px` }}
      >
        <div className="absolute inset-0 bg-white/15 rounded-t-lg" />
      </div>
      <span className="mt-3 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter text-center line-clamp-1">{label}</span>
    </div>
  );
}

type LegendItemProps = {
  color: string;
  label: string;
};

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`size-2 rounded-full ${color}`} />
      <span className="text-[9px] font-bold text-zinc-400 tracking-tighter uppercase">{label}</span>
    </div>
  );
}

type MiniMetricCardProps = {
  label: string;
  value: string;
  sub: string;
  color: string;
};

function MiniMetricCard({ label, value, sub, color }: MiniMetricCardProps) {
  return (
    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
      <p className="text-[10px] font-bold text-zinc-500 uppercase">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className={`text-xl font-black ${color}`}>{value}</p>
        <p className="text-[9px] text-zinc-400 font-medium">{sub}</p>
      </div>
    </div>
  );
}

type QuickActionItemProps = {
  name: string;
  desc: string;
};

function QuickActionItem({ name, desc }: QuickActionItemProps) {
  return (
    <div className="flex items-center justify-between p-3 border border-zinc-100 rounded-xl hover:bg-zinc-50 group cursor-pointer transition-colors">
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-zinc-800">{name}</span>
        <span className="text-[9px] text-zinc-400 font-medium uppercase tracking-tight">{desc}</span>
      </div>
      <div className="size-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
        <ShieldCheck className="size-4" />
      </div>
    </div>
  );
}

type ActivityDotProps = {
  label: string;
  time: string;
  color: string;
};

function ActivityDot({ label, time, color }: ActivityDotProps) {
  return (
    <div className="flex items-start gap-4">
      <div className={`mt-1.5 size-2 rounded-full shrink-0 ${color} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
      <div className="flex flex-col flex-1">
        <span className="text-xs font-bold text-zinc-800 leading-tight">{label}</span>
        <span className="text-[10px] text-zinc-400 font-bold mt-1 uppercase tracking-tighter">{time}</span>
      </div>
    </div>
  );
}