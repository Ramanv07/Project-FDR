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
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>

      {file ? (
        <div className="flex items-center justify-between p-3 bg-surface-50 border border-hairline rounded">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-navy-700" />
            <div>
              <p className="text-sm font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-gray-400 hover:text-gray-600 p-1"
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
          className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-navy-700 bg-navy-50'
              : 'border-surface-300 hover:border-gray-400 bg-white'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Click to browse or drop file here</p>
          <p className="text-xs text-gray-500 mt-1">{helper}</p>
        </div>
      )}
    </div>
  );
}
