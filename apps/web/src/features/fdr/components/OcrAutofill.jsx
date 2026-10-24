import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export default function OcrAutofill({ isScanning, ocrResult, onApply }) {
  if (isScanning) {
    return (
      <div className="p-4 bg-navy-50 border border-navy-200 rounded text-xs text-navy-900 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-navy-700 animate-spin" />
        <div>
          <p className="font-medium">Extracting OCR text from uploaded FDR...</p>
          <p className="text-gray-500 text-[11px]">Identifying bank name, FDR number, amount and maturity date</p>
        </div>
      </div>
    );
  }

  if (!ocrResult) return null;

  return (
    <div className="p-3 bg-surface-100 border border-hairline rounded text-xs text-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-status-green flex-shrink-0" />
        <span>
          Document read successfully (98% confidence). Fields pre-filled below.
        </span>
      </div>
      {onApply && (
        <button
          type="button"
          onClick={onApply}
          className="text-navy-700 underline font-medium hover:text-navy-900"
        >
          Re-apply OCR
        </button>
      )}
    </div>
  );
}
