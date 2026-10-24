import React from 'react';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { BANKS } from '../../../lib/constants';

export default function FdrForm({
  values,
  onChange,
  errors = {},
  onSubmit,
  isSubmitting = false,
  ocrApplied = false,
  submitLabel = 'Submit FDR for scrutiny',
}) {
  const ocrBadge = ocrApplied ? 'Read from document, please confirm' : null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Deposit Identification */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">Fixed deposit details</h3>
        <p className="text-xs text-gray-500 mb-3">
          Enter deposit account figures exactly as issued on official bank receipt.
        </p>

        <div className="space-y-3">
          <FormField
            label="FDR certificate number"
            required
            error={errors.fdrNumber}
            badge={ocrBadge}
          >
            <Input
              value={values.fdrNumber || ''}
              onChange={(e) => onChange('fdrNumber', e.target.value)}
              placeholder="e.g. 31422908764"
              error={Boolean(errors.fdrNumber)}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField label="Issuing bank" required error={errors.bank} badge={ocrBadge}>
              <Select
                value={values.bank || BANKS[0]}
                onChange={(val) => onChange('bank', val)}
                options={BANKS.map((b) => ({ value: b, label: b }))}
              />
            </FormField>

            <FormField label="Bank branch" required error={errors.branch}>
              <Input
                value={values.branch || ''}
                onChange={(e) => onChange('branch', e.target.value)}
                placeholder="e.g. Civil Lines Branch"
                error={Boolean(errors.branch)}
              />
            </FormField>
          </div>

          <FormField
            label="Principal deposit amount (in Rupees)"
            required
            error={errors.amount}
            badge={ocrBadge}
            helperText="Indian number format (e.g. 1000000 for Rs 10,00,000)"
          >
            <Input
              type="number"
              value={values.amount || ''}
              onChange={(e) => onChange('amount', e.target.value)}
              placeholder="1000000"
              error={Boolean(errors.amount)}
            />
          </FormField>
        </div>
      </div>

      <div className="form-divider" />

      {/* Validity and Regulatory Clauses */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">Validity & lien conditions</h3>
        <p className="text-xs text-gray-500 mb-3">
          Maturity date must cover the full duration of statutory approval.
        </p>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField label="Date of issue" required error={errors.issueDate} badge={ocrBadge}>
              <Input
                type="date"
                value={values.issueDate || ''}
                onChange={(e) => onChange('issueDate', e.target.value)}
                error={Boolean(errors.issueDate)}
              />
            </FormField>

            <FormField label="Maturity date" required error={errors.maturityDate} badge={ocrBadge}>
              <Input
                type="date"
                value={values.maturityDate || ''}
                onChange={(e) => onChange('maturityDate', e.target.value)}
                error={Boolean(errors.maturityDate)}
              />
            </FormField>
          </div>

          <FormField
            label="Lien in favour of"
            helperText="Statutory lien required under AICTE Approval Process Handbook"
          >
            <Input
              value="Member Secretary, AICTE, New Delhi"
              readOnly
              disabled
              className="bg-surface-100 text-gray-600 font-medium"
            />
          </FormField>

          <FormField
            label="Academic program / approval year"
            required
            error={errors.programYear}
            helperText="e.g. B.Tech 2024-25 or Integrated MCA"
          >
            <Input
              value={values.programYear || ''}
              onChange={(e) => onChange('programYear', e.target.value)}
              placeholder="e.g. B.Tech 2024-25"
              error={Boolean(errors.programYear)}
            />
          </FormField>
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Registering on ledger...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
