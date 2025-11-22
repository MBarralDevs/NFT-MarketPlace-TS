'use client';

import { useState } from 'react';
import { checkAddressCompliance } from '@/lib/complianceClient';

interface ComplianceCheckProps {
  address: string;
  onComplianceChecked?: (isCompliant: boolean) => void;
}

export function ComplianceChecker({ address, onComplianceChecked }: ComplianceCheckProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    level: string;
    score?: number;
    checkedAt?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const response = await checkAddressCompliance(address);
      setResult({
        level: response.data.risk.level,
        score: response.data.risk.score,
        checkedAt: response.data.screenedAt,
      });
      
      // Notify parent component if callback provided
      const isCompliant = response.data.risk.level.toLowerCase() === 'low';
      onComplianceChecked?.(isCompliant);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check compliance');
      onComplianceChecked?.(false);
    } finally {
      setIsChecking(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheck}
        disabled={isChecking}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isChecking ? 'Checking Compliance...' : 'Check Address Compliance'}
      </button>

      {result && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Compliance Result</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Risk Level: </span>
              <span className={`font-bold ${getRiskColor(result.level)}`}>
                {result.level.toUpperCase()}
              </span>
            </p>
            {result.score !== undefined && (
              <p>
                <span className="font-medium">Risk Score: </span>
                {result.score}
              </p>
            )}
            {result.checkedAt && (
              <p className="text-gray-500">
                Checked: {new Date(result.checkedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

// Example: Integrate with NFT Buy Page
export function NFTBuyPageWithCompliance({ nftAddress, sellerAddress }: { nftAddress: string; sellerAddress: string }) {
  const [isSellerCompliant, setIsSellerCompliant] = useState<boolean | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Purchase NFT</h1>
      
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Seller Compliance Check</h2>
        <p className="text-sm text-gray-600 mb-4">
          Address: <code className="bg-gray-100 px-2 py-1 rounded">{sellerAddress}</code>
        </p>
        
        <ComplianceChecker
          address={sellerAddress}
          onComplianceChecked={(isCompliant) => {
            setIsSellerCompliant(isCompliant);
            setCanProceed(isCompliant);
          }}
        />
      </div>

      <button
        disabled={!canProceed}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {isSellerCompliant === null && 'Check Seller Compliance First'}
        {isSellerCompliant === false && 'Cannot Proceed - Compliance Failed'}
        {isSellerCompliant === true && 'Proceed to Purchase'}
      </button>
    </div>
  );
}