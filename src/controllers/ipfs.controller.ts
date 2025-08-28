import { Request, Response } from "express";
import path from "path";
import {
  uploadFileToIPFS,
  uploadJSONToIPFS,
  fetchJSONFromCID,
  updateJSONOnIPFS,
  updateFileOnIPFS,
  deleteFromIPFS,
} from "../services/pinata.service";

import { NFTMetadata, FTMetadata, UserMetadata, AllowedCollections } from "../types/metadata";

/** ======= Upload File ======= */
export async function uploadFile(req: Request, res: Response) {
  try {
    const file = req.file;
    const collection = (req.body.collection || "uploads") as AllowedCollections;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    const uri = await uploadFileToIPFS(path.resolve(file.path), collection);
    return res.json({ success: true, uri });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/** ======= Upload Metadata ======= */
export async function uploadMetadata(req: Request, res: Response) {
  try {
    const collection = (req.query.collection as AllowedCollections) || (req.body.collection as AllowedCollections) || "metadata";
    const type = req.query.type as "NFT" | "FT" | "USER" || "NFT";

    let metadata: NFTMetadata | FTMetadata | UserMetadata = req.body;
    
    if (type === "NFT") {
      const nftMeta = metadata as NFTMetadata;
      if (!nftMeta.name || !nftMeta.description || !nftMeta.image) {
        return res.status(400).json({ success: false, error: "NFT metadata must include name, description, and image" });
      }
    } else if (type === "FT") {
      const ftMeta = metadata as FTMetadata;
      if (!ftMeta.name || !ftMeta.symbol || !ftMeta.totalSupply) {
        return res.status(400).json({ success: false, error: "FT metadata must include name, symbol, and totalSupply" });
      }
    } else if (type === "USER") {
      const userMeta = metadata as UserMetadata;
      if (!userMeta.username || !userMeta.email) {
        return res.status(400).json({ success: false, error: "USER metadata must include username and email" });
      }
    }

    const uri = await uploadJSONToIPFS(metadata, collection);
    return res.json({ success: true, uri });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/** ======= Fetch Metadata ======= */
export async function fetchMetadata(req: Request, res: Response) {
  try {
    const { cid } = req.params;
    if (!cid) return res.status(400).json({ error: "cid required" });
    const data = await fetchJSONFromCID(cid);
    return res.json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/** ======= Update Metadata ======= */
export async function updateMetadata(req: Request, res: Response) {
  try {
    const { cid } = req.params;
    const type = req.query.type as "NFT" | "FT" | "USER" || "NFT";
    const newData: NFTMetadata | FTMetadata | UserMetadata = req.body;

    if (!cid) return res.status(400).json({ error: "cid required" });

    // Validation by type
    if (type === "NFT") {
      const nftMeta = newData as NFTMetadata;
      if (!nftMeta.name || !nftMeta.description || !nftMeta.image)
        return res.status(400).json({ success: false, error: "NFT metadata must include name, description, and image" });
    } else if (type === "FT") {
      const ftMeta = newData as FTMetadata;
      if (!ftMeta.name || !ftMeta.symbol || !ftMeta.totalSupply)
        return res.status(400).json({ success: false, error: "FT metadata must include name, symbol, and totalSupply" });
    } else if (type === "USER") {
      const userMeta = newData as UserMetadata;
      if (!userMeta.username || !userMeta.email)
        return res.status(400).json({ success: false, error: "USER metadata must include username and email" });
    }

    const newCID = await updateJSONOnIPFS(cid, newData);
    return res.json({ success: true, newCID });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/** ======= Update File ======= */
export async function updateFile(req: Request, res: Response) {
  try {
    const { cid } = req.params;
    const file = req.file;
    const collection = (req.body.collection || "uploads") as AllowedCollections;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!cid) return res.status(400).json({ error: "cid required" });
    const newCID = await updateFileOnIPFS(cid, path.resolve(file.path), collection);
    return res.json({ success: true, newCID });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/** ======= Delete from IPFS ======= */
export async function deleteFromIPFSController(req: Request, res: Response) {
  try {
    const { cid } = req.params;
    if (!cid) return res.status(400).json({ error: "cid required" });
    const success = await deleteFromIPFS(cid);
    return res.json({ success });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
