import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  DollarSign, 
  Shield, 
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Crown,
  Handshake
} from "lucide-react";

const CommunityHeadDashboard = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Crown className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome, Chief Johnson!</h1>
              <p className="text-sm text-muted-foreground">Community Head - Bamenda Central</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage community endorsements and earn commissions from verified properties
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="gap-2 bg-gradient-primary hover:opacity-90">
            <Handshake className="h-4 w-4" />
            Endorse Property
          </Button>
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            Community Map
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Properties Endorsed
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">156</div>
            <p className="text-xs text-muted-foreground mt-1">
              +8 this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Community Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2,340</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active community size
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
            <div className="text-2xl font-bold text-foreground">₣2.8M</div>
            <p className="text-xs text-muted-foreground mt-1">
              +25% from last month
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
            <div className="text-2xl font-bold text-foreground">96.5%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Endorsement approval rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Endorsements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Endorsements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: "NWMZBda1GRA0067",
                owner: "Marie Ngassa",
                property: "Family Residence",
                location: "Nkwen, Bamenda",
                submitted: "2 hours ago",
                urgency: "normal"
              },
              {
                id: "NWMZBda1GRA0068",
                owner: "Paul Tabi",
                property: "Commercial Building", 
                location: "Commercial Avenue, Bamenda",
                submitted: "5 hours ago",
                urgency: "high"
              },
              {
                id: "NWMZBda1GRA0069",
                owner: "Grace Fon",
                property: "Rental Apartment",
                location: "Mile 4, Bamenda", 
                submitted: "1 day ago",
                urgency: "normal"
              }
            ].map((endorsement) => (
              <div key={endorsement.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{endorsement.property}</h4>
                    <span className="text-xs text-muted-foreground">{endorsement.submitted}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Owner: {endorsement.owner}</p>
                  <p className="text-sm text-muted-foreground">{endorsement.location}</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={endorsement.urgency === 'high' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {endorsement.urgency === 'high' ? 'Urgent' : 'Normal'}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">{endorsement.id}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="bg-gradient-success hover:opacity-90">
                    Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Community Stats & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Properties</span>
                <span className="font-medium">234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Verified Properties</span>
                <span className="font-medium">189</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Verification Rate</span>
                <span className="font-medium">81%</span>
              </div>
              <Progress value={81} className="h-2" />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Quick Actions</h4>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                  <Handshake className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm">Bulk Endorsement</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-success" />
                </div>
                <span className="text-sm">Commission Report</span>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-blue-500" />
                </div>
                <span className="text-sm">Community Boundaries</span>
              </Button>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-primary">Monthly Commission</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Next payout: ₣450,000 on March 1st
                  </p>
                  <Button size="sm" className="mt-3 bg-gradient-primary hover:opacity-90">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-semibold text-primary">₣2,800,000</span>
              </div>
              <Progress value={75} className="h-3" />
              <p className="text-xs text-muted-foreground">75% of monthly target</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Month</span>
                <span className="font-semibold text-foreground">₣2,240,000</span>
              </div>
              <Progress value={100} className="h-3" />
              <p className="text-xs text-muted-foreground">Target achieved</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Per Property</span>
                <span className="font-semibold text-foreground">₣18,500</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-success">+12% increase</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityHeadDashboard;