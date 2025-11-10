// Types matching the GraphQL schema

export interface ItemListed {
  nodeId: string;
  rindexerId: number;
  contractAddress: string;
  seller: string | null;
  nftAddress: string | null;
  tokenId: string | null;
  price: string | null;
  txHash: string;
  blockNumber: number;
  blockTimestamp: string | null;
  blockHash: string;
  network: string;
  txIndex: number;
  logIndex: string;
}

export interface ItemBought {
  nodeId: string;
  rindexerId: number;
  contractAddress: string;
  buyer: string | null;
  nftAddress: string | null;
  tokenId: string | null;
  price: string | null;
  txHash: string;
  blockNumber: number;
  blockTimestamp: string | null;
  blockHash: string;
  network: string;
  txIndex: number;
  logIndex: string;
}

export interface ItemCanceled {
  nodeId: string;
  rindexerId: number;
  contractAddress: string;
  seller: string | null;
  nftAddress: string | null;
  tokenId: string | null;
  txHash: string;
  blockNumber: number;
  blockTimestamp: string | null;
  blockHash: string;
  network: string;
  txIndex: number;
  logIndex: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ItemListedsConnection {
  nodes: ItemListed[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface ItemBoughtsConnection {
  nodes: ItemBought[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface ItemCanceledsConnection {
  nodes: ItemCanceled[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface AllMarketplaceEventsData {
  allItemListeds: ItemListedsConnection;
  allItemBoughts: ItemBoughtsConnection;
  allItemCanceleds: ItemCanceledsConnection;
}

export interface ActiveListing {
  tokenId: string;
  contractAddress: string;
  nftAddress: string;
  price: string;
  seller: string;
  blockTimestamp: string | null;
  network: string;
}