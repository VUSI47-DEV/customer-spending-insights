"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ShoppingCart, Film, Car, Utensils, ShoppingBag, Zap } from "lucide-react";
import type { SpendingByCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface CategoryChartProps {
  data: SpendingByCategory;
}

const iconMap: Record<string, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  film: Film,
  car: Car,
  utensils: Utensils,
  "shopping-bag": ShoppingBag,
  zap: Zap,
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: { name: string; amount: number; percentage: number };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-muted-foreground">{d.name}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">
        {formatCurrency(d.amount)}
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <Progress value={d.percentage} className="h-1" />
        <span className="text-[11px] font-semibold text-primary">{d.percentage}%</span>
      </div>
    </div>
  );
}

export default function CategoryChart({ data }: CategoryChartProps) {
  return (
    <Card className="h-full border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Expense Allocation</CardTitle>
        <CardDescription className="text-xs">
          Breakdown by category &middot; {formatCurrency(data.totalAmount)} total
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Donut */}
        <div className="relative mx-auto h-40 w-40 sm:h-48 sm:w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.categories}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                strokeWidth={0}
                animationBegin={0}
                animationDuration={1200}
              >
                {data.categories.map((cat) => (
                  <Cell key={cat.name} fill={cat.color} className="outline-none transition-opacity hover:opacity-80" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold tracking-tight">{formatCurrency(data.totalAmount)}</span>
            <span className="text-[11px] text-muted-foreground">Total</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Legend list */}
        <div className="flex flex-col gap-1">
          {data.categories.map((cat) => {
            const Icon = iconMap[cat.icon] || ShoppingCart;
            return (
              <div
                key={cat.name}
                className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${cat.color}18` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{cat.name}</p>
                    <p className="text-[11px] text-muted-foreground">{cat.transactionCount} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-foreground">{formatCurrency(cat.amount)}</p>
                  <p className="text-[11px] text-muted-foreground">{cat.percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
