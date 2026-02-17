"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SpendingTrends } from "@/lib/types";
import { formatCurrency, formatMonth } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Period } from "@/components/period-filter";

interface TrendChartProps {
  data: SpendingTrends;
  period: Period;
  onPeriodChange: (period: Period) => void;
}

const periodOptions: { label: string; shortLabel: string; value: Period }[] = [
  { label: "Last 3 months", shortLabel: "3M", value: "90d" },
  { label: "Last 30 days", shortLabel: "30D", value: "30d" },
  { label: "Last 7 days", shortLabel: "7D", value: "7d" },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: { month: string; totalSpent: number; transactionCount: number };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-muted-foreground">
        {formatMonth(d.month)}
      </p>
      <p className="mt-0.5 text-sm font-bold text-foreground">
        {formatCurrency(d.totalSpent)}
      </p>
      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
        <ArrowUpRight className="h-3 w-3 text-primary" />
        <span>{d.transactionCount} transactions</span>
      </div>
    </div>
  );
}

export default function TrendChart({ data, period, onPeriodChange }: TrendChartProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Total Spending</CardTitle>
            <CardDescription className="text-xs">
              Spending over the selected period
            </CardDescription>
          </div>
          <div className="inline-flex items-center self-start rounded-lg border border-border bg-muted/50 p-0.5">
            {periodOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={period === opt.value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onPeriodChange(opt.value)}
                className={`h-7 rounded-md px-2 text-xs font-medium sm:px-3 ${
                  period === opt.value
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="sm:hidden">{opt.shortLabel}</span>
                <span className="hidden sm:inline">{opt.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[220px] w-full sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trends} margin={{ top: 10, right: 4, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-border" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                tick={{ fontSize: 10, fontWeight: 500, fill: "currentColor" }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
                dy={10}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(v: number) => `R${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 10, fontWeight: 500, fill: "currentColor" }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
                dx={-4}
                width={50}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "var(--chart-1)", strokeWidth: 1.5, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="totalSpent"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#spendGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
