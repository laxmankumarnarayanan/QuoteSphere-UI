import React, { useState, useEffect } from 'react';
import { Save, Edit } from 'lucide-react';
import { underwriterFinancialAnalysisService, UnderwriterDealFinancialAnalysis } from '../services/underwriterFinancialAnalysisService';

interface UnderwriterFinancialAnalysisSectionProps {
  dealId: string;
  assignmentId: string;
}

export const UnderwriterFinancialAnalysisSection: React.FC<UnderwriterFinancialAnalysisSectionProps> = ({
  dealId,
  assignmentId
}) => {
  const [financialAnalysis, setFinancialAnalysis] = useState<UnderwriterDealFinancialAnalysis | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    assetValue: '',
    liabilityValue: '',
    currentPortionLongTermDebt: '',
    debtCoverageRatio: '',
    liabilityRatio: ''
  });

  useEffect(() => {
    loadFinancialAnalysis();
  }, [dealId]);

  const loadFinancialAnalysis = async () => {
    try {
      setIsLoading(true);
      const data = await underwriterFinancialAnalysisService.getFinancialAnalysisByDealId(dealId);
      if (data) {
        setFinancialAnalysis(data);
        setFormData({
          assetValue: data.assetValue?.toString() || '',
          liabilityValue: data.liabilityValue?.toString() || '',
          currentPortionLongTermDebt: data.currentPortionLongTermDebt?.toString() || '',
          debtCoverageRatio: data.debtCoverageRatio?.toString() || '',
          liabilityRatio: data.liabilityRatio?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error loading financial analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const analysisData = {
        assignmentId,
        dealId,
        assetValue: formData.assetValue ? parseFloat(formData.assetValue) : undefined,
        liabilityValue: formData.liabilityValue ? parseFloat(formData.liabilityValue) : undefined,
        currentPortionLongTermDebt: formData.currentPortionLongTermDebt ? parseFloat(formData.currentPortionLongTermDebt) : undefined,
        debtCoverageRatio: formData.debtCoverageRatio ? parseFloat(formData.debtCoverageRatio) : undefined,
        liabilityRatio: formData.liabilityRatio ? parseFloat(formData.liabilityRatio) : undefined,
        lastUpdatedBy: 'laxman.narayanan@fractalhive.com'
      };

      if (financialAnalysis) {
        // Update existing
        const updated = await underwriterFinancialAnalysisService.updateFinancialAnalysis(
          financialAnalysis.financialAnalysisId,
          analysisData
        );
        setFinancialAnalysis(updated);
      } else {
        // Create new
        const created = await underwriterFinancialAnalysisService.createFinancialAnalysis({
          ...analysisData,
          createdBy: 'laxman.narayanan@fractalhive.com'
        });
        setFinancialAnalysis(created);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving financial analysis:', error);
      alert('Failed to save financial analysis. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="border border-brand-200 rounded-lg bg-brand-50 p-4">
        <h3 className="text-lg font-semibold text-brand-900 mb-4">Underwriter Financial Analysis</h3>
        <div className="text-brand-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="border border-brand-200 rounded-lg bg-brand-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-brand-900">Underwriter Financial Analysis</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1 bg-brand-600 text-white text-sm rounded hover:bg-brand-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Asset Value</label>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={formData.assetValue}
              onChange={(e) => handleInputChange('assetValue', e.target.value)}
              className="w-full px-3 py-2 border border-brand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter asset value"
            />
          ) : (
            <div className="px-3 py-2 bg-white border border-brand-300 rounded-md text-brand-900">
              {financialAnalysis?.assetValue ? `$${financialAnalysis.assetValue.toLocaleString()}` : 'Not specified'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Liability Value</label>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={formData.liabilityValue}
              onChange={(e) => handleInputChange('liabilityValue', e.target.value)}
              className="w-full px-3 py-2 border border-brand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter liability value"
            />
          ) : (
            <div className="px-3 py-2 bg-white border border-brand-300 rounded-md text-brand-900">
              {financialAnalysis?.liabilityValue ? `$${financialAnalysis.liabilityValue.toLocaleString()}` : 'Not specified'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Current Portion Long Term Debt</label>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={formData.currentPortionLongTermDebt}
              onChange={(e) => handleInputChange('currentPortionLongTermDebt', e.target.value)}
              className="w-full px-3 py-2 border border-brand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter current portion long term debt"
            />
          ) : (
            <div className="px-3 py-2 bg-white border border-brand-300 rounded-md text-brand-900">
              {financialAnalysis?.currentPortionLongTermDebt ? `$${financialAnalysis.currentPortionLongTermDebt.toLocaleString()}` : 'Not specified'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Debt Coverage Ratio</label>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={formData.debtCoverageRatio}
              onChange={(e) => handleInputChange('debtCoverageRatio', e.target.value)}
              className="w-full px-3 py-2 border border-brand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter debt coverage ratio"
            />
          ) : (
            <div className="px-3 py-2 bg-white border border-brand-300 rounded-md text-brand-900">
              {financialAnalysis?.debtCoverageRatio ? financialAnalysis.debtCoverageRatio.toFixed(2) : 'Not specified'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Liability Ratio</label>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={formData.liabilityRatio}
              onChange={(e) => handleInputChange('liabilityRatio', e.target.value)}
              className="w-full px-3 py-2 border border-brand-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter liability ratio"
            />
          ) : (
            <div className="px-3 py-2 bg-white border border-brand-300 rounded-md text-brand-900">
              {financialAnalysis?.liabilityRatio ? financialAnalysis.liabilityRatio.toFixed(2) : 'Not specified'}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              // Reset form data to original values
              if (financialAnalysis) {
                setFormData({
                  assetValue: financialAnalysis.assetValue?.toString() || '',
                  liabilityValue: financialAnalysis.liabilityValue?.toString() || '',
                  currentPortionLongTermDebt: financialAnalysis.currentPortionLongTermDebt?.toString() || '',
                  debtCoverageRatio: financialAnalysis.debtCoverageRatio?.toString() || '',
                  liabilityRatio: financialAnalysis.liabilityRatio?.toString() || ''
                });
              }
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}; 