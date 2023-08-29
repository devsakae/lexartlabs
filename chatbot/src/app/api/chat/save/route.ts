import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, getCountFromServer, query, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCa3J-UryL7lzM1w6O-toqs_N6iUYg0sAw",
  authDomain: "lexartlabsbydevsakae.firebaseapp.com",
  projectId: "lexartlabsbydevsakae",
  storageBucket: "lexartlabsbydevsakae.appspot.com",
  messagingSenderId: "670372265591",
  appId: "1:670372265591:web:e346f89e37eecffb85d072"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  const { log, name } = await req.json();
  const lastDate = log[log.length - 1].timestamp;
  const coll = collection(db, 'logs');
  const snapshot = await getCountFromServer(coll);
  try {
    const docRef = await addDoc(collection(db, 'logs'), {
      filename: `Conversation user #${snapshot.data().count + 1} - ${lastDate}`,
      name: name,
      log: log,
    });
    return NextResponse.json({ status: 201, message: `Document created with id ${docRef.id}` });
  } catch (e) {
    console.error('Error adding document');
    return NextResponse.json({ status: 400, message: "Error saving document" });
  }
}

export async function GET() {
  try {
    let response: any = [];
    const q = query(collection(db, 'logs'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => response.push(doc.data()));
    return NextResponse.json({ status: 200, data: response })
  } catch (e) {
    console.error('Error searching docs');
    return NextResponse.json({ status: 500, message: 'Error fetching documents' });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// const path = require('path');
// const fs = require('fs');
// const json2csv = require('json2csv').parse;

// export async function POST(req: NextRequest) {
//   try {
//     fs.mkdir(path.join(__dirname, 'logs'), (err: Error) => { if (err) console.error(err); });
//     const { log } = await req.json();
//     const files = await fs.readdirSync(`${__dirname}/csv`, { withFileTypes: true });
//     const lastDate = log[log.length - 1].timestamp;
//     const fields = ['timestamp', 'author', 'message'];
//     const csv = json2csv(log, { headers: { fields } });
//     fs.writeFile(`${__dirname}/logs/Conversation user #${files} - ${lastDate}.json`, JSON.stringify(log), "utf-8", function(err: Error) { if (err) throw err; });
//   } catch (err) {
//     return NextResponse.json({ status: 500, message: 'ERROR saving log'});
//   } finally {
//      return NextResponse.json({ status: 200, message: 'LOG_SAVED' });
//   }
// }