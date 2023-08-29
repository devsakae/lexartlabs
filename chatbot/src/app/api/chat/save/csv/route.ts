import { NextRequest, NextResponse } from "next/server";
const fs = require('fs');
const json2csv = require('json2csv').parse;

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const payload = await req.json();
    const fields = ['timestamp', 'author', 'message'];
    const csv = json2csv(payload.log, { headers: { fields } });
    fs.writeFile(`${__dirname}/${payload.filename}.csv`, csv, "csv", function(err: Error) { if (err) throw err; });
    return NextResponse.json({ status: 200, message: 'Saved log' });

  } catch (err) {
    return NextResponse.json({ status: 500, message: 'ERROR saving log'});
  }
}