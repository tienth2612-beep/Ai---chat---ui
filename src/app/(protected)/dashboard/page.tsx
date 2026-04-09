"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type { DateRange } from "react-day-picker";
import {
  differenceInCalendarDays,
  endOfDay,
  format,
  startOfDay,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Cell,
  Tooltip,
} from "recharts";
import {
  ExternalLink,
  Calendar as CalendarIcon,
  ShieldCheck,
  History,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type LinePreset = "7d" | "30d" | "3m" | "1y";

function rangeDayCount(from: Date, to: Date) {
  return Math.max(1, differenceInCalendarDays(to, from) + 1);
}

function rangeForPreset(preset: LinePreset, end: Date): DateRange {
  const to = endOfDay(end);
  switch (preset) {
    case "7d":
      return { from: startOfDay(subDays(to, 6)), to };
    case "30d":
      return { from: startOfDay(subDays(to, 29)), to };
    case "3m":
      return { from: startOfDay(subMonths(to, 3)), to };
    case "1y":
      return { from: startOfDay(subYears(to, 1)), to };
    default:
      return { from: startOfDay(subDays(to, 29)), to };
  }
}

/** Mock revenue + bar mix that moves smoothly when the calendar range changes. */
function continuousRevenueMock(from: Date, to: Date) {
  const days = rangeDayCount(from, to);
  const wave = Math.sin(days * 0.07) * 0.12;
  const sub = Math.round(2400 + days * 55 + wave * 600);
  const comm = Math.round(4100 + days * 72 + wave * 800);
  const profit = Math.round(3600 + days * 68 + wave * 750);
  return { sub, comm, profit };
}

const REVENUE_LINE_BY_PRESET: Record<
  LinePreset,
  { labels: string[]; values: number[] }
> = {
  "7d": {
    labels: ["02/04", "03/04", "04/04", "05/04", "06/04", "07/04", "08/04"],
    values: [7.1, 7.8, 8.8, 9.3, 9.4, 11.2, 11.7],
  },
  "30d": {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
    values: [6.7, 7.6, 8.1, 9.7, 11.3, 12.2],
  },
  "3m": {
    labels: ["Month 1", "Month 2", "Month 3"],
    values: [9.6, 10.9, 12.0],
  },
  "1y": {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    values: [7.0, 8.7, 10.1, 11.6],
  },
};

const ENTITY_LINE_BY_PRESET: Record<LinePreset, { name: string; value: number }[]> = {
  "7d": [
    { name: "D1", value: 4.2 },
    { name: "D2", value: 4.8 },
    { name: "D3", value: 5.1 },
    { name: "D4", value: 5.6 },
    { name: "D5", value: 6.0 },
    { name: "D6", value: 6.4 },
    { name: "D7", value: 6.9 },
  ],
  "30d": [
    { name: "T1", value: 5.6 },
    { name: "T2", value: 6.3 },
    { name: "T3", value: 7.1 },
    { name: "T4", value: 8.2 },
    { name: "T5", value: 9.4 },
    { name: "T6", value: 10.2 },
  ],
  "3m": [
    { name: "M1", value: 8.4 },
    { name: "M2", value: 9.7 },
    { name: "M3", value: 10.8 },
  ],
  "1y": [
    { name: "Q1", value: 7.2 },
    { name: "Q2", value: 8.1 },
    { name: "Q3", value: 9.5 },
    { name: "Q4", value: 10.4 },
  ],
};

function formatKValue(v: number) {
  return `$${v}k`;
}

const PRESET_LABELS: { key: LinePreset; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "3m", label: "3 months" },
  { key: "1y", label: "1 year" },
];

