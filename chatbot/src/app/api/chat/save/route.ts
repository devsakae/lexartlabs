import { NextRequest, NextResponse } from "next/server";
const fs = require('fs');
const json2csv = require('json2csv').parse;

export async function POST(req: NextRequest) {
  try {
    const { log } = await req.json();
    const files = fs.readdirSync(__dirname, { withFileTypes: true }).length
    const lastDate = log[log.length - 1].timestamp;
    const fields = ['timestamp', 'author', 'message'];
    const csv = json2csv(log, { fields });
    fs.writeFile(`${__dirname}/Conversation user #${files} - ${lastDate}.csv`, csv, function(err: Error) {
      if (err) throw err;
      else return NextResponse.json({ status: 200, message: 'LOG_SAVED' });
    })
  } catch (err) {
    return NextResponse.json({ status: 500, message: 'ERROR saving log'});
  }
  
}

export const config = {
  api: {
    bodyParser: false,
  },
}