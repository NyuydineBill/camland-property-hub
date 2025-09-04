import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, CheckCircle, AlertTriangle, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface VerificationStatus {
  id: string;
  property_title: string;
  status: 'pending' | 'in_progress' | 'verified' | 'rejected';
  progress: number;
  created_at: string;
  estimated_completion: string;
}

const Verification = () => {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState<VerificationStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, [user]);

  const fetchVerifications = async () => {
    if (!user) return;
    
    try {
      // Fetch properties and their verification status
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, verified, created_at')
        .eq('owner_id', user.id);

      if (error) throw error;

      // Mock verification data - in real app this would come from a verifications table
      const mockVerifications = data?.map(property => ({
        id: property.id,
        property_title: property.title,
        status: property.verified ? 'verified' as const : 'pending' as const,
        progress: property.verified ? 100 : Math.floor(Math.random() * 70) + 10,
        created_at: property.created_at,
        estimated_completion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      })) || [];

      setVerifications(mockVerifications);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Shield className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-success text-white">Verified</Badge>;
      case 'in_progress':
        return <Badge className="bg-warning text-white">In Progress</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading verification status...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Verification</h1>
          <p className="text-muted-foreground mt-1">
            Track the verification status of your properties
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 gap-2">
          <DollarSign className="h-4 w-4" />
          Request Express Verification
        </Button>
      </div>

      {/* Verification Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {verifications.filter(v => v.status === 'verified').length}
                </p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {verifications.filter(v => v.status === 'in_progress').length}
                </p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {verifications.filter(v => v.status === 'pending').length}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((verifications.filter(v => v.status === 'verified').length / verifications.length) * 100) || 0}%
                </p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification List */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          {verifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No properties to verify</h3>
              <p className="text-muted-foreground">
                Add properties to start the verification process
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {verifications.map((verification) => (
                <Card key={verification.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(verification.status)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{verification.property_title}</h3>
                          <p className="text-xs text-muted-foreground">
                            Started: {new Date(verification.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Est. completion: {new Date(verification.estimated_completion).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        <div className="flex-1 min-w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{verification.progress}%</span>
                          </div>
                          <Progress value={verification.progress} className="h-2" />
                        </div>
                        
                        {getStatusBadge(verification.status)}
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Details</Button>
                          {verification.status === 'pending' && (
                            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                              Expedite
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Express Verification Offer */}
      <Card className="border border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Express Verification Service</h3>
              <p className="text-muted-foreground mb-4">
                Speed up your property verification process from 7 days to just 3 days with our express service.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-2xl font-bold text-primary">50,000 FCFA</div>
                <Button className="bg-gradient-primary hover:opacity-90">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verification;