import { NextResponse } from "next/server";
import { getCustomerProfile } from "@/lib/mock-data";

export async function GET() {
  const profile = getCustomerProfile();
  return NextResponse.json(profile);
}
