import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function ProtectedRoute({ admin = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page"><div className="notice">Verificando sessão...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
