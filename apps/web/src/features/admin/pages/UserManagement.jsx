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
    { header: 'Full name', accessor: 'name', sortable: true },
    { header: 'Email address', accessor: 'email', sortable: true },
    {
      header: 'Assigned role',
      accessor: 'role',
      sortable: true,
      render: (r) => (
        <span className="capitalize font-medium text-navy-800 dark:text-blue-400">{r.role}</span>
      ),
    },
    {
      header: 'User ID',
      accessor: 'id',
      render: (r) => <span className="font-mono text-gray-500 dark:text-slate-400">{r.id}</span>,
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

      <div className="border border-hairline dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0f172a] p-5 shadow-xs">
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
