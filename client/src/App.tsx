import { Routes,   } from 'react-router-dom';
import './App.css'
import AdminRoutes from './routes/AdminRoutes'
import PublicRoutes from './routes/PublicRoutes'
import ClientRoutes from './routes/ClientRoutes'
import FreelancerRoutes from './routes/FreelancerRoutes';

function App() {

  return (
  <Routes>
      {PublicRoutes()}
      {AdminRoutes()}
      {ClientRoutes()}
      {FreelancerRoutes()}
    </Routes>
  )
}

export default App
