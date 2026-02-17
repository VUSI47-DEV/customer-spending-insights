"use client";

import { Button } from "@/components/ui/button";

export type Period = "7d" | "30d" | "90d" | "1y";

interface PeriodFilterProps {
  activePeriod: Period;
  onPeriodChange: (period: Period) => void;
}

const periods: { label: string; value: Period }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
];

export default function PeriodFilter({ activePeriod, onPeriodChange }: PeriodFilterProps) {
  return (
    <div className="inline-flex rounded-xl bg-muted p-1">
      {periods.map((p) => (
        <Button
          key={p.value}
          variant={activePeriod === p.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onPeriodChange(p.value)}
          className={`rounded-lg px-4 text-xs font-bold uppercase tracking-widest ${
            activePeriod === p.value
              ? "shadow-sm shadow-primary/20"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
