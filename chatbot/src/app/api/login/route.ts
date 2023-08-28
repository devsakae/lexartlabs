import {  NextResponse } from "next/server";
import answers from '../database/answers.json';

export async function GET() {
  // Create database logic here
  return NextResponse.json({ status: 200, message: answers });
}