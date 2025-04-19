 
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const PublicLayout = () => {
  const state = useSelector((state: RootState) => state.auth);
  console.log('console from publiclayout.tsx',state.user)

  if (state.isAuthenticated && state.user) {
    switch (state.user.role) {
      case 'freelancer':
        return <Navigate to="/freelancer-dashboard" replace />;
      case 'client':
        return <Navigate to="/client-dashboard" replace />;
      case 'admin' :
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />; 
    }
  }

  return <Outlet />;
};

export default PublicLayout;
