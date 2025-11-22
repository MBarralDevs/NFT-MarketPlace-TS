'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import NFTBox from '@/components/NFTBox';
import { checkAddressCompliance } from '@/lib/complianceClient';

interface ComplianceResult {
  checked: boolean;
  isCompliant: boolean;
  riskLevel?: string;
  riskScore?: number;
  error?: string;
}

export default function BuyNFTPage() {
  const params = useParams();
  const { address: buyerAddress } = useAccount();
  
  const nftAddress = params.nftAddress as string;
  const tokenId = params.tokenId as string;

  // State management
  const [sellerAddress, setSellerAddress] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isLoadingNFT, setIsLoadingNFT] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // Compliance state
  const [sellerCompliance, setSellerCompliance] = useState<ComplianceResult>({
    checked: false,
    isCompliant: false,
  });
  const [buyerCompliance, setBuyerCompliance] = useState<ComplianceResult>({
    checked: false,
    isCompliant: false,
  });
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);

  // Fetch NFT details (seller, price) from your GraphQL or contract
  useEffect(() => {
    const fetchNFTDetails = async () => {
      try {
        setIsLoadingNFT(true);
        
        // TODO: Replace with your actual GraphQL query or contract call
        // Example using GraphQL:
        // const response = await fetchGraphQL<{ itemListeds: ItemListed[] }>(
        //   GET_LISTING_QUERY,
        //   { nftAddress, tokenId }
        // );
        
        // For now, placeholder - replace with your actual data fetching
        // const listing = response.itemListeds[0];
        // setSellerAddress(listing.seller);
        // setPrice(listing.price);
        
        // PLACEHOLDER - Remove this and use real data
        setSellerAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
        setPrice('0.1');
        
      } catch (error) {
        console.error('Error fetching NFT details:', error);
      } finally {
        setIsLoadingNFT(false);
      }
    };

    if (nftAddress && tokenId) {
      fetchNFTDetails();
    }
  }, [nftAddress, tokenId]);

  // Check seller compliance
  const checkSellerCompliance = async () => {
    if (!sellerAddress) return;
    
    setIsCheckingCompliance(true);
    try {
      const result = await checkAddressCompliance(sellerAddress);
      
      setSellerCompliance({
        checked: true,
        isCompliant: result.data.risk.level.toLowerCase() === 'low',
        riskLevel: result.data.risk.level,
        riskScore: result.data.risk.score,
      });
    } catch (error) {
      setSellerCompliance({
        checked: true,
        isCompliant: false,
        error: error instanceof Error ? error.message : 'Failed to check compliance',
      });
    } finally {
      setIsCheckingCompliance(false);
    }
  };

  // Check buyer compliance
  const checkBuyerCompliance = async () => {
    if (!buyerAddress) return;
    
    setIsCheckingCompliance(true);
    try {
      const result = await checkAddressCompliance(buyerAddress);
      
      setBuyerCompliance({
        checked: true,
        isCompliant: result.data.risk.level.toLowerCase() === 'low',
        riskLevel: result.data.risk.level,
        riskScore: result.data.risk.score,
      });
    } catch (error) {
      setBuyerCompliance({
        checked: true,
        isCompliant: false,
        error: error instanceof Error ? error.message : 'Failed to check compliance',
      });
    } finally {
      setIsCheckingCompliance(false);
    }
  };

  // Check both addresses
  const checkBothCompliance = async () => {
    setIsCheckingCompliance(true);
    await Promise.all([
      checkSellerCompliance(),
      checkBuyerCompliance(),
    ]);
    setIsCheckingCompliance(false);
  };

  // Handle purchase
  const handlePurchase = async () => {
    if (!buyerAddress) {
      alert('Please connect your wallet');
      return;
    }

    // Check compliance before allowing purchase
    if (!sellerCompliance.checked || !buyerCompliance.checked) {
      alert('Please check compliance before purchasing');
      return;
    }

    if (!sellerCompliance.isCompliant) {
      alert('Cannot proceed: Seller failed compliance check');
      return;
    }

    if (!buyerCompliance.isCompliant) {
      alert('Cannot proceed: Your address failed compliance check');
      return;
    }

    try {
      setIsPurchasing(true);
      
      // TODO: Add your actual purchase logic here
      // Example:
      // await buyItem(nftAddress, tokenId, price);
      
      console.log('Purchase logic goes here');
      alert('Purchase successful! (implement actual purchase logic)');
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsPurchasing(false);
    }
  };

  const getRiskColor = (level?: string) => {
    if (!level) return 'text-gray-600';
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

  const canPurchase = 
    buyerAddress &&
    sellerCompliance.checked &&
    sellerCompliance.isCompliant &&
    buyerCompliance.checked &&
    buyerCompliance.isCompliant &&
    !isPurchasing;

  if (isLoadingNFT) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Purchase NFT</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: NFT Display */}
        <div>
          <NFTBox
            tokenId={tokenId}
            contractAddress={nftAddress}
            price={price}
          />
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">NFT Details</h3>
            <div className="space-y-1 text-sm">
              <p className="break-all">
                <span className="font-medium">Contract:</span> {nftAddress}
              </p>
              <p>
                <span className="font-medium">Token ID:</span> {tokenId}
              </p>
              <p>
                <span className="font-medium">Price:</span> {price} ETH
              </p>
            </div>
          </div>
        </div>

        {/* Right: Compliance & Purchase */}
        <div className="space-y-6">
          {/* Wallet Connection Status */}
          {!buyerAddress ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ Please connect your wallet to purchase this NFT
              </p>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                ✓ Wallet connected: <code className="text-xs">{buyerAddress.slice(0, 6)}...{buyerAddress.slice(-4)}</code>
              </p>
            </div>
          )}

          {/* Seller Compliance Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center justify-between">
              Seller Compliance Check
              {sellerCompliance.checked && sellerCompliance.isCompliant && (
                <span className="text-green-600 text-sm">✓ Verified</span>
              )}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3">
              Seller: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{sellerAddress}</code>
            </p>

            {!sellerCompliance.checked && (
              <button
                onClick={checkSellerCompliance}
                disabled={isCheckingCompliance || !sellerAddress}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isCheckingCompliance ? 'Checking...' : 'Check Seller'}
              </button>
            )}

            {sellerCompliance.checked && (
              <div className={`p-3 rounded-lg ${
                sellerCompliance.isCompliant 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {sellerCompliance.error ? (
                  <p className="text-red-700 text-sm">{sellerCompliance.error}</p>
                ) : (
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Risk Level: </span>
                      <span className={`font-bold ${getRiskColor(sellerCompliance.riskLevel)}`}>
                        {sellerCompliance.riskLevel?.toUpperCase()}
                      </span>
                    </p>
                    {sellerCompliance.riskScore !== undefined && (
                      <p>
                        <span className="font-medium">Risk Score: </span>
                        {sellerCompliance.riskScore}
                      </p>
                    )}
                    {!sellerCompliance.isCompliant && (
                      <p className="text-red-700 font-medium mt-2">
                        ⚠️ This seller has compliance issues
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Buyer Compliance Section */}
          {buyerAddress && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center justify-between">
                Your Compliance Check
                {buyerCompliance.checked && buyerCompliance.isCompliant && (
                  <span className="text-green-600 text-sm">✓ Verified</span>
                )}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3">
                Your address: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{buyerAddress}</code>
              </p>

              {!buyerCompliance.checked && (
                <button
                  onClick={checkBuyerCompliance}
                  disabled={isCheckingCompliance}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isCheckingCompliance ? 'Checking...' : 'Check Your Address'}
                </button>
              )}

              {buyerCompliance.checked && (
                <div className={`p-3 rounded-lg ${
                  buyerCompliance.isCompliant 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {buyerCompliance.error ? (
                    <p className="text-red-700 text-sm">{buyerCompliance.error}</p>
                  ) : (
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Risk Level: </span>
                        <span className={`font-bold ${getRiskColor(buyerCompliance.riskLevel)}`}>
                          {buyerCompliance.riskLevel?.toUpperCase()}
                        </span>
                      </p>
                      {buyerCompliance.riskScore !== undefined && (
                        <p>
                          <span className="font-medium">Risk Score: </span>
                          {buyerCompliance.riskScore}
                        </p>
                      )}
                      {!buyerCompliance.isCompliant && (
                        <p className="text-red-700 font-medium mt-2">
                          ⚠️ Your address has compliance issues
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Check Both Button */}
          {buyerAddress && !sellerCompliance.checked && !buyerCompliance.checked && (
            <button
              onClick={checkBothCompliance}
              disabled={isCheckingCompliance}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {isCheckingCompliance ? 'Checking Both Addresses...' : 'Check Both Addresses'}
            </button>
          )}

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={!canPurchase}
            className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-bold text-lg"
          >
            {!buyerAddress && 'Connect Wallet to Purchase'}
            {buyerAddress && !sellerCompliance.checked && 'Check Seller Compliance First'}
            {buyerAddress && sellerCompliance.checked && !sellerCompliance.isCompliant && 'Seller Failed Compliance'}
            {buyerAddress && sellerCompliance.checked && sellerCompliance.isCompliant && !buyerCompliance.checked && 'Check Your Compliance First'}
            {buyerAddress && buyerCompliance.checked && !buyerCompliance.isCompliant && 'You Failed Compliance Check'}
            {canPurchase && !isPurchasing && `Purchase for ${price} ETH`}
            {isPurchasing && 'Processing Purchase...'}
          </button>

          {/* Info Message */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              ℹ️ Both seller and buyer must pass compliance checks before purchase can proceed.
              This ensures a safe and compliant marketplace for all participants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}