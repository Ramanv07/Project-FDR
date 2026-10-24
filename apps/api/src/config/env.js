import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fdr-trust-ledger',
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:Raman2004@localhost:5432/fdr_trust_ledger',
  jwtSecret: process.env.JWT_SECRET || 'fdr-aicte-trust-ledger-secret-key-2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mockBankUrl: process.env.MOCK_BANK_URL || 'http://localhost:3002',
};
