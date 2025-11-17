export const formatCurrency = (amount: number) => {
  const formatted = new Intl.NumberFormat("en-RW", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(amount);
  return `${formatted} RWF`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
