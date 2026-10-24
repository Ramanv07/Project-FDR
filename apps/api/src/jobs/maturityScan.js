import cron from 'node-cron';
import { logger } from '../config/logger.js';

export function startMaturityScanJob() {
  // Runs daily at 00:00 UTC (or demo tick)
  cron.schedule('0 0 * * *', async () => {
    logger.info('[CRON] Running daily maturity horizon scan for FDR deposits...');
  });
}
