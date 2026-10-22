/**
 * Format number to Indonesian Rupiah currency format
 * Example: 1233000 -> "Rp 1.233.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  // Normalize non-breaking spaces if any
  return formatted.replace(/\u00a0/g, ' ');
}

/**
 * Format sold count into Indonesian friendly text
 * Example: 213 -> "213 terjual", 1250 -> "1.2rb+ terjual"
 */
export function formatSold(sold: number): string {
  if (!sold || sold <= 0) return '0 terjual';
  if (sold >= 1000) {
    const formatted = (sold / 1000).toFixed(1).replace('.0', '');
    return `${formatted}rb+ terjual`;
  }
  return `${sold} terjual`;
}

/**
 * Format rating with 1 decimal place
 * Example: 4.8 -> "4.8", 5 -> "5.0"
 */
export function formatRating(rating: number): string {
  if (rating === undefined || rating === null) return '0.0';
  return Number(rating).toFixed(1);
}
