import crypto from 'crypto';

export function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function computeEntryHash(entry, previousHash) {
  const payload = [
    previousHash || '0'.repeat(64),
    entry.timestamp,
    entry.userId,
    entry.action,
    entry.recordId || '',
    JSON.stringify(entry.data || {}),
  ].join('|');
  return sha256(payload);
}

export function verifyChain(entries) {
  if (!entries || entries.length === 0) return { valid: true, count: 0 };
  let prev = null;
  for (let i = 0; i < entries.length; i++) {
    const expected = computeEntryHash(entries[i], prev);
    if (expected !== entries[i].hash) {
      return { valid: false, breakIndex: i, count: i };
    }
    prev = entries[i].hash;
  }
  return { valid: true, count: entries.length };
}
