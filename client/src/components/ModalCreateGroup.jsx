import { FolderPenIcon } from 'lucide-react';
import { useMessage } from '../store/useMessage';
import { useEffect, useState } from 'react';
import { useGroup } from '../store/useGroup';
import toast from 'react-hot-toast';

const ModalCreateGroup = () => {
  const { users } = useMessage();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [avatarGroup, setAvatarGroup] = useState('');
  const { createGroup, createdGroup } = useGroup();
  async function submit(e) {
    e.preventDefault();
    if (groupName.trim().length === 0) {
      return toast.error('please provide group name ');
    }
    const formData = new FormData();
    formData.append('name', groupName);
    formData.append('description', description);
    formData.append('avatar', avatarGroup);
    formData.append('members', JSON.stringify(members));
    try {
      createGroup(formData);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (createdGroup) {
      setGroupName('');
      setDescription('');
      setMembers('');
      setAvatarGroup('');
      const modal = document.getElementById('my_modal_2');
      if (modal) modal.close();
      toast.success('Group created successfully!');
    }
  }, [createdGroup]);

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-3">create new group</h3>
        <form onSubmit={submit} className="flex flex-col gap-2">
          <div className="form-group relative flex flex-col gap-2">
            <label className="label capitalize">
              group name <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              onChange={(e) => setGroupName(e.target.value)}
              name="name"
              value={groupName}
              className="input pl-9 w-full"
              placeholder="group name"
            />
            <FolderPenIcon className="absolute bottom-2 left-2 text-[#745ab4] p-1 z-1" />
          </div>
          <div className="form-group relative flex flex-col gap-2">
            <label className="label capitalize">description </label>
            <textarea
              className="textarea w-full"
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              value={description}
              placeholder="description group"
            ></textarea>
          </div>
          <div className="form-group relative flex flex-col gap-2">
            <label className="label capitalize">avatar</label>
            <input
              type="file"
              className="file-input file-input-primary w-full"
              onChange={(e) => setAvatarGroup(e.target.files[0])}
            />{' '}
          </div>
          <h5 className="capitalize">members</h5>

          <div className="max-h-48 overflow-y-auto border border-gray-700 rounded mb-4 p-2">
            {users.length === 0 && (
              <p className="text-gray-500 text-sm text-center">
                No users found
              </p>
            )}
            {users.map((user) => (
              <label
                key={user._id}
                className="flex items-center space-x-2 py-1 text-gray-300 hover:bg-gray-800 px-2 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={members.includes(user._id)}
                  onChange={() => setMembers([...members, user._id])}
                />
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-6 h-6 rounded-full"
                />
                <span>{user.name}</span>
              </label>
            ))}
          </div>
          <button className="btn capitalize bg-success">create</button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ModalCreateGroup;
