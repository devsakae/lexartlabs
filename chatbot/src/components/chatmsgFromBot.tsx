import React from 'react';

type Props = {
  message?: any;
};

const BotMessage = (props: Props) => {
  return (
    <div className='flex flex-row items-end justify-end w-full'>
      <p className='text-left border-blue-600 border-2 border-opacity-30 rounded-md bg-blue-500 text-white py-2 px-3 max-w-sm transition duration-150 ease-in-out'>
        { props.message }
      </p>
    </div>
  );
};

export default BotMessage;
