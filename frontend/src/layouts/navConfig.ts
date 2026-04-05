import {
  Dashboard,
  Building,
  DocumentSigned,
  Fire,
  Renew,
  Package,
  Van,
  Warning,
  Education,
  Alarm,
  Security,
} from "@carbon/icons-react";

export const NAV_MODULES = [
  { label: "Dashboard", icon: Dashboard, path: "/dashboard" },
  {
    label: "Fire Administration",
    icon: Building,
    path: "/fire-admin",
    children: [
      { label: "Dashboard", path: "/fire-admin" },
      { label: "Employees", path: "/fire-admin/employees" },
      { label: "Departments", path: "/fire-admin/departments" },
      { label: "Users & Roles", path: "/fire-admin/users" },
    ],
  },
  {
    label: "NOC Management",
    icon: DocumentSigned,
    path: "/noc",
    children: [
      { label: "Dashboard", path: "/noc" },
      { label: "Applications", path: "/noc/applications" },
      { label: "New Application", path: "/noc/applications/new" },
    ],
  },
  {
    label: "Fire Inspection",
    icon: Fire,
    path: "/fire-inspection",
    children: [
      { label: "Dashboard", path: "/fire-inspection" },
      { label: "Buildings", path: "/fire-inspection/buildings" },
    ],
  },
  {
    label: "Renewal Management",
    icon: Renew,
    path: "/renewal",
    children: [
      { label: "Dashboard", path: "/renewal" },
      { label: "Applications", path: "/renewal/applications" },
    ],
  },
  {
    label: "Equipment & Store",
    icon: Package,
    path: "/equipment",
    children: [
      { label: "Dashboard", path: "/equipment" },
      { label: "Inventory", path: "/equipment/inventory" },
    ],
  },
  {
    label: "Vehicle & GPS",
    icon: Van,
    path: "/vehicle-gps",
    children: [
      { label: "Dashboard", path: "/vehicle-gps" },
      { label: "Vehicles", path: "/vehicle-gps/vehicles" },
    ],
  },
  {
    label: "Incident Management",
    icon: Warning,
    path: "/incident",
    children: [
      { label: "Dashboard", path: "/incident" },
      { label: "All Incidents", path: "/incident/list" },
      { label: "Report Incident", path: "/incident/new" },
    ],
  },
  {
    label: "Training & Drill",
    icon: Education,
    path: "/training",
    children: [
      { label: "Dashboard", path: "/training" },
      { label: "Schedule", path: "/training/schedule" },
    ],
  },
  {
    label: "Mock Drill",
    icon: Alarm,
    path: "/mock-drill",
    children: [
      { label: "Dashboard", path: "/mock-drill" },
      { label: "Drills", path: "/mock-drill/drills" },
    ],
  },
  {
    label: "Audit Management",
    icon: Security,
    path: "/audit",
    children: [
      { label: "Dashboard", path: "/audit" },
      { label: "Audits", path: "/audit/inspections" },
    ],
  },
];
