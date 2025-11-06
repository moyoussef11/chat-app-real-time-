import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectRoutes from './middleware/ProtectRoutes';
import PublicRoutes from './middleware/PublicRoutes';
import ProfileUser from './pages/ProfileUser';
import Header from './components/Header';
import Settings from './pages/Settings';
import { useTheme } from './store/useTheme';
import { useAuth } from './store/useAuth';
import { useEffect } from 'react';

function App() {
  const { theme } = useTheme();
  const { token, user, connectWithSocketIo } = useAuth();

  useEffect(() => {
    if (token && user) {
      connectWithSocketIo();
    }
  }, [token, user, connectWithSocketIo]);
  return (
    <div data-theme={theme} className="w-full min-h-screen">
      <Toaster />
      <Header />
      <Routes>
        <Route element={<ProtectRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfileUser />} />
        </Route>
        <Route path="/settings" element={<Settings />} />
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
