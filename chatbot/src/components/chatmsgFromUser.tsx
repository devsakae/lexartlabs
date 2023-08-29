import React from 'react';

type Props = {
  message?: string;
};

const UserMessage = (props: Props) => {
  return (
    <div className='flex flex-row items-start justify-start w-full'>
      <p className='text-left dark:text-stone-800 border-green-500 border-2 border-opacity-30 rounded-md bg-green-400 py-2 px-3 max-w-sm'>
        {props.message}
      </p>
    </div>
  );
};

export default UserMessage;
