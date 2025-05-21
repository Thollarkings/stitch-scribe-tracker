
export const getCurrencySymbol = (currency?: string) => {
  switch (currency) {
    case 'USD':
    case 'CAD':
      return '$';
    case 'GBP':
      return '£';
    case 'EUR':
      return '€';
    case 'NGN':
    default:
      return '₦';
  }
};
