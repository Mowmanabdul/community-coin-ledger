import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Handshake } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Sign Up state
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPin, setSignupPin] = useState("");

  // Log In state
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPin, setLoginPin] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!signupName || !signupPhone || signupPin.length !== 4) {
      toast.error("Please fill all fields correctly");
      setIsLoading(false);
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("cl_users") || "[]");
    const existingUser = users.find((u: any) => u.phone === signupPhone);

    if (existingUser) {
      toast.error("Phone number already registered");
      setIsLoading(false);
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: signupName,
      phone: signupPhone,
      pin: signupPin,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("cl_users", JSON.stringify(users));
    localStorage.setItem("cl_auth", JSON.stringify({ userId: newUser.id, name: newUser.name }));

    toast.success("Account created successfully!");
    setTimeout(() => {
      navigate("/customers");
    }, 500);

    setIsLoading(false);
  };

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginPhone || loginPin.length !== 4) {
      toast.error("Please enter phone and PIN");
      setIsLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem("cl_users") || "[]");
    const user = users.find((u: any) => u.phone === loginPhone && u.pin === loginPin);

    if (!user) {
      toast.error("Invalid phone number or PIN");
      setIsLoading(false);
      return;
    }

    localStorage.setItem("cl_auth", JSON.stringify({ userId: user.id, name: user.name }));
    toast.success("Logged in successfully!");
    
    setTimeout(() => {
      navigate("/customers");
    }, 500);

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Handshake className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Community Ledger</h1>
          <p className="text-muted-foreground">Your community's trusted ledger</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Log in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-phone">Phone Number</Label>
                    <Input
                      id="login-phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-pin">4-Digit PIN</Label>
                    <Input
                      id="login-pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="••••"
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ""))}
                      className="h-12 text-center text-2xl tracking-widest"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join Community Ledger today</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-pin">Create 4-Digit PIN</Label>
                    <Input
                      id="signup-pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="••••"
                      value={signupPin}
                      onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, ""))}
                      className="h-12 text-center text-2xl tracking-widest"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
