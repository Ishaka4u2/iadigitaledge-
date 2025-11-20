
import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen pb-16"> {/* Added padding at bottom to make room for navigation */}
      {children}
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
