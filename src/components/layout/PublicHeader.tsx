import { MapPin, Search, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">CamLand</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Property Management</p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search properties, locations..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className="gap-2"
          onClick={() => navigate('/auth')}
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:block">Sign In</span>
        </Button>
        
        <Button 
          className="gap-2 bg-gradient-primary hover:opacity-90"
          onClick={() => navigate('/auth')}
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:block">Get Started</span>
        </Button>
      </div>
    </header>
  );
};

export default PublicHeader;