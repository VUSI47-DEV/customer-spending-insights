"use client";

import { useState, useMemo } from "react";
import {
  ShoppingCart, Film, Car, Utensils, ShoppingBag, Zap,
  ChevronLeft, ChevronRight, ArrowUpDown, Loader2, Download, SlidersHorizontal,
} from "lucide-react";
import type { Transaction, TransactionFilters } from "@/lib/types";
import api, { CUSTOMER_ID } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAGE_SIZE = 8;
const HIGH_VALUE_THRESHOLD = 300;

const iconMap: Record<string, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  film: Film,
  car: Car,
  utensils: Utensils,
  "shopping-bag": ShoppingBag,
  zap: Zap,
};

type TabValue = "all" | "recent" | "high";

function getRecentStartDate(): string {
  const d = new Date("2024-09-10T00:00:00Z");
  return d.toISOString();
}

export default function TransactionTable() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<TransactionFilters["sortBy"]>("date_desc");
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const { data: filters } = api.useQuery(
    "get",
    "/api/customers/{customerId}/filters",
    { params: { path: { customerId: CUSTOMER_ID } } },
  );

  const tabQueryParams = useMemo(() => {
    switch (activeTab) {
      case "recent":
        return { startDate: getRecentStartDate() };
      case "high":
        return { minAmount: HIGH_VALUE_THRESHOLD };
      default:
        return {};
    }
  }, [activeTab]);

  const { data, isPending: isLoading, isFetching } = api.useQuery(
    "get",
    "/api/customers/{customerId}/transactions",
    {
      params: {
        path: { customerId: CUSTOMER_ID },
        query: {
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE,
          category: categoryFilter === "all" ? undefined : categoryFilter,
          sortBy,
          ...tabQueryParams,
        },
      },
    },
  );

  // Separate queries for badge counts (fetch total counts without pagination)
  const { data: allData } = api.useQuery(
    "get",
    "/api/customers/{customerId}/transactions",
    {
      params: {
        path: { customerId: CUSTOMER_ID },
        query: {
          limit: 1,
          offset: 0,
          category: categoryFilter === "all" ? undefined : categoryFilter,
        },
      },
    },
  );

  const { data: recentData } = api.useQuery(
    "get",
    "/api/customers/{customerId}/transactions",
    {
      params: {
        path: { customerId: CUSTOMER_ID },
        query: {
          limit: 1,
          offset: 0,
          startDate: getRecentStartDate(),
          category: categoryFilter === "all" ? undefined : categoryFilter,
        },
      },
    },
  );

  const { data: highData } = api.useQuery(
    "get",
    "/api/customers/{customerId}/transactions",
    {
      params: {
        path: { customerId: CUSTOMER_ID },
        query: {
          limit: 1,
          offset: 0,
          minAmount: HIGH_VALUE_THRESHOLD,
          category: categoryFilter === "all" ? undefined : categoryFilter,
        },
      },
    },
  );

  const totalPages = data ? Math.ceil(data.pagination.total / PAGE_SIZE) : 0;

  function handleTabChange(tab: string) {
    setActiveTab(tab as TabValue);
    setPage(0);
  }

  function handleCategoryChange(value: string) {
    setCategoryFilter(value);
    setPage(0);
  }

  function toggleSort(field: "date" | "amount") {
    if (field === "date") {
      setSortBy((prev) => (prev === "date_desc" ? "date_asc" : "date_desc"));
    } else {
      setSortBy((prev) => (prev === "amount_desc" ? "amount_asc" : "amount_desc"));
    }
    setPage(0);
  }

  return (
    <Card className="border-border">
      <CardContent className="p-0">
        {/* Tabs + Actions row */}
        <div className="border-b border-border">
          {/* Tabs - scrollable on mobile */}
          <div className="-mb-px overflow-x-auto px-3 sm:px-5">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="h-auto w-max bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="whitespace-nowrap rounded-none border-b-2 border-transparent px-3 pb-3 pt-3 text-xs font-medium sm:text-sm data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  All
                  <span className="hidden sm:inline">&nbsp;Transactions</span>
                  <Badge variant="secondary" className="ml-1.5 h-5 rounded-md px-1.5 text-[10px]">
                    {allData?.pagination.total ?? "—"}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="whitespace-nowrap rounded-none border-b-2 border-transparent px-3 pb-3 pt-3 text-xs font-medium sm:text-sm data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Recent
                  <Badge variant="secondary" className="ml-1.5 h-5 rounded-md px-1.5 text-[10px]">
                    {recentData?.pagination.total ?? "—"}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="high"
                  className="whitespace-nowrap rounded-none border-b-2 border-transparent px-3 pb-3 pt-3 text-xs font-medium sm:text-sm data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  High Value
                  <Badge variant="secondary" className="ml-1.5 h-5 rounded-md px-1.5 text-[10px]">
                    {highData?.pagination.total ?? "—"}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 border-t border-border px-3 py-2.5 sm:px-5">
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-8 w-[130px] text-xs sm:w-[150px]">
                <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filters?.categories.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="h-8 w-8 sm:hidden">
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="hidden h-8 gap-1.5 text-xs sm:inline-flex">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-3 p-4 sm:p-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-3.5 w-16" />
                </div>
              ))}
            </div>
          ) : data?.transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No transactions found</p>
              <p className="text-xs text-muted-foreground/60">
                Try adjusting your filters or selecting a different tab.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[90px] text-xs font-medium sm:w-[110px]">
                    <button
                      onClick={() => toggleSort("date")}
                      className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="min-w-[160px] text-xs font-medium">Merchant</TableHead>
                  <TableHead className="hidden text-xs font-medium sm:table-cell">Category</TableHead>
                  <TableHead className="hidden text-xs font-medium md:table-cell">Status</TableHead>
                  <TableHead className="text-right text-xs font-medium">
                    <button
                      onClick={() => toggleSort("amount")}
                      className="ml-auto flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden text-xs font-medium lg:table-cell">Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.transactions.map((txn: Transaction) => {
                  const Icon = iconMap[txn.icon] || ShoppingCart;
                  return (
                    <TableRow key={txn.id} className="group">
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(txn.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                            {txn.merchant.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{txn.merchant}</p>
                            <p className="truncate text-[11px] text-muted-foreground">{txn.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: txn.categoryColor }} />
                          <span className="text-xs text-foreground">{txn.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="secondary"
                          className="gap-1 border-0 bg-chart-2/10 text-[11px] font-medium text-chart-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />
                          Done
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold text-foreground">
                        {formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {txn.paymentMethod}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {data && data.transactions.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-3 py-3 sm:px-5">
            <p className="text-[11px] text-muted-foreground sm:text-xs">
              {page + 1}/{totalPages} &middot; {data.pagination.total} records
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={!data.pagination.hasMore}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isFetching && !isLoading && (
          <div className="flex items-center justify-center border-t border-border py-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
