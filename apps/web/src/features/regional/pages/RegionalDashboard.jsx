import React, { useState, useMemo } from 'react';
import {
  Building2,
  Landmark,
  ShieldAlert,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Users,
  Eye,
  X,
  Phone,
  Mail,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AICTE_REGIONAL_OFFICES, getRegionalSummary } from '../data/regionalOfficesData';
import { formatIndianCurrency } from '../../../lib/format';

export default function RegionalDashboard() {
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [sortBy, setSortBy] = useState('vault'); // 'vault', 'fdrs', 'health', 'sla'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const summary = useMemo(() => getRegionalSummary(), []);

  const avgHealth = Math.round(summary.healthSum / summary.totalOffices);
  const avgSla = (summary.slaSum / summary.totalOffices).toFixed(1);

  // Available zones
  const zones = ['All', 'North', 'South', 'West', 'East', 'Central', 'North-East', 'North-West', 'South-West', 'South-Central'];

  // Filter & sort
  const filteredOffices = useMemo(() => {
    return AICTE_REGIONAL_OFFICES.filter((office) => {
      const matchZone = selectedZone === 'All' || office.zone === selectedZone;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        office.name.toLowerCase().includes(q) ||
        office.hq.toLowerCase().includes(q) ||
        office.code.toLowerCase().includes(q) ||
        office.director.toLowerCase().includes(q) ||
        office.jurisdictionStates.some((s) => s.toLowerCase().includes(q));
      return matchZone && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'vault') return b.stats.vaultAmountCr - a.stats.vaultAmountCr;
      if (sortBy === 'fdrs') return b.stats.totalFdrs - a.stats.totalFdrs;
      if (sortBy === 'health') return b.stats.healthScore - a.stats.healthScore;
      if (sortBy === 'sla') return b.stats.slaCompliance - a.stats.slaCompliance;
      return 0;
    });
  }, [search, selectedZone, sortBy]);

  // Chart data
  const chartData = useMemo(() => {
    return AICTE_REGIONAL_OFFICES.map((o) => ({
      name: o.code,
      fullName: o.name,
      vaultCr: o.stats.vaultAmountCr,
      fdrs: o.stats.totalFdrs,
      active: o.stats.activeFdrs,
      review: o.stats.inReview,
    }));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Header */}
      <div className="rounded-2xl bg-white dark:bg-[#131519] border border-zinc-200/90 dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              AICTE National Regulatory Framework • 12 Regional Directorates
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-display">
              Regional Offices FDR Custody & Scrutiny Matrix
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Consolidated real-time oversight of all 12 AICTE Regional Directorates and Camp Offices across India. Tracks FDR deposit pipelines, Core Banking API liens, compliance SLAs, and risk exposure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-all ${
                isRefreshing ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync Ledger
            </button>
            <a
              href="#chart-view"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
              National Analytics
            </a>
          </div>
        </div>

        {/* National Stats Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-5 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-100 dark:border-zinc-800/70">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Regional Offices</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">12</p>
            <p className="text-[11px] text-emerald-500 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Online
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-100 dark:border-zinc-800/70">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Total Vault Value</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">₹{summary.totalVaultCr.toFixed(1)} Cr</p>
            <p className="text-[11px] text-zinc-400 mt-1">Across 12 Jurisdictions</p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-100 dark:border-zinc-800/70">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Total FDRs Tracked</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{summary.totalFdrs.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-sky-500 mt-1">
              {((summary.totalActive / summary.totalFdrs) * 100).toFixed(1)}% Active Verified
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-100 dark:border-zinc-800/70">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Approved Institutes</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{summary.totalInstitutes.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-zinc-400 mt-1">Engineering & Tech</p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-100 dark:border-zinc-800/70">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">In-Review / AI Scrutiny</p>
            <p className="text-2xl font-bold text-sky-500 mt-1">{summary.totalInReview}</p>
            <p className="text-[11px] text-zinc-400 mt-1">Avg turnaround {avgSla}d</p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-100 dark:border-zinc-800/70">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Active Coverage Gaps</p>
            <p className="text-2xl font-bold text-rose-500 mt-1">{summary.totalDefaulters}</p>
            <p className="text-[11px] text-rose-500/90 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" /> Urgent Notice Active
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Comparison Chart */}
      <div id="chart-view" className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131519] border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              National FDR Custody Distribution by Regional Office
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Comparative volume of FDRs and total monetary vault custody (₹ in Crores) across all 12 AICTE Directorates
            </p>
          </div>
          <div className="text-xs text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700/60">
            National Avg Health: <span className="font-semibold text-emerald-500">{avgHealth}/100</span> • SLA Compliance:{' '}
            <span className="font-semibold text-sky-500">{avgSla}%</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} interval={0} angle={-25} textAnchor="end" />
              <YAxis yAxisId="left" orientation="left" stroke="#d97706" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#0284c7" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val, name) => [
                  name === 'Vault (₹ Cr)' ? `₹${val} Cr` : `${val} FDRs`,
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="vaultCr" name="Vault (₹ Cr)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="fdrs" name="Total FDRs" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Controls Bar: Search, Zone Filters, Sort, View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#131519] border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search regional office, HQ city, state, or director..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-[#1a1d24] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters and View controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-[#1a1d24] text-zinc-800 dark:text-zinc-200 text-xs focus:outline-hidden"
            >
              <option value="vault">Sort: Vault Value (₹ High to Low)</option>
              <option value="fdrs">Sort: Total FDRs (Highest)</option>
              <option value="health">Sort: Health Score (Highest)</option>
              <option value="sla">Sort: SLA Compliance %</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-100 dark:bg-[#1a1d24]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-800 text-amber-500 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Grid Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-zinc-800 text-amber-500 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Regulatory Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Zone Pill Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {zones.map((zone) => {
          const isActive = selectedZone === zone;
          const count =
            zone === 'All'
              ? AICTE_REGIONAL_OFFICES.length
              : AICTE_REGIONAL_OFFICES.filter((o) => o.zone === zone).length;
          if (zone !== 'All' && count === 0) return null;
          return (
            <button
              key={zone}
              type="button"
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-xs'
                  : 'bg-white dark:bg-[#16181d] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <span>{zone} Zone</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-amber-600/30 text-zinc-950 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffices.map((office) => {
            const activePercent = Math.round((office.stats.activeFdrs / office.stats.totalFdrs) * 100);
            return (
              <div
                key={office.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#131519] border border-zinc-200/90 dark:border-zinc-800/80 p-5 shadow-xs hover:shadow-md hover:border-amber-500/40 dark:hover:border-amber-500/30 transition-all duration-200"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold flex items-center justify-center font-mono text-xs flex-shrink-0">
                        {office.code.slice(0, 4)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                          {office.name}
                        </h3>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          HQ: <span className="font-medium text-zinc-700 dark:text-zinc-300">{office.hq}</span>
                          <span className="text-zinc-300 dark:text-zinc-700">•</span>
                          <span>{office.zone}</span>
                        </p>
                      </div>
                    </div>

                    {/* Health Badge */}
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          office.stats.healthScore >= 95
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                            : office.stats.healthScore >= 90
                            ? 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
                        }`}
                      >
                        {office.stats.healthScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Director & Contact */}
                  <div className="mt-3.5 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                    <p className="font-medium text-zinc-700 dark:text-zinc-300 truncate">
                      {office.director}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{office.email}</p>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-100 dark:border-zinc-800/80">
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Vault Value</p>
                      <p className="text-sm font-bold text-amber-500 mt-0.5">₹{office.stats.vaultAmountCr} Cr</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Total FDRs</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                        {office.stats.totalFdrs.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider">SLA Met</p>
                      <p className="text-sm font-bold text-emerald-500 mt-0.5">{office.stats.slaCompliance}%</p>
                    </div>
                  </div>

                  {/* FDR Pipeline Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 dark:text-zinc-400 font-medium">Compliance Pipeline</span>
                      <span className="text-emerald-500 font-semibold">{activePercent}% Active Verified</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex">
                      <div
                        style={{ width: `${activePercent}%` }}
                        className="bg-emerald-500 h-full rounded-l-full"
                        title={`Active: ${office.stats.activeFdrs}`}
                      />
                      <div
                        style={{ width: `${((office.stats.inReview + office.stats.bankPending) / office.stats.totalFdrs) * 100}%` }}
                        className="bg-sky-400 h-full"
                        title={`In Review / Bank Pending: ${office.stats.inReview + office.stats.bankPending}`}
                      />
                      <div
                        style={{ width: `${(office.stats.defaulterGaps / office.stats.totalFdrs) * 100}%` }}
                        className="bg-rose-500 h-full rounded-r-full"
                        title={`Defaulter Gaps: ${office.stats.defaulterGaps}`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                      <span>In Review: {office.stats.inReview}</span>
                      <span>Bank Pending: {office.stats.bankPending}</span>
                      <span className="text-rose-400 font-semibold">Gaps: {office.stats.defaulterGaps}</span>
                    </div>
                  </div>

                  {/* Jurisdiction State Tags */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {office.jurisdictionStates.map((state) => (
                      <span
                        key={state}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        {state}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                  <button
                    type="button"
                    onClick={() => setSelectedOffice(office)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 hover:bg-amber-500 hover:text-zinc-950 dark:bg-zinc-800/80 dark:hover:bg-amber-400 dark:hover:text-zinc-950 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect Directorate Status</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Regulatory Density Table View */
        <div className="rounded-2xl bg-white dark:bg-[#131519] border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#181a20] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold">Office Code & HQ</th>
                  <th className="py-3 px-4 font-semibold">Director In-Charge</th>
                  <th className="py-3 px-4 font-semibold text-right">Institutes</th>
                  <th className="py-3 px-4 font-semibold text-right">Total FDRs</th>
                  <th className="py-3 px-4 font-semibold text-right">Vault (₹ Cr)</th>
                  <th className="py-3 px-4 font-semibold text-right">Active Verified</th>
                  <th className="py-3 px-4 font-semibold text-right">In Review</th>
                  <th className="py-3 px-4 font-semibold text-right">Gaps / Risk</th>
                  <th className="py-3 px-4 font-semibold text-right">SLA Turnaround</th>
                  <th className="py-3 px-4 font-semibold text-center">Health</th>
                  <th className="py-3 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70 text-zinc-800 dark:text-zinc-200">
                {filteredOffices.map((office) => (
                  <tr
                    key={office.id}
                    className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 border border-amber-500/20 text-amber-500 font-semibold">
                          {office.code}
                        </span>
                        <span>{office.name}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        HQ: {office.hq} ({office.zone} Zone)
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[180px]">
                        {office.director.split('(')[0]}
                      </p>
                      <p className="text-[10px] text-zinc-400">{office.email}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {office.stats.institutesCount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-zinc-900 dark:text-white">
                      {office.stats.totalFdrs.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-500">
                      ₹{office.stats.vaultAmountCr} Cr
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-500 font-medium">
                      {office.stats.activeFdrs}
                      <span className="text-[10px] text-zinc-400 block">
                        {Math.round((office.stats.activeFdrs / office.stats.totalFdrs) * 100)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sky-400 font-medium">
                      {office.stats.inReview}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-500">
                      {office.stats.defaulterGaps}
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-600 dark:text-zinc-300">
                      {office.stats.avgTurnaroundDays}d ({office.stats.slaCompliance}%)
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          office.stats.healthScore >= 95
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
                        }`}
                      >
                        {office.stats.healthScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedOffice(office)}
                        className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Office Detail Modal / Drawer */}
      {selectedOffice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl text-zinc-900 dark:text-zinc-100 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold flex items-center justify-center font-mono text-sm">
                  {selectedOffice.code}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedOffice.name}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span>Headquarters: {selectedOffice.hq}</span>
                    <span>•</span>
                    <span className="text-amber-500 font-medium">{selectedOffice.zone} Zone</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOffice(null)}
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 pt-4">
              {/* Officer & Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-[#1a1d24] border border-zinc-200/80 dark:border-zinc-800">
                <div>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-wider">Director In-Charge</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {selectedOffice.director}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    {selectedOffice.email}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    {selectedOffice.phone}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-wider">Official Secretariat Address</p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
                    {selectedOffice.address}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-2 font-mono">
                    Jurisdiction: {selectedOffice.jurisdictionStates.join(', ')}
                  </p>
                </div>
              </div>

              {/* Stats Matrix 4-grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-200/60 dark:border-zinc-800">
                  <p className="text-[10px] text-zinc-400 uppercase">Vault Secured</p>
                  <p className="text-lg font-bold text-amber-500 mt-0.5">₹{selectedOffice.stats.vaultAmountCr} Cr</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-200/60 dark:border-zinc-800">
                  <p className="text-[10px] text-zinc-400 uppercase">Total FDR Count</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {selectedOffice.stats.totalFdrs.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-200/60 dark:border-zinc-800">
                  <p className="text-[10px] text-zinc-400 uppercase">Scrutiny SLA</p>
                  <p className="text-lg font-bold text-emerald-500 mt-0.5">{selectedOffice.stats.slaCompliance}%</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#181a20] border border-zinc-200/60 dark:border-zinc-800">
                  <p className="text-[10px] text-zinc-400 uppercase">Health Score</p>
                  <p className="text-lg font-bold text-sky-400 mt-0.5">{selectedOffice.stats.healthScore}/100</p>
                </div>
              </div>

              {/* State-wise breakdown table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  State-wise FDR Distribution in {selectedOffice.code}
                </h3>
                <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500">
                      <tr>
                        <th className="py-2 px-3">State / Union Territory</th>
                        <th className="py-2 px-3 text-right">Approved Colleges</th>
                        <th className="py-2 px-3 text-right">FDRs Tracked</th>
                        <th className="py-2 px-3 text-right">Vault (₹ Cr)</th>
                        <th className="py-2 px-3 text-center">Health</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {selectedOffice.stateBreakdown.map((sb) => (
                        <tr key={sb.state} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
                          <td className="py-2 px-3 font-semibold">{sb.state}</td>
                          <td className="py-2 px-3 text-right">{sb.institutes}</td>
                          <td className="py-2 px-3 text-right font-medium">{sb.fdrs}</td>
                          <td className="py-2 px-3 text-right text-amber-500 font-bold">₹{sb.vaultCr} Cr</td>
                          <td className="py-2 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              {sb.health}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Verification Logs */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Live Verification & Audit Stream ({selectedOffice.code})
                </h3>
                <div className="space-y-2">
                  {selectedOffice.recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-[#181a20] border border-zinc-200/70 dark:border-zinc-800 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{log.institute}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{log.action}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 capitalize">
                          {log.status.replace('_', ' ')}
                        </span>
                        <p className="text-[10px] text-zinc-400 mt-1">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-xs text-zinc-400">
                  Direct ledger sync with AICTE Central Custody Node
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Regional Audit Dossier for ${selectedOffice.name} prepared and downloaded.`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Regional Dossier
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOffice(null)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
