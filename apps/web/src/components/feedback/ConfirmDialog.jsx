import React from 'react';
import Dialog from '../ui/Dialog';
import Button from '../ui/Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-xs text-gray-600 mb-6 leading-relaxed">{message}</p>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-hairline">
        <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={isDestructive ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
