import { Request, Response } from "express";
import path from "path";
import { uploadFileToIPFS, uploadJSONToIPFS, fetchJSONFromCID, updateJSONOnIPFS, updateFileOnIPFS, deleteFromIPFS } from "../services/pinata.service";
import { NFTMetadata, AllowedCollections } from "../types/metadata";

// Upload image
export async function uploadImage(req: Request, res: Response) {
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

// Upload metadata
export async function uploadMetadata(req: Request, res: Response) {
    try {
        const collection = (req.query.collection as AllowedCollections) || (req.body.collection as AllowedCollections) || "nfts";
        const metadata = req.body as NFTMetadata;
        if (!metadata || !metadata.name || !metadata.description || !metadata.image) {
            return res.status(400).json({ success: false, error: "Metadata must include name, description and image" });
        }
        const uri = await uploadJSONToIPFS(metadata, collection);
        return res.json({ success: true, uri });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

// Fetch metadata
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

// Update metadata
export async function updateMetadata(req: Request, res: Response) {
    try {
        const { cid } = req.params;
        const newData = req.body as NFTMetadata;
        if (!cid) return res.status(400).json({ error: "cid required" });
        if (!newData || !newData.name || !newData.description || !newData.image) {
            return res.status(400).json({ success: false, error: "New metadata must include name, description, and image" });
        }
        const newCID = await updateJSONOnIPFS(cid, newData);
        return res.json({ success: true, newCID });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

// Update image
export async function updateImage(req: Request, res: Response) {
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

// Delete from IPFS
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
