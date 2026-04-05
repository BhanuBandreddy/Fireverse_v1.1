import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export function AuthLayout() {
  const token = useAuthStore((s) => s.accessToken);
  if (token) return <Navigate to="/dashboard" replace />;
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cds-background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Outlet />
    </div>
  );
}
