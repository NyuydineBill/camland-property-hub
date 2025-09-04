import AddPropertyForm from "@/components/property/AddPropertyForm";

const AddProperty = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Register New Property</h1>
          <p className="text-muted-foreground mt-2">
            Complete the form below to register your property with CamLand. All information will be verified for accuracy and authenticity.
          </p>
        </div>
        
        <AddPropertyForm />
        
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">Important Notes:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Property registration is free, but verification services require payment</li>
            <li>• All uploaded documents will be securely stored and processed for verification</li>
            <li>• Property ID will be auto-generated based on location coordinates</li>
            <li>• Verification typically takes 5-7 business days (Express: 3 days)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;