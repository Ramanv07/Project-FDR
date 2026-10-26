import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../lib/constants';
import Button from '../../../components/ui/Button';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import {
  ShieldCheck,
  Building2,
  Landmark,
  FileCheck2,
  CheckCircle2,
  Lock,
  Fingerprint
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#080d19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Official Govt. of India Header */}
      <header className="bg-white dark:bg-[#0c1424] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="tricolor-stripe" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B1E36] to-[#16355C] text-amber-400 font-bold flex items-center justify-center text-lg shadow-sm border border-amber-500/30">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-950 dark:text-white font-display tracking-tight leading-tight">
                  All India Council for Technical Education
                </p>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  Govt. of India
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                National FDR Trust Ledger • Security Deposit Custody & Verification System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle size="sm" />
            <Link to={ROUTES.MOCK_BANK}>
              <Button variant="secondary" size="sm" icon={<Landmark className="w-3.5 h-3.5 text-blue-600" />}>
                <span className="hidden sm:inline">Bank Simulator</span>
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" size="sm" icon={<Lock className="w-3.5 h-3.5" />}>
                Portal Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Official Authority & FinTech Polish */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:bg-[#080d19] dark:from-[#0c1424] dark:via-[#09101f] dark:to-[#080d19] border-b border-slate-200 dark:border-slate-800 py-12 lg:py-16">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-800/60 text-blue-900 dark:text-blue-300 text-xs font-semibold mb-4 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>OFFICIAL REGULATORY TRUST LEDGER • AICTE NEW DELHI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white font-display tracking-tight leading-[1.15] mb-4">
              Cryptographic Custody & Audit of Technical Institution Security Deposits
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Mandatory national repository maintaining verified custody of Fixed Deposit Receipts pledged in favour of 
              <strong className="text-slate-900 dark:text-white font-semibold"> Member Secretary, AICTE</strong>. Equipped with PaddleOCR certificate scrutiny, bank direct reconciliation, and automated coverage gap audits.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link to={ROUTES.LOGIN}>
                <Button variant="primary" size="lg" icon={<Building2 className="w-4 h-4 text-amber-400" />}>
                  Access Institution Portal
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN}>
                <Button variant="secondary" size="lg" icon={<ShieldCheck className="w-4 h-4 text-blue-600" />}>
                  Officer Scrutiny Bureau
                </Button>
              </Link>
              <Link to={ROUTES.MOCK_BANK}>
                <Button variant="ghost" size="lg" icon={<Landmark className="w-4 h-4 text-slate-600 dark:text-slate-300" />}>
                  Core Bank Gateway
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Statutory KPI Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800">
            <div className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Guarantees Monitored</p>
              <p className="text-2xl font-bold font-display text-slate-950 dark:text-white">₹4,850+ Cr</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Active regulatory pledge</p>
            </div>
            <div className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Technical Institutions</p>
              <p className="text-2xl font-bold font-display text-slate-950 dark:text-white">11,840+</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">AICTE approved colleges</p>
            </div>
            <div className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Scrutiny Integrity</p>
              <p className="text-2xl font-bold font-display text-slate-950 dark:text-white">SHA-256</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-1">Immutable hash audit chain</p>
            </div>
            <div className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Coverage Gap Standard</p>
              <p className="text-2xl font-bold font-display text-slate-950 dark:text-white">0 Days</p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1">Continuous statutory cover</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: The 3 Authorised Portals */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            Designated Stakeholder Portals
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white font-display mt-3">
            Secure Role-Based Regulatory Access
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Select your assigned statutory interface to manage submissions, audits, or bank confirmations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Institution */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-900">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Technical Institution</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Portal A
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Designed for college management, registrars, and finance officers to pledge mandatory FDR security deposits.
              </p>

              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>PaddleOCR certificate extraction</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Pre-expiry automated renewal alerts</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Online lien release applications</span>
                </div>
              </div>
            </div>

            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary" className="w-full">
                Institution Login →
              </Button>
            </Link>
          </div>

          {/* Card 2: Officer Bureau (Featured) */}
          <div className="bg-gradient-to-b from-white to-blue-50/30 dark:from-[#0f172a] dark:to-[#13233e] rounded-2xl border-2 border-[#0F2444] dark:border-blue-500/50 p-6 flex flex-col justify-between shadow-md relative">
            <div className="absolute -top-3 right-6 bg-[#0F2444] text-amber-400 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-amber-500/40 tracking-wider">
              Authorised Regulators
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0F2444] text-white flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-950 dark:text-white font-display">AICTE Scrutiny Bureau</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-300">
                  Officers
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Dedicated workbench for AICTE regional directors and legal scrutiny officers for national deposit oversight.
              </p>

              <div className="space-y-2 border-t border-slate-200/80 dark:border-slate-800 pt-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>Three-way reconciliation matrix</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>Algorithmic FDR health scoring</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>Coverage gap violation audit trail</span>
                </div>
              </div>
            </div>

            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" className="w-full">
                Enter Scrutiny Console →
              </Button>
            </Link>
          </div>

          {/* Card 3: Bank Simulator */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-900">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Core Banking Gateway</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Simulated
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Inter-bank confirmation console simulating RBI scheduled bank responses and NeSL cryptographic verification.
              </p>

              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Direct lien confirmation dispatch</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Deposit mismatch exception triggers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Cryptographic token verification</span>
                </div>
              </div>
            </div>

            <Link to={ROUTES.MOCK_BANK}>
              <Button variant="secondary" className="w-full">
                Open Bank Simulator →
              </Button>
            </Link>
          </div>
        </div>

        {/* Live 5-Stage Verification Process Showcase */}
        <div className="mt-16 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase text-blue-700 dark:text-blue-400">Automated Pipeline</span>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white font-display mt-1">
                The 5-Stage FDR Statutory Lifecycle
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How security deposits are verified, locked, monitored, and safely released
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="pill-trust">
                <Fingerprint className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Zero Trust Architecture
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141f36] border border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-3">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Submission & OCR</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Institution uploads FDR certificate. PaddleOCR extracts principal, maturity, and joint lien clause.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141f36] border border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-3">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Bank Reconciliation</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated API request sent to issuing bank. Confirms lien endorsement and deposit balance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141f36] border border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-3">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Scrutiny & Ledger</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                AICTE Officer confirms 3-way match. Record appended to immutable SHA-256 hash ledger.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141f36] border border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-3">
                4
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Continuous Audit</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Timeline engine monitors maturity dates. Automatically flags lapses or coverage gaps.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141f36] border border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-3">
                5
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">3-Tier Release</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Upon 8-year statutory tenure completion, triple-authorised release order issued to bank.
              </p>
            </div>
          </div>
        </div>

        {/* Statutory Regulatory Directives */}
        <div className="mt-12 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            Statutory AICTE Approval Process Handbook (APH) Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-3 bg-slate-50 dark:bg-[#141f36] rounded-xl border border-slate-100 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">Clause 1.4: Mandatory Joint Lien</strong>
              Fixed deposits must carry explicit endorsement stating "Lien marked in favour of Member Secretary, AICTE, New Delhi". Unencumbered FDRs are void.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#141f36] rounded-xl border border-slate-100 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">Clause 2.1: Continuous Validity</strong>
              Institutions must renew deposits minimum 30 days prior to maturity. A single day of lapsed cover triggers statutory show-cause procedures.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#141f36] rounded-xl border border-slate-100 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">Clause 5.3: Release Authorization</strong>
              Deposit release is sanctioned strictly after tenure expiration, zero outstanding student grievances, and regional inspection clearance.
            </div>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="bg-slate-900 dark:bg-[#060a14] text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-sm">
                🏛️
              </div>
              <div>
                <p className="font-bold text-white font-display">All India Council for Technical Education (AICTE)</p>
                <p className="text-[11px] text-slate-500">Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Officer Login</Link>
              <Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Institution Portal</Link>
              <Link to={ROUTES.MOCK_BANK} className="hover:text-white transition-colors">Bank Simulator</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} AICTE FDR Trust Ledger. Ministry of Education, Government of India.</p>
            <div className="flex items-center gap-3">
              <span>SHA-256 Merkle Ledger</span>
              <span>•</span>
              <span>NeSL Protocol Standard</span>
              <span>•</span>
              <span>ISO 27001 Certified Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
