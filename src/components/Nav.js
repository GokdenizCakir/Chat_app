import React from 'react';

const Nav = ({ conversation, user }) => {
  return (
    <div className='h-[4.5rem] font-bold text-xl text-white bg-[#4a7776] flex text-center justify-center items-center'>
      {conversation?.members.find((m) => m._id !== user._id).username}
    </div>
  );
};

export default Nav;
