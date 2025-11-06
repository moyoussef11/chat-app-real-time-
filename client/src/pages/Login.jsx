import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageSquareMore,
  SquareArrowOutUpRightIcon,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

const Login = () => {
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formDate, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChangeInput = (e) => {
    setFormData({ ...formDate, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formDate.email) return toast.error('Please enter your email');
    if (!regex.test(formDate.email))
      return toast.error('Invalid Email address');
    if (!formDate.password) return toast.error('Please enter your password');
    if (formDate.password.length <= 6)
      return toast.error('password length must be at least 6 characters');

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateInputs();
    if (isValid === true) {
      login(formDate);
    }
  };

  return (
    <div className="content flex items-center justify-between py-10 px-10 max-w-[800px] mx-auto">
      <div className="bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <div className="flex flex-col items-center gap-2">
          <MessageSquareMore
            size={40}
            className="text-[#7459b3] bg-[#7459b3]/30 p-2 rounded-full"
          />
          <h5 className="text-[#3a5365] capitalize text-3xl font-bold">
            Sign In to Chaty
          </h5>
          <span className="text-[#3a5365] capitalize">
            get started with your free account
          </span>
        </div>
        <form onSubmit={handleSubmit} className="fieldset flex flex-col gap-5">
          <div className="form-group relative">
            <label className="label text-[#3e5769]">Email</label>
            <input
              type="email"
              onChange={handleChangeInput}
              name="email"
              value={formDate.email}
              className="input pl-9"
              placeholder="Email"
            />
            <Mail className="absolute bottom-2 left-2 text-[#745ab4] p-1 z-1" />
          </div>
          <div className="form-group relative">
            <label className="label text-[#3e5769]">Password</label>
            <input
              type={`${showPassword ? 'text' : 'password'}`}
              onChange={handleChangeInput}
              name="password"
              value={formDate.password}
              className="input pl-9"
              placeholder="Password"
            />
            <Lock className="absolute bottom-2 left-2 text-[#745ab4] p-1 z-1" />
            {showPassword ? (
              <EyeOff
                onClick={() => setShowPassword(false)}
                className="absolute bottom-2 right-2 text-[#745ab4] p-1 z-1 cursor-pointer"
              />
            ) : (
              <Eye
                onClick={() => setShowPassword(true)}
                className="absolute bottom-2 right-2 text-[#745ab4] p-1 z-1 cursor-pointer"
              />
            )}
          </div>
          <button className="btn btn-neutral mt-4 bg-[#5d478f] flex items-center gap-3 hover:bg-[#5d478f]/50 hover:border-none hover:text-black">
            Login <SquareArrowOutUpRightIcon size={15} />
          </button>
          <span className="text-center text-[#745ab4] text-[14px]">
            Do not have an account?{' '}
            <Link to="/signup" className="font-black">
              Register
            </Link>
          </span>
        </form>
      </div>
      <div className="hidden sm:block">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className={` h-24 w-24  rounded-md bg-[#745ab4]/30 ${
                index % 2 !== 0 ? 'skeleton bg-[#745ab4]/50' : ''
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
