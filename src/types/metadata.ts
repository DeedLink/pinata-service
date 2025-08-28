export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes?: { trait_type: string; value: string | number }[];
}
export interface UserMetadata {
    name: string;
    email?: string;
    walletAddress?: string;
}
export type AllowedCollections = "nfts" | "users" | "properties" | "fts";