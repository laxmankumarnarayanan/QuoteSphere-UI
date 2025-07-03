import React, { useState, useEffect } from "react";
import TextInput from "../../../template components/components/elements/TextInput";
import SecondaryButton from "../../../template components/components/elements/SecondaryButton";
import { dealService } from "../../../services/dealService";

interface SpecialCondition {
  dealID: string;
  conditionNumber: number;
  description: string;
  createdBy?: string;
  createdDateTime?: string;
  lastUpdatedBy?: string;
  lastUpdatedDateTime?: string;
}

interface SpecialConditionsSectionProps {
  dealId: string;
}

const SpecialConditionsSection: React.FC<SpecialConditionsSectionProps> = ({ dealId }) => {
  const [description, setDescription] = useState("");
  const [specialConditions, setSpecialConditions] = useState<SpecialCondition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dealId) {
      dealService.getSpecialConditionsByDealId(dealId).then((data) => {
        setSpecialConditions(data);
      });
    }
  }, [dealId]);

  const handleAdd = async () => {
    if (!description.trim()) {
      setError("Description cannot be empty");
      return;
    }
    setError(null);
    setLoading(true);
    const newCondition: SpecialCondition = {
      dealID: dealId,
      conditionNumber: specialConditions.length + 1,
      description,
      createdBy: "", // Fill as needed
      createdDateTime: new Date().toISOString(),
      lastUpdatedBy: "",
      lastUpdatedDateTime: new Date().toISOString(),
    };
    try {
      const saved = await dealService.addSpecialCondition(newCondition);
      setSpecialConditions([...specialConditions, saved]);
      setDescription("");
    } catch (e: any) {
      setError("Failed to add special condition");
    } finally {
      setLoading(false);
    }
  };

  const nextConditionNumber = specialConditions.length + 1;

  return (
    <div className="w-full border border-violet-200 rounded-lg bg-violet-50 p-6 mt-0">
      <div className="font-semibold text-violet-800 mb-4">Special Conditions</div>
      {specialConditions.length > 0 && (
        <div className="mb-6">
          <div className="font-medium text-violet-900 mb-2">Added Special Conditions:</div>
          <ul className="space-y-2">
            {specialConditions.map((cond, idx) => (
              <li key={cond.conditionNumber} className="flex gap-4 items-center">
                <span className="text-sm font-semibold text-violet-900">Condition {cond.conditionNumber}:</span>
                <span className="text-sm text-slate-800">{cond.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[#636ae8]">Condition Number: {nextConditionNumber}</span>
          <div className="flex-1">
            <TextInput
              id="special-condition-description"
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Enter special condition description"
            />
          </div>
        </div>
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      </div>
      <div className="flex justify-end mt-4">
        <SecondaryButton onClick={handleAdd} disabled={loading || !description.trim()}>
          {loading ? "Adding..." : "Add"}
        </SecondaryButton>
      </div>
    </div>
  );
};

export default SpecialConditionsSection; 