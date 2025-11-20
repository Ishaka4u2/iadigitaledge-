
import { Link, useLocation } from "react-router-dom";
import { Home, User, History, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BottomNavigation = () => {
  const location = useLocation();
  const navItems = [{
    icon: Home,
    label: "Home",
    path: "/dashboard"
  }, {
    icon: History,
    label: "History",
    path: "/history"
  }, {
    icon: User,
    label: "Profile",
    path: "/profile"
  }];
  
  const moreItems = [
    { label: "Buy Data", path: "/buy-data" },
    { label: "Buy Airtime", path: "/buy-airtime" },
    { label: "Cable TV", path: "/cable-tv" },
    { label: "Airtime to Cash", path: "/airtime-to-cash" }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-between items-center px-2">
        {navItems.map((item) => (
          <Link 
            key={item.label}
            to={item.path}
            className={cn(
              "flex flex-col items-center py-2 px-3 text-xs",
              location.pathname === item.path 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="flex flex-col items-center py-2 px-3 text-xs text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-5 w-5 mb-1" />
              <span>More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {moreItems.map((item) => (
              <DropdownMenuItem key={item.label} asChild>
                <Link to={item.path}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BottomNavigation;
