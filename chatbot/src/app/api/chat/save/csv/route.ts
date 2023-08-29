import { NextRequest, NextResponse } from "next/server";
const fs = require('fs');
import { json2csv } from 'json-2-csv';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const payload = await req.json();
    const csv = await json2csv(payload.log);
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    return NextResponse.json(csv, { status: 200, statusText: 'Saved log', headers });

  } catch (err) {
    return NextResponse.json({ error: 'Error converting log'}, { status: 500 });
  }
}