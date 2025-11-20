
import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const Layout = ({ children, showNavigation = true }: LayoutProps) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={cn("flex-1 container", showNavigation && !isAuthPage && "pb-20")}>
        {children}
      </main>
      {showNavigation && !isAuthPage && <BottomNavigation />}
    </div>
  );
};

export default Layout;

// Import cn utility
import { cn } from "@/lib/utils";
