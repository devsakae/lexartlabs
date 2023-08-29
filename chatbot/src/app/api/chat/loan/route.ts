import { NextResponse } from "next/server";
import answers from "../../database/answers.json";

export async function GET() {
  let response = { status: 200, data: answers.loanMenu };
  return NextResponse.json(response);
}