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
        <div className="border border-hairline rounded bg-white p-6 mb-6">
          <h1 className="text-lg font-medium text-gray-900 mb-2">
            Fixed Deposit Receipt (FDR) trust & verification ledger
          </h1>
          <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
            This regulatory infrastructure maintains verified electronic custody of security deposits
            pledged by approved technical institutions in favour of the AICTE. It features multi-tier
            OCR extraction, cryptographic bank confirmation protocols, coverage gap detection, and a
            SHA-256 hash-chained immutable audit ledger.
          </p>
        </div>

        {/* Dense overview tables and portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-hairline rounded bg-white p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-1">Institution portal</h2>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                For college principals and finance officers. Upload FDR certificates with auto-fill OCR,
                monitor maturity dates, submit timely renewals, and request deposit release.
              </p>
            </div>
            <div className="pt-3 border-t border-hairline">
              <Link to={ROUTES.LOGIN}>
                <Button variant="secondary" size="sm" className="w-full">
                  Institution sign in
                </Button>
              </Link>
            </div>
          </div>

          <div className="border border-hairline rounded bg-white p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-1">AICTE scrutiny office</h2>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                For regional and central officers. Search FDR register, review discrepancies across
                submitted/OCR/bank records, track risk queue scores, and process release approvals.
              </p>
            </div>
            <div className="pt-3 border-t border-hairline">
              <Link to={ROUTES.LOGIN}>
                <Button variant="primary" size="sm" className="w-full">
                  Officer sign in
                </Button>
              </Link>
            </div>
          </div>

          <div className="border border-hairline rounded bg-white p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-1">Simulated bank gateway</h2>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Demonstration utility mimicking core banking API webhooks. Inspect inbound verification
                requests, issue cryptographically signed confirmations, or report amount discrepancies.
              </p>
            </div>
            <div className="pt-3 border-t border-hairline">
              <Link to={ROUTES.MOCK_BANK}>
                <Button variant="secondary" size="sm" className="w-full">
                  Open mock bank
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
