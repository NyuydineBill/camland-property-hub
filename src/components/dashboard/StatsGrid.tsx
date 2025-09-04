import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Building, Shield, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const StatsGrid = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    verifiedProperties: 0,
    activeListings: 0,
    commissionEarned: 850000
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      // Fetch user's properties
      const { data: properties, error } = await supabase
        .from('properties')
        .select('verified, status')
        .eq('owner_id', user.id);

      if (error) throw error;

      const totalProperties = properties?.length || 0;
      const verifiedProperties = properties?.filter(p => p.verified).length || 0;
      const activeListings = properties?.filter(p => p.status === 'available').length || 0;

      setStats({
        totalProperties,
        verifiedProperties,
        activeListings,
        commissionEarned: 850000 // This would come from a commissions table
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Properties",
      value: loading ? "..." : stats.totalProperties.toString(),
      change: "+2 this month",
      icon: Building,
      trend: "up"
    },
    {
      title: "Verified Properties", 
      value: loading ? "..." : stats.verifiedProperties.toString(),
      change: `${stats.totalProperties - stats.verifiedProperties} pending verification`,
      icon: Shield,
      trend: "up"
    },
    {
      title: "Active Listings",
      value: loading ? "..." : stats.activeListings.toString(),
      change: "2 new this week",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Commission Earned",
      value: loading ? "..." : `₣${stats.commissionEarned.toLocaleString()}`,
      change: "+15% from last month",
      icon: DollarSign,
      trend: "up"
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;