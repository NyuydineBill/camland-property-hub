import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

const BrokerDashboard = () => {
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
            Manage client properties, listings, and commissions across multiple regions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="gap-2 bg-gradient-primary hover:opacity-90">
            <PlusCircle className="h-4 w-4" />
            Add Client Property
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Viewing
          </Button>
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
            <div className="text-2xl font-bold text-foreground">47</div>
            <p className="text-xs text-muted-foreground mt-1">
              +5 new this month
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
            <div className="text-2xl font-bold text-foreground">89</div>
            <p className="text-xs text-muted-foreground mt-1">
              12 pending verification
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commission Earned
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₣8.5M</div>
            <p className="text-xs text-muted-foreground mt-1">
              +32% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">94.8%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Transaction success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Client Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Client Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                client: "Mr. Emmanuel Toko",
                action: "Property Registration Completed",
                property: "Commercial Complex in Douala",
                timestamp: "1 hour ago",
                status: "completed",
                commission: "₣180,000"
              },
              {
                client: "Mrs. Judith Mbang",
                action: "Verification Request Submitted", 
                property: "Residential Villa in Yaoundé",
                timestamp: "3 hours ago",
                status: "pending",
                commission: "₣85,000"
              },
              {
                client: "Dr. Francis Ngoh",
                action: "Property Listing Created",
                property: "Medical Center in Bamenda",
                timestamp: "5 hours ago", 
                status: "active",
                commission: "₣220,000"
              },
              {
                client: "Ms. Grace Ashu",
                action: "Ownership Transfer Initiated",
                property: "Apartment Building in Limbe",
                timestamp: "1 day ago",
                status: "processing",
                commission: "₣150,000"
              }
            ].map((activity, index) => (
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

                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3 mr-1" />
                  Contact
                </Button>
              </div>
            ))}
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
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                  <PlusCircle className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm">Register for Client</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-success" />
                </div>
                <span className="text-sm">Verify Properties</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-blue-500" />
                </div>
                <span className="text-sm">Map View</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
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