import { TrendingUp, Building, Shield, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statsData = [
  {
    title: "Total Properties",
    value: "12",
    change: "+2 this month",
    icon: Building,
    trend: "up"
  },
  {
    title: "Verified Properties", 
    value: "8",
    change: "3 pending verification",
    icon: Shield,
    trend: "up"
  },
  {
    title: "Active Listings",
    value: "5",
    change: "2 new this week",
    icon: TrendingUp,
    trend: "up"
  },
  {
    title: "Commission Earned",
    value: "₣850,000",
    change: "+15% from last month",
    icon: DollarSign,
    trend: "up"
  }
];

const StatsGrid = () => {
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