import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  DollarSign, 
  Building, 
  TrendingUp,
  Users,
  Calendar,
  Phone,
  Star,
  PlusCircle,
  FileText,
  MapPin,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const BrokerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    activeClients: 0,
    propertiesManaged: 0,
    commissionEarned: 0,
    scheduledViewings: 0,
    clientActivities: [],
    commissionBreakdown: [],
    loading: true
  });

  useEffect(() => {
    if (user) {
      fetchBrokerDashboardData();
    }
  }, [user]);

  const fetchBrokerDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));

      // Fetch broker's managed properties (using owner_id)
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          price,
          currency,
          status,
          created_at,
          profiles!properties_owner_id_fkey(full_name)
        `)
        .eq('owner_id', user.id);

      if (propertiesError) throw propertiesError;

      // For now, we'll simulate client data since we don't have a clients table
      // In a real app, you'd have a separate clients table
      const uniqueClients = new Set();
      const clientActivities = [];
      
      properties?.forEach((property, index) => {
        const clientName = `Client ${index + 1}`;
        uniqueClients.add(clientName);
        
        clientActivities.push({
          client: clientName,
          action: "Property Registration Completed",
          property: property.title,
          timestamp: new Date(property.created_at).toLocaleDateString(),
          status: property.status,
          commission: `₣${(property.price * 0.05).toLocaleString()}` // 5% commission
        });
      });

      // Calculate total commission (5% of all property values)
      const totalCommission = properties?.reduce((sum, prop) => sum + (prop.price * 0.05), 0) || 0;

      // Simulate scheduled viewings
      const scheduledViewings = Math.floor(Math.random() * 10) + 1;

      setDashboardData({
        activeClients: uniqueClients.size,
        propertiesManaged: properties?.length || 0,
        commissionEarned: totalCommission,
        scheduledViewings,
        clientActivities: clientActivities.slice(0, 4), // Show latest 4
        commissionBreakdown: properties?.map(p => ({
          property: p.title,
          commission: p.price * 0.05,
          status: p.status
        })) || [],
        loading: false
      });

    } catch (error) {
      console.error('Error fetching broker dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  if (dashboardData.loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome, Agent Sarah!</h1>
              <p className="text-sm text-muted-foreground">Licensed Real Estate Broker - License #REB2024-001</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            Register properties on behalf of owners and manage commission-based listings
          </p>
        </div>
                <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/properties/add">
            <Button className="gap-2 bg-gradient-primary hover:opacity-90">
              <PlusCircle className="h-4 w-4" />
              Add Property
            </Button>
          </Link>
          <Link to="/appointments">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Manage Appointments
            </Button>
          </Link>
          <Link to="/clients">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Manage Clients
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardData.activeClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active property owners
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Properties Managed
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardData.propertiesManaged}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Client properties
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Potential Commission
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₣{dashboardData.commissionEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              5% of property values
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled Viewings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dashboardData.scheduledViewings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Client Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Property Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.clientActivities.length > 0 ? dashboardData.clientActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{activity.action}</h4>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Client: {activity.client}</p>
                  <p className="text-sm text-muted-foreground">{activity.property}</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : 'outline'}
                      className={`text-xs ${
                        activity.status === 'completed' ? 'bg-success text-white' :
                        activity.status === 'pending' ? 'border-warning text-warning' :
                        activity.status === 'processing' ? 'border-blue-500 text-blue-500' :
                        'border-primary text-primary'
                      }`}
                    >
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                    <span className="text-sm font-medium text-primary">Commission: {activity.commission}</span>
                  </div>
                </div>

                <Button size="sm" variant="outline" onClick={() => {
                  if (activity.contact_phone) {
                    window.open(`tel:${activity.contact_phone}`, '_self');
                  } else {
                    window.open(`mailto:${activity.contact_email}`, '_self');
                  }
                }}>
                  <Phone className="h-3 w-3 mr-1" />
                  Contact
                </Button>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No client properties yet</p>
                <p className="text-sm">Add your first client property to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Target</span>
                <span className="font-medium">₣10M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Earnings</span>
                <span className="font-medium">₣8.5M</span>
              </div>
              <Progress value={85} className="h-3" />
              <p className="text-xs text-muted-foreground">85% of monthly target achieved</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Quick Actions</h4>
              
              <Link to="/properties/add">
                <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                  <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                    <PlusCircle className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">Register for Client</span>
                </Button>
              </Link>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10" onClick={() => window.location.href = '/verification'}>
                <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-success" />
                </div>
                <span className="text-sm">Verify Properties</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10" onClick={() => window.location.href = '/map'}>
                <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-blue-500" />
                </div>
                <span className="text-sm">Map View</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10" onClick={() => window.location.href = '/appointments'}>
                <div className="w-6 h-6 bg-purple-500/10 rounded flex items-center justify-center">
                  <Calendar className="h-3 w-3 text-purple-500" />
                </div>
                <span className="text-sm">Schedule Meetings</span>
              </Button>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-primary">Top Performer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're ranked #2 in the Central Region this month
                  </p>
                  <Button size="sm" className="mt-3 bg-gradient-primary hover:opacity-90">
                    View Leaderboard
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Breakdown - February 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Property Registration</span>
                <span className="font-semibold text-primary">₣3.2M</span>
              </div>
              <Progress value={38} className="h-2" />
              <p className="text-xs text-muted-foreground">38% of total earnings</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Verification Services</span>
                <span className="font-semibold text-primary">₣2.8M</span>
              </div>
              <Progress value={33} className="h-2" />
              <p className="text-xs text-muted-foreground">33% of total earnings</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Commercial Listings</span>
                <span className="font-semibold text-primary">₣1.8M</span>
              </div>
              <Progress value={21} className="h-2" />
              <p className="text-xs text-muted-foreground">21% of total earnings</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Transfer Services</span>
                <span className="font-semibold text-primary">₣700K</span>
              </div>
              <Progress value={8} className="h-2" />
              <p className="text-xs text-muted-foreground">8% of total earnings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrokerDashboard;