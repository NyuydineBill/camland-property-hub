import { useState, useEffect } from "react";
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
  DollarSign,
  MessageCircle,
  Bell,
  Home,
  Filter,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface DashboardData {
  totalProperties: number;
  recentProperties: any[];
  featuredProperties: any[];
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProperties: 0,
    recentProperties: [],
    featuredProperties: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total properties count
      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // Fetch recent properties
      const { data: recentProperties } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(6);

      // Fetch featured properties (verified ones)
      const { data: featuredProperties } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(3);

      setDashboardData({
        totalProperties: count || 0,
        recentProperties: recentProperties || [],
        featuredProperties: featuredProperties || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-muted-foreground mt-1">
            Discover and explore properties across Cameroon
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/properties">
            <Button className="gap-2 bg-gradient-primary hover:opacity-90">
              <Search className="h-4 w-4" />
              Browse Properties
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" />
              View Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Properties
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : dashboardData.totalProperties}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Properties available
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Featured Properties
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : dashboardData.featuredProperties.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Verified properties
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Listings
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : dashboardData.recentProperties.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              New this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick Search
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link to="/search">
              <Button variant="outline" size="sm" className="w-full">
                Start Searching
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Recent Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted animate-pulse rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : dashboardData.recentProperties.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentProperties.slice(0, 4).map((property) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{property.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {property.city}, {property.region}
                      </p>
                      <p className="text-xs font-medium text-primary">
                        {property.currency} {property.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Link to={`/properties/${property.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No recent properties found
            </p>
          )}
          <div className="mt-4">
            <Link to="/properties">
              <Button variant="outline" className="w-full gap-2">
                View All Properties
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Featured Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Featured Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 bg-muted animate-pulse rounded-lg h-20"></div>
              ))}
            </div>
          ) : dashboardData.featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.featuredProperties.map((property) => (
                <Link key={property.id} to={`/properties/${property.id}`}>
                  <Card className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <Badge variant="outline" className="text-xs">Verified</Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate">{property.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {property.city}, {property.region}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        {property.currency} {property.price.toLocaleString()}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No featured properties available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Popular Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Popular Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['Houses in Douala', 'Apartments in Yaoundé', 'Commercial Properties', 'Land for Sale', 'Luxury Villas'].map((search) => (
              <Link key={search} to={`/search?q=${encodeURIComponent(search)}`}>
                <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  {search}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Average Property Price</p>
              <p className="text-2xl font-bold text-primary">XAF 45M</p>
              <p className="text-xs text-green-600">+5.2% this month</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Most Popular Location</p>
              <p className="text-2xl font-bold text-primary">Douala</p>
              <p className="text-xs text-muted-foreground">45% of searches</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Properties Added Today</p>
              <p className="text-2xl font-bold text-primary">{loading ? "..." : Math.floor(dashboardData.totalProperties / 30)}</p>
              <p className="text-xs text-blue-600">New listings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
