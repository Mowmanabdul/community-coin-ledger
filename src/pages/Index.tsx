import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("cl_onboarding_complete");
    const isAuthenticated = localStorage.getItem("cl_auth");

    if (isAuthenticated) {
      navigate("/customers");
    } else if (hasSeenOnboarding) {
      navigate("/auth");
    } else {
      navigate("/onboarding");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
};

export default Index;
