'use client';
import React, { useEffect, useState } from 'react';
import { Doc } from './logHistory';
import csvDownload from 'json-to-csv-export';

type Props = {
  item: Doc;
  handleClick: Function;
};

const LogHistoryItem = ({ item, handleClick }: Props) => {
  const [openLog, setOpenLog] = useState(false);
  const dataToConvert = {
    data: item.log,
    filename: item.filename,
    headers: ['author', 'message', 'timestamp', 'screen'],
  };

  return (
    <div className='flex flex-col border-2 rounded-md p-2'>
      <div className='flex flex-row items-center justify-between'>
        <div>
          <h1>{item.filename}</h1>
        </div>
        <div className='flex flex-row gap-4 text-xs'>
          <button
            className='p-2 px-4 bg-orange-300 hover:bg-orange-400 rounded-sm dark:text-black'
            onClick={() => setOpenLog((prev) => !prev)}
          >
            {openLog ? 'Close log' : 'Open log'}
          </button>
          <button
            className='p-2 px-4 bg-green-300 hover:bg-green-400 rounded-sm dark:text-black'
            onClick={() => csvDownload(dataToConvert)}
          >
            CSV file
          </button>
        </div>
      </div>
      {openLog && (
        <div className='flex flex-col w-full mt-4'>
          {item.log.map((log, index) => (
            <p key={index}>
              <span className='mr-2'>{log.author}:</span>
              <span>{log.screen ? '[Show options]' : log.message}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogHistoryItem;
