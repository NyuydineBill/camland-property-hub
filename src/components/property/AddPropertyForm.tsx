import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, MapPin, FileText, Camera, User } from "lucide-react";

const regions = [
  "Adamawa", "Centre", "East", "Far North", "Littoral", 
  "North", "Northwest", "South", "Southwest", "West"
];

const propertyTypes = [
  "Residential House", "Apartment", "Land", "Commercial Building", 
  "Hotel", "Guest House", "Restaurant", "Shop"
];

const propertyStatus = [
  "Private Property", "For Sale", "For Rent", "Commercial Listing"
];

const AddPropertyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    idType: "",
    
    // Property Information
    region: "",
    division: "",
    subDivision: "",
    quarter: "",
    propertyType: "",
    propertyStatus: "",
    dimensions: "",
    coordinates: "",
    description: "",
    
    // Next of Kin (Optional)
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinEmail: "",
    
    // Agreements
    termsAccepted: false,
    dataProcessingAccepted: false
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Property registration submitted:", formData);
    // Handle form submission
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <p className="text-sm text-muted-foreground">Please provide your personal details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idType">ID Type *</Label>
                <Select value={formData.idType} onValueChange={(value) => setFormData({...formData, idType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nid">National ID Card</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  placeholder="Enter your ID number"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Property Information</h3>
                <p className="text-sm text-muted-foreground">Describe your property details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <Select value={formData.region} onValueChange={(value) => setFormData({...formData, region: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region.toLowerCase()}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="division">Division *</Label>
                <Input
                  id="division"
                  value={formData.division}
                  onChange={(e) => setFormData({...formData, division: e.target.value})}
                  placeholder="Enter division"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subDivision">Sub-Division *</Label>
                <Input
                  id="subDivision"
                  value={formData.subDivision}
                  onChange={(e) => setFormData({...formData, subDivision: e.target.value})}
                  placeholder="Enter sub-division"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quarter">Quarter/Neighborhood *</Label>
                <Input
                  id="quarter"
                  value={formData.quarter}
                  onChange={(e) => setFormData({...formData, quarter: e.target.value})}
                  placeholder="Enter quarter or neighborhood"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select value={formData.propertyType} onValueChange={(value) => setFormData({...formData, propertyType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyStatus">Property Status *</Label>
                <Select value={formData.propertyStatus} onValueChange={(value) => setFormData({...formData, propertyStatus: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyStatus.map((status) => (
                      <SelectItem key={status} value={status.toLowerCase().replace(/\s+/g, '-')}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dimensions">Property Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                  placeholder="e.g., 50m x 30m or 1500 sq meters"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Property Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your property..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Documents & Media</h3>
                <p className="text-sm text-muted-foreground">Upload required documents and photos</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Property Documents *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Property Photos *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload property photos
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG up to 5MB each
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-medium">Next of Kin Information (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinName">Full Name</Label>
                    <Input
                      id="nextOfKinName"
                      value={formData.nextOfKinName}
                      onChange={(e) => setFormData({...formData, nextOfKinName: e.target.value})}
                      placeholder="Next of kin name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinPhone">Phone Number</Label>
                    <Input
                      id="nextOfKinPhone"
                      value={formData.nextOfKinPhone}
                      onChange={(e) => setFormData({...formData, nextOfKinPhone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinEmail">Email Address</Label>
                    <Input
                      id="nextOfKinEmail"
                      type="email"
                      value={formData.nextOfKinEmail}
                      onChange={(e) => setFormData({...formData, nextOfKinEmail: e.target.value})}
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-success rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Review & Submit</h3>
                <p className="text-sm text-muted-foreground">Review your information and accept terms</p>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium">Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="ml-2 font-medium">{formData.fullName || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Property Type:</span>
                  <span className="ml-2 font-medium">{formData.propertyType || "Not selected"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <span className="ml-2 font-medium">
                    {[formData.quarter, formData.subDivision, formData.division, formData.region]
                      .filter(Boolean).join(", ") || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 font-medium">{formData.propertyStatus || "Not selected"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData({...formData, termsAccepted: checked as boolean})}
                />
                <Label htmlFor="terms" className="text-sm">
                  I accept the <Button variant="link" className="p-0 h-auto">Terms and Conditions</Button>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dataProcessing"
                  checked={formData.dataProcessingAccepted}
                  onCheckedChange={(checked) => setFormData({...formData, dataProcessingAccepted: checked as boolean})}
                />
                <Label htmlFor="dataProcessing" className="text-sm">
                  I consent to data processing for property registration and verification
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Register New Property</CardTitle>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
        
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              disabled={!formData.termsAccepted || !formData.dataProcessingAccepted}
              className="bg-gradient-primary hover:opacity-90"
            >
              Submit Registration
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-primary hover:opacity-90"
            >
              Next Step
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AddPropertyForm;