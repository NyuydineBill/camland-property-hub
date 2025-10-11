import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertTriangle,
  Building,
  User,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Image
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface VerificationRequest {
  id: string;
  property_id: string;
  title: string;
  description: string | null;
  city: string;
  region: string | null;
  price: number;
  currency: string;
  property_type: string;
  listing_type: string;
  owner_id: string;
  owner_name: string;
  owner_email: string;
  created_at: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verification_notes?: string;
  documents?: string[];
  images?: string[];
}

const VerificationQueue = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!properties_owner_id_fkey(full_name, email),
          property_images(image_url, is_primary)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const verificationRequests = data?.map(prop => ({
        id: prop.id,
        property_id: prop.id,
        title: prop.title,
        description: prop.description,
        city: prop.city,
        region: prop.region,
        price: prop.price,
        currency: prop.currency,
        property_type: prop.property_type,
        listing_type: prop.listing_type,
        owner_id: prop.owner_id,
        owner_name: prop.profiles?.full_name || 'Unknown Owner',
        owner_email: prop.profiles?.email || 'No email',
        created_at: prop.created_at,
        verification_status: prop.verified ? 'approved' : 'pending' as 'pending' | 'approved' | 'rejected',
        documents: [], // Mock data - would come from documents table
        images: prop.property_images?.map(img => img.image_url) || []
      })) || [];

      setRequests(verificationRequests);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.owner_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.verification_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleVerification = async (propertyId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          verified: action === 'approve',
          verification_notes: notes || null
        })
        .eq('id', propertyId);

      if (error) throw error;

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.property_id === propertyId 
            ? { ...req, verification_status: action === 'approve' ? 'approved' : 'rejected' }
            : req
        )
      );

      // Show success message
      alert(`Property ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating verification status:', error);
      alert('Failed to update verification status. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Verification Queue</h1>
              <p className="text-sm text-muted-foreground">Review and verify property submissions</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            Review property submissions and approve or reject them for platform inclusion.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-gradient-primary hover:opacity-90 gap-2">
            <CheckCircle className="h-4 w-4" />
            Bulk Approve
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export Queue
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {requests.filter(r => r.verification_status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {requests.filter(r => r.verification_status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Successfully verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {requests.filter(r => r.verification_status === 'rejected').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Queue</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{requests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search verification requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <Badge variant="outline" className="px-3 py-2 text-sm">
          {filteredRequests.length} requests found
        </Badge>
      </div>

      {/* Verification Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {request.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {request.city}, {request.region}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {request.owner_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={cn("text-xs", getStatusColor(request.verification_status))}>
                    {getStatusIcon(request.verification_status)}
                    <span className="ml-1">{request.verification_status.toUpperCase()}</span>
                  </Badge>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {request.currency} {request.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {request.property_type} • {request.listing_type}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-3">
                    {request.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Image className="h-4 w-4" /> {request.images.length} images
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" /> {request.documents.length} documents
                    </span>
                  </div>
                </div>
                
                {request.images.length > 0 && (
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {request.verification_status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    size="sm" 
                    className="bg-success hover:bg-success/90 flex-1"
                    onClick={() => handleVerification(request.property_id, 'approve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleVerification(request.property_id, 'reject')}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" /> Review
                  </Button>
                </div>
              )}
              
              {request.verification_status !== 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" /> View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" /> View Documents
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-semibold">No Verification Requests Found</p>
          <p className="mt-2">All properties have been processed or no matches found.</p>
        </div>
      )}
    </div>
  );
};

export default VerificationQueue;