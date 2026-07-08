export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "opportunity";

const variantStyles: Record<BadgeVariant, string> = {
  success:     "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  warning:     "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  danger:      "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  info:        "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20",
  neutral:     "bg-slate-100 text-slate-600 ring-1 ring-slate-600/10",
  opportunity: "bg-teal-50 text-teal-700 ring-1 ring-teal-600/20",
};

type Props = {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
};

export default function Badge({ variant, children, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
