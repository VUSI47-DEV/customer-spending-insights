import { type NextRequest, NextResponse } from "next/server";
import { getSpendingByCategory } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const period = searchParams.get("period") || "30d";

  const categories = getSpendingByCategory(period);
  return NextResponse.json(categories);
}
