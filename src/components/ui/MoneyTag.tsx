/**
 * MoneyTag — green badge showing PJAZZA earning with 💰 prefix
 */

interface MoneyTagProps {
  amount: number;
  currency?: string;
  className?: string;
}

export function MoneyTag({
  amount,
  currency = "€",
  className = "",
}: MoneyTagProps) {
  const formatted = new Intl.NumberFormat("en-MT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-trust text-white ${className}`}
    >
      <span>💰</span>
      <span>
        {currency}
        {formatted}
      </span>
    </span>
  );
}
