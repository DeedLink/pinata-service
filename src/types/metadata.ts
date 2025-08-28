export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    deed: Deed;
}

export interface UserMetadata {
    username: string;
    email?: string;
    walletAddress?: string;
}

export interface FTMetadata {
    name: string;
    email?: string;
    symbol?: string;
    walletAddress?: string;
    totalSupply?: number;
}
export type AllowedCollections = "nfts" | "users" | "fts";

export type Address = string;

interface Tnx {
  _id: string;
  from: Address;
  to: Address;
  amount: number;
  share: number;
  timestamp: number; 
}

interface LocationPoint {
  longitude: number;
  latitude: number;
}

interface Side {
  direction: Directions;
  deedNumber: string;
}

interface Deed {
  _id: string;
  title?: Tnx[]; 
  signedby: Address;
  area: number;
  value: number; 
  location: LocationPoint[];
  sides: Side[];
  deedNumber: string;
  landType: LandType;
  timestamp: number;
}

type Directions = "North" | "South" | "East" | "West";
type LandType = "Paddy land" | "Highland";