import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dashboard,
  Building,
  DocumentSigned,
  SearchLocate,
  Renew,
  Package,
  Van,
  Warning,
  Education,
  Alarm,
  Security,
  ChevronRight,
  ChevronDown,
  Close,
  UserAvatar,
  Logout,
  Fire,
} from "@carbon/icons-react";
import { useAuthStore } from "@/store/auth.store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavChild {
  label: string;
  path: string;
}

interface NavModule {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  accentToken: string;
  children?: NavChild[];
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV: NavModule[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Dashboard,
    accentToken: "var(--cds-support-info)",
  },
  {
    label: "Fire Administration",
    path: "/fire-admin",
    icon: Building,
    accentToken: "var(--cds-support-info)",
    children: [
      { label: "Overview", path: "/fire-admin" },
      { label: "Employees", path: "/fire-admin/employees" },
      { label: "Departments", path: "/fire-admin/departments" },
      { label: "Users & Roles", path: "/fire-admin/users" },
    ],
  },
  {
    label: "NOC Management",
    path: "/noc",
    icon: DocumentSigned,
    accentToken: "var(--cds-support-warning)",
    children: [
      { label: "Overview", path: "/noc" },
      { label: "Applications", path: "/noc/applications" },
      { label: "New Application", path: "/noc/applications/new" },
    ],
  },
  {
    label: "Fire Inspection",
    path: "/fire-inspection",
    icon: SearchLocate,
    accentToken: "var(--cds-support-warning)",
    children: [
      { label: "Overview", path: "/fire-inspection" },
      { label: "Buildings", path: "/fire-inspection/buildings" },
    ],
  },
  {
    label: "Renewal Management",
    path: "/renewal",
    icon: Renew,
    accentToken: "var(--cds-support-success)",
    children: [
      { label: "Overview", path: "/renewal" },
      { label: "Applications", path: "/renewal/applications" },
    ],
  },
  {
    label: "Equipment & Store",
    path: "/equipment",
    icon: Package,
    accentToken: "var(--cds-support-success)",
    children: [
      { label: "Overview", path: "/equipment" },
      { label: "Inventory", path: "/equipment/inventory" },
    ],
  },
  {
    label: "Vehicle & GPS",
    path: "/vehicle-gps",
    icon: Van,
    accentToken: "var(--cds-support-info)",
    children: [
      { label: "Overview", path: "/vehicle-gps" },
      { label: "Vehicles", path: "/vehicle-gps/vehicles" },
    ],
  },
  {
    label: "Incident Management",
    path: "/incident",
    icon: Warning,
    accentToken: "var(--cds-support-error)",
    children: [
      { label: "Overview", path: "/incident" },
      { label: "All Incidents", path: "/incident/list" },
      { label: "Report Incident", path: "/incident/new" },
    ],
  },
  {
    label: "Training & Drill",
    path: "/training",
    icon: Education,
    accentToken: "var(--cds-support-info)",
    children: [
      { label: "Overview", path: "/training" },
      { label: "Schedule", path: "/training/schedule" },
    ],
  },
  {
    label: "Mock Drill",
    path: "/mock-drill",
    icon: Alarm,
    accentToken: "var(--cds-support-error)",
    children: [
      { label: "Overview", path: "/mock-drill" },
      { label: "Drills", path: "/mock-drill/drills" },
    ],
  },
  {
    label: "Audit Management",
    path: "/audit",
    icon: Security,
    accentToken: "var(--cds-support-warning)",
    children: [
      { label: "Overview", path: "/audit" },
      { label: "Audits", path: "/audit/inspections" },
    ],
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // Track which groups are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleGroup = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const isModuleActive = (mod: NavModule) =>
    location.pathname === mod.path ||
    location.pathname.startsWith(mod.path + "/");

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 8500,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* ── Drawer panel ── */}
      <div
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "320px",
          zIndex: 9000,
          display: "flex",
          flexDirection: "column",
          background: "var(--cds-layer-01, #f4f4f4)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.35)",
          transform: open ? "translateX(0)" : "translateX(-320px)",
          transition: "transform 0.3s ease",
          overflowY: "auto",
        }}
      >

        {/* ── Drawer header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1rem",
            height: "64px",
            minHeight: "64px",
            background: "var(--cds-background-inverse, #161616)",
            borderBottom: "1px solid var(--cds-border-subtle-01, #e0e0e0)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--cds-support-error, #da1e28)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Fire size={18} style={{ fill: "#ffffff" }} />
            </div>
            <div>
              <p style={{ color: "var(--cds-text-inverse, #ffffff)", fontWeight: 700, fontSize: "0.875rem", margin: 0, lineHeight: 1.2 }}>
                Firedrive
              </p>
              <p style={{ color: "var(--cds-text-placeholder, #a8a8a8)", fontSize: "0.6875rem", margin: 0, lineHeight: 1.2 }}>
                MFES · Maharashtra
              </p>
            </div>
          </div>
          <button
            aria-label="Close navigation"
            onClick={onClose}
            style={{
              width: "2rem",
              height: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              flexShrink: 0,
            }}
          >
            <Close size={20} style={{ fill: "var(--cds-icon-inverse, #ffffff)" }} />
          </button>
        </div>

        {/* ── Nav items ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
          {NAV.map((mod) => {
            const isActive = isModuleActive(mod);
            const isOpen = expanded[mod.path] ?? isActive;
            const Icon = mod.icon;

            return (
              <div key={mod.path}>
                {/* ── Module row ── */}
                <button
                  onClick={() => {
                    if (mod.children) {
                      toggleGroup(mod.path);
                      navigate(mod.path);
                    } else {
                      handleNavigate(mod.path);
                    }
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0 1rem",
                    height: "48px",
                    background: isActive
                      ? "var(--cds-layer-selected-01, #e0e0e0)"
                      : "transparent",
                    border: "none",
                    borderLeft: isActive
                      ? `3px solid var(--cds-interactive, #0f62fe)`
                      : "3px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--cds-layer-hover-01, #e8e8e8)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                  }}
                >
                  {/* Icon badge */}
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      background: mod.accentToken,
                      opacity: isActive ? 1 : 0.15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    <Icon
                      size={16}
                      style={{
                        fill: isActive ? "#ffffff" : mod.accentToken,
                      }}
                    />
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      flex: 1,
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive
                        ? "var(--cds-text-primary, #161616)"
                        : "var(--cds-text-secondary, #525252)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {mod.label}
                  </span>

                  {/* Chevron for groups */}
                  {mod.children && (
                    isOpen
                      ? <ChevronDown size={16} style={{ fill: "var(--cds-icon-secondary, #525252)", flexShrink: 0 }} />
                      : <ChevronRight size={16} style={{ fill: "var(--cds-icon-secondary, #525252)", flexShrink: 0 }} />
                  )}
                </button>

                {/* ── Sub-items ── */}
                {mod.children && isOpen && (
                  <div
                    style={{
                      borderLeft: "1px solid var(--cds-border-subtle-01, #e0e0e0)",
                      marginLeft: "calc(1rem + 3px + 28px + 0.75rem)",
                    }}
                  >
                    {mod.children.map((child) => {
                      const childActive = location.pathname === child.path;
                      return (
                        <button
                          key={child.path}
                          onClick={() => handleNavigate(child.path)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            height: "40px",
                            padding: "0 1rem 0 0.875rem",
                            background: childActive
                              ? "var(--cds-layer-selected-01, #e0e0e0)"
                              : "transparent",
                            border: "none",
                            borderLeft: childActive
                              ? `2px solid ${mod.accentToken}`
                              : "2px solid transparent",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                          onMouseEnter={(e) => {
                            if (!childActive)
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "var(--cds-layer-hover-01, #e8e8e8)";
                          }}
                          onMouseLeave={(e) => {
                            if (!childActive)
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "transparent";
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              color: childActive
                                ? "var(--cds-text-primary, #161616)"
                                : "var(--cds-text-secondary, #525252)",
                              fontWeight: childActive ? 600 : 400,
                            }}
                          >
                            {child.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Drawer footer ── */}
        <div
          style={{
            borderTop: "1px solid var(--cds-border-subtle-01, #e0e0e0)",
            padding: "0.75rem 1rem",
            background: "var(--cds-layer-02, #e8e8e8)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--cds-interactive, #0f62fe)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <UserAvatar size={18} style={{ fill: "#ffffff" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 600, color: "var(--cds-text-primary, #161616)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user ? `${user.firstName} ${user.lastName}` : "Super Admin"}
            </p>
            <p style={{ margin: 0, fontSize: "0.6875rem", color: "var(--cds-text-secondary, #525252)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email ?? "superadmin@firedrive.gov.in"}
            </p>
          </div>
          <button
            aria-label="Logout"
            onClick={handleLogout}
            title="Sign out"
            style={{
              width: "2rem",
              height: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              flexShrink: 0,
            }}
          >
            <Logout size={18} style={{ fill: "var(--cds-icon-secondary, #525252)" }} />
          </button>
        </div>
      </div>
    </>
  );
}
