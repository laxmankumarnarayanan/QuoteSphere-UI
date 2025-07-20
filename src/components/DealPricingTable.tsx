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
  feePercentage: string;
  feeType: string;
  flatFeeAmount: string;
  discountPercentage: string;
  standardPrice: string;
  //preferentialType: string;
  finalPrice: string;
  feeCap: string;
  maxDiscountAmount: string;
  calculatedFeeAmount: string;
  totalCommitmentAmount: string;
  discountAmount: string;
}

interface DealPricingTableProps {
  dealId: string;
}

const DealPricingTable: React.FC<DealPricingTableProps> = ({ dealId }) => {
  const [rows, setRows] = useState<DealPricingRow[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ 
    discountPercentage: string; 
    discountAmount: string;
    preferentialType: string;
  }>({ 
    discountPercentage: '', 
    discountAmount: '',
    preferentialType: ''
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
      discountPercentage: rows[idx].discountPercentage || '',
      discountAmount: rows[idx].discountAmount || '',
      preferentialType: rows[idx].preferentialType || '',
    });
  };

  const handleCancel = () => {
    setEditIdx(null);
    setEditValues({ 
      discountPercentage: '', 
      discountAmount: '',
      preferentialType: ''
    });
  };

  const handleChange = (field: 'discountPercentage' | 'discountAmount' | 'preferentialType', value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (idx: number) => {
    setLoading(true);
    setError(null);
    try {
      const row = rows[idx];
      const updated = {
        ...row,
        discountPercentage: editValues.discountPercentage,
        discountAmount: editValues.discountAmount,
        preferentialType: editValues.preferentialType,
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
        discountPercentage: '', 
        discountAmount: '',
        preferentialType: ''
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
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">1. Fee Name</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">2. Currency</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">3. Standard Price</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">4. Standard Percentage</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">5. Fee Type</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">6. Preferential Type</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">7. Preferential Value</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">8. Final Price</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">9. Actions</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">10. Fee Cap</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">11. Max Discount</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">12. Calculated Fee</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-violet-800">13. Total Commitment</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id.priceId} className="border-b last:border-b-0">
                <td className="px-3 py-2 text-sm text-slate-800">{row.priceDescription}</td>
                <td className="px-3 py-2 text-sm text-slate-800">{row.currency}</td>
                <td className="px-3 py-2 text-sm text-slate-800">{row.standardPrice}</td>
                <td className="px-3 py-2 text-sm text-slate-800">
                  {editIdx === idx ? (
                    <SelectInput
                      id={`preferentialType-${idx}`}
                      label="Fee Type"
                      value={editValues.preferentialType}
                      onChange={val => handleChange('preferentialType', val)}
                      options={preferentialTypeOptions}
                      placeholder="Select Fee Type"
                      disabled={preferentialTypeLoading}
                    />
                  ) : (
                    row.preferentialType
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
                <td className="px-3 py-2 text-sm text-slate-800">
                  {editIdx === idx ? (
                    <TextInput
                      id={`discountAmount-${idx}`}
                      label="Discount Amount"
                      value={editValues.discountAmount}
                      onChange={val => handleChange('discountAmount', val)}
                      type="number"
                    />
                  ) : (
                    row.discountAmount
                  )}
                </td>
                <td className="px-3 py-2 text-sm text-slate-800">{row.finalPrice}</td>
                <td className="px-3 py-2 text-sm text-slate-800">{row.feeType}</td>
                <td className="px-3 py-2 text-sm text-slate-800">{row.feePercentage}</td>
                <td className="px-3 py-2 text-sm text-slate-800">{row.flatFeeAmount}</td>
                <td className="px-3 py-2 text-sm text-slate-800">{row.feeCap}</td>
                <td className="px-3 py-2 text-sm text-slate-800">{row.maxDiscountAmount}</td>
                <td className="px-3 py-2 text-sm text-slate-800">{row.calculatedFeeAmount}</td>
                <td className="px-3 py-2 text-sm text-slate-800">{row.totalCommitmentAmount}</td>
                <td className="px-3 py-2 text-sm text-slate-800">
                  {editIdx === idx ? (
                    <div className="flex gap-2">
                      <PrimaryButton size="sm" onClick={() => handleSave(idx)} isLoading={loading}>
                        Save
                      </PrimaryButton>
                      <SecondaryButton size="sm" onClick={handleCancel}>
                        Cancel
                      </SecondaryButton>
                    </div>
                  ) : (
                    <SecondaryButton size="sm" onClick={() => handleEdit(idx)}>
                      Edit
                    </SecondaryButton>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={15} className="text-center text-slate-500 py-4">No pricing details found for this deal.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealPricingTable; 