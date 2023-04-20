import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = ({ currentUser, conversation }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const user = conversation.members.find((m) => m._id !== currentUser._id);
    setUsername(user.username);
  }, [conversation, currentUser]);
  return (
    <button
      className={`${
        window.location.pathname === '/' + username
          ? null
          : 'bg-[#889E98] hover:scale-105 hover:ring ring-white cursor-pointer'
      } flex p-4 rounded-xl transition-all justify-center items-center w-full `}
    >
      {username}
    </button>
  );
};

export default Chat;
