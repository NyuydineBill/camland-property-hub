import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Plus, 
  Search, 
  Clock, 
  MapPin, 
  User,
  Building,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Edit,
  Filter
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  property_title: string;
  property_address: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  created_at: string;
}

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Mock appointment data - in a real app, this would come from the database
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          client_name: "John Mensah",
          client_phone: "+237 677 123 456",
          client_email: "john.mensah@email.com",
          property_title: "Luxury Villa in Douala",
          property_address: "Douala, Littoral",
          appointment_date: "2025-09-22",
          appointment_time: "10:00",
          status: "scheduled",
          notes: "First viewing, interested in purchasing",
          created_at: "2025-09-20T10:00:00Z"
        },
        {
          id: "2",
          client_name: "Marie Ashu",
          client_phone: "+237 681 234 567",
          client_email: "marie.ashu@email.com",
          property_title: "Commercial Office Space Yaoundé",
          property_address: "Yaoundé, Centre",
          appointment_date: "2025-09-21",
          appointment_time: "14:30",
          status: "scheduled",
          notes: "Corporate lease inquiry",
          created_at: "2025-09-19T14:30:00Z"
        },
        {
          id: "3",
          client_name: "Paul Biya",
          client_phone: "+237 692 345 678",
          client_email: "paul.biya@email.com",
          property_title: "Family Home in Bamenda",
          property_address: "Bamenda, North West",
          appointment_date: "2025-09-20",
          appointment_time: "16:00",
          status: "completed",
          notes: "Viewing completed, client very interested",
          created_at: "2025-09-18T16:00:00Z"
        },
        {
          id: "4",
          client_name: "Sarah Ngom",
          client_phone: "+237 693 456 789",
          client_email: "sarah.ngom@email.com",
          property_title: "Student Accommodation Buea",
          property_address: "Buea, South West",
          appointment_date: "2025-09-25",
          appointment_time: "11:00",
          status: "scheduled",
          notes: "Student housing inquiry",
          created_at: "2025-09-20T11:00:00Z"
        }
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.property_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || appointment.status === filterStatus;
    const matchesDate = !selectedDate || appointment.appointment_date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'rescheduled': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      case 'rescheduled': return <Calendar className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">Manage property viewings and client meetings</p>
        </div>
        <Button className="gap-2 bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4" />
          Schedule Viewing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-xs text-muted-foreground">Total Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'scheduled').length}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'completed').length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{new Set(appointments.map(a => a.property_title)).size}</p>
                <p className="text-xs text-muted-foreground">Properties Shown</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-48"
        />
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "scheduled" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("scheduled")}
          >
            Scheduled
          </Button>
          <Button
            variant={filterStatus === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(appointment.status)} text-white flex items-center gap-1`}>
                      {getStatusIcon(appointment.status)}
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.client_name}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.property_title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(appointment.appointment_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.property_address}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.client_phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.client_email}</span>
                      </div>
                      {appointment.notes && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {appointment.status === 'scheduled' && (
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No appointments found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterStatus !== "all" || selectedDate
              ? "Try adjusting your search or filter criteria"
              : "Start by scheduling your first property viewing"
            }
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Schedule Viewing
          </Button>
        </div>
      )}
    </div>
  );
};

export default Appointments;