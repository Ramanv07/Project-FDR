import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import InstitutionLayout from '../layouts/InstitutionLayout';
import OfficerLayout from '../layouts/OfficerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import RequireAuth from './guards/RequireAuth';
import RequireRole from './guards/RequireRole';

// Public & Basic Pages
import Landing from '../features/public/pages/Landing';
import LandingV2 from '../features/public/pages/LandingV2';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Profile from '../features/auth/pages/Profile';
import NotFound from '../features/errors/pages/NotFound';
import Forbidden from '../features/errors/pages/Forbidden';
import MockBankConsole from '../features/mock-bank/pages/MockBankConsole';

// Institution Pages
import InstitutionDashboard from '../features/dashboard/pages/InstitutionDashboard';
import SubmitFdr from '../features/fdr/pages/SubmitFdr';
import MyFdrs from '../features/fdr/pages/MyFdrs';
import FdrDetail from '../features/fdr/pages/FdrDetail';
import RenewFdr from '../features/fdr/pages/RenewFdr';
import ReleaseRequest from '../features/release/pages/ReleaseRequest';

// Officer Pages
import OfficerDashboard from '../features/dashboard/pages/OfficerDashboard';
import FdrRegister from '../features/fdr/pages/FdrRegister';
import InstitutionList from '../features/institutions/pages/InstitutionList';
import InstitutionDetail from '../features/institutions/pages/InstitutionDetail';
import RiskQueue from '../features/risk/pages/RiskQueue';
import VerificationQueue from '../features/verification/pages/VerificationQueue';
import FdrReview from '../features/verification/pages/FdrReview';
import CoverageGapTimeline from '../features/risk/pages/CoverageGapTimeline';
import ReleaseApprovals from '../features/release/pages/ReleaseApprovals';
import Reports from '../features/reports/pages/Reports';

// Regional Directorate & AI Assistant
import RegionalDashboard from '../features/regional/pages/RegionalDashboard';
import AssistantPage from '../features/assistant/pages/AssistantPage';

// Admin Pages
import UserManagement from '../features/admin/pages/UserManagement';
import AlertSettings from '../features/admin/pages/AlertSettings';
import AuditLedger from '../features/audit/pages/AuditLedger';

import { ROLES, ROUTES } from '../lib/constants';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Landing />,
  },
  {
    // DESIGN PROTOTYPE — delete this route once approved
    path: '/v2',
    element: <LandingV2 />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <Login /> },
      { path: ROUTES.REGISTER, element: <Register /> },
    ],
  },
  {
    path: ROUTES.MOCK_BANK,
    element: <MockBankConsole />,
  },
  {
    path: '/forbidden',
    element: <Forbidden />,
  },

  // Common authenticated profile route
  {
    path: ROUTES.PROFILE,
    element: (
      <RequireAuth>
        <InstitutionLayout />
      </RequireAuth>
    ),
    children: [{ index: true, element: <Profile /> }],
  },

  // Institution Section
  {
    path: '/institution',
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={[ROLES.INSTITUTION, ROLES.OFFICER, ROLES.ADMIN]}>
          <InstitutionLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.INSTITUTION_DASHBOARD} replace /> },
      { path: 'dashboard', element: <InstitutionDashboard /> },
      { path: 'fdr/submit', element: <SubmitFdr /> },
      { path: 'fdrs', element: <MyFdrs /> },
      { path: 'fdr/:id', element: <FdrDetail /> },
      { path: 'fdr/:id/renew', element: <RenewFdr /> },
      { path: 'fdr/:id/release', element: <ReleaseRequest /> },
      { path: 'assistant', element: <AssistantPage /> },
    ],
  },

  // Officer Section
  {
    path: '/officer',
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={[ROLES.OFFICER, ROLES.ADMIN]}>
          <OfficerLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.OFFICER_DASHBOARD} replace /> },
      { path: 'dashboard', element: <OfficerDashboard /> },
      { path: 'regional-offices', element: <RegionalDashboard /> },
      { path: 'assistant', element: <AssistantPage /> },
      { path: 'fdr-register', element: <FdrRegister /> },
      { path: 'institutions', element: <InstitutionList /> },
      { path: 'institution/:id', element: <InstitutionDetail /> },
      { path: 'risk-queue', element: <RiskQueue /> },
      { path: 'verification-queue', element: <VerificationQueue /> },
      { path: 'fdr/:id/review', element: <FdrReview /> },
      { path: 'coverage-gaps', element: <CoverageGapTimeline /> },
      { path: 'release-approvals', element: <ReleaseApprovals /> },
      { path: 'reports', element: <Reports /> },
    ],
  },

  // Admin Section
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={[ROLES.ADMIN, ROLES.OFFICER]}>
          <AdminLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.USER_MANAGEMENT} replace /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'regional-offices', element: <RegionalDashboard /> },
      { path: 'assistant', element: <AssistantPage /> },
      { path: 'alerts', element: <AlertSettings /> },
      { path: 'audit', element: <AuditLedger /> },
    ],
  },

  // Top-level Assistant direct route
  {
    path: ROUTES.AI_ASSISTANT,
    element: (
      <RequireAuth>
        <OfficerLayout />
      </RequireAuth>
    ),
    children: [{ index: true, element: <AssistantPage /> }],
  },

  {
    path: '*',
    element: <NotFound />,
  },
]);
