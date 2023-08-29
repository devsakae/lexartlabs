import { NextRequest, NextResponse } from "next/server";
const path = require('path');
const fs = require('fs');

export async function POST(req: NextRequest) {
  fs.mkdir('/logs', { recursive: true }, (err: any) => {
    if (err) throw err;
  });
  const res = await req.json();
  const dirpath = path.join(__dirname, '/logs');
  fs.writeFile(`${dirpath}/RELATORIO TESTE.csv`, JSON.stringify(res.log), 'utf8', (err: any) => {
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