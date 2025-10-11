import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Search,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Filter,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  title: string;
  description: string | null;
  city: string;
  region: string | null;
  price: number;
  currency: string;
  property_type: string;
  listing_type: string;
  status: string;
  verified: boolean | null;
  owner_id: string;
  created_at: string;
  owner_name?: string;
  owner_email?: string;
}

const PropertyManagement = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!properties_owner_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const propertiesWithOwner = data?.map(prop => ({
        ...prop,
        owner_name: prop.profiles?.full_name || 'Unknown Owner',
        owner_email: prop.profiles?.email || 'No email'
      })) || [];

      setProperties(propertiesWithOwner);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.owner_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "verified" && property.verified) ||
      (statusFilter === "pending" && !property.verified) ||
      (statusFilter === "flagged" && property.status === "flagged");
    
    const matchesType = typeFilter === "all" || property.property_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (verified: boolean | null, status: string) => {
    if (status === "flagged") return "bg-red-100 text-red-800 border-red-200";
    if (verified) return "bg-green-100 text-green-800 border-green-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'house': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'apartment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'commercial': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'land': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (verified: boolean | null, status: string) => {
    if (status === "flagged") return <AlertTriangle className="h-4 w-4" />;
    if (verified) return <CheckCircle className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
              <Building className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Property Management</h1>
              <p className="text-sm text-muted-foreground">Manage all platform properties</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            View, verify, and manage properties across the platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-gradient-primary hover:opacity-90 gap-2">
            <CheckCircle className="h-4 w-4" />
            Bulk Verification
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{properties.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {properties.filter(p => p.verified).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Verified properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {properties.filter(p => !p.verified).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₣{(properties.reduce((sum, p) => sum + p.price, 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground mt-1">Combined value</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search properties by title, city, or owner..."
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
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>
        <Badge variant="outline" className="px-3 py-2 text-sm">
          {filteredProperties.length} properties found
        </Badge>
      </div>

      {/* Properties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-foreground truncate">
                    {property.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {property.city}, {property.region}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Badge className={cn("text-xs", getStatusColor(property.verified, property.status))}>
                  {getStatusIcon(property.verified, property.status)}
                  <span className="ml-1">
                    {property.status === "flagged" ? "Flagged" : property.verified ? "Verified" : "Pending"}
                  </span>
                </Badge>
                <Badge className={cn("text-xs", getTypeColor(property.property_type))}>
                  {property.property_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {property.currency} {property.price.toLocaleString()}
                </span>
                <Badge variant="outline">
                  {property.listing_type}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Owner: {property.owner_name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Listed: {new Date(property.created_at).toLocaleDateString()}</span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {property.description || 'No description available'}
              </p>
              
              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" /> View
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                  <Edit className="h-4 w-4 mr-2" /> Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Building className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-semibold">No Properties Found</p>
          <p className="mt-2">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;