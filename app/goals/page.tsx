"use client";

import { useMemo } from "react";
import PageLayout from "@/components/page-layout";
import GoalTracker from "@/components/goal-tracker";
import api, { CUSTOMER_ID } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  Loader2,
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingDown,
  PiggyBank,
  ShieldCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function GoalsPage() {
  const { data: goals, isPending: goalsLoading } = api.useQuery(
    "get",
    "/api/customers/{customerId}/goals",
    { params: { path: { customerId: CUSTOMER_ID } } },
  );

  const stats = useMemo(() => {
    if (!goals?.goals) return null;
    const g = goals.goals;
    const totalBudget = g.reduce((sum, goal) => sum + goal.monthlyBudget, 0);
    const totalSpent = g.reduce((sum, goal) => sum + goal.currentSpent, 0);
    const onTrack = g.filter((goal) => goal.status === "on_track").length;
    const warning = g.filter((goal) => goal.status === "warning").length;
    const exceeded = g.filter((goal) => goal.status === "exceeded").length;
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const remaining = totalBudget - totalSpent;

    return {
      totalBudget,
      totalSpent,
      remaining,
      overallPercentage: Math.round(overallPercentage * 10) / 10,
      onTrack,
      warning,
      exceeded,
      totalGoals: g.length,
    };
  }, [goals]);

  return (
    <PageLayout title="Goals">
      {goalsLoading || !goals || !stats ? (
        <div className="flex flex-col items-center gap-6 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-4 w-40" />
            <Skeleton className="mx-auto h-3 w-28" />
          </div>
        </div>
      ) : (
        <>
          {/* Budget overview cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <Card className="border-border">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                    Total Budget
                  </p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-1/10">
                    <PiggyBank className="h-3.5 w-3.5 text-chart-1" />
                  </div>
                </div>
                <p className="mt-1 text-lg font-bold tracking-tight text-foreground sm:mt-2 sm:text-2xl">
                  {formatCurrency(stats.totalBudget)}
                </p>
                <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                  Across {stats.totalGoals} goals
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                    Total Spent
                  </p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-4/10">
                    <TrendingDown className="h-3.5 w-3.5 text-chart-4" />
                  </div>
                </div>
                <p className="mt-1 text-lg font-bold tracking-tight text-foreground sm:mt-2 sm:text-2xl">
                  {formatCurrency(stats.totalSpent)}
                </p>
                <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                  {stats.overallPercentage}% of budget used
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                    Remaining
                  </p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-2/10">
                    <ShieldCheck className="h-3.5 w-3.5 text-chart-2" />
                  </div>
                </div>
                <p className={`mt-1 text-lg font-bold tracking-tight sm:mt-2 sm:text-2xl ${stats.remaining >= 0 ? "text-foreground" : "text-destructive"}`}>
                  {formatCurrency(Math.abs(stats.remaining))}
                </p>
                <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                  {stats.remaining >= 0 ? "Still available" : "Over budget"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                    Goal Health
                  </p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-3.5 w-3.5 text-primary" />
                  </div>
                </div>
                <p className="mt-1 text-lg font-bold tracking-tight text-foreground sm:mt-2 sm:text-2xl">
                  {stats.onTrack}/{stats.totalGoals}
                </p>
                <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                  Goals on track
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Overall progress */}
          <Card className="border-border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">
                      Overall Budget Usage
                    </p>
                    <span
                      className={`text-sm font-bold ${
                        stats.overallPercentage > 100
                          ? "text-destructive"
                          : stats.overallPercentage > 80
                            ? "text-chart-4"
                            : "text-chart-2"
                      }`}
                    >
                      {stats.overallPercentage}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(stats.overallPercentage, 100)}
                    className={`h-3 ${
                      stats.overallPercentage > 100
                        ? "[&>div]:bg-destructive"
                        : stats.overallPercentage > 80
                          ? "[&>div]:bg-chart-4"
                          : "[&>div]:bg-chart-2"
                    }`}
                  />
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {formatCurrency(stats.totalSpent)} spent of{" "}
                      {formatCurrency(stats.totalBudget)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status breakdown + Goals list */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-12">
            {/* Status summary */}
            <div className="xl:col-span-4">
              <Card className="h-full border-border">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Status Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Overview of all budget goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-2/10">
                          <CheckCircle2 className="h-4 w-4 text-chart-2" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">On Track</p>
                          <p className="text-[11px] text-muted-foreground">
                            Within budget limits
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="border-0 bg-chart-2/10 text-sm font-bold text-chart-2">
                        {stats.onTrack}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-4/10">
                          <AlertTriangle className="h-4 w-4 text-chart-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Warning</p>
                          <p className="text-[11px] text-muted-foreground">
                            Approaching limit
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="border-0 bg-chart-4/10 text-sm font-bold text-chart-4">
                        {stats.warning}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Exceeded</p>
                          <p className="text-[11px] text-muted-foreground">
                            Over budget
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="border-0 bg-destructive/10 text-sm font-bold text-destructive">
                        {stats.exceeded}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full gap-2" size="sm">
                      <Target className="h-4 w-4" />
                      Create New Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goals list */}
            <div className="xl:col-span-8">
              <GoalTracker goals={goals.goals} />
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
