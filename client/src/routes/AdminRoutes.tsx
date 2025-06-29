 
import { Route,   } from "react-router-dom";
// import AdminDash from "../components/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import CategoryManagement from "../components/admin/CategoryManagement";
import AdminDashboard from "../components/admin/AdminDashboard";
import PaymentAnalysis from "../components/admin/PaymentAnalysis";
import UserTable from "../components/admin/UserManagement";
import AdminLayout from "../components/admin/layout/AdminLayout";
 
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
      path="/admin/payments"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
          <PaymentAnalysis />
          </AdminLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
          <UserTable />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/category" element={<AdminLayout> <CategoryManagement /> </AdminLayout> }/>
  </>
);

export default AdminRoutes;