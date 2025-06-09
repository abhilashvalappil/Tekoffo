
import { Routes,   } from 'react-router-dom';
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import './App.css'
import AdminRoutes from './routes/AdminRoutes'
import PublicRoutes from './routes/PublicRoutes'
import ClientRoutes from './routes/ClientRoutes'
import FreelancerRoutes from './routes/FreelancerRoutes';
import { User, useSocketConnection } from './hooks/customhooks/useSocket';

 
  const App: React.FC = () => {

    const user = useSelector((state: RootState) => state.auth.user);
    useSocketConnection(user as User);

  return (
  <Routes>
      {PublicRoutes()}
      {AdminRoutes()}
      {ClientRoutes()}
      {FreelancerRoutes()}
    </Routes>
  )
}

export default App;
