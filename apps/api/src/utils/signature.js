import crypto from 'crypto';

const BANK_DEMO_SECRET = 'aicte-demo-bank-secret-2024';

export function signBankPayload(payload) {
  return crypto
    .createHmac('sha256', BANK_DEMO_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
}

export function verifyBankSignature(payload, signature) {
  const expected = signBankPayload(payload);
  return expected === signature;
}
