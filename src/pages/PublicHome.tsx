import PublicPropertyMap from "@/components/map/PublicPropertyMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Shield, 
  Building, 
  Users, 
  Briefcase, 
  Eye,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Interactive Property Map",
    description: "Explore properties across Cameroon with our advanced mapping system",
    icon: MapPin,
    color: "text-primary"
  },
  {
    title: "Blockchain Security", 
    description: "Advanced blockchain technology ensures property authenticity",
    icon: Shield,
    color: "text-success"
  },
  {
    title: "Official Verification",
    description: "Partnership with government agencies for legitimate verification",
    icon: CheckCircle,
    color: "text-blue-500"
  },
  {
    title: "Multi-User Platform",
    description: "Designed for property owners, brokers, and community leaders",
    icon: Users,
    color: "text-purple-500"
  }
];

const accountTypes = [
  {
    title: "User Account",
    description: "Browse properties and access basic information",
    icon: Eye,
    color: "bg-blue-500",
    features: ["Property search", "Basic property info", "Contact verification"]
  },
  {
    title: "Property Owner", 
    description: "Register and manage your properties",
    icon: Building,
    color: "bg-primary",
    features: ["Property registration", "Verification services", "Commercial listings"],
    popular: true
  },
  {
    title: "Community Head",
    description: "Community privileges and commission earning",
    icon: Users,
    color: "bg-purple-500", 
    features: ["Community endorsements", "Commission earning", "Verification assistance"]
  },
  {
    title: "Real Estate Broker",
    description: "Professional property services and management",
    icon: Briefcase,
    color: "bg-orange-500",
    features: ["Client property registration", "Professional listings", "Commission management"]
  }
];

const stats = [
  { label: "Properties Registered", value: "12,500+", icon: Building },
  { label: "Verified Properties", value: "8,200+", icon: Shield },
  { label: "Active Users", value: "25,000+", icon: Users },
  { label: "Success Rate", value: "98.5%", icon: TrendingUp }
];

const PublicHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Cameroon's Premier
              <span className="block text-primary">Property Management Platform</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Register, verify, and manage your properties with blockchain security, 
              official government partnerships, and comprehensive ownership tracking across all regions of Cameroon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2 bg-gradient-primary hover:opacity-90 text-lg px-8 py-4 h-auto"
                onClick={() => navigate('/auth')}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2 text-lg px-8 py-4 h-auto"
                onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MapPin className="h-5 w-5" />
                Explore Properties
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="map-section" className="py-16 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Explore Properties Across Cameroon
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse our interactive map to discover properties in all regions. 
              <strong className="text-foreground"> Sign in to view detailed information and contact owners.</strong>
            </p>
          </div>
          
          <Card className="shadow-elegant">
            <div className="h-[600px]">
              <PublicPropertyMap />
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 lg:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose CamLand?</h2>
            <p className="text-lg text-muted-foreground">
              Advanced technology meets government partnerships for the most secure property platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-card-hover transition-shadow">
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${feature.color} bg-current/10`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Account Types Section */}
      <section className="py-16 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Account Type</h2>
            <p className="text-lg text-muted-foreground">
              Different roles for different needs - find the account type that suits you best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accountTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className={`hover:shadow-card-hover transition-all ${type.popular ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type.title}</CardTitle>
                          {type.popular && (
                            <Badge className="bg-primary text-primary-foreground mt-1">
                              <Star className="h-3 w-3 mr-1" />
                              Most Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {type.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90"
                      onClick={() => navigate('/auth')}
                    >
                      Create {type.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 lg:px-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Secure Your Property Future?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of Cameroonians who trust CamLand for their property management needs. 
            Get started today with our free registration.
          </p>
          <Button 
            size="lg" 
            className="gap-2 bg-gradient-primary hover:opacity-90 text-lg px-12 py-4 h-auto"
            onClick={() => navigate('/auth')}
          >
            Start Your Journey
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;