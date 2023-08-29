'use client';
import LogHistory from '@/components/admin/logHistory';
import { useEffect, useState } from 'react';

type Props = {}

const page = (props: Props) => {
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (password === process.env.NEXT_PUBLIC_LOG_PASSWORD) setChecked(true);
  }, [password])

  return (
    <section className='flex flex-col h-screen'>
      <div className='flex flex-col items-center justify-center bg-slate-200 w-full h-1/6 fixed'>
        <h1>Chatbot log history</h1>
        <legend className='text-xs'>Created by Rodrigo Sakae</legend>
      </div>
      <div className='pt-28 flex flex-col items-center justify-center h-screen'>
        {checked
          ? <LogHistory />
          : <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password provided by e-mail'
            className='border-[1px] border-purple-400 w-80 p-2 rounded-md'
          />
        }
      </div>
    </section>
  )
}

export default page