import { NextResponse } from 'next/server';
// import answers from './database/answers.json';

type Data = {
  message: string;
};

export async function GET() {
  const res = await fetch('/database/answers.json');
  const data = res.json();
  return NextResponse.json({ data });
}