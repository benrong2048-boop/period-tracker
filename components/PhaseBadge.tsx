import type { CyclePhase } from "@/lib/types";

const phaseStyles: Record<CyclePhase, string> = {
  menstrual: "bg-morandi-pink/30 text-morandi-dark border border-morandi-pink/50",
  follicular: "bg-morandi-stone/20 text-morandi-dark border border-morandi-border",
  fertile: "bg-morandi-pinkLight/60 text-morandi-dark border border-morandi-pink/40",
  ovulation: "bg-morandi-pink/40 text-morandi-dark border border-morandi-pink",
  luteal: "bg-morandi-stone/25 text-morandi-dark border border-morandi-border",
  unknown: "bg-morandi-border/60 text-morandi-gray border border-morandi-border",
};

export function PhaseBadge({
  phase,
  label,
  className = "",
}: {
  phase: CyclePhase;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium border ${phaseStyles[phase]} ${className}`}
    >
      {label}
    </span>
  );
}
