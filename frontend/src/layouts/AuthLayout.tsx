import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export function AuthLayout() {
  const token = useAuthStore((s) => s.accessToken);
  if (token) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
