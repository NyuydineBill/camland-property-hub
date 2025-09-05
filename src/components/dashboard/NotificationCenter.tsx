import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, MessageCircle, Phone, Mail, Calendar, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'contact_request' | 'property_inquiry' | 'system';
  title: string;
  message: string;
  property_id?: string;
  property_title?: string;
  sender_name?: string;
  sender_email?: string;
  sender_phone?: string;
  created_at: string;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // For now, we'll simulate notifications
      // In a real app, these would come from your database
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'contact_request',
          title: 'New Property Inquiry',
          message: 'Someone is interested in your property "Modern Family Villa in Bamenda"',
          property_id: '1',
          property_title: 'Modern Family Villa in Bamenda',
          sender_name: 'John Doe',
          sender_email: 'john.doe@email.com',
          sender_phone: '+237 677 888 999',
          created_at: new Date().toISOString(),
          read: false,
        },
        {
          id: '2',
          type: 'property_inquiry',
          title: 'Property Question',
          message: 'A potential buyer has questions about your downtown apartment',
          property_id: '2',
          property_title: 'Downtown Apartment for Rent',
          sender_name: 'Jane Smith',
          sender_email: 'jane.smith@email.com',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: false,
        },
        {
          id: '3',
          type: 'system',
          title: 'Property Verified',
          message: 'Your property "Beachside House in Limbe" has been verified and is now live',
          property_id: '4',
          property_title: 'Beachside House in Limbe',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          read: true,
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    toast({
      title: "Notification Deleted",
      description: "Notification has been removed.",
    });
  };

  const handleContactResponse = (notification: Notification, method: 'phone' | 'email') => {
    if (method === 'phone' && notification.sender_phone) {
      window.open(`tel:${notification.sender_phone}`);
    } else if (method === 'email' && notification.sender_email) {
      const subject = encodeURIComponent(`Re: ${notification.property_title}`);
      window.open(`mailto:${notification.sender_email}?subject=${subject}`);
    }
    markAsRead(notification.id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contact_request':
      case 'property_inquiry':
        return <MessageCircle className="h-5 w-5 text-blue-600" />;
      case 'system':
        return <Bell className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchNotifications}
          >
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 h-auto"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 h-auto text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    
                    {notification.property_title && (
                      <p className="text-xs text-blue-600 mt-1">
                        Property: {notification.property_title}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                    
                    {(notification.type === 'contact_request' || notification.type === 'property_inquiry') && (
                      <>
                        <Separator className="my-3" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            From: {notification.sender_name}
                          </span>
                          <div className="flex gap-2 ml-auto">
                            {notification.sender_phone && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleContactResponse(notification, 'phone')}
                                className="h-6 px-2 text-xs"
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                            )}
                            {notification.sender_email && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleContactResponse(notification, 'email')}
                                className="h-6 px-2 text-xs"
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
