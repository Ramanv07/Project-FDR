/**
 * SHA-256 hash chain for the audit ledger.
 * Each entry's hash = SHA-256(previousHash + timestamp + userId + action + recordId + data).
 * Uses the Web Crypto API (available in browsers and Node 18+).
 */

/**
 * Compute SHA-256 hex digest of a string.
 */
export async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Build the hash input string from an audit entry.
 */
function buildHashInput(entry, previousHash) {
  return [
    previousHash || '0'.repeat(64),
    entry.timestamp,
    entry.userId,
    entry.action,
    entry.recordId || '',
    JSON.stringify(entry.data || {}),
  ].join('|');
}

/**
 * Compute the hash for a single entry given the previous hash.
 */
export async function computeEntryHash(entry, previousHash) {
  const input = buildHashInput(entry, previousHash);
  return sha256(input);
}

/**
 * Verify the entire audit chain.
 * @param {Object[]} entries - ordered audit log entries, each with a `.hash` field
 * @returns {{ valid: boolean, verifiedCount: number, breakIndex: number|null, message: string }}
 */
export async function verifyChain(entries) {
  if (!entries || entries.length === 0) {
    return { valid: true, verifiedCount: 0, breakIndex: null, message: 'No entries to verify' };
  }

  let previousHash = null;

  for (let i = 0; i < entries.length; i++) {
    const expected = await computeEntryHash(entries[i], previousHash);
    if (expected !== entries[i].hash) {
      return {
        valid: false,
        verifiedCount: i,
        breakIndex: i,
        message: `Chain broken at entry ${i + 1}: expected ${expected.slice(0, 8)}..., found ${(entries[i].hash || '').slice(0, 8)}...`,
      };
    }
    previousHash = entries[i].hash;
  }

  return {
    valid: true,
    verifiedCount: entries.length,
    breakIndex: null,
    message: `Chain intact: ${entries.length.toLocaleString()} entries verified`,
  };
}

/**
 * Build a complete audit chain from raw entries (without hashes).
 * Used to initialise mock data.
 */
export async function buildChain(rawEntries) {
  const chain = [];
  let previousHash = null;

  for (const entry of rawEntries) {
    const hash = await computeEntryHash(entry, previousHash);
    chain.push({ ...entry, hash, previousHash: previousHash || '0'.repeat(64) });
    previousHash = hash;
  }

  return chain;
}
