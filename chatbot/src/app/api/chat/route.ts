import {  NextResponse } from "next/server";
import answers from "../database/answers.json";

export async function GET() {
  const greet = answers.greetings[Math.floor(Math.random() * answers.greetings.length)].message;
  const data = {
    ...answers,
    "greetings": greet,
  }
  let response = { status: 200, data };
  return NextResponse.json(response);
}