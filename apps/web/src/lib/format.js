/**
 * Indian number and date formatting utilities.
 * All formatting goes through here so we never have inconsistent formats.
 */

/** Format number in Indian grouping: 5,00,000 */
export function formatIndianCurrency(amount) {
  if (amount == null) return '';
  const num = Number(amount);
  if (isNaN(num)) return '';
  const str = Math.abs(num).toFixed(0);
  // Indian grouping: last 3 digits, then groups of 2
  let result = str.slice(-3);
  let remaining = str.slice(0, -3);
  while (remaining.length > 0) {
    result = remaining.slice(-2) + ',' + result;
    remaining = remaining.slice(0, -2);
  }
  return (num < 0 ? '-' : '') + 'Rs ' + result;
}

/** Format date as DD-MMM-YYYY (e.g. 15-Mar-2025) */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

/** Days between two dates (positive means second is later) */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = d2.getTime() - d1.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/** Days from today to a future date */
export function daysUntil(dateStr) {
  return daysBetween(new Date(), new Date(dateStr));
}

/** Truncate text with ellipsis */
export function truncate(str, maxLen = 40) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

/** First 8 chars of a hash for display */
export function hashPrefix(hash) {
  if (!hash) return '';
  return hash.slice(0, 8);
}
