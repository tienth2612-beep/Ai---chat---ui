"use client";

import React from "react";
import { 
  PanelLeft, Search, CircleHelp, Settings, ExternalLink, Users, TrendingUp, TrendingDown 
} from "lucide-react";

export default function HitradiesExactFinalWithData() {
  return (
    <div className="group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar">
      <main className="relative flex min-h-svh flex-1 flex-col bg-background">
        
        {/* HEADER - GIỮ NGUYÊN */}
        <header className="flex h-16 shrink-0 items-center border-b bg-white px-4">
          <div className="flex w-full items-center gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent h-7 w-7">
                <PanelLeft className="lucide lucide-panel-left size-10" />
                <span className="sr-only">Toggle Sidebar</span>
              </button>
              <div data-orientation="vertical" role="none" className="shrink-0 bg-border w-[1px] mx-1 h-4 hidden lg:block"></div>
              <div className="hidden lg:block truncate"></div>
            </div>

            <div className="relative mx-auto hidden w-full max-w-xl md:block">
              <Search className="lucide lucide-search pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <input 
                className="flex w-full border px-3 py-1 text-base transition-colors h-10 rounded-full border-zinc-200 bg-white pl-10 pr-4 shadow-sm md:text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                placeholder="Search Total user, Active membership, Revenue  ..."
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <a className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent" href="/help">
                <CircleHelp className="lucide lucide-circle-help size-4" />
              </a>
              <a className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent" href="/settings">
                <Settings className="lucide lucide-settings size-4" />
              </a>
              <button type="button" className="flex size-10 items-center justify-center rounded-full bg-white transition-colors hover:bg-zinc-50">
                <span className="relative flex shrink-0 overflow-hidden size-9 rounded-full">
                  <span className="flex h-full w-full items-center justify-center rounded-full text-xs bg-[#0070f3] text-white">ĐT</span>
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT - GIỮ NGUYÊN Ô, THÊM THÔNG SỐ & TREND */}
        <main className="z-50">
          <div className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              

              <StatCard 
                title="Total users" 
                value="25" 
                trend="+12%"
                isUp={true}
                highlight 
                rows={[
                  { label: "Tradies", val: "15" },
                  { label: "Clients", val: "10" },
                  { label: "Pending Approval", val: "4"}
                ]} 
              />

              {/* 2. Quotes */}
              <StatCard 
                title="Memberships" 
                value="18" 
                trend="-2%"
                isUp={false}
                rows={[
                  { label: "Pro Tier", val: "12" },
                  { label: "Basic Tier", val: "6" },
                  { label: "Expiring Soon", val: "3" }
                ]} 
              />

              {/* 3. Jobs */}
              <StatCard 
                title="Quotes" 
                value="45" 
                trend="+8%"
                isUp={true}
                rows={[
                  { label: "Awaiting Response", val: "28" },
                  { label: "Accepted", val: "12" },
                  { label: "Declined", val: "5" }
                ]} 
              />

              {/* 4. Invoices */}
              <StatCard 
                title="Invoices" 
                value="29" 
                trend="+10%"
                isUp={true}
                rows={[
                  { label: "Paid", val: "21" },
                  { label: "Awaiting Payment", val: "8" }
                ]} 
              />

              {/* 5. Business Performance */}
              <StatCard 
                title="Revenue" 
                value="$12,234.00" 
                trend="+15%"
                isUp={true}
                rows={[
                  { label: "Subscriptions", val: "$4,500.00" },
                  { label: "Commissions", val: "$7,734.00" },
                  { label: "Net Profit", val: "$8,450.00" }
                ]} 
              />

              {/* 6. Expenses */}
              <StatCard 
                title="Expenses" 
                value="$1,200.00" 
                trend="+5%"
                isUp={false}
                rows={[
                  { label: "This Week", val: "$1,200.00" }
                ]} 
              />
            </div>

            {/* PHẦN BIỂU ĐỒ */}
            <div className="grid gap-4 md:grid-cols-2">
              <ChartPlaceholder 
                title="Clients by Service" 
                emptyText="No client data available" 
              />
              <ChartPlaceholder 
                title="Cumulative Client Growth" 
                emptyText="No client trend data available" 
              />
            </div>
          </div>
        </main>
      </main>
    </div>
  );
}

function StatCard({ title, value, rows, highlight = false, trend, isUp }) {
  return (
    <div className={`rounded-md border text-card-foreground cursor-pointer transition-all duration-200 hover:shadow-md ${highlight ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-card'}`}>
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="tracking-tight text-sm font-medium">{title}</div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md text-xs h-6 w-6 p-0 hover:bg-accent">
            <ExternalLink className="lucide lucide-external-link h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
        
          <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
            {isUp ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
            {trend}
          </div>
        </div>
        <div className="space-y-1 pt-2 border-t border-gray-100 mt-2">
          <div className="text-xs font-medium text-muted-foreground mb-1"></div>
          {rows.map((row, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="font-medium">{row.label}</span>
              <span className="text-muted-foreground">{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartPlaceholder({ title, emptyText }) {
  return (
    <div className="rounded-md border bg-card text-card-foreground">
      <div className="space-y-1.5 p-6 flex flex-row items-center justify-between">
        <div className="font-semibold leading-none tracking-tight">{title}</div>
        <button className="inline-flex items-center justify-center rounded-md text-xs h-8 w-8 p-0 hover:bg-accent">
          <ExternalLink className="lucide lucide-external-link h-4 w-4" />
        </button>
      </div>
      <div className="p-6 pt-0">
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Users className="lucide lucide-users h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{emptyText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}