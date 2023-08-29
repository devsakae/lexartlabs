import React from 'react';
import { Parser } from 'html-to-react';

type Props = {
  message?: any;
};

const BotMessage = (props: Props) => {
  const htmlParser = new (Parser as any)();
  return (
    <div className='flex flex-row items-end justify-end w-full'>
      <p className='text-left border-blue-600 border-2 border-opacity-30 rounded-md bg-blue-500 text-white py-2 px-3 max-w-sm whitespace-break-spaces'>
        { props.message.startsWith('<') ? htmlParser.parse(props.message) : props.message }
      </p>
    </div>
  );
};

export default BotMessage;
