import initialUsers from '../users.json';
import initialAlerts from '../alerts.json';
import { registerMockHandler } from '../../lib/apiClient';

let users = [...initialUsers];
let alerts = { ...initialAlerts };

export function initAdminHandler() {
  registerMockHandler('/admin/users', async () => {
    return users;
  });

  registerMockHandler('/admin/users/create', async ({ data }) => {
    const newUser = {
      id: `user-${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email,
      role: data.role,
      institutionId: data.institutionId || null,
      password: data.password || 'demo123',
    };
    users.push(newUser);
    return newUser;
  });

  registerMockHandler('/admin/alerts', async () => {
    return alerts;
  });

  registerMockHandler('/admin/alerts/update', async ({ data }) => {
    alerts = {
      ...alerts,
      reminderDays: data.reminderDays || alerts.reminderDays,
      escalateAfterDays: Number(data.escalateAfterDays) || alerts.escalateAfterDays,
      channels: { ...alerts.channels, ...(data.channels || {}) },
    };
    return alerts;
  });
}
