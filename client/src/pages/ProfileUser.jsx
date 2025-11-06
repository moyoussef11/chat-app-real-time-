import { useAuth } from '../store/useAuth';
import avatarImg from '../assets/avatar.png';
import { Camera, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const ProfileUser = () => {
  const [selectImg, setSelectImg] = useState('');
  const { user, updateUser } = useAuth();
  const handleUpdate = async () => {
    updateUser(userDetails._id, selectImg);
  };
  useEffect(() => {
    if (selectImg) {
      handleUpdate();
    }
  }, [selectImg]);

  const userDetails = user;

  return (
    <div className="max-w-3xl bg-base-300 rounded p-5 mx-auto py-10 glass flex flex-col">
      <div className="capitalize text-center ">
        <h5 className="font-black">profile</h5>
        <span>your profile information</span>
      </div>
      <label className="relative cursor-pointer mx-auto ">
        <img
          src={
            selectImg
              ? URL.createObjectURL(selectImg)
              : userDetails.profilePic
              ? userDetails.profilePic
              : avatarImg
          }
          className="h-32 w-32 object-cover rounded-full"
          alt="avatarImg"
        />
        <Camera
          size={30}
          className="absolute right-0 bottom-2 z-1 text-[#7459b3] bg-[#7459b3]/40 p-1 rounded-full"
        />
        <input
          onChange={(e) => setSelectImg(e.target.files[0])}
          type="file"
          className="hidden"
        />
      </label>
      <span className=" text-center">
        {' '}
        click to update your photo
      </span>
      <div>
        <form className="max-w-[500px] mx-auto flex flex-col gap-3">
          <div className="form-group text-base-content">
            <label
              className="relative capitalize flex items-center gap-1"
              htmlFor="name"
            >
              {' '}
              <User size={15} /> Full name
            </label>
            <input
              type="text"
              className="border border-white outline-white placeholder:text-white w-full py-1 px-2 rounded"
              name="name"
              value={userDetails.name}
              disabled
            />
          </div>
          <div className="form-group text-base-content">
            <label
              className="relative capitalize flex items-center gap-1"
              htmlFor="email"
            >
              {' '}
              <Mail size={15} /> email
            </label>
            <input
              type="email"
              className="border border-white outline-white placeholder:text-white w-full py-1 px-2 rounded"
              name="email"
              value={userDetails.email}
              disabled
            />
          </div>
        </form>
      </div>
      <div className="w-full md:w-[500px] mx-auto my-5 text-base-content capitalize glass p-2">
        <h5 className=" font-bold text-left">Account Information</h5>
        <div className="flex items-center  justify-between text-base-content border-b py-2">
          <h5>member since</h5>
          <span className="text-sm">2025/10/10</span>
        </div>
        <div className="flex items-center justify-between text-base-content border-b py-2">
          <h5>Account status</h5>
          <span className="text-sm text-green-500">active</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
