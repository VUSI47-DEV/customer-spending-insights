import { type NextRequest, NextResponse } from "next/server";
import { getSpendingSummary } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const period = searchParams.get("period") || "30d";

  const summary = getSpendingSummary(period);
  return NextResponse.json(summary);
}
