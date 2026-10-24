import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import fdrRoutes from './modules/fdr/fdr.routes.js';
import documentRoutes from './modules/documents/document.routes.js';
import verificationRoutes from './modules/verification/verification.routes.js';
import riskRoutes from './modules/risk/risk.routes.js';
import releaseRoutes from './modules/release/release.routes.js';
import auditRoutes from './modules/audit/audit.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(cors());
app.use(express.json());

// Health probe
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'fdr-trust-ledger-api' }));

// Mount Modular Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/fdrs', fdrRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/release', releaseRoutes);
app.use('/api/audit', auditRoutes);

app.use(errorHandler);
