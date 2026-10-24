import { app } from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';
import { startMaturityScanJob } from './jobs/maturityScan.js';
import { startEscalationJob } from './jobs/escalation.js';

async function bootstrap() {
  await connectDB();
  startMaturityScanJob();
  startEscalationJob();

  app.listen(config.port, () => {
    logger.info(`FDR Trust Ledger API server running on port ${config.port} (${config.env})`);
  });
}

bootstrap();
