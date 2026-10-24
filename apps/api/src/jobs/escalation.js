import cron from 'node-cron';
import { logger } from '../config/logger.js';

export function startEscalationJob() {
  cron.schedule('0 6 * * *', async () => {
    logger.info('[CRON] Checking unacknowledged maturity alerts for officer escalation...');
  });
}
