import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fdrApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { useToast } from '../../../components/ui/Toast';
import { formatIndianCurrency, formatDate, daysBetween } from '../../../lib/format';
import { BANKS, ROUTES } from '../../../lib/constants';
import { AlertTriangle } from 'lucide-react';

export default function RenewFdr() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [oldFdr, setOldFdr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formValues, setFormValues] = useState({
    newFdrNumber: '',
    bank: BANKS[0],
    branch: '',
    amount: '',
    issueDate: '',
    maturityDate: '',
    programYear: '',
  });

  useEffect(() => {
    async function fetchOld() {
      try {
        const data = await fdrApi.getFdrById(id);
        setOldFdr(data);
        if (data) {
          setFormValues({
            newFdrNumber: '',
            bank: data.bank,
            branch: data.branch || '',
            amount: String(data.amount),
            issueDate: data.maturityDate || '',
            maturityDate: '',
            programYear: data.programYear || '',
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOld();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spinner />
      </div>
    );
  }

  // Calculate coverage gap if new issue date is after old maturity date
  const gapDays =
    oldFdr?.maturityDate && formValues.issueDate
      ? daysBetween(oldFdr.maturityDate, formValues.issueDate)
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.newFdrNumber || !formValues.issueDate || !formValues.maturityDate) {
      addToast('Please fill all mandatory renewal fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await fdrApi.renewFdr({
        oldFdrId: oldFdr.id,
        ...formValues,
      });
      addToast('Renewal FDR submitted successfully.', 'success');
      navigate(ROUTES.MY_FDRS);
    } catch (err) {
      addToast(err.message || 'Renewal failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Renew or replace FDR"
        description={`Submit renewal for FDR #${oldFdr?.fdrNumber} • Ensure continuous validity`}
      />

      {/* Coverage Gap Warning if gapDays > 0 */}
      {gapDays > 0 && (
        <div className="p-4 mb-6 bg-red-50 border border-status-red rounded flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-status-red flex-shrink-0 mt-0.5" />
          <div className="text-xs text-status-red">
            <p className="font-semibold">
              Warning: Coverage gap of {gapDays} {gapDays === 1 ? 'day' : 'days'} detected!
            </p>
            <p className="mt-0.5 leading-relaxed">
              The existing FDR matures on {formatDate(oldFdr?.maturityDate)}, but the replacement
              commences on {formatDate(formValues.issueDate)}. Uncovered periods constitute a regulatory
              non-compliance breach under AICTE terms.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Existing (Old) FDR Details */}
        <div className="lg:col-span-5 border border-hairline rounded bg-white p-5 space-y-4">
          <h2 className="text-sm font-medium text-gray-900 pb-2 border-b border-surface-200">
            Existing deposit on record
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-gray-500 block">FDR number</span>
              <span className="font-mono font-medium text-gray-900">{oldFdr?.fdrNumber}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Current amount</span>
              <span className="font-medium text-gray-900">
                {formatIndianCurrency(oldFdr?.amount)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Bank & branch</span>
              <span className="text-gray-800">{oldFdr?.bank} ({oldFdr?.branch || 'Main'})</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-hairline">
              <div>
                <span className="text-gray-500 block">Issue date</span>
                <span className="text-gray-800">{formatDate(oldFdr?.issueDate)}</span>
              </div>
              <div>
                <span className="text-gray-500 block font-medium text-navy-800">Maturity date</span>
                <span className="text-navy-800 font-semibold">{formatDate(oldFdr?.maturityDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: New Replacement FDR Form */}
        <div className="lg:col-span-7 border border-hairline rounded bg-white p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4 pb-2 border-b border-surface-200">
            Replacement FDR certificate details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="New FDR certificate number" required>
              <Input
                value={formValues.newFdrNumber}
                onChange={(e) => setFormValues((p) => ({ ...p, newFdrNumber: e.target.value }))}
                placeholder="New bank deposit number"
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Bank" required>
                <Select
                  value={formValues.bank}
                  onChange={(v) => setFormValues((p) => ({ ...p, bank: v }))}
                  options={BANKS.map((b) => ({ value: b, label: b }))}
                />
              </FormField>

              <FormField label="Branch" required>
                <Input
                  value={formValues.branch}
                  onChange={(e) => setFormValues((p) => ({ ...p, branch: e.target.value }))}
                  placeholder="Branch location"
                  required
                />
              </FormField>
            </div>

            <FormField label="Renewal amount (in Rs)" required>
              <Input
                type="number"
                value={formValues.amount}
                onChange={(e) => setFormValues((p) => ({ ...p, amount: e.target.value }))}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="New issue date"
                required
                helperText="Should coincide with or precede old maturity date"
              >
                <Input
                  type="date"
                  value={formValues.issueDate}
                  onChange={(e) => setFormValues((p) => ({ ...p, issueDate: e.target.value }))}
                  required
                />
              </FormField>

              <FormField label="New maturity date" required>
                <Input
                  type="date"
                  value={formValues.maturityDate}
                  onChange={(e) => setFormValues((p) => ({ ...p, maturityDate: e.target.value }))}
                  required
                />
              </FormField>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Registering replacement...' : 'Submit renewal FDR'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
