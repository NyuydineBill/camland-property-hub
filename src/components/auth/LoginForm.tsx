import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Eye, EyeOff, Shield, Building, Users, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const accountTypes = [
  {
    id: "user",
    title: "User Account",
    description: "Basic property viewing and engagement",
    icon: Eye,
    color: "bg-blue-500"
  },
  {
    id: "owner",
    title: "Property Owner",
    description: "Register and manage your properties",
    icon: Building,
    color: "bg-primary"
  },
  {
    id: "community",
    title: "Community Head",
    description: "Community privileges and commission earning",
    icon: Users,
    color: "bg-purple-500"
  },
  {
    id: "broker",
    title: "Real Estate Broker",
    description: "Professional property services",
    icon: Briefcase,
    color: "bg-orange-500"
  },
  {
    id: "admin",
    title: "System Administrator",
    description: "Full platform management and control",
    icon: Shield,
    color: "bg-red-500"
  }
];

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: ""
  });

  const { login, signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your full name.",
      });
      return;
    }

    if (!selectedAccountType) {
      toast({
        variant: "destructive",
        title: "Account type required",
        description: "Please select an account type.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedAccountType as any,
        phone: formData.phone
      });
      
      toast({
        title: "Account created!",
        description: "Welcome to CamLand Property Hub!",
      });
      
      // Navigate to dashboard after successful signup
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary">CamLand</h1>
          <p className="text-muted-foreground">Property Management Platform</p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Forgot password?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-6">
                {/* Account Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Choose Account Type</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {accountTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedAccountType === type.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedAccountType(type.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.color}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{type.title}</p>
                                {type.id === 'owner' && (
                                  <Badge variant="secondary" className="text-xs">Popular</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="regName">Full Name</Label>
                    <Input
                      id="regName"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regEmail">Email Address</Label>
                    <Input
                      id="regEmail"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                   <div className="space-y-2">
                     <Label htmlFor="regPhone">Phone Number</Label>
                     <Input
                       id="regPhone"
                       value={formData.phone}
                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                       placeholder="+237 6XX XXX XXX"
                     />
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="regPassword">Password</Label>
                     <div className="relative">
                       <Input
                         id="regPassword"
                         type={showPassword ? "text" : "password"}
                         value={formData.password}
                         onChange={(e) => setFormData({...formData, password: e.target.value})}
                         placeholder="Create a strong password (min 6 chars)"
                         required
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="icon"
                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                         onClick={() => setShowPassword(!showPassword)}
                       >
                         {showPassword ? (
                           <EyeOff className="h-4 w-4" />
                         ) : (
                           <Eye className="h-4 w-4" />
                         )}
                       </Button>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="confirmPassword">Confirm Password</Label>
                     <Input
                       id="confirmPassword"
                       type={showPassword ? "text" : "password"}
                       value={formData.confirmPassword}
                       onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                       placeholder="Confirm your password"
                       required
                     />
                   </div>

                   <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" disabled={isLoading}>
                     {isLoading ? "Creating Account..." : "Create Account"}
                   </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secured with advanced encryption</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;