import React from 'react';
import { format } from 'timeago.js';

const Message = ({ message, user }) => {
  return (
    <>
      {message.senderId === user._id ? (
        <div className='w-full flex flex-row-reverse'>
          <div className='flex flex-col items-end'>
            <div className='rounded-2xl inline-block text-white p-4 rounded-br-none bg-[#f97f71]'>
              {message.text}
            </div>
            <div className='text-gray-600 text-end'>
              {format(message.createdAt)}
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full flex'>
          <div className='flex flex-col items-start'>
            <div className='rounded-2xl text-white p-4 rounded-bl-none bg-[#799c9a]'>
              {message.text}
            </div>
            <div className='text-gray-600'>{format(message.createdAt)}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
