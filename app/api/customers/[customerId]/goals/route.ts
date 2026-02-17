import { NextResponse } from "next/server";
import { getSpendingGoals } from "@/lib/mock-data";

export async function GET() {
  const goals = getSpendingGoals();
  return NextResponse.json(goals);
}
