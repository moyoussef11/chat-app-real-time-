import { MessagesSquare, Plus, Users } from 'lucide-react';
import { useMessage } from '../store/useMessage';
import { useEffect, useState } from 'react';
import { useAuth } from '../store/useAuth';
import ModalCreateGroup from './ModalCreateGroup';
import { useGroup } from '../store/useGroup';

const SideBar = () => {
  const { getUsersSideBar, users, setSelectedUser } = useMessage();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { onlineUsers } = useAuth();

  const { groups, getGroupsSideBar, setSelectedGroup } = useGroup();

  useEffect(() => {
    getUsersSideBar();
    getGroupsSideBar();
  }, [getUsersSideBar, getGroupsSideBar]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  return (
    <aside className="w-[20%] rounded p-2 overflow-y-auto">
      <div className="flex items-center justify-between flex-wrap gap-1 mb-3">
        <div className="flex items-center gap-3 capitalize text-[12px]">
          <MessagesSquare size={15} className="mx-auto sm:mx-0" />
          <h5 className="font-black hidden sm:block ">groups</h5>
        </div>
        <ModalCreateGroup />
        <button
          onClick={() => document.getElementById('my_modal_2').showModal()}
          className="flex items-center gap-1 capitalize text-[12px] bg-primary/40 text-primary p-1 rounded-field cursor-pointer"
        >
          <Plus size={12} className="hidden md:block" /> create group
        </button>
      </div>
      <div className="groups my-5  overflow-y-auto h-[150px] flex flex-col gap-1">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div
              key={group._id}
              className="groups flex items-center gap-2 p-1 cursor-pointer hover:bg-base-100"
              onClick={() => {
                setSelectedGroup(group);
                setSelectedUser(null);
              }}
            >
              <img
                className="w-7 h-7 md:w-10 md:h-10 rounded-full object-cover mx-auto md:mx-0"
                src={group.avatar}
                alt={group.name}
              />
              <span className="text-[12px] hidden md:block">{group.name}</span>
            </div>
          ))
        ) : (
          <span className="text-[12px] text-center my-auto text-warning">
            not found group please add group and start chat
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 capitalize">
        <Users className="mx-auto sm:mx-0" />
        <h5 className="font-black hidden sm:block">contacts</h5>
      </div>
      <div className="mt-3 hidden lg:flex items-center gap-2">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm">Show online only</span>
        </label>
        <span className="text-xs text-green-500">
          ({onlineUsers?.length - 1} online)
        </span>
      </div>
      <div className="users flex flex-col gap-5 my-5 overflow-y-auto h-[500px]">
        {users.length > 0
          ? filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedGroup(null);
                }}
                className="user flex items-center gap-2 p-1 cursor-pointer hover:bg-base-100"
              >
                <img
                  className="w-7 h-7 md:w-10 md:h-10 rounded-full object-cover mx-auto md:mx-0"
                  src={user.profilePic}
                  alt="profile-pic"
                />
                <div className="text-[12px] hidden md:block">
                  <h4 className="font-bold ">{user.name}</h4>

                  {onlineUsers?.includes(user._id) ? (
                    <span className="text-green-500">online</span>
                  ) : (
                    <span className="text-red-500">offline</span>
                  )}
                </div>
              </div>
            ))
          : 'not found users'}
      </div>
    </aside>
  );
};

export default SideBar;
