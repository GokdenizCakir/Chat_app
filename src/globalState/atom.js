import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: null,
});

export const currentChatState = atom({
  key: 'currentChatState',
  default: null,
});
