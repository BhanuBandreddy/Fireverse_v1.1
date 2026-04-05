import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  SideNavLink,
} from "@carbon/react";
import { Logout, UserAvatar, Menu, Close } from "@carbon/icons-react";
import { useAuthStore } from "@/store/auth.store";
import { NAV_MODULES } from "./navConfig";

const HEADER_HEIGHT = "48px";
const HEADER_BG = "#161616";
const HEADER_TEXT = "#f4f4f4";

export function AppLayout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sideNavExpanded, setSideNavExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {/* ── Fully custom header — no Carbon Header component ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_HEIGHT,
          background: HEADER_BG,
          display: "flex",
          alignItems: "center",
          zIndex: 8000,
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}
      >
        {/* Hamburger toggle */}
        <button
          aria-label={sideNavExpanded ? "Close menu" : "Open menu"}
          onClick={() => setSideNavExpanded((prev) => !prev)}
          style={{
            width: HEADER_HEIGHT,
            height: HEADER_HEIGHT,
            minWidth: HEADER_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: sideNavExpanded ? "#393939" : "transparent",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.15s ease",
          }}
        >
          {sideNavExpanded
            ? <Close size={20} style={{ fill: HEADER_TEXT }} />
            : <Menu size={20} style={{ fill: HEADER_TEXT }} />
          }
        </button>

        {/* Brand name */}
        <a
          href="/dashboard"
          style={{
            color: HEADER_TEXT,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            letterSpacing: "0.01em",
            paddingLeft: "0.5rem",
            flex: 1,
          }}
        >
          🔥 Firedrive
        </a>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            aria-label="User Profile"
            style={{
              width: HEADER_HEIGHT,
              height: HEADER_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <UserAvatar size={20} style={{ fill: HEADER_TEXT }} />
          </button>
          <button
            aria-label="Logout"
            onClick={handleLogout}
            style={{
              width: HEADER_HEIGHT,
              height: HEADER_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Logout size={20} style={{ fill: HEADER_TEXT }} />
          </button>
        </div>
      </div>

      {/* ── Backdrop ── */}
      {sideNavExpanded && (
        <div
          onClick={() => setSideNavExpanded(false)}
          style={{
            position: "fixed",
            top: HEADER_HEIGHT,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 6000,
          }}
        />
      )}

      {/* ── Collapsible overlay sidebar ── */}
      <SideNav
        aria-label="Side navigation"
        isFixedNav
        expanded={sideNavExpanded}
        style={{
          top: HEADER_HEIGHT,
          zIndex: 7000,
          transform: sideNavExpanded ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
          width: "16rem",
        }}
      >
        <SideNavItems>
          {NAV_MODULES.map((mod) =>
            mod.children ? (
              <SideNavMenu
                key={mod.path}
                title={mod.label}
                renderIcon={mod.icon}
                defaultExpanded={location.pathname.startsWith(mod.path)}
              >
                {mod.children.map((child) => (
                  <SideNavMenuItem
                    key={child.path}
                    href={child.path}
                    isActive={location.pathname === child.path}
                    onClick={() => setSideNavExpanded(false)}
                  >
                    {child.label}
                  </SideNavMenuItem>
                ))}
              </SideNavMenu>
            ) : (
              <SideNavLink
                key={mod.path}
                href={mod.path}
                renderIcon={mod.icon}
                isActive={location.pathname === mod.path}
                onClick={() => setSideNavExpanded(false)}
              >
                {mod.label}
              </SideNavLink>
            )
          )}
        </SideNavItems>
      </SideNav>

      {/* ── Page content ── */}
      <main
        style={{
          flex: 1,
          marginTop: HEADER_HEIGHT,
          padding: "2rem",
          background: "var(--cds-background, #f4f4f4)",
          minHeight: `calc(100vh - ${HEADER_HEIGHT})`,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
