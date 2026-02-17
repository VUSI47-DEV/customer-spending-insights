"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { SpendingSummary } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SummaryCardsProps {
  summary: SpendingSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Spent",
      value: formatCurrency(summary.totalSpent),
      change: summary.comparedToPrevious.spentChange,
      description: "Trending this period",
    },
    {
      title: "Transactions",
      value: summary.transactionCount.toLocaleString(),
      change: summary.comparedToPrevious.transactionChange,
      description: summary.comparedToPrevious.transactionChange >= 0
        ? "Higher activity this period"
        : "Lower activity this period",
    },
    {
      title: "Avg. Transaction",
      value: formatCurrency(summary.averageTransaction),
      change: null,
      description: "Per transaction average",
    },
    {
      title: "Top Category",
      value: summary.topCategory,
      change: null,
      description: "Highest spend category",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-start justify-between gap-1">
              <p className="text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                {card.title}
              </p>
              {card.change !== null && (
                <Badge
                  variant="secondary"
                  className={`gap-0.5 border-0 px-1.5 py-0 text-[11px] font-semibold ${
                    card.change >= 0
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}
                >
                  {card.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(card.change)}%
                </Badge>
              )}
            </div>
            <p className="mt-1 text-lg font-bold tracking-tight text-foreground sm:mt-2 sm:text-2xl">
              {card.value}
            </p>
            <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
              {card.description}{" "}
              {card.change !== null && (
                <span className={card.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                  {card.change >= 0 ? "↗" : "↘"}
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
