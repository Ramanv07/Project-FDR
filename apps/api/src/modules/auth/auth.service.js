import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';

export const authService = {
  async authenticateUser({ email, role }) {
    // Demo service logic
    const mockUser = {
      id: 'user-04',
      name: 'R.K. Pandey',
      email,
      role: role || 'officer',
      institutionId: null,
    };

    const token = jwt.sign(
      { id: mockUser.id, email: mockUser.email, role: mockUser.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    );

    return { token, user: mockUser };
  },

  async registerInstitution(data) {
    const newUser = {
      id: `user-${Date.now().toString().slice(-4)}`,
      name: data.contactPerson,
      email: data.email,
      role: 'institution',
      institutionId: `inst-${Date.now().toString().slice(-4)}`,
    };

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    );

    return { token, user: newUser };
  },
};
