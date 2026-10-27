import React, { useState, useEffect } from 'react';
import { adminApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import DataTable from '../../../components/data/DataTable';
import Drawer from '../../../components/ui/Drawer';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { useToast } from '../../../components/ui/Toast';
import { ROLES } from '../../../lib/constants';

export default function UserManagement() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ROLES.OFFICER,
    password: 'demo' + Math.floor(100 + Math.random() * 900),
  });

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      addToast('Name and email are mandatory.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.createUser(formData);
      addToast('User created successfully.', 'success');
      setDrawerOpen(false);
      setFormData({
        name: '',
        email: '',
        role: ROLES.OFFICER,
        password: 'demo' + Math.floor(100 + Math.random() * 900),
      });
      await fetchUsers();
    } catch (err) {
      addToast(err.message || 'Creation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Full name',
      accessor: 'name',
      sortable: true,
      render: (r) => <span className="font-semibold text-zinc-900 dark:text-zinc-100">{r.name}</span>,
    },
    {
      header: 'Email address',
      accessor: 'email',
      sortable: true,
      render: (r) => <span className="text-zinc-500 dark:text-zinc-400">{r.email}</span>,
    },
    {
      header: 'Assigned role',
      accessor: 'role',
      sortable: true,
      render: (r) => {
        const roleColor = {
          [ROLES.INSTITUTION]: 'text-emerald-600 dark:text-emerald-400 font-medium',
          [ROLES.OFFICER]: 'text-sky-600 dark:text-sky-400 font-medium',
          [ROLES.ADMIN]: 'text-amber-600 dark:text-amber-400 font-medium',
        }[r.role] || 'text-zinc-700 dark:text-zinc-300';
        return <span className={`capitalize ${roleColor}`}>{r.role}</span>;
      },
    },
    {
      header: 'User ID',
      accessor: 'id',
      render: (r) => <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">{r.id}</span>,
    },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="User management"
        description="Portal user directory, roles, and credential management"
        action={
          <Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)}>
            Add new user
          </Button>
        }
      />

      <div className="border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl bg-white dark:bg-[#16181d] p-5 shadow-xs">
        <DataTable
          columns={columns}
          data={users}
          emptyMessage="No user accounts configured on ledger."
        />
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add portal user"
        description="Provision access credentials for AICTE officer or institution representative"
        width="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Full name" required>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Dr. Ramesh Kumar"
              required
            />
          </FormField>

          <FormField label="Official email" required>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="r.kumar@aicte.gov.in"
              required
            />
          </FormField>

          <FormField label="System role" required>
            <Select
              value={formData.role}
              onChange={(val) => setFormData((p) => ({ ...p, role: val }))}
              options={[
                { value: ROLES.OFFICER, label: 'AICTE Scrutiny Officer' },
                { value: ROLES.INSTITUTION, label: 'Institution Representative' },
                { value: ROLES.ADMIN, label: 'System Administrator' },
              ]}
            />
          </FormField>

          <FormField label="Temporary initial password" required>
            <Input
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              placeholder="password"
              required
            />
          </FormField>

          <div className="pt-4 border-t border-hairline flex items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create user'}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
