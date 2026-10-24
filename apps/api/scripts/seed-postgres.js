import { pool, runMigrations } from '../src/config/db.js';
import { logger } from '../src/config/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mocksDir = path.resolve(__dirname, '../../web/src/mocks');

async function seed() {
  logger.info('[PostgreSQL Seeder] Initializing schema migrations...');
  await runMigrations();

  const institutions = JSON.parse(fs.readFileSync(path.join(mocksDir, 'institutions.json'), 'utf-8'));
  const users = JSON.parse(fs.readFileSync(path.join(mocksDir, 'users.json'), 'utf-8'));
  const fdrs = JSON.parse(fs.readFileSync(path.join(mocksDir, 'fdrs.json'), 'utf-8'));

  logger.info(`[PostgreSQL Seeder] Seeding ${institutions.length} institutions...`);
  for (const inst of institutions) {
    await pool.query(
      `INSERT INTO institutions (id, aicte_id, name, state, contact_person, email, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email;`,
      [inst.id, inst.aicteId, inst.name, inst.state, inst.contactPerson, inst.email, inst.phone],
    );
  }

  logger.info(`[PostgreSQL Seeder] Seeding ${users.length} users...`);
  for (const u of users) {
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, institution_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;`,
      [u.id, u.name, u.email, u.password || 'demo123', u.role, u.institutionId],
    );
  }

  logger.info(`[PostgreSQL Seeder] Seeding ${fdrs.length} FDR records...`);
  for (const f of fdrs) {
    await pool.query(
      `INSERT INTO fdrs (
         id, fdr_number, institution_id, institution_name, bank, branch, amount,
         bank_amount, issue_date, maturity_date, lien_holder, program_year,
         status, trust_level, is_duplicate, has_compliance_issue, documents, timeline, ocr_data
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
       ON CONFLICT (id) DO NOTHING;`,
      [
        f.id,
        f.fdrNumber,
        f.institutionId,
        f.institutionName,
        f.bank,
        f.branch || 'Main Branch',
        f.amount,
        f.bankAmount,
        f.issueDate,
        f.maturityDate,
        f.lienHolder || 'Member Secretary, AICTE New Delhi',
        f.programYear || '2024-25',
        f.status,
        f.trustLevel,
        f.isDuplicate || false,
        f.hasComplianceIssue || false,
        JSON.stringify(f.documents || []),
        JSON.stringify(f.timeline || []),
        JSON.stringify(f.ocrData || null),
      ],
    );
  }

  logger.info('[PostgreSQL Seeder] Database seeded successfully!');
  await pool.end();
}

seed().catch((err) => {
  logger.error('[PostgreSQL Seeder] Error during seed', err);
  process.exit(1);
});
