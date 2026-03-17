export const formatMMK = (value = 0) => {
  const safe = Number(value || 0);
  return `${safe.toLocaleString('en-US')} MMK`;
};

export const percent = (value = 0, digits = 1) => `${(Number(value || 0) * 100).toFixed(digits)}%`;

export const roundPriceMyanmar = (value = 0, mode = 'standard') => {
  const v = Number(value || 0);
  if (mode === 'premium') return Math.ceil(v / 1000) * 1000 - 100;
  if (mode === 'promotional') return Math.ceil(v / 500) * 500 - 100;
  return Math.ceil(v / 500) * 500;
};
