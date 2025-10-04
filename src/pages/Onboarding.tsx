import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Bell, Handshake } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      localStorage.setItem("cl_onboarding_complete", "true");
      navigate("/auth");
    }
  };

  const screens = [
    {
      icon: <Handshake className="h-24 w-24 text-primary" />,
      title: "Community Ledger",
      subtitle: "Your community's trusted ledger"
    },
    {
      icon: <Users className="h-24 w-24 text-primary" />,
      title: "Track Customers",
      subtitle: "Keep a clear record of everyone you do business with."
    },
    {
      icon: <Bell className="h-24 w-24 text-primary" />,
      title: "Send Reminders",
      subtitle: "Send friendly, gentle reminders for outstanding payments."
    }
  ];

  const currentScreen = screens[step];

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md w-full">
        <div className="mb-8">
          {currentScreen.icon}
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {currentScreen.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          {currentScreen.subtitle}
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-center gap-2 mb-6">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === step 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
        
        <Button 
          onClick={handleGetStarted} 
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          {step === 2 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
