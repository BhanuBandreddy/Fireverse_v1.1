import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Header,
  HeaderName,
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
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header aria-label="Firedrive Platform">
        <SkipToContent />
        <HeaderName href="/dashboard" prefix="">
          🔥 Firedrive
        </HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label={user ? `${user.firstName} ${user.lastName}` : "User"} tooltipAlignment="end">
            <UserAvatar size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="Logout" tooltipAlignment="end" onClick={handleLogout}>
            <Logout size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      <div style={{ display: "flex", flex: 1, paddingTop: "3rem" }}>
        <SideNav aria-label="Side navigation" isFixedNav expanded style={{ top: "3rem" }}>
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
                >
                  {mod.label}
                </SideNavLink>
              )
            )}
          </SideNavItems>
        </SideNav>

        <Content style={{ flex: 1, marginLeft: "16rem", padding: "2rem", background: "var(--cds-background)" }}>
          <Outlet />
        </Content>
      </div>
    </div>
  );
}