export default function HitradiesDashboard() {
  const [activeTab, setActiveTab] = useState("entities");
  const [dateOpen, setDateOpen] = useState(false);
  const [linePreset, setLinePreset] = useState<LinePreset>("30d");
  const [range, setRange] = useState<DateRange | undefined>(() =>
    rangeForPreset("30d", new Date())
  );

  const effectiveRange = useMemo(() => {
    if (range?.from && range?.to) return { from: range.from, to: range.to };
    if (range?.from) return { from: range.from, to: range.from };
    const d = rangeForPreset("30d", new Date());
    return { from: d.from!, to: d.to! };
  }, [range]);

  const periodLabel = useMemo(
    () =>
      `${format(effectiveRange.from, "dd/MM/yyyy")} – ${format(effectiveRange.to, "dd/MM/yyyy")}`,
    [effectiveRange]
  );

  const daySpan = useMemo(
    () => rangeDayCount(effectiveRange.from, effectiveRange.to),
    [effectiveRange]
  );

  const applyLinePreset = useCallback((preset: LinePreset) => {
    const anchor = range?.to ?? range?.from ?? new Date();
    setRange(rangeForPreset(preset, anchor));
    setLinePreset(preset);
  }, [range?.to, range?.from]);

  const continuousRevenue = useMemo(
    () => continuousRevenueMock(effectiveRange.from, effectiveRange.to),
    [effectiveRange]
  );

  const revenueTrendData = useMemo(() => {
    const cfg = REVENUE_LINE_BY_PRESET[linePreset];
    return cfg.labels.map((name, i) => ({
      name,
      value: cfg.values[i] ?? 0,
    }));
  }, [linePreset]);

  const revenueSourceData = useMemo(
    () => [
      {
        name: "Subscriptions",
        value: continuousRevenue.sub / 1000,
        fill: "#6366f1",
      },
      {
        name: "Commissions",
        value: continuousRevenue.comm / 1000,
        fill: "#10b981",
      },
      {
        name: "Net Profit",
        value: continuousRevenue.profit / 1000,
        fill: "#f59e0b",
      },
    ],
    [continuousRevenue]
  );

  const entityTrendData = useMemo(
    () => ENTITY_LINE_BY_PRESET[linePreset],
    [linePreset]
  );

  const entityStatusData = useMemo(() => {
    const n = daySpan;
    return [
      {
        name: "Active",
        value: Math.min(10, Math.max(2, Math.round(4 + n * 0.12))),
      },
      {
        name: "Inactive",
        value: Math.min(10, Math.max(1, Math.round(1 + n * 0.05))),
      },
      {
        name: "Pending",
        value: Math.min(10, Math.max(1, Math.round(2 + n * 0.07))),
      },
    ];
  }, [daySpan]);

  const userKpis = useMemo(() => {
    const total = Math.min(48, Math.max(5, 5 + Math.floor(daySpan / 6)));
    const pro = Math.max(1, Math.floor(total * 0.42));
    const regular = Math.max(1, Math.floor(total * 0.28));
    const expiring = Math.max(0, Math.floor(total * 0.15));
    const inactive = Math.max(1, total - pro - regular - expiring);
    return { total, pro, regular, expiring, inactive };
  }, [daySpan]);

  const entityKpis = useMemo(() => {
    const total = Math.min(30, Math.max(6, 6 + Math.floor(daySpan / 5)));
    const active = Math.max(2, Math.round(total * 0.56));
    const inactive = Math.max(0, Math.round(total * 0.14));
    const pending = Math.max(1, total - active - inactive);
    return { total, active, inactive, pending };
  }, [daySpan]);

  const dateToolbar = (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full justify-start border-zinc-200 bg-white text-left font-normal sm:w-[260px]"
          >
            <CalendarIcon className="mr-2 size-4 text-zinc-500" />
            <span className="truncate text-xs sm:text-sm">{periodLabel}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(next) => {
              setRange(next);
              if (next?.from && next?.to) setDateOpen(false);
            }}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <div className="inline-flex flex-wrap rounded-md border border-zinc-200 bg-white p-1">
        {PRESET_LABELS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => applyLinePreset(key)}
            className={cn(
              "rounded px-2.5 py-1.5 text-xs font-medium transition-colors",
              linePreset === key
                ? "bg-indigo-500 text-white"
                : "text-zinc-500 hover:bg-zinc-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
          
          {/* TOP ROW: 3 KPI CARDS */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard 
              title="Total users" value={String(userKpis.total)} trend="+12%" isUp={true} 
              isActive={activeTab === "users"} 
              onClick={() => setActiveTab("users")}
              detailHref="/admin/users"
              tooltipMsg="Go to user management"
              rows={[
                { label: "Pro Tier", val: String(userKpis.pro) },
                { label: "Basic Tier", val: String(userKpis.regular) },
                { label: "Expiring soon", val: String(userKpis.expiring) },
              ]} 
            />
            <StatCard 
              title="Business Entities" value={String(entityKpis.total)} trend="-2%" isUp={false} 
              isActive={activeTab === "entities"} 
              onClick={() => setActiveTab("entities")}
              detailHref="/admin/companies"
              tooltipMsg="View companies list"
              rows={[
                { label: "Active", val: String(entityKpis.active) },
                { label: "Inactive", val: String(entityKpis.inactive) },
                { label: "Pending Review", val: String(entityKpis.pending) },
              ]} 
            />
            <StatCard 
              title="Revenue" value={`$${(continuousRevenue.sub + continuousRevenue.comm).toLocaleString()}`} trend="+15%" isUp={true} 
              isActive={activeTab === "revenue"} 
              onClick={() => setActiveTab("revenue")}
              detailHref="/admin/finance"
              tooltipMsg="Totals for the selected date range (mock)"
              rows={[
                { label: "Subscriptions", val: `$${continuousRevenue.sub.toLocaleString()}` },
                { label: "Commissions", val: `$${continuousRevenue.comm.toLocaleString()}` },
                { label: "Net Profit", val: `$${continuousRevenue.profit.toLocaleString()}` },
              ]} 
            />
          </div>

          {/* BOTTOM ROW: TAB DETAIL CONTENT */}
          <div className="grid gap-4 md:grid-cols-3">
            
            <div className="md:col-span-2 rounded-2xl border bg-white p-6 sm:p-8 shadow-sm min-h-[420px] min-w-0 overflow-hidden">
              
              {/* --- TAB 1: USERS ANALYTICS --- */}
              {activeTab === "users" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-blue-600">Users Engagement</h2>
                      <p className="text-xs text-zinc-500 font-medium">Comparison between account tiers and activity levels</p>
                    </div>
                    {dateToolbar}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                    <div className="lg:col-span-2 bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50">
                      <div className="flex items-end justify-around h-48 gap-4 px-4 relative">
                        <div className="absolute inset-x-0 top-0 h-px bg-blue-200/20" />
                        <div className="absolute inset-x-0 top-2/4 h-px bg-blue-200/20" />
                        <BarColumn label="Pro" value={userKpis.pro} total={userKpis.total} color="bg-blue-600" />
                        <BarColumn label="Regular" value={userKpis.regular} total={userKpis.total} color="bg-zinc-400" />
                        <BarColumn label="Expiring" value={userKpis.expiring} total={userKpis.total} color="bg-amber-500" />
                        <BarColumn label="Inactive" value={userKpis.inactive} total={userKpis.total} color="bg-rose-500" />
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
                      <MiniMetricCard label="Active Now" value={String(8 + (daySpan % 9))} sub="Online users" color="text-emerald-600" />
                      <MiniMetricCard label="New Signups" value={`+${2 + (daySpan % 5)}`} sub="In selected range" color="text-blue-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB 2: ENTITIES ANALYTICS --- */}
              {activeTab === "entities" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900">Business Entity Analytics</h2>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Line chart follows <span className="font-semibold text-zinc-600">{PRESET_LABELS.find((p) => p.key === linePreset)?.label}</span>
                        . Bar chart updates with the date range.
                      </p>
                    </div>
                    {dateToolbar}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Company Status</h3>
                      <div className="min-h-[11rem] overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50/30">
                        <div className="h-44 w-full min-w-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={entityStatusData} margin={{ top: 8, right: 4, left: 0, bottom: 4 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                              <YAxis
                                tick={{ fontSize: 10, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 10]}
                                ticks={[0, 3, 5, 8, 10]}
                              />
                              <Tooltip cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={900}>
                                {entityStatusData.map((entry) => (
                                  <Cell
                                    key={entry.name}
                                    fill={
                                      entry.name === "Active"
                                        ? "#10b981"
                                        : entry.name === "Inactive"
                                        ? "#6366f1"
                                        : "#f59e0b"
                                    }
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Registration Trend</h3>
                      <div className="overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50/30">
                        <div className="h-44 w-full min-w-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={entityTrendData} margin={{ top: 8, right: 4, left: 0, bottom: 4 }}>
                              <defs>
                                <linearGradient id="entityTrend" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                              <YAxis
                                tick={{ fontSize: 10, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                                domain={["auto", "auto"]}
                              />
                              <Tooltip cursor={{ stroke: "#cbd5e1" }} />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#6366f1"
                                fill="url(#entityTrend)"
                                strokeWidth={2}
                                animationDuration={900}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Company List</h3>
                    <div className="rounded-xl border border-zinc-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-zinc-50 text-zinc-500 text-xs">
                          <tr>
                            <th className="text-left px-4 py-3 font-semibold">Company Name</th>
                            <th className="text-left px-4 py-3 font-semibold">Region</th>
                            <th className="text-left px-4 py-3 font-semibold">Status</th>
                            <th className="text-left px-4 py-3 font-semibold">Registration Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                          <tr>
                            <td className="px-4 py-3 font-medium">Linhdtl's Business</td>
                            <td className="px-4 py-3">Canberra, ACT</td>
                            <td className="px-4 py-3"><span className="rounded-full bg-emerald-50 text-emerald-600 px-2 py-0.5 font-semibold">Active</span></td>
                            <td className="px-4 py-3">03/04/2026</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-medium">Hitradies</td>
                            <td className="px-4 py-3">Canberra, ACT</td>
                            <td className="px-4 py-3"><span className="rounded-full bg-emerald-50 text-emerald-600 px-2 py-0.5 font-semibold">Active</span></td>
                            <td className="px-4 py-3">03/04/2026</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-medium">Hearts and Minds</td>
                            <td className="px-4 py-3">-</td>
                            <td className="px-4 py-3"><span className="rounded-full bg-zinc-100 text-zinc-600 px-2 py-0.5 font-semibold">Inactive</span></td>
                            <td className="px-4 py-3">03/04/2026</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-medium">Bach Painting</td>
                            <td className="px-4 py-3">-</td>
                            <td className="px-4 py-3"><span className="rounded-full bg-amber-50 text-amber-600 px-2 py-0.5 font-semibold">Pending</span></td>
                            <td className="px-4 py-3">03/04/2026</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-medium">Google Australia</td>
                            <td className="px-4 py-3">23423, 42342</td>
                            <td className="px-4 py-3"><span className="rounded-full bg-emerald-50 text-emerald-600 px-2 py-0.5 font-semibold">Active</span></td>
                            <td className="px-4 py-3">03/04/2026</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-zinc-400">Showing 1–5 of 8 results</p>
                  </div>
                </div>
              )}

              {/* --- TAB 3: REVENUE ANALYTICS --- */}
              {activeTab === "revenue" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-w-0">
                  <div className="mb-6 flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900">Revenue Analytics</h2>
                      <p className="text-sm text-zinc-500">
                        Revenue trends and source analysis over time
                      </p>
                    </div>
                    {dateToolbar}
                    <p className="text-[10px] text-zinc-400">
                      Subscriptions, Commissions, and Net Profit follow the selected dates. Line chart follows preset periods.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 min-w-0">
                    <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-5 text-center shadow-sm min-w-0">
                      <span className="text-xl sm:text-2xl font-bold text-indigo-600 block mb-1 tabular-nums">${continuousRevenue.sub.toLocaleString()}.00</span>
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Subscriptions</span>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-5 text-center shadow-sm min-w-0">
                      <span className="text-xl sm:text-2xl font-bold text-emerald-500 block mb-1 tabular-nums">${continuousRevenue.comm.toLocaleString()}.00</span>
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Commissions</span>
                    </div>
                    <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-5 text-center shadow-sm min-w-0">
                      <span className="text-xl sm:text-2xl font-bold text-amber-500 block mb-1 tabular-nums">${continuousRevenue.profit.toLocaleString()}.00</span>
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Net Profit</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2 min-w-0">
                    <div className="space-y-3 min-w-0">
                      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">REVENUE TREND</h3>
                      <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50/30">
                        <div className="h-44 w-full min-w-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrendData} margin={{ top: 8, right: 4, left: 0, bottom: 4 }}>
                              <defs>
                                <linearGradient id="revenueTrend" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                              <YAxis
                                tick={{ fontSize: 10, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={formatKValue}
                                domain={[0, "dataMax + 2"]}
                              />
                              <Tooltip formatter={(value: number | string) => [`$${Number(value).toFixed(1)}k`, "Revenue"]} cursor={{ stroke: "#cbd5e1" }} />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#6366f1"
                                fill="url(#revenueTrend)"
                                strokeWidth={2}
                                animationDuration={900}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 min-w-0">
                      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">REVENUE SOURCE COMPARISON</h3>
                      <div className="min-h-[11rem] min-w-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50/30">
                        <div className="h-44 w-full min-w-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueSourceData} margin={{ top: 8, right: 4, left: 0, bottom: 4 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                              <YAxis
                                tick={{ fontSize: 10, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={formatKValue}
                                domain={[0, "dataMax + 2"]}
                              />
                              <Tooltip formatter={(value: number | string) => [`$${Number(value).toFixed(2)}k`, "Value"]} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={900}>
                                {revenueSourceData.map((item) => (
                                  <Cell key={item.name} fill={item.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
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
    </div>
  );
}

// --- SUB-COMPONENTS ---

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
               {tooltipMsg || "View details"}
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

function BarColumn({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
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

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`size-2 rounded-full ${color}`} />
      <span className="text-[9px] font-bold text-zinc-400 tracking-tighter uppercase">{label}</span>
    </div>
  );
}

function MiniMetricCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
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

function ActivityDot({ label, time, color }: { label: string; time: string; color: string }) {
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