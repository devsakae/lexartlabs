import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getCountFromServer, query, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRESTORE_API,
  authDomain: process.env.NEXT_PUBLIC_FIRESTORE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIRESTORE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIRESTORE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIRESTORE_SENDERID,
  appId: process.env.NEXT_PUBLIC_FIRESTORE_APPID
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
    return NextResponse.json({ error: 'Error fetching documents'}, { status: 500 });
  }
}