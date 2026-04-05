import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Logout, UserAvatar, Menu, Close } from "@carbon/icons-react";
import { useAuthStore } from "@/store/auth.store";
import { NavDrawer } from "./NavDrawer";

const HEADER_HEIGHT = "48px";
const HEADER_BG     = "#161616";
const HEADER_TEXT   = "#f4f4f4";

export function AppLayout() {
  const { logout } = useAuthStore();
  const navigate   = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {/* ── Fixed top header ── */}
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
        {/* Hamburger */}
        <button
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          onClick={() => setDrawerOpen((prev) => !prev)}
          style={{
            width: HEADER_HEIGHT,
            height: HEADER_HEIGHT,
            minWidth: HEADER_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: drawerOpen ? "#393939" : "transparent",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.15s ease",
          }}
        >
          {drawerOpen
            ? <Close size={20} style={{ fill: HEADER_TEXT }} />
            : <Menu  size={20} style={{ fill: HEADER_TEXT }} />
          }
        </button>

        {/* Brand */}
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

      {/* ── Navigation drawer (full-height overlay) ── */}
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

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
