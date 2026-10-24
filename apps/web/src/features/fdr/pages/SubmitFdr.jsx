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

export default function SubmitFdr() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrApplied, setOcrApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formValues, setFormValues] = useState({
    fdrNumber: '',
    bank: BANKS[0],
    branch: '',
    amount: '',
    issueDate: '',
    maturityDate: '',
    programYear: '2025-26',
  });

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setIsScanning(true);
    setOcrApplied(false);

    // Simulate OCR text parsing pipeline (1.2 seconds)
    setTimeout(() => {
      setIsScanning(false);
      setOcrApplied(true);
      // Realistic pre-filled Indian bank values extracted via OCR
      setFormValues({
        fdrNumber: '38947102954',
        bank: 'State Bank of India',
        branch: 'Civil Lines, Raipur',
        amount: '1000000',
        issueDate: '2025-05-15',
        maturityDate: '2028-05-15',
        programYear: 'B.Tech 2025-26',
      });
      addToast('OCR extracted details successfully. Please confirm fields.', 'info');
    }, 1200);
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
          <div className="border border-hairline rounded bg-white p-5">
            <FileUpload
              file={file}
              onFileSelect={handleFileSelect}
              onClear={() => {
                setFile(null);
                setOcrApplied(false);
              }}
              label="Original scanned deposit receipt (PDF/Image)"
              helper="System automatically reads FDR certificate numbers, amounts, and validity dates"
            />
          </div>

          <OcrAutofill
            isScanning={isScanning}
            ocrResult={ocrApplied}
            onApply={() => handleFileSelect(file || { name: 'FDR_Certificate.pdf', size: 1024 * 512 })}
          />

          {/* Certificate Document Preview */}
          <DocumentPreview
            documentName={file ? file.name : 'Sample_FDR_Scan.pdf'}
            ocrData={formValues}
          />
        </div>

        {/* Right Column: Detailed Verification Form */}
        <div className="lg:col-span-7">
          <div className="border border-hairline rounded bg-white p-6">
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
