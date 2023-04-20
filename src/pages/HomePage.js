import axios from 'axios';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import io from 'socket.io-client';
import { userState } from '../globalState/atom';
import plusIcon from './../assets/plus.svg';
import searchIcon from './../assets/search.svg';
import sendIcon from './../assets/send.svg';
import Chat from './../components/Chat';
import Nav from '../components/Nav';
import Message from '../components/Message';
import Modal from '../components/Modal';

const Home = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const scrollRef = useRef();
  const [user, setUser] = useRecoilState(userState);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BASE_URL + '/users/me', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        socket.current = io(process.env.REACT_APP_SOCKET_URL);
        socket.current.on('getMessage', (data) => {
          setArrivalMessage({
            senderId: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        });
      })
      .catch((err) => navigate('/login'));
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      const sender = currentChat?.members.find(
        (m) => m._id === arrivalMessage.senderId
      );

      if (sender) setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BASE_URL + '/conversations/' + user?._id, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversation);
      })
      .catch((err) => console.log(err));
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      socket.current?.emit('addUser', user._id);
    }
  }, [user, socket]);

  useEffect(() => {
    if (currentChat) {
      axios
        .get(process.env.REACT_APP_BASE_URL + '/messages/' + currentChat._id, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        .then((res) => {
          setMessages(res.data.messages);
        })
        .catch((err) => console.log(err));
    }
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input) return;
    const newMessage = {
      conversationId: currentChat?._id,
      senderId: user._id,
      text: input,
    };

    const receiver = currentChat.members.find((m) => m._id !== user._id);

    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId: receiver._id,
      text: input,
    });

    const token = localStorage.getItem('accessToken');

    axios
      .post(process.env.REACT_APP_BASE_URL + '/messages/', newMessage, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((res) => {
        setMessages([...messages, res.data.messageData]);
        setInput('');
      })
      .catch((err) => console.log(err));
  };

  const closeModal = (e) => {
    if (e.target.id === 'close') setShowModal(false);
  };

  return (
    <div className='flex relative'>
      <Modal showModal={showModal} closeModal={closeModal} user={user} />

      <div className='text-white shadow-2xl flex flex-col items-center h-screen relative z-40 w-72 bg-[#4a7776]'>
        <div className='shadow-2xl px-6 py-4 flex justify-between items-center w-full'>
          <div className='w-10 aspect-square flex justify-center items-center cursor-pointer rounded-lg hover:bg-[#3e6967]'>
            <img className='w-6' src={searchIcon} alt='search' />
          </div>
          <h2 className='text-xl'>Chats</h2>
          <img
            onClick={() => setShowModal(true)}
            className='w-10 cursor-pointer rounded-lg hover:bg-[#3e6967]'
            src={plusIcon}
            alt='Add'
          />
        </div>
        <div className='flex flex-col w-full mt-4 gap-4'>
          {conversations.map((c) => (
            <div key={c._id} className='px-4 w-full'>
              <div onClick={() => setCurrentChat(c)}>
                <Chat currentUser={user} conversation={c} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='w-[calc(100vw-18rem)] h-screen bg-[#e8dcc4]'>
        <Nav conversation={currentChat} user={user} />
        <div className='h-[calc(100vh-8.5rem)] flex flex-col gap-4 p-10 overflow-y-scroll'>
          {messages.map((message) => (
            <div key={message._id} ref={scrollRef}>
              <Message message={message} user={user} />
            </div>
          ))}
        </div>
        <form onSubmit={(e) => sendMessage(e)}>
          <div className='h-[4rem] px-4 flex justify-between items-center gap-4 bg-[#97ACA0]'>
            <input
              maxLength={50}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              type='text'
              placeholder='Write something...'
              className='h-[2.6rem] px-4 focus:outline-none font-semibold text-[#3e6363] rounded-full w-full'
            />
            <button
              type='submit'
              className='cursor-pointer rounded-2xl p-2 hover:bg-[#8c9f95]'
            >
              <img className='w-10' src={sendIcon} alt='Send' />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
