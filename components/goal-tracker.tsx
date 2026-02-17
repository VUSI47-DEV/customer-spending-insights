"use client";

import { Target, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { SpendingGoal } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface GoalTrackerProps {
  goals: SpendingGoal[];
}

const statusConfig = {
  on_track: {
    label: "On Track",
    progressClass: "[&>div]:bg-chart-2",
    icon: CheckCircle2,
    badgeClass: "bg-chart-2/10 text-chart-2 border-0",
    dotColor: "bg-chart-2",
  },
  warning: {
    label: "Warning",
    progressClass: "[&>div]:bg-chart-4",
    icon: AlertTriangle,
    badgeClass: "bg-chart-4/10 text-chart-4 border-0",
    dotColor: "bg-chart-4",
  },
  exceeded: {
    label: "Exceeded",
    progressClass: "[&>div]:bg-destructive",
    icon: XCircle,
    badgeClass: "bg-destructive/10 text-destructive border-0",
    dotColor: "bg-destructive",
  },
};

export default function GoalTracker({ goals }: GoalTrackerProps) {
  return (
    <Card className="h-full border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Budget Goals</CardTitle>
            <CardDescription className="text-xs">Monthly limits tracking</CardDescription>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {goals.map((goal) => {
            const config = statusConfig[goal.status];
            const barWidth = Math.min(goal.percentageUsed, 100);

            return (
              <div key={goal.id} className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{goal.category}</span>
                    <Badge variant="secondary" className={`gap-1 text-[11px] font-medium ${config.badgeClass}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
                      {config.label}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {goal.daysRemaining}d left
                  </span>
                </div>

                <Progress value={barWidth} className={`h-2 ${config.progressClass}`} />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(goal.currentSpent)}
                    <span className="mx-1 text-muted-foreground/40">/</span>
                    {formatCurrency(goal.monthlyBudget)}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      goal.percentageUsed > 100
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {goal.percentageUsed.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
