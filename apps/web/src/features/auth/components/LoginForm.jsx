import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { ROLES, ROUTES } from '../../../lib/constants';

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
        <div className="p-3 bg-red-50 border border-status-red rounded text-xs text-status-red">
          {error}
        </div>
      )}

      <FormField label="Portal role" required>
        <Select
          value={role}
          onChange={(val) => setDemoRole(val)}
          options={[
            { value: ROLES.OFFICER, label: 'AICTE Officer' },
            { value: ROLES.INSTITUTION, label: 'Institution Staff' },
            { value: ROLES.ADMIN, label: 'System Administrator' },
          ]}
        />
      </FormField>

      <FormField label="Official email address" required>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@aicte.gov.in"
          required
        />
      </FormField>

      <FormField label="Password" required>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </FormField>

      <Button type="submit" variant="primary" className="w-full mt-2" disabled={isLoading}>
        {isLoading ? 'Authenticating...' : 'Sign in to portal'}
      </Button>

      {/* Quick demo credentials toggle */}
      <div className="pt-4 border-t border-hairline text-center">
        <p className="text-[11px] text-gray-500 mb-2">Demo pre-sets:</p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setDemoRole(ROLES.OFFICER)}
            className="text-xs text-navy-700 underline hover:text-navy-900"
          >
            Officer
          </button>
          <span className="text-gray-300">•</span>
          <button
            type="button"
            onClick={() => setDemoRole(ROLES.INSTITUTION)}
            className="text-xs text-navy-700 underline hover:text-navy-900"
          >
            Institution
          </button>
          <span className="text-gray-300">•</span>
          <button
            type="button"
            onClick={() => setDemoRole(ROLES.ADMIN)}
            className="text-xs text-navy-700 underline hover:text-navy-900"
          >
            Admin
          </button>
        </div>
      </div>
    </form>
  );
}
