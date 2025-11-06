import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

const PublicRoutes = () => {
  const { token, user } = useAuth();
  console.log('PublicRoutes rendered');

  if (token === undefined || user === undefined) {
    return null;
  }

  if (token && user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;
