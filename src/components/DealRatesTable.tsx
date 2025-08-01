import React, { useEffect, useState } from "react";
import TextInput from "../template components/components/elements/TextInput";
import SecondaryButton from "../template components/components/elements/SecondaryButton";
import PrimaryButton from "../template components/components/elements/PrimaryButton";
import { dealService } from "../services/dealService";

const API_BASE_URL = 'https://dealdesk-web-app-fqfnfrezdefbb0g5.centralindia-01.azurewebsites.net/api';

export interface DealRatesRow {
  id: {
    dealId: string;
    businessDomainId: string;
    rateId: string;
  };
  rateDescription: string;
  baseRate: string;
  spread: string;
  margin: string;
  requestedSpread: string;
  requestedMargin: string;
  productCategoryId: string;
  productId: string;
  subProductId: string;
  createdBy: string;
  createdDateTime: string;
  lastUpdatedBy: string;
  lastUpdatedDateTime: string;
  productSubCategoryId: string;
  allowUpdates: boolean;
}

interface DealRatesTableProps {
  dealId: string;
  productId?: string;
  subProductId?: string;
}

const DealRatesTable: React.FC<DealRatesTableProps> = ({ dealId, productId, subProductId }) => {
  const [rows, setRows] = useState<DealRatesRow[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ 
    requestedSpread: string;
    requestedMargin: string;
  }>({ 
    requestedSpread: '',
    requestedMargin: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRows() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/deal-rates`);
        const data = await res.json();
        // Filter for this dealId and specific product/subproduct if provided
        let filteredData = data.filter((row: DealRatesRow) => row.id.dealId === dealId);
        
        if (productId && subProductId) {
          filteredData = filteredData.filter((row: DealRatesRow) => 
            row.productId === productId && row.subProductId === subProductId
          );
        }
        
        setRows(filteredData);
      } catch (e) {
        setError("Failed to load rate details.");
      } finally {
        setLoading(false);
      }
    }
    if (dealId) fetchRows();
  }, [dealId, productId, subProductId]);

  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditValues({
      requestedSpread: rows[idx].requestedSpread || '',
      requestedMargin: rows[idx].requestedMargin || '',
    });
  };

  const handleCancel = () => {
    setEditIdx(null);
    setEditValues({ 
      requestedSpread: '',
      requestedMargin: ''
    });
  };

  const handleChange = (field: 'requestedSpread' | 'requestedMargin', value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (idx: number) => {
    setLoading(true);
    setError(null);
    try {
      const row = rows[idx];
      const updated = {
        ...row,
        requestedSpread: editValues.requestedSpread,
        requestedMargin: editValues.requestedMargin,
      };
      // PUT to backend
      await fetch(`${API_BASE_URL}/deal-rates`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      // Update local state
      setRows(prev => prev.map((r, i) => (i === idx ? updated : r)));
      setEditIdx(null);
      setEditValues({ 
        requestedSpread: '',
        requestedMargin: ''
      });
    } catch (e) {
      setError("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if no rows found
  if (rows.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="w-full border border-brand-200 rounded-lg bg-brand-50 p-6 mt-4">
      <div className="font-semibold text-brand-800 mb-4">Rate Details</div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading && <div className="text-slate-600 mb-2">Loading...</div>}
      <div className="overflow-x-auto">
        <div className="space-y-4">
          {rows.map((row, idx) => (
            <div
              key={row.id.rateId}
              className="bg-white rounded-lg shadow border border-brand-200 p-0"
            >
              <table className="w-full">
                <tbody>
                  {/* First line: Rate Description + Edit button */}
                  <tr>
                    <td
                      className="px-4 py-3 text-base font-semibold text-brand-900"
                      colSpan={6}
                    >
                      {row.rateDescription}
                      <span className="ml-2 text-xs text-brand-500 font-normal">(Rate Description)</span>
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
                        <SecondaryButton 
                          onClick={() => handleEdit(idx)}
                          disabled={!row.allowUpdates}
                          className={!row.allowUpdates ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          Edit
                        </SecondaryButton>
                      )}
                    </td>
                  </tr>
                  {/* Second line: Other fields */}
                  <tr className="bg-brand-50">
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Base Rate:</span> {row.baseRate}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Spread:</span> {row.spread}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Margin:</span> {row.margin}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Requested Spread:</span>{" "}
                      {editIdx === idx ? (
                        <TextInput
                          id={`requestedSpread-${idx}`}
                          label=""
                          value={editValues.requestedSpread}
                          onChange={val => handleChange('requestedSpread', val)}
                          type="number"
                        />
                      ) : (
                        row.requestedSpread
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Requested Margin:</span>{" "}
                      {editIdx === idx ? (
                        <TextInput
                          id={`requestedMargin-${idx}`}
                          label=""
                          value={editValues.requestedMargin}
                          onChange={val => handleChange('requestedMargin', val)}
                          type="number"
                        />
                      ) : (
                        row.requestedMargin
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-800">
                      <span className="font-medium text-brand-700">Allow Updates:</span>{" "}
                      {row.allowUpdates ? "Yes" : "No"}
                    </td>
                    {/* Empty cell for alignment with the edit button column */}
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealRatesTable; 