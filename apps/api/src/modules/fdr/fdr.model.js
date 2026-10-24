import mongoose from 'mongoose';

const fdrSchema = new mongoose.Schema(
  {
    fdrNumber: { type: String, required: true, index: true },
    institutionId: { type: String, required: true, index: true },
    institutionName: { type: String, required: true },
    bank: { type: String, required: true },
    branch: { type: String, required: true },
    amount: { type: Number, required: true },
    bankAmount: { type: Number, default: null },
    issueDate: { type: String, required: true },
    maturityDate: { type: String, required: true },
    lienHolder: { type: String, default: 'AICTE, New Delhi' },
    programYear: { type: String, required: true },
    status: { type: String, default: 'submitted' },
    trustLevel: { type: String, default: 'submitted' },
    isDuplicate: { type: Boolean, default: false },
    hasComplianceIssue: { type: Boolean, default: false },
    documents: [{ name: String, uploadedAt: String }],
    timeline: [{ event: String, date: String, user: String }],
  },
  { timestamps: true },
);

export const FDR = mongoose.models.FDR || mongoose.model('FDR', fdrSchema);
