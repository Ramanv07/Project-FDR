import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import { ROUTES } from '../../../lib/constants';

export default function Register() {
  return (
    <div className="w-full max-w-lg bg-white border border-hairline rounded p-8 shadow-xs">
      <div className="text-center mb-6 border-b border-surface-200 pb-5">
        <div className="inline-block px-2.5 py-1 bg-navy-50 border border-navy-200 rounded text-xs font-semibold text-navy-800 uppercase tracking-wider mb-2">
          AICTE New Delhi
        </div>
        <h1 className="text-lg font-medium text-gray-900">Institution Registration</h1>
        <p className="text-xs text-gray-500 mt-1">
          Enroll technical institute for FDR compliance tracking and verification
        </p>
      </div>

      <RegisterForm />

      <div className="mt-6 pt-4 border-t border-hairline text-center text-xs text-gray-500">
        Already registered?{' '}
        <Link to={ROUTES.LOGIN} className="text-navy-700 hover:text-navy-900 font-medium ml-1">
          Sign in here
        </Link>
      </div>
    </div>
  );
}
