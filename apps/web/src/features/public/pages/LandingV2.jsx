import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../lib/constants';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldCheck, Building2, Landmark, Lock, ArrowRight, TrendingUp, Shield, Cpu } from 'lucide-react';

/*
  LANDING V3 — Dual-mode · Fixes:
  ─────────────────────────────────────
  • No badges anywhere — they look cheap
  • Light mode: flat clean design, no glow, teal (#0d9488) accent not green
  • Dark mode: all muted text bumped to #8aabb8 (readable)
  • Dots: high opacity (0.14 dark, 0.12 light) so they're actually visible
  • Layer order: dots → glow (dark only) → content
*/

export default function LandingV2() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800;900&display=swap');

        .v3 *, .v3 *::before, .v3 *::after {
          box-sizing: border-box;
          margin: 0; padding: 0;
          font-family: 'Jost', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ══════════════════ ROOT ══════════════════ */
        .v3 {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        .v3.dark { background: #02060d; color: #e2eefb; }
        .v3.light { background: #f8fafc; color: #0f172a; }

        /* ══════════════════ LAYER 0: DOTS ══════════════════ */
        .v3-dots {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
        }
        /* Dark dots: crisp, subtle, not washed out */
        .v3.dark .v3-dots {
          background-image: radial-gradient(rgba(147, 197, 253, 0.8) 1.1px, transparent 1.1px);
          background-size: 24px 24px;
          opacity: 0.10;
        }
        /* Light dots: slate dots */
        .v3.light .v3-dots {
          background-image: radial-gradient(rgba(100, 116, 139, 1) 1.2px, transparent 1.2px);
          background-size: 24px 24px;
          opacity: 0.12;
        }

        /* ══════════════════ LAYER 1: GLOW (dark only, FULL-WIDTH HORIZON RISING SUN) ══════════════════ */
        .v3-glow {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
        }
        /* Pure elliptical rising sun arc (NO linear gradient rectangle) */
        .v3.dark .v3-glow {
          background:
            radial-gradient(ellipse 115% 70% at 50% 100%, rgba(2, 132, 199, 0.40) 0%, rgba(14, 165, 233, 0.17) 35%, rgba(56, 189, 248, 0.04) 60%, transparent 75%);
        }
        /* Light: NO glow — pure flat clean */
        .v3.light .v3-glow { background: none; }

        /* ══════════════════ LAYER 2: CONTENT ══════════════════ */
        .v3-content { position: relative; z-index: 2; }

        /* ══════════════════ FLOATING PILL NAVBAR ══════════════════ */
        .v3-header-wrap {
          position: sticky; top: 20px; z-index: 50; width: 100%;
          max-width: 1140px; margin: 0 auto; padding: 0 20px;
          pointer-events: none;
        }
        .v3-header {
          pointer-events: auto; width: 100%; height: 58px;
          border-radius: 9999px; display: flex; align-items: center;
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          transition: all .25s ease;
        }
        .v3.dark .v3-header {
          background: rgba(5, 12, 22, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow: 0 12px 36px -4px rgba(0, 0, 0, 0.55);
        }
        .v3.light .v3-header {
          background: rgba(255, 255, 255, 0.90);
          border: 1px solid #e2e8f0;
          box-shadow: 0 6px 24px -2px rgba(15, 23, 42, 0.07);
        }
        .v3-header-inner {
          width: 100%; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }

        /* ══════════════════ CARDS (NO GLOW, CLEAN SLEEK BORDERS) ══════════════════ */
        /* DARK: Sleek deep navy cards with clean subtle border, ZERO glow */
        .v3.dark .card {
          background: rgba(5, 12, 22, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          border-radius: 18px;
          transition: border-color .2s, transform .2s;
        }
        .v3.dark .card:hover {
          border-color: rgba(255, 255, 255, 0.14);
          transform: translateY(-2px);
        }
        .v3.dark .card-featured {
          background: rgba(7, 18, 35, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.10);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-radius: 18px;
        }
        .v3.dark .card-inner {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        /* LIGHT: Flat clean cards — NO glow */
        .v3.light .card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: border-color .2s, transform .2s;
        }
        .v3.light .card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }
        .v3.light .card-featured {
          background: linear-gradient(160deg, #eff6ff 0%, #dbeafe 100%);
          border: 1.5px solid #bfdbfe;
          border-radius: 16px;
        }
        .v3.light .card-inner {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        /* ══════════════════ BUTTONS (NO GLOW) ══════════════════ */
        .btn {
          display: inline-flex; align-items: center; gap: 8px;
          border-radius: 12px; font-weight: 600; font-size: 14px;
          letter-spacing: 0.01em; cursor: pointer; text-decoration: none;
          transition: all .2s ease; white-space: nowrap;
        }
        .btn-lg  { padding: 13px 28px; font-size: 15px; }
        .btn-sm  { padding: 7px 15px; font-size: 13px; border-radius: 10px; }

        /* Dark primary — oceanic blue, ZERO glow shadow */
        .v3.dark .btn-primary {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff;
        }
        .v3.dark .btn-primary:hover {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          transform: translateY(-1px);
        }
        /* Light primary — original classic blue, ZERO glow shadow */
        .v3.light .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border: 1px solid #1d4ed8;
          color: #fff;
        }
        .v3.light .btn-primary:hover {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          transform: translateY(-1px);
        }

        /* Dark ghost — clean subtle, ZERO glow */
        .v3.dark .btn-ghost {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #c5dff8;
          backdrop-filter: blur(8px);
        }
        .v3.dark .btn-ghost:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          color: #fff;
        }
        /* Light ghost */
        .v3.light .btn-ghost {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
        }
        .v3.light .btn-ghost:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        /* ══════════════════ TYPOGRAPHY ══════════════════ */
        .t-hero { font-size: clamp(1.85rem, 5.5vw, 3.4rem); font-weight: 800; letter-spacing: -0.025em; line-height: 1.15; word-break: break-word; }
        .t-h2   { font-size: clamp(1.35rem, 3.5vw, 2.1rem); font-weight: 700; letter-spacing: -0.02em; }
        .t-h3   { font-size: 1.05rem; font-weight: 700; letter-spacing: -0.01em; }
        .t-stat { font-size: clamp(1.4rem, 2.8vw, 2rem); font-weight: 800; letter-spacing: -0.03em; }
        .t-label{ font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        .t-body { font-size: clamp(0.9rem, 2.2vw, 1rem); font-weight: 400; line-height: 1.65; }

        /* Dark text colors — crisp oceanic readable */
        .v3.dark .c-primary { color: #f0f7ff; }
        .v3.dark .c-body    { color: #a4c3e2; }
        .v3.dark .c-muted   { color: #6a8ea8; }
        .v3.dark .c-accent  { color: #38bdf8; }

        /* Light text colors — clean original slate */
        .v3.light .c-primary { color: #0f172a; }
        .v3.light .c-body    { color: #475569; }
        .v3.light .c-muted   { color: #64748b; }
        .v3.light .c-accent  { color: #2563eb; }

        /* Hero gradient text */
        .v3.dark .grad-text {
          background: linear-gradient(130deg, #7dd3fc 10%, #bae6fd 55%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .v3.light .grad-text {
          background: linear-gradient(130deg, #1d4ed8 10%, #2563eb 55%, #0284c7 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* Shimmer underline */
        .shimmer {
          height: 2px; width: 72px; margin: 0 auto; border-radius: 2px; opacity: 0.60;
        }
        .v3.dark  .shimmer { background: linear-gradient(90deg, transparent, #38bdf8, transparent); }
        .v3.light .shimmer { background: linear-gradient(90deg, transparent, #2563eb, transparent); }

        /* ══════════════════ DIVIDER ══════════════════ */
        .divider { height: 1px; border: none; }
        .v3.dark  .divider { background: rgba(255, 255, 255, 0.07); }
        .v3.light .divider { background: #e2e8f0; }

        /* ══════════════════ ICON RING ══════════════════ */
        .icon-ring {
          width: 44px; height: 44px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .v3.dark  .icon-ring-blue   { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); }
        .v3.dark  .icon-ring-amber  { background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.15); }
        .v3.light .icon-ring-blue   { background: rgba(37, 99, 235, 0.08);   border: 1px solid rgba(37, 99, 235, 0.18); }
        .v3.light .icon-ring-amber  { background: rgba(245, 158, 11, 0.08);  border: 1px solid rgba(245, 158, 11, 0.18); }

        /* Step number */
        .step-n {
          width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
          color: white; font-size: 12px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .v3.dark  .step-n { background: linear-gradient(135deg, #0284c7, #0369a1); }
        .v3.light .step-n { background: linear-gradient(135deg, #2563eb, #1d4ed8); }

        /* ══════════════════ FOOTER ══════════════════ */
        .v3-footer { backdrop-filter: blur(14px); }
        .v3.dark  .v3-footer { background: rgba(2, 6, 13, 0.96); border-top: 1px solid rgba(255, 255, 255, 0.07); }
        .v3.light .v3-footer { background: #ffffff;             border-top: 1px solid #e2e8f0; }

        /* Footer links */
        .fl { text-decoration: none; font-weight: 500; font-size: 13px; transition: color .2s; }
        .v3.dark  .fl { color: #6a8ea8; } .v3.dark  .fl:hover { color: #f0f7ff; }
        .v3.light .fl { color: #64748b; } .v3.light .fl:hover { color: #0f172a; }

        /* ══════════════════ ANIMATIONS ══════════════════ */
        @keyframes fi { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }
        .fi1 { animation: fi .55s ease both .05s; }
        .fi2 { animation: fi .55s ease both .18s; }
        .fi3 { animation: fi .55s ease both .30s; }
        .fi4 { animation: fi .55s ease both .44s; }
        .fi5 { animation: fi .55s ease both .56s; }

        /* ══════════════════ RESPONSIVE ADAPTATIONS & STRUCTURAL CSS ══════════════════ */
        .v3-brand {
          display: flex; align-items: center; gap: 10px; min-width: 0; flex-shrink: 1;
        }
        .v3-brand-logo {
          width: 36px; height: 36px; border-radius: 10px; font-size: 17px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .v3.dark .v3-brand-logo {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.20), rgba(2, 132, 199, 0.40));
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .v3.light .v3-brand-logo {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(29, 78, 216, 0.25));
          border: 1px solid #bfdbfe;
        }
        .v3-brand-text { display: flex; flex-direction: column; min-width: 0; }
        .v3-brand-title {
          font-size: 14px; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .v3-brand-sub {
          font-size: 11px; font-weight: 500; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .v3-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .v3-status-badge {
          font-size: 11.5px; font-weight: 500; display: inline-flex; align-items: center; gap: 5px; margin-right: 4px;
        }
        .v3-status-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #10b981; display: inline-block;
        }
        .v3-btn-short { display: none; }
        .v3-btn-full { display: inline; }

        .v3-hero { padding: 88px 24px 64px; text-align: center; }
        .v3-hero-inner { max-width: 760px; margin: 0 auto; }
        .v3-hero-cta { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
        .v3-kpi-grid {
          max-width: 980px; margin: 64px auto 0;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
        }
        .v3-kpi-card { padding: 22px; text-align: left; }
        .v3-section { padding: 0 24px 72px; }
        .v3-section-inner { max-width: 1100px; margin: 0 auto; }
        .v3-section-head { text-align: center; margin-bottom: 44px; }
        .v3-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .v3-lifecycle-card { padding: 40px 34px; }
        .v3-lifecycle-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .v3-clauses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        @media (max-width: 992px) {
          .v3-brand-sub { display: none !important; }
          .v3-status-badge { display: none !important; }
          .v3-kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 44px; }
          .v3-cards-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; gap: 16px; }
          .v3-lifecycle-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .v3-clauses-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; gap: 12px; }
        }

        @media (max-width: 768px) {
          .v3-header-wrap { top: 10px; padding: 0 12px; }
          .v3-header { height: 52px; border-radius: 9999px; }
          .v3-header-inner { padding: 0 12px; }
          .v3-bank-btn { display: none !important; }
          .v3-btn-full { display: none !important; }
          .v3-btn-short { display: inline !important; }
          .v3-hero { padding: 36px 16px 32px !important; }
          .v3-hero-cta {
            flex-direction: column !important;
            width: 100% !important;
            max-width: 320px !important;
            margin: 0 auto !important;
            gap: 10px !important;
          }
          .v3-hero-cta .btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 12px 20px !important;
          }
          .v3-kpi-grid { margin-top: 32px !important; gap: 8px !important; }
          .v3-kpi-card { padding: 14px 12px !important; }
          .v3-kpi-card .t-stat { font-size: 1.3rem !important; }
          .v3-kpi-card .t-label { font-size: 10px !important; }
          .v3-section { padding: 0 16px 44px !important; }
          .v3-section-head { margin-bottom: 28px !important; }
          .v3-cards-grid .card, .v3-cards-grid .card-featured { padding: 22px 18px !important; }
          .v3-lifecycle-card { padding: 22px 14px !important; }
          .v3-lifecycle-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
          .v3-footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .v3-footer-links { width: 100% !important; justify-content: space-between !important; gap: 12px !important; flex-wrap: wrap !important; }
        }

        @media (max-width: 420px) {
          .v3-header-wrap { top: 8px; padding: 0 8px; }
          .v3-header { height: 48px; }
          .v3-header-inner { padding: 0 10px; }
          .v3-brand-title { font-size: 13px !important; }
          .v3-brand-logo { width: 30px; height: 30px; font-size: 14px; }
          .v3-signin-btn { padding: 5px 10px !important; font-size: 12px !important; }
          .v3-hero { padding: 28px 10px 22px !important; }
          .t-hero { font-size: clamp(1.65rem, 6.5vw, 2.2rem) !important; }
          .v3-kpi-grid { gap: 6px !important; }
          .v3-kpi-card { padding: 12px 10px !important; }
          .v3-section { padding: 0 10px 36px !important; }
        }

        @media (max-width: 330px) {
          .v3-kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className={`v3 ${isDark ? 'dark' : 'light'}`}>

        {/* Layer 0 — Dots */}
        <div className="v3-dots" aria-hidden />

        {/* Layer 1 — Glow (dark mode only) */}
        <div className="v3-glow" aria-hidden />

        {/* Layer 2 — Content */}
        <div className="v3-content">

          {/* ══ FLOATING PILL NAVBAR ══ */}
          <div className="v3-header-wrap">
            <header className="v3-header">
              <div className="v3-header-inner">
                <div className="v3-brand">
                  <div className="v3-brand-logo">
                    <Landmark size={18} className={isDark ? 'text-[#38bdf8]' : 'text-[#2563eb]'} />
                  </div>
                  <div className="v3-brand-text">
                    <span className="c-primary v3-brand-title">AICTE FDR Ledger</span>
                    <span className="c-muted v3-brand-sub">National Security Deposit Regulatory Vault</span>
                  </div>
                </div>
                <div className="v3-actions">
                  <ThemeToggle size="sm" />
                  <Link to={ROUTES.MOCK_BANK} className="btn btn-ghost btn-sm v3-bank-btn" style={{ textDecoration:'none', borderRadius:9999 }}>
                    <Landmark size={13} /> <span>Bank Simulator</span>
                  </Link>
                  <Link to={ROUTES.LOGIN} className="btn btn-primary btn-sm v3-signin-btn" style={{ textDecoration:'none', borderRadius:9999 }}>
                    <Lock size={13} />
                    <span className="v3-btn-full">Portal Sign In</span>
                    <span className="v3-btn-short">Sign In</span>
                  </Link>
                </div>
              </div>
            </header>
          </div>

          {/* ══ HERO ══ */}
          <section className="v3-hero">
            <div className="v3-hero-inner">

              <h1 className="t-hero c-primary fi2" style={{ marginBottom:20 }}>
                Cryptographic Custody &amp; Audit of{' '}
                <span className="grad-text">Institution Security Deposits</span>
              </h1>

              <div className="shimmer fi2" style={{ marginBottom:22 }} />

              <p className="t-body c-body fi3" style={{ maxWidth:570, margin:'0 auto 34px' }}>
                Mandatory national repository for Fixed Deposit Receipts pledged in favour of{' '}
                <strong className="c-primary" style={{ fontWeight:600 }}>Member Secretary, AICTE</strong>
                {' '}— with OCR scrutiny, bank reconciliation, and automated coverage gap audits.
              </p>

              <div className="fi4 v3-hero-cta">
                <Link to={ROUTES.LOGIN} className="btn btn-primary btn-lg" style={{ textDecoration:'none' }}>
                  <Building2 size={16} /> Access Institution Portal
                </Link>
                <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-lg" style={{ textDecoration:'none' }}>
                  <ShieldCheck size={16} /> Officer Scrutiny Bureau
                </Link>
                <Link to={ROUTES.MOCK_BANK} className="btn btn-ghost btn-lg" style={{ textDecoration:'none' }}>
                  <Landmark size={16} /> Core Bank Gateway
                </Link>
              </div>
            </div>

            {/* KPI strip — NO badges, just clean stat + label */}
            <div className="fi5 v3-kpi-grid">
              {[
                { label:'Guarantees Monitored', value:'₹4,850+ Cr', sub:'Active regulatory pledge' },
                { label:'Institutions Covered',  value:'11,840+',   sub:'AICTE approved colleges' },
                { label:'Scrutiny Integrity',    value:'SHA-256',   sub:'Immutable hash ledger' },
                { label:'Coverage Gap',          value:'0 Days',    sub:'Continuous statutory cover' },
              ].map(k => (
                <div key={k.label} className="card v3-kpi-card">
                  <div className="t-label c-muted" style={{ marginBottom:9 }}>{k.label}</div>
                  <div className="t-stat c-primary" style={{ marginBottom:5 }}>{k.value}</div>
                  <div className="c-accent" style={{ fontSize:12, fontWeight:500 }}>{k.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ PORTAL CARDS ══ */}
          <section className="v3-section">
            <div className="v3-section-inner">
              <div className="v3-section-head">
                <div className="t-label c-muted" style={{ marginBottom:10 }}>Designated Stakeholder Portals</div>
                <h2 className="t-h2 c-primary">Secure Role-Based Access</h2>
              </div>

              <div className="v3-cards-grid">

                {/* Institution */}
                <div className="card" style={{ padding:'30px 26px' }}>
                  <div className="icon-ring icon-ring-blue" style={{ marginBottom:20 }}>
                    <Building2 size={19} color={isDark ? '#38bdf8' : '#2563eb'} />
                  </div>
                  <h3 className="t-h3 c-primary" style={{ marginBottom:10 }}>Technical Institution</h3>
                  <p className="t-body c-body" style={{ fontSize:14, marginBottom:28 }}>
                    For college management, registrars, and finance officers to pledge mandatory FDR security deposits via OCR-assisted submission and automated bank verification.
                  </p>
                  <div className="divider" style={{ marginBottom:22 }} />
                  <Link to={ROUTES.LOGIN} className="btn btn-ghost" style={{ textDecoration:'none', width:'100%', justifyContent:'center' }}>
                    Institution Login <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Officer — featured */}
                <div className="card-featured" style={{ padding:'30px 26px' }}>
                  <div style={{
                    width:44, height:44, borderRadius:14, marginBottom:20,
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(2, 132, 199, 0.45))'
                      : 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(29, 78, 216, 0.30))',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #bfdbfe',
                    display:'flex', alignItems:'center', justifyContent:'center'
                  }}>
                    <ShieldCheck size={19} color={isDark ? '#7dd3fc' : '#2563eb'} />
                  </div>
                  <h3 className="t-h3 c-primary" style={{ marginBottom:10 }}>AICTE Scrutiny Bureau</h3>
                  <p className="t-body c-body" style={{ fontSize:14, marginBottom:28 }}>
                    Dedicated workbench for AICTE regional directors — three-way reconciliation, FDR health scoring, and full coverage audit trails across all enrolled institutions.
                  </p>
                  <div className="divider" style={{ marginBottom:22 }} />
                  <Link to={ROUTES.LOGIN} className="btn btn-primary" style={{ textDecoration:'none', width:'100%', justifyContent:'center' }}>
                    Enter Scrutiny Console <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Bank */}
                <div className="card" style={{ padding:'30px 26px' }}>
                  <div className="icon-ring icon-ring-amber" style={{ marginBottom:20 }}>
                    <Landmark size={19} color="#f59e0b" />
                  </div>
                  <h3 className="t-h3 c-primary" style={{ marginBottom:10 }}>Core Banking Gateway</h3>
                  <p className="t-body c-body" style={{ fontSize:14, marginBottom:28 }}>
                    Simulates RBI scheduled bank responses — lien confirmation, deposit mismatch triggers, and NeSL cryptographic verification for regulatory audit completeness.
                  </p>
                  <div className="divider" style={{ marginBottom:22 }} />
                  <Link to={ROUTES.MOCK_BANK} className="btn btn-ghost" style={{ textDecoration:'none', width:'100%', justifyContent:'center' }}>
                    Open Bank Simulator <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ══ 5-STAGE LIFECYCLE ══ */}
          <section className="v3-section">
            <div className="v3-section-inner">
              <div className="card v3-lifecycle-card">
                <div className="v3-section-head">
                  <div className="t-label c-muted" style={{ marginBottom:10 }}>Automated Pipeline</div>
                  <h2 className="t-h2 c-primary">The 5-Stage FDR Statutory Lifecycle</h2>
                </div>
                <div className="v3-lifecycle-grid">
                  {[
                    { n:1, title:'Submission & OCR',    desc:'OCR extracts principal, maturity, and joint lien clause from the uploaded certificate.' },
                    { n:2, title:'Bank Reconciliation', desc:'Automated API confirms lien endorsement and deposit balance with the issuing bank.' },
                    { n:3, title:'Scrutiny & Ledger',   desc:'Officer confirms 3-way match. Record appended to the immutable SHA-256 ledger.' },
                    { n:4, title:'Continuous Audit',    desc:'Timeline engine flags coverage lapses and maturity gaps automatically.' },
                    { n:5, title:'3-Tier Release',      desc:'Triple-authorised release order issued after 8-year statutory tenure completion.' },
                  ].map(s => (
                    <div key={s.n} className="card-inner" style={{ padding:'18px 16px' }}>
                      <div className="step-n" style={{ marginBottom:12 }}>{s.n}</div>
                      <h4 className="c-primary" style={{ fontSize:13, fontWeight:700, marginBottom:8 }}>{s.title}</h4>
                      <p className="c-muted" style={{ fontSize:12.5, lineHeight:1.55 }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══ APH CLAUSES ══ */}
          <section className="v3-section">
            <div className="v3-section-inner">
              <div className="v3-clauses-grid">
                {[
                  { tag:'Clause 1.4', title:'Mandatory Joint Lien',  body:'FDRs must state "Lien marked in favour of Member Secretary, AICTE, New Delhi". Unencumbered FDRs are void under APH guidelines.' },
                  { tag:'Clause 2.1', title:'Continuous Validity',   body:'Renew minimum 30 days before maturity. One day of lapsed cover triggers statutory show-cause notice to the institution.' },
                  { tag:'Clause 5.3', title:'Release Authorization', body:'Release sanctioned after tenure expiry, zero student grievances, and regional inspection clearance — triple-authorised.' },
                ].map(c => (
                  <div key={c.tag} className="card" style={{ padding:'24px 22px' }}>
                    <div className="t-label c-accent" style={{ marginBottom:9 }}>{c.tag}</div>
                    <strong className="c-primary" style={{ fontSize:15.5, display:'block', marginBottom:10, fontWeight:700 }}>{c.title}</strong>
                    <p className="c-body" style={{ fontSize:13.5, lineHeight:1.62 }}>{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ FOOTER ══ */}
          <footer className="v3-footer">
            <div style={{ maxWidth:1100, margin:'0 auto', padding:'34px 24px 26px' }}>
              <div className="v3-footer-inner" style={{
                display:'flex', flexWrap:'wrap', alignItems:'center',
                justifyContent:'space-between', gap:22, paddingBottom:22,
                borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #e2e8f0'
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{
                    width:34, height:34, borderRadius:10,
                    background: isDark ? 'rgba(56, 189, 248, 0.10)' : 'rgba(37, 99, 235, 0.08)',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.20)' : '1px solid #cbd5e1',
                    display:'flex', alignItems:'center', justifyContent:'center'
                  }}>
                    <Landmark size={17} className={isDark ? 'text-[#38bdf8]' : 'text-[#2563eb]'} />
                  </div>
                  <div>
                    <div className="c-primary" style={{ fontSize:14, fontWeight:700 }}>All India Council for Technical Education (AICTE)</div>
                    <div className="c-muted" style={{ fontSize:11.5, marginTop:2 }}>Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</div>
                  </div>
                </div>
                <div className="v3-footer-links" style={{ display:'flex', alignItems:'center', gap:24 }}>
                  <Link to={ROUTES.LOGIN}     className="fl">Officer Login</Link>
                  <Link to={ROUTES.LOGIN}     className="fl">Institution Portal</Link>
                  <Link to={ROUTES.MOCK_BANK} className="fl">Bank Simulator</Link>
                </div>
              </div>
              <div style={{ paddingTop:18, display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                <span className="c-muted" style={{ fontSize:12 }}>
                  © {new Date().getFullYear()} AICTE FDR Trust Ledger. Ministry of Education, Government of India.
                </span>
                <span className="c-muted" style={{ fontSize:12 }}>
                  SHA-256 Merkle · NeSL Protocol Standard · ISO 27001
                </span>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
