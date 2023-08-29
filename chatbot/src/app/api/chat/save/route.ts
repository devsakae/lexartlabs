import { NextRequest, NextResponse } from "next/server";
const path = require('path');
const fs = require('fs');

export async function POST(req: NextRequest) {
  const body = await req.json();

  for (const entry of body.log) {
    fs.appendFileSync(`${__dirname}/history_${body.name}.json`, JSON.stringify(entry));
  };
  
  // fs.writeFile(path + '/relatorio.json', JSON.stringify(res), 'utf8', function (err: Error){
  //   if (err) console.error('Some error occured')
  //   else console.log('Written!');
  // })
  return NextResponse.json({ status: 200, message: 'LOG_SAVED' });
}

export const config = {
  api: {
    bodyParser: false,
  },
}