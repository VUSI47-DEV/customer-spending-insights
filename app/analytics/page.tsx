"use client";

import { useState, useMemo } from "react";
import PageLayout from "@/components/page-layout";
import SummaryCards from "@/components/summary-cards";
import CategoryChart from "@/components/category-chart";
import TrendChart from "@/components/trend-chart";
import { type Period } from "@/components/period-filter";
import api, { CUSTOMER_ID } from "@/lib/api";
import { formatCurrency, formatMonth } from "@/lib/utils";
import { Loader2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface MonthlyTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: { month: string; totalSpent: number; transactionCount: number };
  }>;
}

function MonthlyTooltip({ active, payload }: MonthlyTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-muted-foreground">{formatMonth(d.month)}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">{formatCurrency(d.totalSpent)}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {d.transactionCount} transactions
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");

  const { data: summary, isPending: summaryLoading } = api.useQuery(
    "get",
    "/api/customers/{customerId}/spending/summary",
    { params: { path: { customerId: CUSTOMER_ID }, query: { period } } },
  );

  const { data: categories, isPending: categoriesLoading } = api.useQuery(
    "get",
    "/api/customers/{customerId}/spending/categories",
    { params: { path: { customerId: CUSTOMER_ID }, query: { period } } },
  );

  const { data: trends, isPending: trendsLoading } = api.useQuery(
    "get",
    "/api/customers/{customerId}/spending/trends",
    { params: { path: { customerId: CUSTOMER_ID } } },
  );

  const isLoading = summaryLoading || categoriesLoading || trendsLoading;

  const monthlyComparison = useMemo(() => {
    if (!trends?.trends || trends.trends.length < 2) return null;
    const sorted = [...trends.trends].sort((a, b) => a.month.localeCompare(b.month));
    const current = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];
    const change = previous.totalSpent > 0
      ? ((current.totalSpent - previous.totalSpent) / previous.totalSpent) * 100
      : 0;
    return {
      currentMonth: formatMonth(current.month),
      previousMonth: formatMonth(previous.month),
      currentSpent: current.totalSpent,
      previousSpent: previous.totalSpent,
      change: Math.round(change * 10) / 10,
      currentTransactions: current.transactionCount,
      previousTransactions: previous.transactionCount,
    };
  }, [trends]);

  const spendingStats = useMemo(() => {
    if (!trends?.trends || trends.trends.length === 0) return null;
    const amounts = trends.trends.map((t) => t.totalSpent);
    const total = amounts.reduce((sum, a) => sum + a, 0);
    return {
      average: total / amounts.length,
      highest: Math.max(...amounts),
      lowest: Math.min(...amounts),
      highestMonth: formatMonth(
        trends.trends[amounts.indexOf(Math.max(...amounts))].month,
      ),
      lowestMonth: formatMonth(
        trends.trends[amounts.indexOf(Math.min(...amounts))].month,
      ),
    };
  }, [trends]);

  return (
    <PageLayout title="Analytics">
      {isLoading || !summary || !categories || !trends ? (
        <div className="flex flex-col items-center gap-6 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-4 w-40" />
            <Skeleton className="mx-auto h-3 w-28" />
          </div>
        </div>
      ) : (
        <>
          {/* KPI summary cards */}
          <SummaryCards summary={summary} />

          {/* Spending trends chart */}
          <TrendChart data={trends} period={period} onPeriodChange={setPeriod} />

          {/* Monthly comparison + Spending stats */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Month-over-month comparison */}
            {monthlyComparison && (
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Monthly Comparison
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {monthlyComparison.previousMonth} vs {monthlyComparison.currentMonth}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`gap-1 border-0 text-xs font-semibold ${
                        monthlyComparison.change >= 0
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {monthlyComparison.change >= 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      {Math.abs(monthlyComparison.change)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {monthlyComparison.previousMonth}
                        </p>
                        <p className="mt-1 text-xl font-bold tracking-tight text-foreground">
                          {formatCurrency(monthlyComparison.previousSpent)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {monthlyComparison.previousTransactions} transactions
                        </p>
                      </div>
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {monthlyComparison.currentMonth}
                        </p>
                        <p className="mt-1 text-xl font-bold tracking-tight text-foreground">
                          {formatCurrency(monthlyComparison.currentSpent)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {monthlyComparison.currentTransactions} transactions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                      {monthlyComparison.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                      )}
                      <p className="text-xs text-muted-foreground">
                        {monthlyComparison.change >= 0
                          ? `Spending increased by ${formatCurrency(monthlyComparison.currentSpent - monthlyComparison.previousSpent)} this month`
                          : `Spending decreased by ${formatCurrency(monthlyComparison.previousSpent - monthlyComparison.currentSpent)} this month`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Spending statistics */}
            {spendingStats && (
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Spending Statistics
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Key metrics across all periods
                      </CardDescription>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Monthly Average
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {formatCurrency(spendingStats.average)}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-1/10">
                        <BarChart3 className="h-4 w-4 text-chart-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-border px-4 py-3">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Highest Month
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-foreground">
                          {formatCurrency(spendingStats.highest)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {spendingStats.highestMonth}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border px-4 py-3">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Lowest Month
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-foreground">
                          {formatCurrency(spendingStats.lowest)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {spendingStats.lowestMonth}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Monthly bar chart + Category breakdown */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Monthly Spending Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Transaction volume by month
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[260px] w-full sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={trends.trends}
                        margin={{ top: 10, right: 4, left: -25, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="4 4"
                          vertical={false}
                          stroke="currentColor"
                          className="text-border"
                        />
                        <XAxis
                          dataKey="month"
                          tickFormatter={formatMonth}
                          tick={{ fontSize: 10, fontWeight: 500, fill: "currentColor" }}
                          className="text-muted-foreground"
                          axisLine={false}
                          tickLine={false}
                          dy={10}
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
                        <Tooltip content={<MonthlyTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
                        <Bar
                          dataKey="totalSpent"
                          radius={[6, 6, 0, 0]}
                          animationDuration={1200}
                        >
                          {trends.trends.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === trends.trends.length - 1
                                  ? "var(--chart-1)"
                                  : "var(--chart-1)"
                              }
                              fillOpacity={
                                index === trends.trends.length - 1 ? 1 : 0.4
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="xl:col-span-5">
              <CategoryChart data={categories} />
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
