import type { CyclePhase } from "@/lib/types";

const phaseStyles: Record<CyclePhase, string> = {
  menstrual: "bg-pink-200/80 text-pink-800",
  follicular: "bg-sky-200/80 text-sky-800",
  fertile: "bg-violet-200/80 text-violet-800",
  ovulation: "bg-purple-300/80 text-purple-900",
  luteal: "bg-amber-200/80 text-amber-800",
  unknown: "bg-gray-200/80 text-gray-600",
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
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${phaseStyles[phase]} ${className}`}
    >
      {label}
    </span>
  );
}
