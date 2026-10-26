import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { ROLES, ROUTES } from '../../../lib/constants';
import { ShieldCheck, Building2, UserCog, Lock, Mail } from 'lucide-react';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('rk.pandey@aicte.gov.in');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState(ROLES.OFFICER);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login({ email, password, role });
      if (user.role === ROLES.INSTITUTION) {
        navigate(ROUTES.INSTITUTION_DASHBOARD);
      } else if (user.role === ROLES.ADMIN) {
        navigate(ROUTES.USER_MANAGEMENT);
      } else {
        navigate(ROUTES.OFFICER_DASHBOARD);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoRole = (targetRole) => {
    setRole(targetRole);
    if (targetRole === ROLES.OFFICER) {
      setEmail('rk.pandey@aicte.gov.in');
    } else if (targetRole === ROLES.INSTITUTION) {
      setEmail('meena@gecraipur.ac.in');
    } else if (targetRole === ROLES.ADMIN) {
      setEmail('admin@aicte.gov.in');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Role Selector Tabs */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Select Portal Role
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setDemoRole(ROLES.OFFICER)}
            className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
              role === ROLES.OFFICER
                ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-900 dark:text-blue-300 shadow-xs ring-1 ring-blue-600'
                : 'bg-slate-50 dark:bg-[#141f36] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2b4c]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>AICTE Officer</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoRole(ROLES.INSTITUTION)}
            className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
              role === ROLES.INSTITUTION
                ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-900 dark:text-blue-300 shadow-xs ring-1 ring-blue-600'
                : 'bg-slate-50 dark:bg-[#141f36] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2b4c]'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>College / Inst</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoRole(ROLES.ADMIN)}
            className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
              role === ROLES.ADMIN
                ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-900 dark:text-blue-300 shadow-xs ring-1 ring-blue-600'
                : 'bg-slate-50 dark:bg-[#141f36] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2b4c]'
            }`}
          >
            <UserCog className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>System Admin</span>
          </button>
        </div>
      </div>

      <FormField label="Official Email ID" required>
        <div className="relative">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@aicte.gov.in"
            required
            className="w-full"
          />
        </div>
      </FormField>

      <FormField label="Password" required>
        <div className="relative">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full"
          />
        </div>
      </FormField>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-2"
        disabled={isLoading}
        icon={<Lock className="w-4 h-4" />}
      >
        {isLoading ? 'Verifying Credentials...' : 'Sign In to Ledger Vault'}
      </Button>

      <div className="text-center pt-2">
        <span className="text-[11px] text-slate-400">
          Demo pre-loaded credentials. Click any role button above to auto-fill.
        </span>
      </div>
    </form>
  );
}
