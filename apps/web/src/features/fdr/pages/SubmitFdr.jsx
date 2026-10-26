import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { fdrApi } from '../api';
import { validateFdrForm } from '../schema';
import PageHeader from '../../../components/data/PageHeader';
import FileUpload from '../../../components/ui/FileUpload';
import DocumentPreview from '../../../components/data/DocumentPreview';
import OcrAutofill from '../components/OcrAutofill';
import FdrForm from '../components/FdrForm';
import { useToast } from '../../../components/ui/Toast';
import { BANKS, ROUTES } from '../../../lib/constants';
import { readPdfOcr } from '../../../lib/fdrOcrReader';

export default function SubmitFdr() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrApplied, setOcrApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [ocrDefect, setOcrDefect] = useState(null);
  const [ocrSuccess, setOcrSuccess] = useState(null);

  const [formValues, setFormValues] = useState({
    fdrNumber: '',
    bank: BANKS[0],
    branch: '',
    amount: '',
    issueDate: '',
    maturityDate: '',
    programYear: '2025-26',
  });

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setIsScanning(true);
    setOcrApplied(false);
    setOcrDefect(null);
    setOcrSuccess(null);

    // Read real PDF contents using client-side OCR reader
    try {
      const ocrResult = await readPdfOcr(selectedFile);
      setIsScanning(false);
      setOcrApplied(true);

      if (ocrResult.success && ocrResult.fields) {
        const f = ocrResult.fields;
        setFormValues((prev) => ({
          ...prev,
          bank: f.bank || prev.bank,
          fdrNumber: f.fdrNumber || prev.fdrNumber,
          branch: f.branch || prev.branch,
          amount: f.amount || prev.amount,
          issueDate: f.issueDate || prev.issueDate,
          maturityDate: f.maturityDate || prev.maturityDate,
          programYear: f.programYear || '2025-26',
        }));

        if (!ocrResult.isCompliant && ocrResult.defects) {
          setOcrDefect(ocrResult.defects);
          addToast(`OCR Alert: Non-compliant FDR from ${f.bank} detected.`, 'warning');
        } else {
          setOcrSuccess(ocrResult.complianceMessage || `100% Compliant: ${f.bank} FDR validated.`);
          addToast(`OCR successfully extracted details from ${f.bank}.`, 'success');
        }
      } else {
        addToast('Document uploaded. Please verify fields manually.', 'info');
      }
    } catch (err) {
      setIsScanning(false);
      addToast('Could not parse document. Please enter details manually.', 'error');
    }
  };

  const handleLoadSample = async (filename) => {
    try {
      const res = await fetch(`/mock_fdrs/${filename}`);
      const blob = await res.blob();
      const mockFile = new File([blob], filename, { type: 'application/pdf' });
      await handleFileSelect(mockFile);
    } catch (e) {
      addToast('Error loading sample document', 'error');
    }
  };

  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateFdrForm(formValues);
    if (!isValid) {
      setErrors(validationErrors);
      addToast('Please correct indicated errors before submission.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await fdrApi.createFdr({
        ...formValues,
        institutionId: user?.institutionId || 'inst-01',
        institutionName: user?.institutionName || 'Government Engineering College, Raipur',
        submittedBy: user?.name,
        documents: file ? [{ name: file.name, uploadedAt: new Date().toISOString().slice(0, 10) }] : [],
      });
      addToast('FDR registered on ledger and queued for verification.', 'success');
      navigate(ROUTES.MY_FDRS);
    } catch (err) {
      addToast(err.message || 'Submission failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Submit new FDR"
        description="Register a newly pledged fixed deposit receipt with AICTE scrutiny office"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Document Upload & Simulated OCR Certificate View */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-hairline dark:border-slate-800 rounded-xl bg-white dark:bg-[#0f172a] p-5 space-y-4 shadow-xs">
            <FileUpload
              file={file}
              onFileSelect={handleFileSelect}
              onClear={() => {
                setFile(null);
                setOcrApplied(false);
                setOcrDefect(null);
                setOcrSuccess(null);
              }}
              label="Original scanned deposit receipt (PDF/Image)"
              helper="System automatically reads FDR certificate numbers, amounts, and validity dates"
            />

            {/* Quick Demo Samples Box */}
            <div className="pt-3 border-t border-hairline dark:border-slate-800 text-xs">
              <span className="font-semibold text-textSecondary dark:text-slate-400 uppercase tracking-wide">Demo Mock Files:</span>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample('FDR_OCR_TEST_DOCUMENT.pdf')}
                  className="text-left px-2.5 py-1.5 rounded border border-blue-300 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <span className="font-semibold block">✓ 1. Canara Bank</span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-300 block">₹12 Lakh · 2024-2027</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('FDR_VALID_SBI_15LAKH.pdf')}
                  className="text-left px-2.5 py-1.5 rounded border border-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <span className="font-semibold block">✓ 2. SBI Valid</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block">₹15 Lakh · 36 Mo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('FDR_REJECT_PNB_DEFECTIVE.pdf')}
                  className="text-left px-2.5 py-1.5 rounded border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                >
                  <span className="font-semibold block">✕ 3. PNB Reject</span>
                  <span className="text-[10px] text-rose-700 dark:text-rose-300 block">₹5 Lakh · Expired</span>
                </button>
              </div>
            </div>
          </div>

          {/* OCR Scrutiny Result Banners */}
          {ocrDefect && (
            <div className="border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 rounded p-4 text-xs space-y-1.5">
              <div className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 text-sm">
                <span>⚠️</span> Non-Compliant FDR Detected by OCR
              </div>
              <ul className="list-disc pl-4 space-y-1 text-rose-700 dark:text-rose-300">
                {ocrDefect.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
              <div className="text-[11px] text-rose-600 dark:text-rose-400 pt-1 font-mono">
                Recommendation: Scrutiny rejection anticipated.
              </div>
            </div>
          )}

          {ocrSuccess && (
            <div className="border border-emerald-300 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <span className="text-base leading-none">✓</span>
              <div>
                <span className="font-semibold">AICTE Compliance Passed: </span>
                {ocrSuccess}
              </div>
            </div>
          )}

          <OcrAutofill
            isScanning={isScanning}
            ocrResult={ocrApplied}
            onApply={() => handleFileSelect(file || { name: 'FDR_VALID_SBI_15LAKH.pdf', size: 5470 })}
          />

          {/* Certificate Document Preview */}
          <DocumentPreview
            documentName={file ? file.name : 'Sample_FDR_Scan.pdf'}
            ocrData={formValues}
          />
        </div>

        {/* Right Column: Detailed Verification Form */}
        <div className="lg:col-span-7">
          <div className="border border-hairline dark:border-slate-800 rounded-xl bg-white dark:bg-[#0f172a] p-6 shadow-xs">
            <FdrForm
              values={formValues}
              onChange={handleFieldChange}
              errors={errors}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              ocrApplied={ocrApplied}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
