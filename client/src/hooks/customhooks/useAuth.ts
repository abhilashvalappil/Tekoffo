
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch,RootState,persistor } from '../../redux/store'; 
import { logout } from '../../redux/services/authService'; 
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '../../utils/errors/errorHandler';

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (user?._id) {
        const result = await dispatch(logout(user._id)).unwrap();
        console.log('Logout successful:', result);
        persistor.purge();
        navigate('/signin');
      }
    } catch (error) {
      handleApiError(error)
    }
  };

  return { handleLogout };
};
