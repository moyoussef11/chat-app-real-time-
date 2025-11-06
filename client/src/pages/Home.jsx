import SideBar from '../components/SideBar';
import MessagesChat from '../components/MessagesChat';
import NoChatSelected from '../components/NoChatSelected';
import { useMessage } from '../store/useMessage';
import { useGroup } from '../store/useGroup';
import MessagesChatGroup from '../components/MessagesChatGroup';

const Home = () => {
  const { selectedUser } = useMessage();
  const { selectedGroup } = useGroup();

  return (
    <div className="py-10 bg-base-300 max-w-6xl mx-auto rounded md:p-4 h-screen">
      <div className="flex h-full rounded">
        <SideBar />
        <div className="w-[80%] h-full">
          {selectedUser ? (
            <MessagesChat />
          ) : selectedGroup ? (
            <MessagesChatGroup />
          ) : (
            <NoChatSelected />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
