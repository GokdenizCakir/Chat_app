import React, { useRef } from 'react';
import greenPlusIcon from './../assets/plusGreen.svg';
import axios from 'axios';

const Modal = ({ showModal, closeModal, user }) => {
  const usernameRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    axios
      .post(
        process.env.REACT_APP_BASE_URL + '/conversations/',
        {
          senderId: user._id,
          receiverUsername: usernameRef.current.value,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      id='close'
      onClick={(e) => closeModal(e)}
      className={`${
        showModal ? null : 'hidden'
      } fixed flex justify-center items-center backdrop-blur-sm z-50 inset-0 bg-black/30`}
    >
      <div className='rounded-2xl p-4 text-center bg-[#4a7776]'>
        <h2 className='text-white font-bold text-xl'>Add Friend</h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={usernameRef}
            maxLength={50}
            spellCheck={false}
            type='text'
            placeholder='username'
            className='h-[2.6rem] px-4 focus:outline-none mt-4 mb-2 text-center font-semibold text-[#3e6363] rounded-full w-full'
          />
          <button
            type='submit'
            className='py-1 w-full hover:bg-[#c2ddd7] cursor-pointer flex justify-center rounded-full text-[#4a7776] transition-all bg-[#a6bfb9]'
          >
            <img className='w-8' src={greenPlusIcon} alt='Add' />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
