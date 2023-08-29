import { NextResponse } from "next/server";
import answers from "../../database/answers.json";

export async function GET() {
  // Simple logic for loan prompt (model for others)
  return NextResponse.json({ status: 200, data: answers.loanMenu });
}