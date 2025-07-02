import React, { useState, useEffect } from "react";
import { saveDealCollateral, DealCollateral } from "../services/dealCollateralService";
import SelectInput from "../template components/components/form/SelectInput";
import { dealService } from "../services/dealService";
import TextInput from "../template components/components/form/TextInput";
import SecondaryButton from "../template components/components/elements/SecondaryButton";
import { v4 as uuidv4 } from "uuid";

interface DealCollateralFormProps {
  dealId: string;
}

const initialState = {
  collateralType: "",
  collateralValue: "",
  currency: "",
};

const DealCollateralForm: React.FC<DealCollateralFormProps> = ({ dealId }) => {
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
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        dealId,
        collateralId: uuidv4(),
        collateralType: form.collateralType,
        collateralValue: Number(form.collateralValue),
        currency: form.currency,
        createdBy: "",
        createdDateTime: new Date().toISOString(),
        lastUpdatedBy: "",
        lastUpdatedDateTime: new Date().toISOString(),
      };
      console.log("Saving DealCollateral payload:", payload);
      await saveDealCollateral(payload);
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
      <TextInput
        id="collateralValue"
        label="Collateral Value"
        value={form.collateralValue}
        onChange={val => setForm(prev => ({ ...prev, collateralValue: val }))}
        required
        placeholder="Enter collateral value"
        type="number"
      />
      <SecondaryButton type="submit" isLoading={loading} size="md">
        Add
      </SecondaryButton>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">Saved successfully!</div>}
    </form>
  );
};

export default DealCollateralForm; 