import React, { useState, useEffect } from "react";
import { saveDealCollateral, DealCollateral } from "../services/dealCollateralService";
import SelectInput from "../template components/components/form/SelectInput";
import { dealService } from "../services/dealService";
import TextareaInput from "../template components/components/form/TextareaInput";

const initialState = {
  dealId: "",
  collateralId: 0,
  collateralType: "",
  collateralValue: "",
  currency: "",
  createdBy: "",
  createdDateTime: "",
  lastUpdatedBy: "",
  lastUpdatedDateTime: "",
};

const DealCollateralForm: React.FC = () => {
  const [form, setForm] = useState<typeof initialState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [collateralTypeOptions, setCollateralTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [collateralTypeLoading, setCollateralTypeLoading] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState<{ value: string; label: string }[]>([]);
  const [currencyLoading, setCurrencyLoading] = useState(false);

  useEffect(() => {
    setCollateralTypeLoading(true);
    dealService.getDropdownValues("DealCollateral", "CollateralType")
      .then(values => setCollateralTypeOptions(values.map(v => ({ value: v, label: v }))))
      .finally(() => setCollateralTypeLoading(false));

    setCurrencyLoading(true);
    dealService.getDropdownValues("DealCollateral", "Currency")
      .then(values => setCurrencyOptions(values.map(v => ({ value: v, label: v }))))
      .finally(() => setCurrencyLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'collateralId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await saveDealCollateral({ ...form, collateralValue: Number(form.collateralValue) });
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
      <input name="collateralId" type="number" value={form.collateralId} onChange={handleChange} placeholder="Collateral ID" required className="input" />
      <SelectInput
        id="collateralType"
        label="Collateral Type"
        value={form.collateralType}
        onChange={val => setForm(prev => ({ ...prev, collateralType: val }))}
        options={collateralTypeOptions}
        required
        disabled={collateralTypeLoading}
        placeholder={collateralTypeLoading ? "Loading..." : "Select Collateral Type"}
      />
      <TextareaInput
        id="collateralValue"
        label="Collateral Value"
        value={form.collateralValue}
        onChange={val => setForm(prev => ({ ...prev, collateralValue: val }))}
        required
        placeholder="Enter collateral value"
        rows={2}
      />
      <SelectInput
        id="currency"
        label="Currency"
        value={form.currency}
        onChange={val => setForm(prev => ({ ...prev, currency: val }))}
        options={currencyOptions}
        required
        disabled={currencyLoading}
        placeholder={currencyLoading ? "Loading..." : "Select Currency"}
      />
      <input name="createdDateTime" type="datetime-local" value={form.createdDateTime} onChange={handleChange} placeholder="Created DateTime" className="input" />
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