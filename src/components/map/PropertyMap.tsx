import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Home, 
  Building, 
  Hotel, 
  UtensilsCrossed,
  AlertTriangle,
  Filter,
  Search,
  ArrowRight
} from "lucide-react";

interface Property {
  id: string;
  type: 'private' | 'state' | 'rent' | 'sale' | 'hotel' | 'eatery' | 'conflict';
  title: string;
  location: string;
  coordinates: [number, number];
  price?: string;
  status: string;
}

const mockProperties: Property[] = [
  {
    id: "NWMZBda1GRA0023",
    type: "private",
    title: "Family Residence",
    location: "Bamenda, NW Region",
    coordinates: [10.1578, 6.1926],
    status: "Private Property"
  },
  {
    id: "NWMZBda1GRA0024", 
    type: "sale",
    title: "Modern Villa",
    location: "Limbe, SW Region", 
    coordinates: [9.2145, 4.0156],
    price: "45,000,000 FCFA",
    status: "For Sale"
  },
  {
    id: "NWMZBda1GRA0025",
    type: "hotel",
    title: "Mountain View Hotel",
    location: "Buea, SW Region",
    coordinates: [9.2924, 4.1563],
    price: "15,000 FCFA/night",
    status: "Hotel"
  }
];

const propertyIcons = {
  private: Home,
  state: Building,
  rent: Home,
  sale: Home,
  hotel: Hotel,
  eatery: UtensilsCrossed,
  conflict: AlertTriangle,
};

const propertyColors = {
  private: '#22C55E',
  state: '#16A34A', 
  rent: '#EAB308',
  sale: '#3B82F6',
  hotel: '#8B5CF6',
  eatery: '#F97316',
  conflict: '#EF4444',
};

const PropertyMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!mapContainer.current) return;

    // ADD YOUR MAPBOX TOKEN HERE - Get it from https://mapbox.com/
    const MAPBOX_TOKEN = ""; // Paste your Mapbox public token here (starts with pk.)
    
    if (!MAPBOX_TOKEN) {
      console.warn('Mapbox token is required. Get your free token at https://mapbox.com/');
      // Show fallback message instead of initializing map
      return;
    }

    // Set the access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map centered on Cameroon
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v11', 
      center: [12.3547, 3.8480], // Cameroon center
      zoom: 6,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add property markers
    mockProperties.forEach((property) => {
      const markerDiv = document.createElement('div');
      markerDiv.className = 'custom-marker';
      markerDiv.style.width = '30px';
      markerDiv.style.height = '30px';
      markerDiv.style.borderRadius = '50%';
      markerDiv.style.backgroundColor = propertyColors[property.type];
      markerDiv.style.border = '3px solid white';
      markerDiv.style.cursor = 'pointer';
      markerDiv.style.display = 'flex';
      markerDiv.style.alignItems = 'center';
      markerDiv.style.justifyContent = 'center';
      markerDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

      const IconComponent = propertyIcons[property.type];
      markerDiv.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        ${property.type === 'private' ? '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>' :
          property.type === 'hotel' ? '<path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/>' :
          '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'}
      </svg>`;

      const marker = new mapboxgl.Marker(markerDiv)
        .setLngLat(property.coordinates)
        .addTo(map.current!);

      markerDiv.addEventListener('click', () => {
        setSelectedProperty(property);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const filteredProperties = mockProperties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Map Controls */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Property Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {Object.entries(propertyColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize text-muted-foreground">
                {type === 'private' ? 'Private' :
                 type === 'state' ? 'State' :
                 type === 'rent' ? 'For Rent' :
                 type === 'sale' ? 'For Sale' :
                 type === 'hotel' ? 'Hotels' :
                 type === 'eatery' ? 'Eateries' : 'Conflict Zone'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Map Container */}
        <div ref={mapContainer} className="absolute inset-0">
          {/* Fallback content when Mapbox token is not provided */}
          <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
            <Card className="p-8 max-w-md mx-4 text-center">
              <CardContent>
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Interactive Map Coming Soon</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To enable the interactive property map, add your free Mapbox token.
                </p>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.open('https://mapbox.com/', '_blank')}
                >
                  Get Free Mapbox Token
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Property Details Panel */}
        {selectedProperty && (
          <Card className="absolute top-4 left-4 w-80 z-10 shadow-elegant">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{selectedProperty.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProperty.location}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedProperty(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: propertyColors[selectedProperty.type],
                      color: propertyColors[selectedProperty.type]
                    }}
                  >
                    {selectedProperty.status}
                  </Badge>
                </div>

                <div className="text-sm">
                  <p className="font-medium">Property ID:</p>
                  <p className="text-muted-foreground font-mono">{selectedProperty.id}</p>
                </div>

                {selectedProperty.price && (
                  <div className="text-sm">
                    <p className="font-medium">Price:</p>
                    <p className="text-lg font-semibold text-primary">{selectedProperty.price}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Properties List - Mobile */}
        <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border p-4 md:hidden max-h-48 overflow-y-auto">
          <h4 className="font-medium mb-2">Properties ({filteredProperties.length})</h4>
          <div className="space-y-2">
            {filteredProperties.slice(0, 3).map((property) => (
              <div 
                key={property.id}
                className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setSelectedProperty(property)}
              >
                <div 
                  className="w-3 h-3 rounded-full border border-white flex-shrink-0"
                  style={{ backgroundColor: propertyColors[property.type] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{property.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{property.location}</p>
                </div>
                {property.price && (
                  <p className="text-xs font-medium text-primary">{property.price}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;