import { useState, useEffect } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
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
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your properties today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/properties/add">
            <Button className="bg-gradient-primary hover:opacity-90 gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Property
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

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;