import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { ROUTES } from '../../../lib/constants';

export default function Login() {
  return (
    <div className="w-full max-w-md bg-white border border-hairline rounded p-8 shadow-xs">
      <div className="text-center mb-6 border-b border-surface-200 pb-5">
        <div className="inline-block px-2.5 py-1 bg-navy-50 border border-navy-200 rounded text-xs font-semibold text-navy-800 uppercase tracking-wider mb-2">
          AICTE New Delhi
        </div>
        <h1 className="text-lg font-medium text-gray-900">FDR Trust Ledger</h1>
        <p className="text-xs text-gray-500 mt-1">
          Institutional Security Deposit & Term Deposit Monitoring Portal
        </p>
      </div>

      <LoginForm />

      <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs text-gray-500">
        <Link to={ROUTES.HOME} className="hover:text-gray-800">
          ← Public portal
        </Link>
        <Link to={ROUTES.REGISTER} className="text-navy-700 hover:text-navy-900 font-medium">
          Register new institution
        </Link>
      </div>
    </div>
  );
}
