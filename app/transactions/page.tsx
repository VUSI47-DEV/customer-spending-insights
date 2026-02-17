"use client";

import { useState } from "react";
import PageLayout from "@/components/page-layout";
import TransactionTable from "@/components/transaction-table";
import api, { CUSTOMER_ID } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { type Period } from "@/components/period-filter";
import { Loader2, Receipt, ArrowUpRight, ArrowDownRight, Wallet, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TransactionsPage() {
  const [period] = useState<Period>("30d");

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

  const isLoading = summaryLoading || categoriesLoading;

  return (
    <PageLayout title="Transactions">
      {isLoading || !summary || !categories ? (
        <div className="flex flex-col items-center gap-6 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-4 w-40" />
            <Skeleton className="mx-auto h-3 w-28" />
          </div>
        </div>
      ) : (
        <>
          {/* Transaction summary stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <Card className="border-border">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                    Total Spent
                  </p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-1/10">
                    <Wallet className="h-3.5 w-3.5 text-chart-1" />
                  </div>
                </div>
                <p className="mt-1 text-lg font-bold tracking-tight text-foreground sm:mt-2 sm:text-2xl">
                  {formatCurrency(summary.totalSpent)}
                </p>
                <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                    Transaction Count
                  </p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-2/10">
                    <Receipt className="h-3.5 w-3.5 text-chart-2" />
                  </div>
                </div>
                <p className="mt-1 text-lg font-bold tracking-tight text-foreground sm:mt-2 sm:text-2xl">
                  {summary.transactionCount.toLocaleString()}
                </p>
                <div className="mt-0.5 hidden sm:flex sm:items-center sm:gap-1">
                  <Badge
                    variant="secondary"
                    className={`gap-0.5 border-0 px-1.5 py-0 text-[11px] font-semibold ${
                      summary.comparedToPrevious.transactionChange >= 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {summary.comparedToPrevious.transactionChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(summary.comparedToPrevious.transactionChange)}%
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">vs prior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                    Avg. Transaction
                  </p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-3/10">
                    <CreditCard className="h-3.5 w-3.5 text-chart-3" />
                  </div>
                </div>
                <p className="mt-1 text-lg font-bold tracking-tight text-foreground sm:mt-2 sm:text-2xl">
                  {formatCurrency(summary.averageTransaction)}
                </p>
                <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                  Per transaction
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                    Top Category
                  </p>
                </div>
                <p className="mt-1 text-lg font-bold tracking-tight text-foreground sm:mt-2 sm:text-2xl">
                  {summary.topCategory}
                </p>
                <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                  Highest spend category
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category quick breakdown */}
          <div className="flex flex-wrap gap-2">
            {categories.categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs font-medium text-foreground">
                  {cat.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(cat.amount)}
                </span>
                <Badge variant="secondary" className="h-5 border-0 px-1.5 text-[10px]">
                  {cat.percentage}%
                </Badge>
              </div>
            ))}
          </div>

          {/* Full-width transaction table */}
          <TransactionTable />
        </>
      )}
    </PageLayout>
  );
}
