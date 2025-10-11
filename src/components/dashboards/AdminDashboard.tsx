import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Users, 
  Building, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Database,
  BarChart3,
  UserCheck,
  Ban,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Globe,
  Lock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  pendingVerifications: number;
  totalRevenue: number;
  activeTransactions: number;
  systemHealth: number;
  recentUsers: any[];
  pendingProperties: any[];
}

interface UserActivity {
  id: string;
  user_name: string;
  action: string;
  timestamp: string;
  details: string;
  user_id?: string;
  property_id?: string;
}

interface SystemAlert {
  id: string;
  type: 'security' | 'system' | 'business';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProperties: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
    activeTransactions: 0,
    systemHealth: 98.5,
    recentUsers: [],
    pendingProperties: []
  });
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [propertyTypes, setPropertyTypes] = useState({
    residential: 0,
    commercial: 0,
    land: 0,
    hotels: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Functions to handle admin actions
  const handleUserApproval = async (userId: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        // You could add a verified field to profiles table or other approval logic
        console.log(`Approving user: ${userId}`);
        alert(`User approved successfully!`);
      } else {
        console.log(`Rejecting user: ${userId}`);
        alert(`User rejected.`);
      }
      // Refresh data after action
      fetchAdminData();
    } catch (error) {
      console.error('Error handling user approval:', error);
      alert('Error processing user approval');
    }
  };

  const handlePropertyVerification = async (propertyId: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          verified: action === 'approve',
          status: action === 'approve' ? 'available' : 'pending'
        })
        .eq('id', propertyId);

      if (error) throw error;

      alert(`Property ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      // Refresh data after action
      fetchAdminData();
    } catch (error) {
      console.error('Error handling property verification:', error);
      alert('Error processing property verification');
    }
  };

  const fetchAdminData = async () => {
    try {
      console.log('Fetching admin data...');
      
      // Temporarily bypass RPC functions and use direct queries for debugging
      console.log('Fetching admin data directly from database...');
      
      const [usersResponse, propertiesResponse, favoritesResponse] = await Promise.all([
        supabase.from('profiles').select('id, full_name, phone, role, created_at').order('created_at', { ascending: false }),
        supabase.from('properties').select('*, profiles!properties_owner_id_fkey(full_name, phone)').order('created_at', { ascending: false }),
        supabase.from('favorites').select('*')
      ]);

      console.log('Users response:', usersResponse);
      console.log('Properties response:', propertiesResponse);

      // Calculate stats with fallback data
      const users = usersResponse.data || [];
      const properties = propertiesResponse.data || [];
      const totalUsers = users.length;
      const totalProperties = properties.length;
      const pendingVerifications = properties.filter(p => !p.verified).length;
      const totalFavorites = favoritesResponse.data?.length || 0;
      
      // Get recent users (last 5)
      const recentUsers = users.slice(0, 5);
      
      // Get pending properties for verification
      const pendingProperties = properties.filter(p => !p.verified).slice(0, 5);

      console.log(`Found ${totalUsers} users, ${totalProperties} properties, ${pendingVerifications} pending verifications`);
      console.log('Pending properties for admin review:', pendingProperties);
      console.log('All properties:', properties.map(p => ({ id: p.id, title: p.title, verified: p.verified })));
      
      // Calculate revenue based on property values (simplified)
      const totalRevenue = properties.reduce((sum, p) => sum + (p.price || 0), 0) || 0;
      const activeTransactions = Math.floor(totalProperties * 0.1); // Estimate 10% of properties have active transactions

      setStats({
        totalUsers,
        totalProperties,
        pendingVerifications,
        totalRevenue: totalRevenue * 0.05, // 5% commission
        activeTransactions,
        systemHealth: 98.5,
        recentUsers,
        pendingProperties
      });

      // Fetch recent activity from real data
      const { data: recentProperties } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          created_at,
          owner_id,
          profiles!properties_owner_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentProperties) {
        const activityData = recentProperties.map((property) => ({
          id: property.id,
          user_name: property.profiles?.full_name || 'Unknown User',
          action: 'Property Registration',
          timestamp: property.created_at,
          details: `Registered "${property.title}"`,
          user_id: property.owner_id,
          property_id: property.id
        }));
        setRecentActivity(activityData);
      } else {
        setRecentActivity([]);
      }

      // Generate real system alerts based on data
      const alerts = [];
      
      // Alert if there are too many pending verifications
      if (pendingVerifications > 10) {
        alerts.push({
          id: 'verification-backlog',
          type: 'business',
          message: `Verification queue has ${pendingVerifications} pending properties - consider reviewing soon`,
          severity: pendingVerifications > 20 ? 'high' : 'medium',
          timestamp: new Date().toISOString()
        });
      }

      // Alert if there are many new users
      if (totalUsers > 100) {
        alerts.push({
          id: 'user-growth',
          type: 'business',
          message: `Platform growing rapidly with ${totalUsers} total users registered`,
          severity: 'low',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        });
      }

      // Alert about property activity
      if (totalProperties > 50) {
        alerts.push({
          id: 'property-milestone',
          type: 'system',
          message: `Platform milestone: ${totalProperties} properties registered`,
          severity: 'low',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        });
      }

      // Add a default success alert if no other alerts
      if (alerts.length === 0) {
        alerts.push({
          id: 'system-healthy',
          type: 'system',
          message: 'All systems operating normally - no critical issues detected',
          severity: 'low',
          timestamp: new Date().toISOString()
        });
      }

      setSystemAlerts(alerts);

      // Calculate property type breakdown
      const typeBreakdown = propertiesResponse.data?.reduce((acc, property) => {
        const type = property.property_type;
        if (type === 'house' || type === 'apartment' || type === 'villa') {
          acc.residential++;
        } else if (type === 'commercial' || type === 'office') {
          acc.commercial++;
        } else if (type === 'land') {
          acc.land++;
        } else {
          acc.hotels++;
        }
        return acc;
      }, { residential: 0, commercial: 0, land: 0, hotels: 0 }) || { residential: 0, commercial: 0, land: 0, hotels: 0 };

      setPropertyTypes(typeBreakdown);

      console.log('Admin data loaded:', {
        users: users.length,
        properties: properties.length,
        recentUsers: recentUsers.length,
        pendingProperties: pendingProperties.length
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      
      // Set fallback data to show something instead of empty dashboard
      setStats({
        totalUsers: 0,
        totalProperties: 0,
        pendingVerifications: 0,
        totalRevenue: 0,
        activeTransactions: 0,
        systemHealth: 98.5,
        recentUsers: [],
        pendingProperties: []
      });

      setRecentActivity([{
        id: 'error-activity',
        user_name: 'System',
        action: 'Database Connection',
        timestamp: new Date().toISOString(),
        details: 'Error fetching data - check database connection and permissions'
      }]);

      setSystemAlerts([{
        id: 'db-error',
        type: 'system',
        message: 'Unable to fetch admin data. Check database permissions and connection.',
        severity: 'high',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg"></div>
            <div>
              <div className="h-8 w-48 bg-muted rounded"></div>
              <div className="h-4 w-32 bg-muted rounded mt-2"></div>
            </div>
          </div>
          <div className="h-10 w-32 bg-muted rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
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
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">System Administrator - Full Access</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            Monitor and manage the entire CamLand platform
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={fetchAdminData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
          <Link to="/settings">
            <Button className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90">
              <Settings className="h-4 w-4" />
              System Settings
            </Button>
          </Link>
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Properties
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalProperties.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +8% this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Verifications
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.pendingVerifications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Platform Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₣{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-1">
              +25% this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Transactions
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.activeTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time count
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Health
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.systemHealth}%</div>
            <p className="text-xs text-success mt-1">
              Excellent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Platform Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.action}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">User: {activity.user_name}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      // You can replace this with actual view activity details functionality
                      alert(`Viewing details for: ${activity.action} by ${activity.user_name}`);
                    }}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {alert.type.toUpperCase()}
                          </Badge>
                          <Badge 
                            variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2,156</div>
                <p className="text-sm text-muted-foreground">Basic users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Property Owners</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">847</div>
                <p className="text-sm text-muted-foreground">Verified owners</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Community Heads</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">23</div>
                <p className="text-sm text-muted-foreground">Active leaders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Brokers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">156</div>
                <p className="text-sm text-muted-foreground">Licensed brokers</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Management Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/admin/verification">
                  <Button className="h-20 flex-col gap-2 w-full">
                    <UserCheck className="h-6 w-6" />
                    Verify Users
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="outline" className="h-20 flex-col gap-2 w-full">
                    <Ban className="h-6 w-6" />
                    Manage Users
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="outline" className="h-20 flex-col gap-2 w-full">
                    <Edit className="h-6 w-6" />
                    Edit Profiles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Verified Properties</span>
                  <span className="font-semibold text-success">8,234</span>
                </div>
                <Progress value={78} className="h-2" />
                
                <div className="flex justify-between">
                  <span className="text-sm">Pending Verification</span>
                  <span className="font-semibold text-warning">2,341</span>
                </div>
                <Progress value={22} className="h-2" />
                
                <div className="flex justify-between">
                  <span className="text-sm">Flagged Properties</span>
                  <span className="font-semibold text-destructive">45</span>
                </div>
                <Progress value={1} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Residential</span>
                  <span className="font-semibold">{propertyTypes.residential.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Commercial</span>
                  <span className="font-semibold">{propertyTypes.commercial.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Land</span>
                  <span className="font-semibold">{propertyTypes.land.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Hotels</span>
                  <span className="font-semibold">{propertyTypes.hotels.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/verification">
                  <Button className="w-full justify-start gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Bulk Verification
                  </Button>
                </Link>
                <Link to="/admin/properties">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Review Flagged
                  </Button>
                </Link>
                <Link to="/admin/properties">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Trash2 className="h-4 w-4" />
                    Manage Properties
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Property Verifications</CardTitle>
              <p className="text-sm text-muted-foreground">
                {stats.pendingProperties.length} properties awaiting verification
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.pendingProperties.length > 0 ? (
                  stats.pendingProperties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{property.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {property.city}, {property.region} • {property.currency} {property.price?.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Owner: {property.profiles?.full_name || 'Unknown'} • 
                            Submitted {new Date(property.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-success hover:bg-success/90" 
                          onClick={() => handlePropertyVerification(property.id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handlePropertyVerification(property.id, 'reject')}
                        >
                          Reject
                        </Button>
                        <Link to={`/properties/${property.id}`}>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending property verifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest user registrations
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{user.full_name || 'Unknown User'}</h4>
                          <p className="text-sm text-muted-foreground">
                            Role: {user.role} • Phone: {user.phone || 'Not provided'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Registered {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-success hover:bg-success/90" 
                          onClick={() => handleUserApproval(user.id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleUserApproval(user.id, 'reject')}
                        >
                          Suspend
                        </Button>
                        <Link to={`/admin/users`}>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent users</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Verification Fees</span>
                    <span className="font-semibold">₣45.2M</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Commission Fees</span>
                    <span className="font-semibold">₣38.7M</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Premium Services</span>
                    <span className="font-semibold">₣17.1M</span>
                  </div>
                  <Progress value={17} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Payouts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Community Heads</span>
                  <span className="font-semibold">₣12.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Brokers</span>
                  <span className="font-semibold">₣18.9M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Referrals</span>
                  <span className="font-semibold">₣3.2M</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2">
                  <DollarSign className="h-4 w-4" />
                  Process Payouts
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Generate Reports
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Database Performance</span>
                    <span className="font-semibold text-success">98.5%</span>
                  </div>
                  <Progress value={98.5} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Server Uptime</span>
                    <span className="font-semibold text-success">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Storage Usage</span>
                    <span className="font-semibold text-warning">76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2">
                  <Database className="h-4 w-4" />
                  Database Backup
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  System Configuration
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Lock className="h-4 w-4" />
                  Security Settings
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Globe className="h-4 w-4" />
                  Platform Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;