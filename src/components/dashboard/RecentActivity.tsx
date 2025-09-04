import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Shield, 
  RefreshCw, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "verification",
    title: "Property Verification Completed",
    description: "Villa in Douala - NWMZBda1GRA0024",
    time: "2 hours ago",
    status: "completed",
    icon: Shield
  },
  {
    id: 2,
    type: "listing",
    title: "New Property Listing",
    description: "Modern apartment added to marketplace",
    time: "5 hours ago", 
    status: "active",
    icon: MapPin
  },
  {
    id: 3,
    type: "transfer",
    title: "Ownership Transfer Request",
    description: "Pending approval for property NWMZBda1GRA0023",
    time: "1 day ago",
    status: "pending",
    icon: RefreshCw
  },
  {
    id: 4,
    type: "view",
    title: "Property Viewed",
    description: "Someone viewed your property in Bamenda",
    time: "2 days ago",
    status: "info",
    icon: Eye
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success text-white";
    case "active":
      return "bg-primary text-primary-foreground";
    case "pending":
      return "bg-warning text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "pending":
      return Clock;
    default:
      return AlertCircle;
  }
};

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          const StatusIcon = getStatusIcon(activity.status);
          
          return (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{activity.title}</h4>
                  <div className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getStatusColor(activity.status)}`}
                >
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;