import Link from "next/link";
import NFTBox from "./NFTBox";
import { useActiveListings } from "../hooks/useActiveListings";

export default function RecentlyListedNFTs() {
    const { data: activeListings, isLoading, error } = useActiveListings({
        first: 50,
        orderBy: ["BLOCK_TIMESTAMP_DESC"], // Most recent first
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mt-8 text-center">
                <Link
                    href="/list-nft"
                    className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    List Your NFT
                </Link>
            </div>
            
            <h2 className="text-2xl font-bold mb-6">Recently Listed NFTs</h2>

            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error loading listings: </strong>
                    <span className="block sm:inline">{(error as Error).message}</span>
                </div>
            )}

            {!isLoading && !error && activeListings && activeListings.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No NFTs listed yet. Be the first to list!</p>
                </div>
            )}

            {!isLoading && !error && activeListings && activeListings.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {activeListings.map((listing) => (
                        <Link
                            key={`${listing.contractAddress}-${listing.tokenId}-${listing.network}`}
                            href={`/buy-nft/${listing.nftAddress}/${listing.tokenId}`}
                            className="block transition-transform hover:scale-105 cursor-pointer"
                        >
                            <NFTBox
                                tokenId={listing.tokenId}
                                contractAddress={listing.nftAddress}
                                price={listing.price}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}