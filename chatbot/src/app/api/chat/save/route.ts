// import { NextRequest, NextResponse } from "next/server";
// const path = require('path');
// const fs = require('fs');

// export async function POST(req: NextRequest) {
//   // fs.mkdir('./history', { recursive: true }, (err: any) => {
//   //   if (err) throw err;
//   // });
//   const res = await req.json();
//   // fs.mkdir(path.join(__dirname, '/history'))
//   // const dirpath = path.join(__dirname, '/history');
//   fs.writeFile(path + '/relatorio.json', JSON.stringify(res), 'utf8', function (err: Error){
//     if (err) console.error('Some error occured')
//     else console.log('Written!');
//   })
//   return NextResponse.json({ status: 200, message: 'LOG_SAVED' });
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// import { NextApiHandler, NextApiRequest } from "next";
import { NextRequest, NextResponse } from 'next/server';
import fs from "fs";
import { stringify } from "csv-stringify";
// import { firestore } from "../../firestore";

export async function POST(req: NextRequest) {
  const { name, log } = await req.json();
  const filename = `Chat with ${name}.csv`;
  console.log('creating a chat file named', filename);
  const writableStream = fs.createWriteStream(filename);
  const columns = ["timestamp", "author", "message"];
  const stringifier = stringify({ header: true, columns });

  stringifier.pipe(writableStream);
  stringifier.on('finish', async () => {
    const csvFile = await fs.promises.readFile(
      `${process.cwd()}/${filename}`,
      "utf-8"
    );
    return NextResponse.json({
      status: 200,
      send: csvFile
    })
  });
  for (const entry of log) {
    console.log('writing', entry.author, 'message')
    stringifier.write([entry.timestamp, entry.author, entry.message], "utf-8");
  }
  stringifier.end();

    // const csvFile = await fs.promises.readFile(
    //   `${process.cwd()}/${filename}`,
    //   "utf-8"
    // );
    // return NextResponse.json({
    //   status: 200,
    //   send: csvFile
    // header: {
    //   'Content-Type': 'text/csv',
    //   'Content-Disposition': `attachment; filename=${csvFile}`,
    // },
    // message: 'Log saved'
    // })

    // stringifier.on("close", async () => {
    //   const csvFile = fs.readFileSync(`${process.cwd()}/${filename}`, "utf-8");
    //   return NextResponse.json({ status: 200, message: 'LOG_SAVED' });
    // res
    //   .status(200)
    //   .setHeader("Content-Type", "text/csv")
    //   .setHeader("Content-Disposition", `attachment; filename=${filename}`)
    //   .send(csvFile);
    // });
    // stringifier.end();
    // res.status(200).setHeader("Content-Type", "text/csv").send({ message: 'This is a test '});
  };

  export const config = {
    api: {
      bodyParser: false,
    },
  }