import { useState, useEffect } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import UserDashboard from "@/components/dashboards/UserDashboard";
import BrokerDashboard from "@/components/dashboards/BrokerDashboard";
import CommunityHeadDashboard from "@/components/dashboards/CommunityHeadDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  MapPin, 
  PlusCircle, 
  Shield, 
  Eye,
  ArrowRight,
  CheckCircle,
  Clock,
  Building
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  // Render different dashboards based on user role
  if (user?.role === 'user') {
    return <UserDashboard />;
  }
  
  if (user?.role === 'broker') {
    return <BrokerDashboard />;
  }
  
  if (user?.role === 'community') {
    return <CommunityHeadDashboard />;
  }

  // Enhanced Property Owner Dashboard
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || 'Property Owner'}!</h1>
              <p className="text-sm text-muted-foreground">Property Owner Account - Verified</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage your property portfolio and track performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/properties/add">
            <Button className="bg-gradient-primary hover:opacity-90 gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Property
            </Button>
          </Link>
          <Link to="/verification">
            <Button variant="outline" className="gap-2">
              <Shield className="h-4 w-4" />
              Get Verified
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
      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Property Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: "NWMZBda1GRA0024",
                title: "Modern Villa in Douala",
                status: "Listed",
                views: 234,
                inquiries: 12,
                lastActivity: "2 hours ago",
                verified: true
              },
              {
                id: "NWMZBda1GRA0025", 
                title: "Commercial Space in Yaoundé",
                status: "Pending Verification",
                views: 89,
                inquiries: 3,
                lastActivity: "1 day ago",
                verified: false
              },
              {
                id: "NWMZBda1GRA0026",
                title: "Apartment Complex in Bamenda",
                status: "Rented",
                views: 456,
                inquiries: 28,
                lastActivity: "5 days ago",
                verified: true
              }
            ].map((property) => (
              <div key={property.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary-foreground" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{property.title}</h4>
                    <div className="flex items-center gap-2">
                      {property.verified && (
                        <Badge className="bg-success text-white text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">{property.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">ID: {property.id}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {property.views} views
                    </span>
                    <span>{property.inquiries} inquiries</span>
                    <span>Last activity: {property.lastActivity}</span>
                  </div>
                </div>

                <Button size="sm" variant="outline">
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Urgent Actions */}
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-warning">Verification Pending</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 properties need document verification
                  </p>
                  <Button size="sm" className="mt-2 bg-warning hover:bg-warning/90 text-white">
                    Complete Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Quick Actions</h4>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                  <PlusCircle className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm">Add New Property</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center">
                  <Shield className="h-3 w-3 text-success" />
                </div>
                <span className="text-sm">Request Verification</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center">
                  <Eye className="h-3 w-3 text-blue-500" />
                </div>
                <span className="text-sm">View Analytics</span>
              </Button>
            </div>

            {/* Revenue Summary */}
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 mt-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-primary">Monthly Revenue</p>
                  <p className="text-lg font-bold text-foreground">₣2,450,000</p>
                  <p className="text-xs text-success">+18% from last month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-primary rounded flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-primary-foreground" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/verification">
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Verify Property</p>
                  <p className="text-xs text-muted-foreground">Get official verification</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-warning" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">List for Sale</p>
                <p className="text-xs text-muted-foreground">Create commercial listing</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </Button>
            
            <Link to="/properties">
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Search Properties</p>
                  <p className="text-xs text-muted-foreground">Explore marketplace</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Verification Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Document Submission</p>
                    <p className="text-xs text-muted-foreground">All required documents uploaded</p>
                  </div>
                </div>
                <Badge className="bg-success text-white">Complete</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Property Inspection</p>
                    <p className="text-xs text-muted-foreground">Scheduled for tomorrow</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-warning text-warning">Pending</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Final Approval</p>
                    <p className="text-xs text-muted-foreground">Awaiting inspection completion</p>
                  </div>
                </div>
                <Badge variant="secondary">Waiting</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">66%</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-primary">Express Verification Available</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your property verified within 3 days for 50,000 FCFA
                  </p>
                  <Button size="sm" className="mt-3 bg-gradient-primary hover:opacity-90">
                    Upgrade to Express
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationCenter />
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;