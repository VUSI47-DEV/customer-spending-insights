import { NextResponse } from "next/server";
import { getFilters } from "@/lib/mock-data";

export async function GET() {
  const filters = getFilters();
  return NextResponse.json(filters);
}
