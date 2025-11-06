import { Send, XCircle } from 'lucide-react';
import { useGroup } from '../store/useGroup';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../store/useAuth';
import toast from 'react-hot-toast';

const MessagesChatGroup = () => {
  const { user } = useAuth();
  const {
    selectedGroup,
    setSelectedGroup,
    getGroupMessages,
    groupMessages,
    sendMessage,
    sendMessageBySocketIo,
    unsubscribeFromMessages,
  } = useGroup();
  const [textMessage, setTextMessage] = useState('');

  useEffect(() => {
    if (selectedGroup) {
      getGroupMessages();
      sendMessageBySocketIo();
    }
    return () => unsubscribeFromMessages();
  }, [
    selectedGroup,
    getGroupMessages,
    sendMessageBySocketIo,
    unsubscribeFromMessages,
  ]);

  const downRef = useRef();

  useEffect(() => {
    downRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (textMessage.trim().length === 0) {
      return toast.error('please provide message ');
    }
    try {
      sendMessage(textMessage);
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
            src={selectedGroup.avatar}
            className="h-10 w-10 rounded-full object-cover"
            alt="profile-pic"
          />
          <div className="capitalize text-sm">
            <h5>{selectedGroup.name}</h5>
          </div>
        </div>
        <XCircle
          onClick={() => setSelectedGroup(null)}
          className="cursor-pointer"
        />
      </div>
      <div
        ref={downRef}
        className="chats bg-base-100 p-2 h-full my-5 rounded overflow-y-auto"
      >
        {groupMessages.length > 0 ? (
          groupMessages.map((msg) => {
            const isSender = msg.sender._id === user._id;
            return (
              <div
                key={msg._id}
                className={`flex items-start gap-3 mb-4 ${
                  isSender ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isSender && (
                  <img
                    src={msg.sender.profilePic}
                    alt={msg.sender.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div
                  className={`max-w-[75%] p-2 rounded-2xl ${
                    isSender
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  {!isSender && (
                    <p className="font-semibold text-sm mb-1">
                      {msg.sender.name}
                    </p>
                  )}
                  <p className="text-sm break-words">{msg.text}</p>
                </div>
                {isSender && (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
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
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={textMessage}
            placeholder="Type a message..."
            className="input flex-1"
            onChange={(e) => setTextMessage(e.target.value)}
          />

          <button>
            <Send className="cursor-pointer" />
          </button>
        </form>
      </div>
    </main>
  );
};

export default MessagesChatGroup;
