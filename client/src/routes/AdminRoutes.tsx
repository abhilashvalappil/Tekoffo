 
import { Route,   } from "react-router-dom";
// import AdminDash from "../components/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import CategoryManagement from "../components/admin/CategoryManagement";
import AdminUsers from "../components/admin/UserManagement";
import AdminDashboard from "../components/admin/AdminDashboard";
import PaymentAnalysis from "../components/admin/PaymentAnalysis";
 
const AdminRoutes = () => (
  <>
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/users"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUsers />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/payments"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <PaymentAnalysis />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/category" element={ <CategoryManagement /> }/>
  </>
);

export default AdminRoutes;