import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, Phone, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ContactModalProps {
  property: {
    id: string;
    title: string;
    contact_phone?: string | null;
    contact_email?: string | null;
    price: number;
    currency: string;
  };
  children?: React.ReactNode;
}

const ContactModal: React.FC<ContactModalProps> = ({ property, children }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    message: `Hi, I'm interested in your property "${property.title}". Could you please provide more information?`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the message to your backend
      // For now, we'll simulate the action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent!",
        description: "Your inquiry has been sent to the property owner. They will contact you soon.",
      });
      
      setIsOpen(false);
      setFormData({
        ...formData,
        message: `Hi, I'm interested in your property "${property.title}". Could you please provide more information?`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneCall = () => {
    if (property.contact_phone) {
      window.open(`tel:${property.contact_phone}`);
    }
  };

  const handleEmail = () => {
    if (property.contact_email) {
      const subject = encodeURIComponent(`Inquiry about ${property.title}`);
      const body = encodeURIComponent(formData.message);
      window.open(`mailto:${property.contact_email}?subject=${subject}&body=${body}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full bg-gradient-primary hover:opacity-90">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Owner
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Property Owner</DialogTitle>
          <DialogDescription>
            Send a message about "{property.title}" - {property.currency} {property.price.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-2 gap-3 py-4">
          {property.contact_phone && (
            <Button variant="outline" onClick={handlePhoneCall} className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call Now
            </Button>
          )}
          {property.contact_email && (
            <Button variant="outline" onClick={handleEmail} className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Button>
          )}
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Your phone number"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message to the property owner..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
