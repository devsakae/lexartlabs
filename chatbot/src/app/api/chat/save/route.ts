import { NextRequest, NextResponse } from "next/server";
const path = require('path');
const fs = require('fs');

export async function POST(req: NextRequest) {
  const res = await req.json();

  await fs.writeFile(`${path}/logs/Conversation user #1 - teste.csv`, JSON.stringify(res.log), 'utf8', (err: any) => {
    if (err) console.error('Some error occured')
    console.log('Finished');
  })
  return NextResponse.json({ status: 200, message: 'LOG_SAVED' });
}

export const config = {
  api: {
    bodyParser: false,
  },
}