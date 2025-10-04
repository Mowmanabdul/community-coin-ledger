import { useNavigate, useLocation } from "react-router-dom";
import { Users, LayoutDashboard } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-3xl mx-auto flex">
        <button
          onClick={() => navigate("/customers")}
          className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
            isActive("/customers")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-6 w-6" />
          <span className="text-xs font-medium">Customers</span>
        </button>
        
        <button
          onClick={() => navigate("/dashboard")}
          className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
            isActive("/dashboard")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-xs font-medium">Dashboard</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
