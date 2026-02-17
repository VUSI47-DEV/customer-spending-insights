"use client";

import { useState } from "react";
import PageLayout from "@/components/page-layout";
import SummaryCards from "@/components/summary-cards";
import CategoryChart from "@/components/category-chart";
import TrendChart from "@/components/trend-chart";
import TransactionTable from "@/components/transaction-table";
import GoalTracker from "@/components/goal-tracker";
import { type Period } from "@/components/period-filter";
import api, { CUSTOMER_ID } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
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

  const { data: goals, isPending: goalsLoading } = api.useQuery(
    "get",
    "/api/customers/{customerId}/goals",
    { params: { path: { customerId: CUSTOMER_ID } } },
  );

  const isLoading = summaryLoading || categoriesLoading || trendsLoading || goalsLoading;

  return (
    <PageLayout title="Dashboard">
      {isLoading || !summary || !categories || !trends || !goals ? (
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

          {/* Chart: full width spending trends with period filter inside */}
          <TrendChart data={trends} period={period} onPeriodChange={setPeriod} />

          {/* Lower section: categories + goals */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <CategoryChart data={categories} />
            </div>
            <div className="xl:col-span-7">
              <GoalTracker goals={goals.goals} />
            </div>
          </div>

          {/* Transactions table (full width) */}
          <TransactionTable />
        </>
      )}
    </PageLayout>
  );
}
