import React from "react";
import { useParams } from "react-router-dom";

const EditProperty: React.FC = () => {
  const { id } = useParams();
  // TODO: Fetch property data and provide edit form
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      <p className="text-muted-foreground mb-6">Editing property ID: {id}</p>
      {/* Add edit form here */}
      <div className="border rounded p-4 bg-background">
        <p>Edit property form coming soon.</p>
      </div>
    </div>
  );
};

export default EditProperty;
