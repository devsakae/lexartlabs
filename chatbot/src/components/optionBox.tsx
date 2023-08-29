import React from 'react';
import { OptionMenu } from './chatbot';

type Props = {
  options: OptionMenu[];
  handleAction: Function;
}

const OptionsBox = ({ options, handleAction }: Props) => {
  return (
    <div className='flex flex-row items-end justify-end w-full'>
      <div className='text-left border-blue-600 border-2 border-opacity-30 rounded-md bg-blue-500 text-white py-2 px-3 max-w-sm transition duration-150 ease-in-out'>
        { options.map((opt, index) => (
          <div
            key={index}
            role='button'
            onClick={ () => handleAction(opt.id) }
            className='bg-cyan-500 my-2 p-2 px-4 rounded-md hover:bg-cyan-700'
          >
          {opt.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OptionsBox