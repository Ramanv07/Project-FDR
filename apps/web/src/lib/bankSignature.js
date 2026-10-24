/**
 * Simulated bank digital signature.
 * In production this would use RSA/ECDSA with the bank's private key.
 * Here we use HMAC-SHA256 with a demo secret so the demo can show
 * signature verification passing and failing.
 */

const DEMO_SECRET = 'aicte-demo-bank-secret-2024';

/**
 * Sign a bank response payload.
 */
export async function signBankResponse(payload) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(DEMO_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const data = encoder.encode(JSON.stringify(payload));
  const sig = await crypto.subtle.sign('HMAC', key, data);
  const sigArray = Array.from(new Uint8Array(sig));
  return sigArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify a bank response signature.
 */
export async function verifyBankSignature(payload, signature) {
  const expected = await signBankResponse(payload);
  return expected === signature;
}
