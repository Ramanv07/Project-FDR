import crypto from 'crypto';

const DEMO_PRIVATE_KEY = 'aicte-demo-bank-secret-2024';

export function signBankResponse(payload) {
  return crypto
    .createHmac('sha256', DEMO_PRIVATE_KEY)
    .update(JSON.stringify(payload))
    .digest('hex');
}
