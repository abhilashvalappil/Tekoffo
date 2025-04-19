 
import { Route,   } from "react-router-dom";
import AdminDash from "../components/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import CategoryManagement from "../components/admin/CategoryManagement";
 
const AdminRoutes = () => (
  <>
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDash />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/category" element={ <CategoryManagement /> }/>
  </>
);

export default AdminRoutes;