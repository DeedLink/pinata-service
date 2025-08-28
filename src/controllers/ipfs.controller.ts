import { Request, Response } from "express";
import path from "path";
import { uploadFileToIPFS, uploadJSONToIPFS, fetchJSONFromCID } from "../services/pinata.service";
import { NFTMetadata, AllowedCollections } from "../types/metadata";

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