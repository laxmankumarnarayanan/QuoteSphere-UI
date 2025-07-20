import React, { useEffect, useState } from "react";
import TextInput from "../template components/components/form/TextInput";
import SecondaryButton from "../template components/components/elements/SecondaryButton";
import PrimaryButton from "../template components/components/elements/PrimaryButton";
import SelectInput from "../template components/components/elements/SelectInput";
import { dealService } from "../services/dealService";

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface DealPricingRow {
  id: {
    dealId: string;
    businessDomainId: string;
    productId: string;
    subProductId: string;
    priceId: string;
  };
  priceDescription: string;
  currency: string;
  feeType: string;
  flatFeeAmount: string;
  feePercentage: string;
  preferentialType: string;
  standardPrice: string;
  discountPercentage: string;
}

interface DealPricingTableProps {
  dealId: string;
}

const DealPricingTable: React.FC<DealPricingTableProps> = ({ dealId }) => {
  const [rows, setRows] = useState<DealPricingRow[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ 
    preferentialType: string;
    standardPrice: string;
    discountPercentage: string;
  }>({ 
    preferentialType: '',
    standardPrice: '',
    discountPercentage: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferentialTypeOptions, setPreferentialTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [preferentialTypeLoading, setPreferentialTypeLoading] = useState(false);

  // Load preferential type dropdown options
  useEffect(() => {
    setPreferentialTypeLoading(true);
    dealService.getDropdownValues("DealPricing", "PreferentialType")
      .then(values => setPreferentialTypeOptions(values.map(v => ({ value: v, label: v }))))
      .catch(err => {
        console.error("Error loading preferential types:", err);
        setError("Failed to load preferential type options.");
      })
      .finally(() => setPreferentialTypeLoading(false));
  }, []);

  useEffect(() => {
    async function fetchRows() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/deal-pricing`);
        const data = await res.json();
        // Filter for this dealId
        setRows(data.filter((row: DealPricingRow) => row.id.dealId === dealId));
      } catch (e) {
        setError("Failed to load pricing details.");
      } finally {
        setLoading(false);
      }
    }
    if (dealId) fetchRows();
  }, [dealId]);

  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditValues({
      preferentialType: rows[idx].preferentialType || '',
      standardPrice: rows[idx].standardPrice || '',
      discountPercentage: rows[idx].discountPercentage || '',
    });
  };

  const handleCancel = () => {
    setEditIdx(null);
    setEditValues({ 
      preferentialType: '',
      standardPrice: '',
      discountPercentage: ''
    });
  };

  const handleChange = (field: 'preferentialType' | 'standardPrice' | 'discountPercentage', value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (idx: number) => {
    setLoading(true);
    setError(null);
    try {
      const row = rows[idx];
      const updated = {
        ...row,
        preferentialType: editValues.preferentialType,
        standardPrice: editValues.standardPrice,
        discountPercentage: editValues.discountPercentage,
      };
      // PUT to backend
      await fetch(`${API_BASE_URL}/deal-pricing`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      // Update local state
      setRows(prev => prev.map((r, i) => (i === idx ? updated : r)));
      setEditIdx(null);
      setEditValues({ 
        preferentialType: '',
        standardPrice: '',
        discountPercentage: ''
      });
    } catch (e) {
      setError("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full border border-violet-200 rounded-lg bg-violet-50 p-6 mt-0">
      <div className="font-semibold text-violet-800 mb-4">Pricing & Fees Details</div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading && <div className="text-slate-600 mb-2">Loading...</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-violet-100">
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800" colSpan={8}>
                Deal Pricing
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <React.Fragment key={row.id.priceId}>
                {/* First line: Price Description + Edit button */}
                <tr className="border-b-0">
                  <td className="px-3 py-2 text-sm text-slate-800 font-semibold" colSpan={7}>
                    {row.priceDescription}
                  </td>
                  <td className="px-3 py-2 text-sm text-right" style={{ width: "1%" }}>
                    {editIdx === idx ? (
                      <>
                        <PrimaryButton onClick={() => handleSave(idx)} className="mr-2">Save</PrimaryButton>
                        <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
                      </>
                    ) : (
                      <SecondaryButton onClick={() => handleEdit(idx)}>Edit</SecondaryButton>
                    )}
                  </td>
                </tr>
                {/* Second line: Other fields */}
                <tr className="border-b last:border-b-0 bg-violet-50">
                  <td className="px-3 py-2 text-sm text-slate-800">{row.currency}</td>
                  <td className="px-3 py-2 text-sm text-slate-800">{row.feeType}</td>
                  <td className="px-3 py-2 text-sm text-slate-800">{row.flatFeeAmount}</td>
                  <td className="px-3 py-2 text-sm text-slate-800">{row.feePercentage}</td>
                  <td className="px-3 py-2 text-sm text-slate-800">
                    {editIdx === idx ? (
                      <SelectInput
                        id={`preferentialType-${idx}`}
                        label="Preferential Type"
                        value={editValues.preferentialType}
                        onChange={val => handleChange('preferentialType', val)}
                        options={preferentialTypeOptions}
                        placeholder="Select Preferential Type"
                        disabled={preferentialTypeLoading}
                      />
                    ) : (
                      row.preferentialType
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-800">
                    {editIdx === idx ? (
                      <TextInput
                        id={`standardPrice-${idx}`}
                        label="Standard Price"
                        value={editValues.standardPrice}
                        onChange={val => handleChange('standardPrice', val)}
                        type="number"
                      />
                    ) : (
                      row.standardPrice
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-800">
                    {editIdx === idx ? (
                      <TextInput
                        id={`discountPercentage-${idx}`}
                        label="Discount %"
                        value={editValues.discountPercentage}
                        onChange={val => handleChange('discountPercentage', val)}
                        type="number"
                      />
                    ) : (
                      row.discountPercentage
                    )}
                  </td>
                  {/* Empty cell for alignment with the edit button column */}
                  <td />
                </tr>
              </React.Fragment>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={10} className="text-center text-slate-500 py-4">No pricing details found for this deal.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealPricingTable; 