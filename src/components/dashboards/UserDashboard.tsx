import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Search, 
  MapPin, 
  Heart,
  Clock,
  Shield,
  Star,
  TrendingUp,
  Building,
  DollarSign
} from "lucide-react";

const UserDashboard = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
          <p className="text-muted-foreground mt-1">
            Discover and explore properties across Cameroon
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="gap-2 bg-gradient-primary hover:opacity-90">
            <Search className="h-4 w-4" />
            Search Properties
          </Button>
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            View Map
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Properties Viewed
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saved Properties
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 new favorites
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Searches Made
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contacts Made
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 pending responses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Searches */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Property Views</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: "NWMZBda1GRA0024",
                title: "Modern Villa in Limbe",
                location: "Limbe, SW Region",
                price: "45,000,000 FCFA",
                type: "For Sale",
                viewed: "2 hours ago"
              },
              {
                id: "NWMZBda1GRA0025", 
                title: "City Center Apartment",
                location: "Douala, Littoral",
                price: "250,000 FCFA/month",
                type: "For Rent",
                viewed: "Yesterday"
              },
              {
                id: "NWMZBda1GRA0026",
                title: "Mountain View Hotel",
                location: "Buea, SW Region", 
                price: "15,000 FCFA/night",
                type: "Hotel",
                viewed: "2 days ago"
              }
            ].map((property) => (
              <div key={property.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary-foreground" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{property.title}</h4>
                    <span className="text-xs text-muted-foreground">{property.viewed}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{property.type}</Badge>
                    <span className="text-sm font-medium text-primary">{property.price}</span>
                  </div>
                </div>

                <Button size="sm" variant="outline">
                  View Again
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Advanced Search</p>
                <p className="text-xs text-muted-foreground">Find specific properties</p>
              </div>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Browse Map</p>
                <p className="text-xs text-muted-foreground">Interactive property map</p>
              </div>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Saved Properties</p>
                <p className="text-xs text-muted-foreground">View your favorites</p>
              </div>
            </Button>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mt-4">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-primary">Upgrade Account</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Become a property owner to list your own properties
                  </p>
                  <Button size="sm" className="mt-3 bg-gradient-primary hover:opacity-90">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Trending in Your Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Luxury Apartment",
                location: "Yaoundé, Centre",
                price: "₣35,000,000",
                image: "🏢",
                trending: "+12%"
              },
              {
                title: "Beach House", 
                location: "Kribi, South",
                price: "₣28,000,000",
                image: "🏖️",
                trending: "+8%"
              },
              {
                title: "Commercial Space",
                location: "Douala, Littoral", 
                price: "₣180,000/month",
                image: "🏪",
                trending: "+15%"
              }
            ].map((property, index) => (
              <Card key={index} className="hover:shadow-card-hover transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-3xl mb-3 text-center">{property.image}</div>
                  <h4 className="font-medium mb-1">{property.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{property.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">{property.price}</span>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {property.trending}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;