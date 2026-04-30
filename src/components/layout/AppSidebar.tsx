import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Megaphone, 
  Settings, 
  LogOut, 
  BookUser,
  ShieldCheck,
  Building2
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth";
export function AppSidebar(): JSX.Element {
  const currentUser = useAuthStore(s => s.currentUser);
  const logout = useAuthStore(s => s.logout);
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["admin", "captain", "secretary", "kagawad", "resident"] },
    { title: "Local Directory", icon: BookUser, path: "/directory", roles: ["admin", "captain", "secretary", "kagawad", "resident"] },
    { title: "Documents", icon: FileText, path: "/services", roles: ["admin", "captain", "secretary", "kagawad", "resident"] },
    { title: "Announcements", icon: Megaphone, path: "/announcements", roles: ["admin", "captain", "secretary", "kagawad", "resident"] },
    { title: "Users", icon: Users, path: "/users", roles: ["admin"] },
  ];
  const filteredItems = navItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sidebar-foreground tracking-tight">PanipOne</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Brgy. Panipuan BIS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/50 px-4 mb-2">Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.path}
                  tooltip={item.title}
                  className="px-4"
                >
                  <Link to={item.path}>
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex flex-col gap-4">
          {currentUser && (
            <div className="flex items-center gap-3 px-1 py-1 rounded-lg bg-sidebar-accent/50 border border-sidebar-border">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{currentUser.name.charAt(0)}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold truncate text-sidebar-foreground">{currentUser.name}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{currentUser.role}</span>
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors px-1"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}