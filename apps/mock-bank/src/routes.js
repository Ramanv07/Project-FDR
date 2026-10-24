import { Router } from 'express';
import { signBankResponse } from './sign.js';
import bankData from './bankData.json' assert { type: 'json' };

const router = Router();

// Simulated Core Banking Verification Endpoint
router.post('/verify-fdr', (req, res) => {
  const { fdrNumber, claimedAmount } = req.body;
  const match = bankData.find((b) => b.fdrNumber === fdrNumber);

  if (!match) {
    const payload = { fdrNumber, status: 'not_found', timestamp: new Date().toISOString() };
    const signature = signBankResponse(payload);
    return res.json({ ...payload, signature });
  }

  const isAmountMatch = Number(match.amount) === Number(claimedAmount);
  const payload = {
    fdrNumber,
    bank: match.bank,
    branch: match.branch,
    amount: match.amount,
    status: isAmountMatch ? 'confirmed' : 'mismatch',
    timestamp: new Date().toISOString(),
  };

  const signature = signBankResponse(payload);
  return res.json({ ...payload, signature });
});

export default router;
