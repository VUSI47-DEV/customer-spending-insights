import { NextResponse } from "next/server";
import { getSpendingTrends } from "@/lib/mock-data";

export async function GET() {
  const trends = getSpendingTrends();
  return NextResponse.json(trends);
}
