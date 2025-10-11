import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  UserCheck,
  Ban,
  Edit,
  Eye,
  Shield,
  UserCog,
  Building,
  DollarSign,
  Calendar,
  Filter
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
  properties_count?: number;
  is_verified?: boolean;
}

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch properties count for each user
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('owner_id');

      if (propertiesError) throw propertiesError;

      // Count properties per user
      const propertyCounts = properties?.reduce((acc, prop) => {
        acc[prop.owner_id] = (acc[prop.owner_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Combine data
      const usersWithCounts = profiles?.map(profile => ({
        ...profile,
        properties_count: propertyCounts[profile.id] || 0,
        is_verified: true // Assume all users are verified for now
      })) || [];

      setUsers(usersWithCounts);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'broker': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'community': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'owner': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'broker': return <UserCog className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      case 'owner': return <Building className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
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
              <UserCog className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-sm text-muted-foreground">Manage all platform users and their roles</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            View, edit, and manage user accounts across the platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-gradient-primary hover:opacity-90 gap-2">
            <UserCheck className="h-4 w-4" />
            Bulk Actions
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Property Owners</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {users.filter(u => u.role === 'owner').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active owners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Brokers</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {users.filter(u => u.role === 'broker').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Licensed brokers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Community Heads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {users.filter(u => u.role === 'community').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Community leaders</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="owner">Property Owners</option>
          <option value="broker">Brokers</option>
          <option value="community">Community Heads</option>
          <option value="admin">Admins</option>
        </select>
        <Badge variant="outline" className="px-3 py-2 text-sm">
          {filteredUsers.length} users found
        </Badge>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  {getRoleIcon(user.role)}
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {user.full_name || 'Unknown User'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Badge className={cn("text-xs", getRoleColor(user.role))}>
                {user.role.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Phone: {user.phone}</span>
                </div>
              )}
              {user.properties_count > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-primary" />
                  <span>{user.properties_count} Properties</span>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" /> View
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-semibold">No Users Found</p>
          <p className="mt-2">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;