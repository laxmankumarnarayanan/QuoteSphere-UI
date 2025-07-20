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
    <div className="w-full border border-brand-200 rounded-lg bg-brand-50 p-6 mt-0">
      <div className="font-semibold text-brand-800 mb-4">Pricing & Fees Details</div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading && <div className="text-slate-600 mb-2">Loading...</div>}
      <div className="overflow-x-auto">
        <div className="space-y-4">
          {rows.map((row, idx) => (
            <div
              key={row.id.priceId}
              className="bg-white rounded-lg shadow border border-brand-200 p-0"
            >
              <table className="w-full">
                <tbody>
                  {/* First line: Fee Description + Edit button */}
                  <tr>
                    <td
                      className="px-4 py-3 text-base font-semibold text-brand-900"
                      colSpan={7}
                    >
                      {row.priceDescription}
                      <span className="ml-2 text-xs text-brand-500 font-normal">(Fee Description)</span>
                    </td>
                    <td className="px-4 py-3 text-right" style={{ width: "1%" }}>
                      {editIdx === idx ? (
                        <>
                          <PrimaryButton onClick={() => handleSave(idx)} className="mr-2">
                            Save
                          </PrimaryButton>
                          <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
                        </>
                      ) : (
                        <SecondaryButton onClick={() => handleEdit(idx)}>Edit</SecondaryButton>
                      )}
                    </td>
                  </tr>
                  {/* Second line: Other fields */}
                  <tr className="bg-brand-50">
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Currency:</span> {row.currency}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Fee Type:</span> {row.feeType}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Flat Fee Amount:</span> {row.flatFeeAmount}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Fee Percentage:</span> {row.feePercentage}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Preferential Type:</span>{" "}
                      {editIdx === idx ? (
                        <SelectInput
                          id={`preferentialType-${idx}`}
                          label=""
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
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Standard Price:</span>{" "}
                      {editIdx === idx ? (
                        <TextInput
                          id={`standardPrice-${idx}`}
                          label=""
                          value={editValues.standardPrice}
                          onChange={val => handleChange('standardPrice', val)}
                          type="number"
                        />
                      ) : (
                        row.standardPrice
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Discount %:</span>{" "}
                      {editIdx === idx ? (
                        <TextInput
                          id={`discountPercentage-${idx}`}
                          label=""
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
                </tbody>
              </table>
            </div>
          ))}
          {rows.length === 0 && !loading && (
            <tr>
              <td colSpan={10} className="text-center text-slate-500 py-4">No pricing details found for this deal.</td>
            </tr>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealPricingTable; 