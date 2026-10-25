import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../lib/constants';
import Button from '../../../components/ui/Button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-50 text-gray-800">
      {/* Top utility bar */}
      <header className="border-b border-hairline bg-white">
        <div className="max-w-content mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-navy-700 text-white font-medium flex items-center justify-center text-xs">
              AICTE
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 leading-tight">
                All India Council for Technical Education
              </p>
              <p className="text-xs text-gray-500">
                FDR Trust Ledger — Security Deposit Monitoring System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={ROUTES.MOCK_BANK}>
              <Button variant="secondary" size="sm">
                Simulated bank console
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" size="sm">
                Sign in to portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content container */}
      <main className="max-w-content mx-auto px-6 py-8">
        <div className="bg-white border border-slate-300 rounded p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold text-navy-800 uppercase tracking-wider bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              Government Regulatory System
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            AICTE Security Deposit & Fixed Deposit Receipt (FDR) Trust Ledger
          </h1>
          <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
            National regulatory repository maintaining verified custody of fixed deposit receipts pledged by approved technical institutions in favour of AICTE. Features PaddleOCR certificate scrutiny, bank verification reconciliation, statutory coverage gap auditing, and SHA-256 tamper-proof ledger logging.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-300 rounded p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">Technical Institution Portal</h2>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                For college principals and finance officials. Upload FDR certificates with automated OCR text extraction, review validity timelines, submit continuous renewals, and apply for deposit release.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <Link to={ROUTES.LOGIN}>
                <Button variant="secondary" size="sm" className="w-full">
                  Institution Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-[#1F3A5F] rounded p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-bold text-slate-900">AICTE Scrutiny Office</h2>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-[#1F3A5F]">
                  Authorised
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                For regional and bureau officers. Three-way reconciliation review (Institution vs OCR vs Bank), health scoring, regulatory coverage gap audit, and three-tier release approvals.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <Link to={ROUTES.LOGIN}>
                <Button variant="primary" size="sm" className="w-full">
                  Officer Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">Core Banking Gateway Simulator</h2>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Inter-bank confirmation console. Inspect inbound verification requests, issue cryptographic confirmations, or report principal amount mismatches.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <Link to={ROUTES.MOCK_BANK}>
                <Button variant="secondary" size="sm" className="w-full">
                  Access Bank Console
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Regulatory notes table */}
        <div className="mt-8 border border-hairline rounded bg-white p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Statutory guidelines summary</h2>
          <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
            <p>
              1. <strong>Mandatory lien clause:</strong> Every FDR must carry an endorsement confirming
              lien marking in favour of "Member Secretary, AICTE, New Delhi".
            </p>
            <p>
              2. <strong>Continuous validity:</strong> Institutions must maintain uninterrupted FDR
              coverage throughout the active approval cycle. Uncovered periods constitute a regulatory gap.
            </p>
            <p>
              3. <strong>Release conditions:</strong> Security deposits are released strictly upon
              completion of the statutory period, subject to zero pending compliance inquiries.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
