import { daysBetween } from '../../lib/format';

export function validateFdrForm(values) {
  const errors = {};

  if (!values.fdrNumber?.trim()) {
    errors.fdrNumber = 'FDR number is required';
  } else if (!/^\d{8,}$/.test(values.fdrNumber.trim())) {
    errors.fdrNumber = 'FDR number must contain at least 8 digits';
  }

  if (!values.bank?.trim()) {
    errors.bank = 'Issuing bank is required';
  }

  if (!values.branch?.trim()) {
    errors.branch = 'Bank branch name is required';
  }

  if (!values.amount) {
    errors.amount = 'Deposit amount is required';
  } else if (isNaN(Number(values.amount)) || Number(values.amount) <= 0) {
    errors.amount = 'Deposit amount must be a positive number';
  }

  if (!values.issueDate) {
    errors.issueDate = 'Issue date is required';
  }

  if (!values.maturityDate) {
    errors.maturityDate = 'Maturity date is required';
  } else if (values.issueDate && daysBetween(values.issueDate, values.maturityDate) <= 0) {
    errors.maturityDate = 'Maturity date must be after issue date';
  }

  if (!values.programYear?.trim()) {
    errors.programYear = 'Program / approval academic year is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
