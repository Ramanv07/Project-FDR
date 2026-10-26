import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function FileUpload({
  onFileSelect,
  accept = '.pdf,image/*',
  helper = 'PDF or scanned image up to 10MB',
  label = 'Upload original FDR document',
  file = null,
  onClear,
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</span>

      {file ? (
        <div className="flex items-center justify-between p-3 bg-surface-50 dark:bg-[#0c1424] border border-hairline dark:border-slate-800 rounded-lg">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-navy-700 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{file.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-navy-700 dark:border-blue-500 bg-navy-50 dark:bg-blue-950/40'
              : 'border-surface-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 bg-white dark:bg-[#0c1424]'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <UploadCloud className="w-8 h-8 text-gray-400 dark:text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Click to browse or drop file here</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{helper}</p>
        </div>
      )}
    </div>
  );
}
