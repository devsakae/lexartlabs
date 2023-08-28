import { NextRequest, NextResponse } from "next/server";
import answers from "../../database/answers.json";

export async function GET(request: NextRequest) {
  console.log(request);
  let response = { status: 'success', results: 'API answer here' };
  return NextResponse.json(response);
}