import React, { useState } from "react";
import { saveDealCollateral, DealCollateral } from "../services/dealCollateralService";

const initialState: DealCollateral = {
  dealId: "",
  collateralId: 0,
  collateralType: "",
  collateralValue: 0,
  currency: "",
  createdBy: "",
  createdDateTime: "",
  lastUpdatedBy: "",
  lastUpdatedDateTime: "",
};

const DealCollateralForm: React.FC = () => {
  const [form, setForm] = useState<DealCollateral>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'collateralId' || name === 'collateralValue' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await saveDealCollateral(form);
      setSuccess(true);
      setForm(initialState);
    } catch (err: any) {
      setError("Failed to save DealCollateral.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <input name="dealId" value={form.dealId} onChange={handleChange} placeholder="Deal ID (UUID)" required className="input" />
      <input name="collateralId" type="number" value={form.collateralId} onChange={handleChange} placeholder="Collateral ID" required className="input" />
      <input name="collateralType" value={form.collateralType} onChange={handleChange} placeholder="Collateral Type" className="input" />
      <input name="collateralValue" type="number" value={form.collateralValue} onChange={handleChange} placeholder="Collateral Value" className="input" />
      <input name="currency" value={form.currency} onChange={handleChange} placeholder="Currency (e.g. USD)" maxLength={3} className="input" />
      <input name="createdBy" value={form.createdBy} onChange={handleChange} placeholder="Created By" className="input" />
      <input name="createdDateTime" type="datetime-local" value={form.createdDateTime} onChange={handleChange} placeholder="Created DateTime" className="input" />
      <input name="lastUpdatedBy" value={form.lastUpdatedBy} onChange={handleChange} placeholder="Last Updated By" className="input" />
      <input name="lastUpdatedDateTime" type="datetime-local" value={form.lastUpdatedDateTime} onChange={handleChange} placeholder="Last Updated DateTime" className="input" />
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Saving..." : "Save"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">Saved successfully!</div>}
    </form>
  );
};

export default DealCollateralForm; 