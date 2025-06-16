import React from "react";
import { Separator } from "../../../../components/ui/separator";

export const CustomerDetailsSection = (): JSX.Element => {
  return (
    <div className="w-full py-4 bg-white">
      <Separator className="mb-4" />
      {/* Navigation buttons removed from here as they are handled by DealCreationLayer */}
    </div>
  );
};
