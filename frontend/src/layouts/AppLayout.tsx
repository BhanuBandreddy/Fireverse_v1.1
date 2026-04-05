import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Header,
  HeaderName,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  SideNavLink,
  Content,
  SkipToContent,
} from "@carbon/react";
import { Logout, UserAvatar } from "@carbon/icons-react";
import { useAuthStore } from "@/store/auth.store";
import { NAV_MODULES } from "./navConfig";

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
      <Header aria-label="Firedrive Platform">
        <SkipToContent />
        <HeaderMenuButton
          aria-label={sideNavExpanded ? "Close menu" : "Open menu"}
          onClick={() => setSideNavExpanded((prev) => !prev)}
          isActive={sideNavExpanded}
        />
        <HeaderName href="/dashboard" prefix="">
          🔥 Firedrive
        </HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label="User Profile"
            tooltipAlignment="end"
          >
            <UserAvatar size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="Logout" tooltipAlignment="end" onClick={handleLogout}>
            <Logout size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      {/* Backdrop — closes sidebar when clicking outside */}
      {sideNavExpanded && (
        <div
          onClick={() => setSideNavExpanded(false)}
          style={{
            position: "fixed",
            top: "3rem",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 5999,
          }}
        />
      )}

      {/* Collapsible overlay sidebar */}
      <SideNav
        aria-label="Side navigation"
        isFixedNav
        expanded={sideNavExpanded}
        style={{
          top: "3rem",
          zIndex: 6000,
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

      {/* Content always takes full width */}
      <Content
        style={{
          flex: 1,
          marginLeft: 0,
          paddingTop: "calc(3rem + 2rem)",
          padding: "calc(3rem + 2rem) 2rem 2rem",
          background: "var(--cds-background)",
        }}
      >
        <Outlet />
      </Content>
    </div>
  );
}
