import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "../utils/graphQL-client";
import type { AllMarketplaceEventsData, ActiveListing } from "../types/marketplaceTypes";

const GET_MARKETPLACE_EVENTS_WITH_FILTER = `
  query GetMarketplaceEvents(
    $first: Int
    $orderBy: [ItemListedsOrderBy!]
    $networkFilter: String
  ) {
    allItemListeds(
      first: $first
      orderBy: $orderBy
      condition: { network: $networkFilter }
    ) {
      nodes {
        rindexerId
        contractAddress
        seller
        nftAddress
        tokenId
        price
        txHash
        blockNumber
        blockTimestamp
        blockHash
        network
        txIndex
        logIndex
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
    allItemBoughts(condition: { network: $networkFilter }) {
      nodes {
        contractAddress
        nftAddress
        tokenId
        network
      }
    }
    allItemCanceleds(condition: { network: $networkFilter }) {
      nodes {
        contractAddress
        nftAddress
        tokenId
        network
      }
    }
  }
`;

/**
 * Filters out bought and canceled items from the listed items
 * Returns only active listings
 */
function filterActiveListings(data: AllMarketplaceEventsData): ActiveListing[] {
  const listedItems = data.allItemListeds.nodes;
  const boughtItems = data.allItemBoughts.nodes;
  const canceledItems = data.allItemCanceleds.nodes;

  console.log(`Total listed items: ${listedItems.length}`);
  console.log(`Total bought items: ${boughtItems.length}`);
  console.log(`Total canceled items: ${canceledItems.length}`); 
  console.log(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);

  // Create a Set of unique identifiers for bought and canceled items
  const inactiveItemsSet = new Set<string>();

  boughtItems.forEach((item) => {
    const key = `${item.contractAddress}-${item.nftAddress}-${item.tokenId}-${item.network}`.toLowerCase();
    inactiveItemsSet.add(key);
  });

  canceledItems.forEach((item) => {
    const key = `${item.contractAddress}-${item.nftAddress}-${item.tokenId}-${item.network}`.toLowerCase();
    inactiveItemsSet.add(key);
  });

  // Filter out inactive listings
  const activeListings = listedItems.filter((item) => {
    const key = `${item.contractAddress}-${item.nftAddress}-${item.tokenId}-${item.network}`.toLowerCase();
    return !inactiveItemsSet.has(key) && item.tokenId && item.price && item.nftAddress && item.seller;
  });

  // Map to ActiveListing type
  return activeListings.map((item) => ({
    tokenId: item.tokenId!,
    contractAddress: item.contractAddress,
    nftAddress: item.nftAddress!,
    price: item.price!,
    seller: item.seller!,
    blockTimestamp: item.blockTimestamp,
    network: item.network,
  }));
}

interface UseActiveListingsOptions {
  first?: number;
  orderBy?: string[];
  network?: string; // Filter by specific network (e.g., "ethereum", "polygon")
  enabled?: boolean;
}

/**
 * Custom hook to fetch active NFT listings with optional network filtering
 * Automatically filters out bought and canceled items
 * 
 * @example
 * // Get all active listings
 * const { data } = useActiveListings();
 * 
 * @example
 * // Get active listings on Ethereum mainnet only
 * const { data } = useActiveListings({ network: "ethereum" });
 * 
 * @example
 * // Get top 20 most expensive listings on Polygon
 * const { data } = useActiveListings({ 
 *   first: 20, 
 *   orderBy: ["PRICE_DESC"],
 *   network: "polygon" 
 * });
 */
export function useActiveListings(options: UseActiveListingsOptions = {}) {
  const { 
    first = 100, 
    orderBy = ["BLOCK_TIMESTAMP_DESC"], 
    network,
    enabled = true 
  } = options;

  return useQuery({
    queryKey: ["activeListings", first, orderBy, network],
    queryFn: async () => {
      const data = await fetchGraphQL<AllMarketplaceEventsData>(
        GET_MARKETPLACE_EVENTS_WITH_FILTER,
        {
          first,
          orderBy,
          networkFilter: network || null,
        }
      );
      return filterActiveListings(data);
    },
    enabled,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
  });
}

/**
 * Hook to fetch active listings from multiple networks
 * This is useful if you want to display listings from all chains
 */
export function useMultiNetworkActiveListings(
  networks: string[],
  options: Omit<UseActiveListingsOptions, "network"> = {}
) {
  const queries = networks.map((network) => 
    useActiveListings({ ...options, network })
  );

  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error;

  // Combine all listings from different networks
  const data = queries
    .filter((q) => q.data)
    .flatMap((q) => q.data!);

  // Sort combined data by timestamp (most recent first)
  const sortedData = data.sort((a, b) => {
    if (!a.blockTimestamp || !b.blockTimestamp) return 0;
    return new Date(b.blockTimestamp).getTime() - new Date(a.blockTimestamp).getTime();
  });

  return {
    data: sortedData,
    isLoading,
    error,
  };
}