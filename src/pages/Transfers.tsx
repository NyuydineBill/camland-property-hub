import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, ArrowRight, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PropertyTransfer {
  id: string;
  property_title: string;
  from_owner: string;
  to_owner: string;
  transfer_type: 'sale' | 'gift' | 'inheritance';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  amount?: number;
  currency?: string;
  created_at: string;
  completed_at?: string;
}

const Transfers = () => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<PropertyTransfer[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTransfer, setShowNewTransfer] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    transfer_type: '',
    recipient_email: '',
    amount: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Fetch user's properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('id, title')
        .eq('owner_id', user.id);

      setProperties(propertiesData || []);

      // Mock transfer data - in real app this would come from a transfers table
      const mockTransfers: PropertyTransfer[] = [
        {
          id: '1',
          property_title: 'Family Home in Douala',
          from_owner: 'John Doe',
          to_owner: 'jane.doe@email.com',
          transfer_type: 'sale',
          status: 'in_progress',
          amount: 25000000,
          currency: 'XAF',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          property_title: 'Commercial Building',
          from_owner: 'John Doe',
          to_owner: 'investor@company.com',
          transfer_type: 'sale',
          status: 'completed',
          amount: 50000000,
          currency: 'XAF',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed_at: new Date().toISOString()
        }
      ];

      setTransfers(mockTransfers);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <RefreshCw className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-white">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-warning text-white">In Progress</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const handleSubmitTransfer = async () => {
    // In a real app, this would create a transfer record
    console.log('Transfer request:', formData);
    setShowNewTransfer(false);
    setFormData({
      property_id: '',
      transfer_type: '',
      recipient_email: '',
      amount: '',
      notes: ''
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading transfers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Transfers</h1>
          <p className="text-muted-foreground mt-1">
            Manage property ownership transfers
          </p>
        </div>
        <Button 
          onClick={() => setShowNewTransfer(true)}
          className="bg-gradient-primary hover:opacity-90 gap-2"
        >
          <Plus className="h-4 w-4" />
          New Transfer
        </Button>
      </div>

      {/* Transfer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {transfers.filter(t => t.status === 'completed').length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
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
                  {transfers.filter(t => t.status === 'in_progress').length}
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
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {transfers.filter(t => t.status === 'pending').length}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{transfers.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Transfer Form */}
      {showNewTransfer && (
        <Card>
          <CardHeader>
            <CardTitle>New Property Transfer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property</Label>
                <Select 
                  value={formData.property_id} 
                  onValueChange={(value) => setFormData({...formData, property_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Transfer Type</Label>
                <Select 
                  value={formData.transfer_type} 
                  onValueChange={(value) => setFormData({...formData, transfer_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="gift">Gift</SelectItem>
                    <SelectItem value="inheritance">Inheritance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Recipient Email</Label>
                <Input
                  value={formData.recipient_email}
                  onChange={(e) => setFormData({...formData, recipient_email: e.target.value})}
                  placeholder="recipient@email.com"
                />
              </div>

              {formData.transfer_type === 'sale' && (
                <div className="space-y-2">
                  <Label>Amount (XAF)</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional information about this transfer..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitTransfer} className="bg-gradient-primary hover:opacity-90">
                Submit Transfer Request
              </Button>
              <Button variant="outline" onClick={() => setShowNewTransfer(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transfers List */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No transfers yet</h3>
              <p className="text-muted-foreground">
                Start your first property transfer
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transfers.map((transfer) => (
                <Card key={transfer.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(transfer.status)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{transfer.property_title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{transfer.from_owner}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{transfer.to_owner}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(transfer.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        {transfer.amount && (
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              {transfer.currency} {transfer.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {transfer.transfer_type}
                            </p>
                          </div>
                        )}
                        
                        {getStatusBadge(transfer.status)}
                        
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transfers;