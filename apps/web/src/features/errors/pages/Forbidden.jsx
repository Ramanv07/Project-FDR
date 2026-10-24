import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../lib/constants';
import Button from '../../../components/ui/Button';

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white border border-hairline rounded p-8">
        <h1 className="text-2xl font-medium text-status-red mb-2">403</h1>
        <p className="text-sm font-medium text-gray-800 mb-1">Access restricted</p>
        <p className="text-xs text-gray-500 mb-6">
          Your current credentials do not have authorization to view this section of the ledger.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button variant="primary" size="sm">
            Sign in with authorized role
          </Button>
        </Link>
      </div>
    </div>
  );
}
