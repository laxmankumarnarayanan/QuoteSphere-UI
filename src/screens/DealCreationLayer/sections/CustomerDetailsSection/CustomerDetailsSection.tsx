import React from "react";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";

export const CustomerDetailsSection = (): JSX.Element => {
  return (
    <footer className="w-full py-4 bg-white">
      <Separator className="mb-4" />
      <div className="flex justify-end gap-2 px-4">
        <Button
          variant="outline"
          className="font-normal text-sm text-[#242524]"
        >
          Back
        </Button>
        <Button className="font-normal text-sm bg-[#636ae8] hover:bg-[#5058d6] text-white">
          Next
        </Button>
      </div>
    </footer>
  );
};
