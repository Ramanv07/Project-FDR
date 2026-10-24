import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../lib/constants';
import Button from '../../../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white border border-hairline rounded p-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">404</h1>
        <p className="text-sm font-medium text-gray-800 mb-1">Page not found</p>
        <p className="text-xs text-gray-500 mb-6">
          The requested ledger document or URL does not exist on this portal.
        </p>
        <Link to={ROUTES.HOME}>
          <Button variant="secondary" size="sm">
            Return to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
