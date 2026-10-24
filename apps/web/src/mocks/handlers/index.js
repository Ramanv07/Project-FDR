import { initAuthHandler } from './authHandler';
import { initFdrHandler } from './fdrHandler';
import { initVerificationHandler } from './verificationHandler';
import { initRiskHandler } from './riskHandler';
import { initReleaseHandler } from './releaseHandler';
import { initInstitutionHandler } from './institutionHandler';
import { initReportsHandler } from './reportsHandler';
import { initAdminHandler } from './adminHandler';
import { initAuditHandler } from './auditHandler';
import { initBankHandler } from './bankHandler';

export function setupMockHandlers() {
  initAuthHandler();
  initFdrHandler();
  initVerificationHandler();
  initRiskHandler();
  initReleaseHandler();
  initInstitutionHandler();
  initReportsHandler();
  initAdminHandler();
  initAuditHandler();
  initBankHandler();
}
