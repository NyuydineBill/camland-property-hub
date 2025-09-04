import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  MapPin, 
  PlusCircle, 
  List, 
  Shield, 
  RefreshCw, 
  DollarSign, 
  Users, 
  Settings,
  ChevronDown,
  Home,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Property Map",
    href: "/map", 
    icon: MapPin,
    badge: null,
  },
  {
    title: "Properties",
    icon: Building,
    children: [
      { title: "My Properties", href: "/properties", badge: "12" },
      { title: "Add Property", href: "/properties/add", badge: null },
      { title: "Property Search", href: "/properties/search", badge: null },
    ]
  },
  {
    title: "Verification",
    href: "/verification",
    icon: Shield,
    badge: "3",
  },
  {
    title: "Transfers", 
    href: "/transfers",
    icon: RefreshCw,
    badge: "1",
  },
  {
    title: "Commissions",
    href: "/commissions", 
    icon: DollarSign,
    badge: null,
  },
  {
    title: "Community",
    href: "/community",
    icon: Users,
    badge: null,
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [openGroups, setOpenGroups] = useState<string[]>(["Properties"]);

  const toggleGroup = (title: string) => {
    setOpenGroups(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-sidebar-foreground">Owner Account</p>
                <p className="text-xs text-sidebar-foreground/70">Verified Property Owner</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <Collapsible 
                    open={openGroups.includes(item.title)}
                    onOpenChange={() => toggleGroup(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-10 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          openGroups.includes(item.title) && "rotate-180"
                        )} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center justify-between w-full h-9 px-3 ml-6 text-sm rounded-md transition-colors",
                              isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )
                          }
                        >
                          <span>{child.title}</span>
                          {child.badge && (
                            <Badge variant="secondary" className="ml-auto h-5 text-xs">
                              {child.badge}
                            </Badge>
                          )}
                        </NavLink>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between w-full h-10 px-3 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="h-5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <NavLink
              to="/settings"
              className="flex items-center gap-3 w-full h-10 px-3 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;