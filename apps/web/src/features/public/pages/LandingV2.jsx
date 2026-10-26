import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../lib/constants';
import Button from '../../../components/ui/Button';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import { ShieldCheck, Building2, Landmark, Lock } from 'lucide-react';

/*
  LANDING V2 — DESIGN PROTOTYPE
  Dark palette: pure oceanic navy (zero purple/red undertone)
    Page bg  → #060e18
    Surface  → #0a1727
    Raised   → #0e2035
    Blue     → #3888eb
    No glows, no borders
*/

const BLUE  = '#3888eb';
const SAGE  = '#62b082';
const SAND  = '#c7a464';
const ROSE  = '#c77884';
const MUTED = '#8295ac';

export default function LandingV2() {
  return (
    <>
      <style>{`
        .v2-root {
          --bg:      #F8FAFC;
          --surface: #ffffff;
          --raised:  #f1f5f9;
        }
        html.dark .v2-root {
          --bg:      #060e18;
          --surface: #0a1727;
          --raised:  #0e2035;
        }
        .v2-card    { background: var(--surface); }
        .v2-step    { background: var(--raised);  }
        html.dark .v2-hero-section { background: #060e18; }
        .v2-hero-section           { background: linear-gradient(180deg,#F8FAFC 0%,#eef2f8 100%); }
        html.dark .v2-section-label { color: ${BLUE}; }
        .v2-section-label           { color: #1d4ed8; }
        html.dark .v2-kpi-card { background: #0a1727; }
        .v2-kpi-card           { background: #ffffff; }
        html.dark .v2-featured-card { background: linear-gradient(160deg,#0e223d 0%,#091829 100%); }
        .v2-featured-card           { background: linear-gradient(160deg,#eff6ff 0%,#dbeafe 100%); }
        html.dark .v2-footer { background: #040810; }
        .v2-footer             { background: #0f172a; }
        html.dark .v2-header {
          background: rgba(6,14,24,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(56,136,235,.1);
        }
        .v2-header {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
        }
      `}</style>

      <div className="v2-root min-h-screen flex flex-col font-sans"
        style={{ background: 'var(--bg)', color: '#0f172a' }}>

        {/* ── Header ────────────────────────────────────────────── */}
        <header className="v2-header sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B1E36] to-[#16355C] text-amber-400 font-bold flex items-center justify-center text-lg">
                🏛️
              </div>
              <div>
                <p className="text-base font-bold text-slate-950 dark:text-white font-display tracking-tight leading-tight">
                  All India Council for Technical Education
                </p>
                <p className="text-xs sm:text-[13px] font-medium" style={{ color: MUTED }}>
                  Govt. of India &nbsp;•&nbsp; National FDR Trust Ledger &nbsp;•&nbsp; Deposit Custody &amp; Verification
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle size="sm" />
              <Link to={ROUTES.MOCK_BANK}>
                <Button variant="secondary" size="sm" icon={<Landmark className="w-3.5 h-3.5" style={{ color: BLUE }} />}>
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

        {/* ── Hero — centered ───────────────────────────────────── */}
        <section className="v2-hero-section relative py-20 lg:py-28 overflow-hidden">
          {/* Subtle grid background preserved from original design */}
          <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.045] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="v2-section-label text-xs sm:text-sm font-semibold uppercase tracking-widest mb-5">
                Official Regulatory Trust Ledger &nbsp;·&nbsp; AICTE New Delhi
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold text-slate-950 dark:text-white font-display tracking-tight leading-[1.15] mb-6">
                Cryptographic Custody &amp; Audit of Technical Institution Security Deposits
              </h1>
              <p className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: MUTED }}>
                Mandatory national repository for Fixed Deposit Receipts pledged in favour of{' '}
                <strong className="text-slate-900 dark:text-white font-semibold">Member Secretary, AICTE</strong> —
                with OCR scrutiny, bank reconciliation, and automated coverage gap audits.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="primary" size="lg" icon={<Building2 className="w-4 h-4" style={{ color: SAND }} />}>
                    Access Institution Portal
                  </Button>
                </Link>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="secondary" size="lg" icon={<ShieldCheck className="w-4 h-4" style={{ color: BLUE }} />}>
                    Officer Scrutiny Bureau
                  </Button>
                </Link>
                <Link to={ROUTES.MOCK_BANK}>
                  <Button variant="ghost" size="lg" icon={<Landmark className="w-4 h-4 text-slate-400" />}>
                    Core Bank Gateway
                  </Button>
                </Link>
              </div>
            </div>

            {/* KPI Strip — full width, below hero text */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
              {[
                { label: 'Guarantees Monitored', value: '₹4,850+ Cr', sub: 'Active regulatory pledge', color: SAGE },
                { label: 'Institutions',          value: '11,840+',    sub: 'AICTE approved colleges', color: BLUE },
                { label: 'Scrutiny Integrity',    value: 'SHA-256',    sub: 'Immutable hash ledger',   color: SAND },
                { label: 'Coverage Gap',          value: '0 Days',     sub: 'Continuous statutory cover', color: ROSE },
              ].map((k) => (
                <div key={k.label} className="v2-kpi-card rounded-xl p-5">
                  <p className="text-xs sm:text-sm font-semibold mb-2" style={{ color: MUTED }}>{k.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold font-display text-slate-950 dark:text-white">{k.value}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: k.color }}>{k.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Portal Cards ──────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex-1">

          <div className="text-center mb-16">
            <p className="v2-section-label text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
              Designated Stakeholder Portals
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 dark:text-white font-display">
              Secure Role-Based Access
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 — Institution */}
            <div className="v2-card rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${BLUE}18` }}>
                  <Building2 className="w-5 h-5" style={{ color: BLUE }} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">
                  Technical Institution
                </h3>
                <p className="text-sm leading-relaxed mb-8" style={{ color: MUTED }}>
                  For college management, registrars, and finance officers to pledge mandatory FDR security deposits via OCR-assisted submission.
                </p>
              </div>
              <Link to={ROUTES.LOGIN}>
                <Button variant="secondary" className="w-full">Institution Login →</Button>
              </Link>
            </div>

            {/* Card 2 — Officer (Featured) */}
            <div className="v2-featured-card rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: '#0F2444' }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: SAND }} />
                </div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white font-display mb-2">
                  AICTE Scrutiny Bureau
                </h3>
                <p className="text-sm leading-relaxed mb-8" style={{ color: MUTED }}>
                  Dedicated workbench for AICTE regional directors and scrutiny officers — three-way reconciliation, FDR health scoring, and coverage audit trails.
                </p>
              </div>
              <Link to={ROUTES.LOGIN}>
                <Button variant="primary" className="w-full">Enter Scrutiny Console →</Button>
              </Link>
            </div>

            {/* Card 3 — Bank */}
            <div className="v2-card rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${SAND}18` }}>
                  <Landmark className="w-5 h-5" style={{ color: SAND }} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">
                  Core Banking Gateway
                </h3>
                <p className="text-sm leading-relaxed mb-8" style={{ color: MUTED }}>
                  Simulates RBI scheduled bank responses — lien confirmation, deposit mismatch triggers, and NeSL cryptographic verification.
                </p>
              </div>
              <Link to={ROUTES.MOCK_BANK}>
                <Button variant="secondary" className="w-full">Open Bank Simulator →</Button>
              </Link>
            </div>
          </div>

          {/* ── 5-Stage Lifecycle ──────────────────────────────── */}
          <div className="v2-card rounded-2xl p-10 mt-24">
            <div className="text-center mb-12">
              <p className="v2-section-label text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">Automated Pipeline</p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white font-display">
                The 5-Stage FDR Statutory Lifecycle
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { n: 1, title: 'Submission & OCR',    desc: 'OCR extracts principal, maturity, and joint lien clause from the uploaded certificate.', color: BLUE },
                { n: 2, title: 'Bank Reconciliation', desc: 'Automated API confirms lien endorsement and deposit balance with the issuing bank.',      color: BLUE },
                { n: 3, title: 'Scrutiny & Ledger',   desc: 'Officer confirms 3-way match. Record appended to the immutable SHA-256 ledger.',          color: BLUE },
                { n: 4, title: 'Continuous Audit',    desc: 'Timeline engine flags coverage lapses and maturity gaps automatically.',                   color: BLUE },
                { n: 5, title: '3-Tier Release',      desc: 'Triple-authorised release order issued after 8-year statutory tenure completion.',          color: SAGE },
              ].map((s) => (
                <div key={s.n} className="v2-step rounded-xl p-5">
                  <div className="w-6 h-6 rounded-md text-white font-bold flex items-center justify-center text-xs mb-3"
                    style={{ background: s.color }}>
                    {s.n}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{s.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── APH Guidelines ────────────────────────────────── */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Clause 1.4', sub: 'Mandatory Joint Lien',  body: 'FDRs must state "Lien marked in favour of Member Secretary, AICTE, New Delhi". Unencumbered FDRs are void.' },
              { title: 'Clause 2.1', sub: 'Continuous Validity',   body: 'Renew minimum 30 days before maturity. One day of lapsed cover triggers statutory show-cause.' },
              { title: 'Clause 5.3', sub: 'Release Authorization', body: 'Release sanctioned after tenure expiry, zero student grievances, and regional inspection clearance.' },
            ].map((c) => (
              <div key={c.title} className="v2-step rounded-2xl p-5 text-sm leading-relaxed">
                <p className="v2-section-label text-xs font-bold uppercase tracking-widest mb-0.5">{c.title}</p>
                <strong className="text-slate-900 dark:text-slate-100 block mb-2 text-[15px]">{c.sub}</strong>
                <span style={{ color: MUTED }}>{c.body}</span>
              </div>
            ))}
          </div>
        </main>

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer className="v2-footer text-xs sm:text-sm py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8"
              style={{ borderBottom: '1px solid rgba(74,141,232,.08)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-400"
                  style={{ background: '#0a1727' }}>
                  🏛️
                </div>
                <div>
                  <p className="font-bold text-white font-display text-sm sm:text-base">All India Council for Technical Education (AICTE)</p>
                  <p className="text-xs" style={{ color: MUTED }}>Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to={ROUTES.LOGIN} className="hover:text-white transition-colors" style={{ color: MUTED }}>Officer Login</Link>
                <Link to={ROUTES.LOGIN} className="hover:text-white transition-colors" style={{ color: MUTED }}>Institution Portal</Link>
                <Link to={ROUTES.MOCK_BANK} className="hover:text-white transition-colors" style={{ color: MUTED }}>Bank Simulator</Link>
              </div>
            </div>
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: MUTED }}>
              <p>© {new Date().getFullYear()} AICTE FDR Trust Ledger. Ministry of Education, Government of India.</p>
              <div className="flex items-center gap-3">
                <span>SHA-256 Merkle Ledger</span><span>•</span>
                <span>NeSL Protocol Standard</span><span>•</span>
                <span>ISO 27001 Certified Security</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
