import { Send, UploadIcon, X, XCircle } from 'lucide-react';
import { useMessage } from '../store/useMessage';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../store/useAuth';
import toast from 'react-hot-toast';
import { formatDate } from '../utils';

const MessagesChat = () => {
  const {
    selectedUser,
    setSelectedUser,
    getMessages,
    messages,
    sendMessage,
    sendMessageBySocketIo,
    unsubscribeFromMessages,
  } = useMessage();
  const { user } = useAuth();
  const [textMessage, setTextMessage] = useState('');
  const [picMessage, setPicMessage] = useState('');
  const downRef = useRef();

  useEffect(() => {
    downRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // console.log(user);

  useEffect(() => {
    if (selectedUser) {
      getMessages();
      sendMessageBySocketIo();
    }
    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessages,
    sendMessageBySocketIo,
    unsubscribeFromMessages,
  ]);
  // useEffect(() => {
  //   getMessages();
  //   sendMessageBySocketIo();
  // }, [getMessages, sendMessageBySocketIo]);

  // console.log(messages);

  const handleSendMessage = (e) => {
    e.preventDefault();
    // if (textMessage.trim().length === 0) {
    //   return toast.error('please provide message ');
    // }
    try {
      const formData = new FormData();
      formData.append('text', textMessage);
      formData.append('image', picMessage);
      sendMessage(formData);
      setPicMessage('');
      setTextMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <main className="p-2 flex flex-col h-full justify-between">
      <div className="head flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-5">
          <img
            src={selectedUser.profilePic}
            className="h-10 w-10 rounded-full object-cover"
            alt="profile-pic"
          />
          <div className="capitalize text-sm">
            <h5>{selectedUser.name}</h5>
            <span>online</span>
          </div>
        </div>
        <XCircle
          onClick={() => setSelectedUser(null)}
          className="cursor-pointer"
        />
      </div>
      <div
        ref={downRef}
        className="chats bg-base-100 p-2 h-full my-5  rounded overflow-hidden overflow-y-auto"
      >
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isSender = msg.senderId._id === user._id;
            const profilePic = isSender
              ? user.profilePic
              : msg.senderId.profilePic;
            return (
              <div
                key={msg._id}
                className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt={isSender ? msg.senderId.name : msg.receiverId.name}
                      src={profilePic}
                    />
                  </div>
                </div>

                <div className="chat-header">
                  <time className="text-xs opacity-50">
                    {formatDate(msg.createdAt)}
                  </time>
                </div>

                <div className="chat-bubble">{msg.text}</div>

                {msg.image && (
                  <div className="chat-bubble my-2 block mb-14">
                    <img
                      src={msg.image}
                      alt="message"
                      className="w-40 rounded-md"
                    />
                  </div>
                )}
                <div ref={downRef}></div>
              </div>
            );
          })
        ) : (
          <span className="flex items-center justify-center h-full capitalize">
            not found message please send and start chat
          </span>
        )}
      </div>
      <div className="inputs">
        {picMessage && (
          <div className="chat-bubble my-2 relative">
            <X
              onClick={() => setPicMessage(null)}
              size={15}
              className="absolute text-red-500 right-2 -top-2 cursor-pointer"
            />
            <img
              src={URL.createObjectURL(picMessage)}
              alt="message"
              className="w-20 h-20 rounded-md"
            />
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={textMessage}
            placeholder="Type a message..."
            className="input flex-1"
            onChange={(e) => setTextMessage(e.target.value)}
          />
          <label className="w-fit">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setPicMessage(e.target.files[0])}
            />
            <UploadIcon className="cursor-pointer w-fit" />
          </label>
          <button>
            <Send className="cursor-pointer" />
          </button>
        </form>
      </div>
    </main>
  );
};

export default MessagesChat;
