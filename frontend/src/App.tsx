import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import LoginPage from "@/modules/auth/pages/LoginPage";
import GlobalDashboard from "@/modules/dashboard/pages/GlobalDashboard";
import IntelligenceDashboard from "@/modules/dashboard/pages/IntelligenceDashboard";
import FireAdminDashboard from "@/modules/fire-admin/pages/FireAdminDashboard";
import EmployeeList from "@/modules/fire-admin/pages/EmployeeList";
import DepartmentList from "@/modules/fire-admin/pages/DepartmentList";
import UserList from "@/modules/fire-admin/pages/UserList";
import NOCDashboard from "@/modules/noc/pages/NOCDashboard";
import NOCApplicationList from "@/modules/noc/pages/NOCApplicationList";
import NOCApplicationForm from "@/modules/noc/pages/NOCApplicationForm";
import FireInspectionDashboard from "@/modules/fire-inspection/pages/FireInspectionDashboard";
import BuildingList from "@/modules/fire-inspection/pages/BuildingList";
import RenewalDashboard from "@/modules/renewal/pages/RenewalDashboard";
import RenewalApplicationList from "@/modules/renewal/pages/RenewalApplicationList";
import EquipmentDashboard from "@/modules/equipment/pages/EquipmentDashboard";
import InventoryList from "@/modules/equipment/pages/InventoryList";
import VehicleGPSDashboard from "@/modules/vehicle-gps/pages/VehicleGPSDashboard";
import VehicleList from "@/modules/vehicle-gps/pages/VehicleList";
import IncidentDashboard from "@/modules/incident/pages/IncidentDashboard";
import IncidentList from "@/modules/incident/pages/IncidentList";
import IncidentForm from "@/modules/incident/pages/IncidentForm";
import TrainingDashboard from "@/modules/training/pages/TrainingDashboard";
import TrainingScheduleList from "@/modules/training/pages/TrainingScheduleList";
import MockDrillDashboard from "@/modules/mock-drill/pages/MockDrillDashboard";
import DrillList from "@/modules/mock-drill/pages/DrillList";
import AuditDashboard from "@/modules/audit/pages/AuditDashboard";
import AuditList from "@/modules/audit/pages/AuditList";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.accessToken);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<GlobalDashboard />} />
        <Route path="/intelligence" element={<IntelligenceDashboard />} />
        <Route path="/fire-admin" element={<FireAdminDashboard />} />
        <Route path="/fire-admin/employees" element={<EmployeeList />} />
        <Route path="/fire-admin/departments" element={<DepartmentList />} />
        <Route path="/fire-admin/users" element={<UserList />} />
        <Route path="/noc" element={<NOCDashboard />} />
        <Route path="/noc/applications" element={<NOCApplicationList />} />
        <Route path="/noc/applications/new" element={<NOCApplicationForm />} />
        <Route path="/fire-inspection" element={<FireInspectionDashboard />} />
        <Route path="/fire-inspection/buildings" element={<BuildingList />} />
        <Route path="/renewal" element={<RenewalDashboard />} />
        <Route path="/renewal/applications" element={<RenewalApplicationList />} />
        <Route path="/equipment" element={<EquipmentDashboard />} />
        <Route path="/equipment/inventory" element={<InventoryList />} />
        <Route path="/vehicle-gps" element={<VehicleGPSDashboard />} />
        <Route path="/vehicle-gps/vehicles" element={<VehicleList />} />
        <Route path="/incident" element={<IncidentDashboard />} />
        <Route path="/incident/list" element={<IncidentList />} />
        <Route path="/incident/new" element={<IncidentForm />} />
        <Route path="/training" element={<TrainingDashboard />} />
        <Route path="/training/schedule" element={<TrainingScheduleList />} />
        <Route path="/mock-drill" element={<MockDrillDashboard />} />
        <Route path="/mock-drill/drills" element={<DrillList />} />
        <Route path="/audit" element={<AuditDashboard />} />
        <Route path="/audit/inspections" element={<AuditList />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
