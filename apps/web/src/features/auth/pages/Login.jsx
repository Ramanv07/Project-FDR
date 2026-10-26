import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { ROUTES } from '../../../lib/constants';
import { Shield, Lock, ArrowLeft, Building2 } from 'lucide-react';

export default function Login() {
  return (
    <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-200">
      {/* Tricolor National Ribbon */}
      <div className="tricolor-stripe" />

      <div className="p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B1E36] to-[#16355C] text-amber-400 font-bold flex items-center justify-center text-xl shadow-md border border-amber-500/30 mx-auto mb-3">
            🏛️
          </div>
          <div className="inline-block px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-full text-[10px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-2">
            Government of India • AICTE
          </div>
          <h1 className="text-xl font-bold text-slate-950 dark:text-white font-display">
            Regulatory Portal Access
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            FDR Trust Ledger & Security Deposit Custody Vault
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Public portal
          </Link>
          <Link to={ROUTES.REGISTER} className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-semibold hover:underline">
            Register institution
          </Link>
        </div>
      </div>
    </div>
  );
}
