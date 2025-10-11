import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  MapPin, 
  Home, 
  Building, 
  Hotel, 
  UtensilsCrossed,
  Eye,
  Heart,
  Share2,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Property {
  id: string;
  title: string;
  description: string;
  city: string;
  region: string | null;
  price: number;
  currency: string;
  property_type: string;
  listing_type: string;
  status: string;
  verified: boolean | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  contact_email?: string | null;
  created_at: string;
}

const PropertySearch: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("all");
  const [selectedListingType, setSelectedListingType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [minBathrooms, setMinBathrooms] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    properties, 
    searchQuery, 
    selectedPropertyType, 
    selectedListingType, 
    selectedStatus, 
    priceRange, 
    selectedRegion, 
    minBedrooms, 
    minBathrooms, 
    verifiedOnly
  ]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = properties;

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Property type filter
    if (selectedPropertyType !== "all") {
      filtered = filtered.filter(property => property.property_type === selectedPropertyType);
    }

    // Listing type filter
    if (selectedListingType !== "all") {
      filtered = filtered.filter(property => property.listing_type === selectedListingType);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(property => property.status === selectedStatus);
    }

    // Price range filter
    filtered = filtered.filter(property => 
      property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Region filter
    if (selectedRegion !== "all") {
      filtered = filtered.filter(property => property.region === selectedRegion);
    }

    // Bedroom filter
    if (minBedrooms > 0) {
      filtered = filtered.filter(property => 
        property.bedrooms && property.bedrooms >= minBedrooms
      );
    }

    // Bathroom filter
    if (minBathrooms > 0) {
      filtered = filtered.filter(property => 
        property.bathrooms && property.bathrooms >= minBathrooms
      );
    }

    // Verified only filter
    if (verifiedOnly) {
      filtered = filtered.filter(property => property.verified === true);
    }

    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setSelectedPropertyType("all");
    setSelectedListingType("all");
    setSelectedStatus("all");
    setPriceRange([0, 10000000]);
    setSelectedRegion("all");
    setMinBedrooms(0);
    setMinBathrooms(0);
    setVerifiedOnly(false);
    setSearchQuery("");
  };

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'house':
      case 'villa':
        return <Home className="h-4 w-4" />;
      case 'apartment':
      case 'condo':
        return <Building className="h-4 w-4" />;
      case 'hotel':
        return <Hotel className="h-4 w-4" />;
      case 'commercial':
      case 'office':
        return <UtensilsCrossed className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'house':
      case 'villa':
        return 'bg-green-100 text-green-800';
      case 'apartment':
      case 'condo':
        return 'bg-blue-100 text-blue-800';
      case 'hotel':
        return 'bg-purple-100 text-purple-800';
      case 'commercial':
      case 'office':
        return 'bg-orange-100 text-orange-800';
      case 'land':
        return 'bg-brown-100 text-brown-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString()}`;
  };

  const getUniqueRegions = () => {
    const regions = properties
      .map(p => p.region)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return regions;
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Property Search</h1>
        <p className="text-muted-foreground">
          Find your perfect property with advanced filters and search
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by title, description, location, or property ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {Object.values({
              selectedPropertyType,
              selectedListingType,
              selectedStatus,
              selectedRegion,
              minBedrooms,
              minBathrooms,
              verifiedOnly
            }).some(v => v !== "all" && v !== 0 && v !== false) && (
              <Badge variant="secondary" className="ml-1">
                Active
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Search Filters</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Property Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Property Type</label>
                <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Listing Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Listing Type</label>
                <Select value={selectedListingType} onValueChange={setSelectedListingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Listings</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {getUniqueRegions().map(region => (
                      <SelectItem key={region} value={region!}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Price Range: {formatPrice(priceRange[0], 'XAF')} - {formatPrice(priceRange[1], 'XAF')}
              </label>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
                max={10000000}
                step={100000}
                className="w-full"
              />
            </div>

            {/* Bedrooms and Bathrooms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Min Bedrooms</label>
                <Select value={minBedrooms.toString()} onValueChange={(v) => setMinBedrooms(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Min Bathrooms</label>
                <Select value={minBathrooms.toString()} onValueChange={(v) => setMinBathrooms(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="verified"
                  checked={verifiedOnly}
                  onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
                />
                <label htmlFor="verified" className="text-sm font-medium">
                  Verified properties only
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground">
          {loading ? 'Loading...' : `${filteredProperties.length} properties found`}
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/map')}>
          <MapPin className="h-4 w-4 mr-2" />
          View on Map
        </Button>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/properties/${property.id}`)}>
              <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                <div className="text-6xl opacity-20">
                  {getPropertyIcon(property.property_type)}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getPropertyTypeColor(property.property_type)}>
                      {property.property_type}
                    </Badge>
                    {property.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Heart className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">{property.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {property.city}, {property.region}
                </p>
                
                <p className="text-2xl font-bold text-primary mb-3">
                  {formatPrice(property.price, property.currency)}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    {property.listing_type === 'rent' ? '/month' : ''}
                  </span>
                </p>

                {(property.bedrooms || property.bathrooms || property.area_sqm) && (
                  <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                    {property.bedrooms && (
                      <span>{property.bedrooms} bed</span>
                    )}
                    {property.bathrooms && (
                      <span>{property.bathrooms} bath</span>
                    )}
                    {property.area_sqm && (
                      <span>{property.area_sqm} m²</span>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No properties found matching your criteria.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default PropertySearch;
