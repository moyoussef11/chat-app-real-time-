import { LogOutIcon, MessageSquareMore, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

const Header = () => {
  const { token, user, logout } = useAuth();
  return (
    <header className="pb-3">
      <div className="navbar bg-base-100 shadow-sm flex items-center justify-between">
        <Link to={'/'} className="flex items-center gap-3">
          <MessageSquareMore
            size={35}
            className="text-[#7459b3] bg-[#7459b3]/30 p-2 rounded-full"
          />
          <p className="text-xl">Chaty</p>
        </Link>
        <div className="">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link
                to="/settings"
                className="text-base-content capitalize flex items-center gap-1"
              >
                <Settings size={15} /> settings
              </Link>
            </li>
            {token && user && (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="text-base-content capitalize flex items-center gap-1"
                  >
                    <User size={15} /> profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="text-red-500 capitalize flex items-center gap-1"
                  >
                    <LogOutIcon size={15} /> logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
