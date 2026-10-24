import { describe, it, expect } from '@jest/globals';
import crypto from 'crypto';

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function computeEntryHash(entry, prevHash) {
  return sha256([prevHash || '0'.repeat(64), entry.action, entry.data].join('|'));
}

function verifyChain(entries) {
  let prev = null;
  for (let i = 0; i < entries.length; i++) {
    const expected = computeEntryHash(entries[i], prev);
    if (expected !== entries[i].hash) {
      return { valid: false, breakIndex: i };
    }
    prev = entries[i].hash;
  }
  return { valid: true, breakIndex: null };
}

describe('Cryptographic Hash Chain', () => {
  it('validates a properly chained series of ledger entries', () => {
    const entries = [];
    let prev = null;
    for (let i = 0; i < 3; i++) {
      const e = { action: `ACTION_${i}`, data: `data_${i}` };
      const hash = computeEntryHash(e, prev);
      entries.push({ ...e, hash });
      prev = hash;
    }

    const result = verifyChain(entries);
    expect(result.valid).toBe(true);
    expect(result.breakIndex).toBeNull();
  });

  it('detects tampering and locates exact broken entry', () => {
    const entries = [];
    let prev = null;
    for (let i = 0; i < 4; i++) {
      const e = { action: `ACTION_${i}`, data: `data_${i}` };
      const hash = computeEntryHash(e, prev);
      entries.push({ ...e, hash });
      prev = hash;
    }

    // Tamper with index 2
    entries[2].data = 'TAMPERED_MALICIOUS_DATA';

    const result = verifyChain(entries);
    expect(result.valid).toBe(false);
    expect(result.breakIndex).toBe(2);
  });
});
