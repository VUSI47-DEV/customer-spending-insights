import { type NextRequest, NextResponse } from "next/server";
import { getTransactions } from "@/lib/mock-data";
import type { TransactionFilters } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const minAmountParam = searchParams.get("minAmount");

  const filters: TransactionFilters = {
    limit: Number(searchParams.get("limit")) || 20,
    offset: Number(searchParams.get("offset")) || 0,
    category: searchParams.get("category") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    minAmount: minAmountParam ? Number(minAmountParam) : undefined,
    sortBy: (searchParams.get("sortBy") as TransactionFilters["sortBy"]) || "date_desc",
  };

  const result = getTransactions(filters);
  return NextResponse.json(result);
}
