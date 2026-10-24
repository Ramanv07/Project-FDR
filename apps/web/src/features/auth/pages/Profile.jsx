import React from 'react';
import { useAuth } from '../useAuth';
import PageHeader from '../../../components/data/PageHeader';
import Button from '../../../components/ui/Button';

export default function Profile() {
  const { user, role, logout } = useAuth();

  return (
    <div className="max-w-content">
      <PageHeader
        title="User profile"
        description="Official credentials and access rights on AICTE FDR Trust Ledger"
        action={
          <Button variant="secondary" size="sm" onClick={logout}>
            Sign out
          </Button>
        }
      />

      <div className="bg-white border border-hairline rounded p-6 max-w-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-surface-200">
            <div className="w-12 h-12 rounded bg-navy-700 text-white font-medium flex items-center justify-center text-base">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">{user?.name}</h2>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500 block">Assigned role</span>
              <span className="font-medium text-gray-800 capitalize">{role}</span>
            </div>
            <div>
              <span className="text-gray-500 block">User identifier</span>
              <span className="font-mono text-gray-800">{user?.id}</span>
            </div>

            {user?.institutionName && (
              <div className="col-span-2 border-t border-surface-200 pt-3">
                <span className="text-gray-500 block">Affiliated institution</span>
                <span className="font-medium text-gray-800">{user.institutionName}</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">ID: {user.institutionId}</span>
              </div>
            )}

            <div className="col-span-2 border-t border-surface-200 pt-3">
              <span className="text-gray-500 block">Access privilege scope</span>
              <span className="text-gray-700 leading-relaxed block mt-1">
                {role === 'officer' &&
                  'Full national scrutiny authority, cryptographic bank handshake audit, risk queue triaging, and multi-tier release authorization.'}
                {role === 'institution' &&
                  'FDR upload with automated OCR verification, coverage gap monitoring, timely renewal submissions, and release application initiation.'}
                {role === 'admin' &&
                  'System administration, security policy parameters, cryptographic hash chain integrity auditor, and operator directory governance.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
