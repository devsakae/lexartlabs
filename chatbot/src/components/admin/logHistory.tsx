'use client'
import { useEffect, useState } from 'react';
import LogHistoryItem from './logHistoryItem';

export type Log = {
  author: string;
  message?: string;
  timestamp: string;
  screen?: Object;
}

export type Doc = {
  filename: string;
  name: string;
  log: Log[];
}

const LogHistory = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Doc[]>();

  useEffect(() => {
    setLoading(true);
    const fetchLogs = async () => {
      await fetch('/api/chat/save/')
      .then(response => response.json())
      .then((json) => {
        if (json.status === 200) {
          setData(json.data);
        } else throw new Error;
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    };
    fetchLogs();
  }, []);

  return (
    <section className='w-full h-screen flex flex-col items-center justify-start gap-5'>
      <h2>DISCLAIMER: Logs will be erased September 28</h2>
      <div className='flex flex-col gap-2 w-full md:w-3/4 px-4'>
        { loading ? (<div>Loading...</div>) : data?.map((entry) => (<LogHistoryItem item={ entry } key={ entry.filename } />)) }
      </div>
    </section>
  )
}

export default LogHistory