import usersData from '../users.json';
import institutionsData from '../institutions.json';
import { registerMockHandler } from '../../lib/apiClient';

let users = [...usersData];

export function initAuthHandler() {
  registerMockHandler('/auth/login', async ({ data }) => {
    const { email, password, role } = data;
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role),
    );

    if (!user) {
      throw new Error('Invalid email or role selection');
    }

    if (password && user.password && password !== user.password) {
      throw new Error('Invalid password');
    }

    const institution = user.institutionId
      ? institutionsData.find((i) => i.id === user.institutionId)
      : null;

    return {
      token: `mock-jwt-token-${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId,
        institutionName: institution ? institution.name : null,
      },
    };
  });

  registerMockHandler('/auth/register-institution', async ({ data }) => {
    const newInst = {
      id: `inst-${Date.now().toString().slice(-4)}`,
      aicteId: data.aicteId,
      name: data.name,
      state: data.state,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
    };
    institutionsData.push(newInst);

    const newUser = {
      id: `user-${Date.now().toString().slice(-4)}`,
      name: data.contactPerson,
      email: data.email,
      role: 'institution',
      institutionId: newInst.id,
      password: data.password || 'demo123',
    };
    users.push(newUser);

    return {
      token: `mock-jwt-token-${newUser.id}`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        institutionId: newInst.id,
        institutionName: newInst.name,
      },
    };
  });

  registerMockHandler('/auth/profile', async () => {
    return { status: 'success' };
  });
}
