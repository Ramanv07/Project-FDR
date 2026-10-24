import initialLog from '../auditLog.json';
import { registerMockHandler } from '../../lib/apiClient';
import { buildChain, verifyChain } from '../../lib/hashChain';

let auditLog = [];
let isTampered = false;

// Initialize hash chain asynchronously on load
async function initChain() {
  auditLog = await buildChain(initialLog);
}
initChain();

export function initAuditHandler() {
  registerMockHandler('/audit/ledger', async () => {
    return auditLog;
  });

  registerMockHandler('/audit/verify', async () => {
    return verifyChain(auditLog);
  });

  registerMockHandler('/audit/tamper', async () => {
    if (!isTampered && auditLog.length > 2) {
      // Tamper with entry index 2: alter amount without updating hash
      auditLog[2] = {
        ...auditLog[2],
        data: { ...auditLog[2].data, amount: 9999999, tampered: true },
        details: '[TAMPERED] Fraudulent modification of deposit amount on ledger record',
      };
      isTampered = true;
    }
    return { isTampered, auditLog };
  });

  registerMockHandler('/audit/restore', async () => {
    auditLog = await buildChain(initialLog);
    isTampered = false;
    return { isTampered, auditLog };
  });
}
