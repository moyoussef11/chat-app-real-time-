import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

const ProtectRoutes = () => {
  const { token, user } = useAuth();
  console.log('ProtectRoutes rendered');

  if (token === undefined || user === undefined) {
    return null; 
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectRoutes;
