import path from "path";
import {
  uploadFileToIPFS,
  uploadJSONToIPFS,
  fetchJSONFromCID,
  updateJSONOnIPFS,
  updateFileOnIPFS,
  deleteFromIPFS,
} from "../services/pinata.service.js";

/** ======= Upload File ======= */
export async function uploadFile(req, res) {
  try {
    const file = req.file;
    const collection = req.body.collection || "uploads";
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    const uri = await uploadFileToIPFS(path.resolve(file.path), collection);
    return res.json({ success: true, uri });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/** ======= Upload Metadata ======= */
export async function uploadMetadata(req, res) {
  console.log("Request Body:", req.body);
  console.log("Query Params:", req.query);
  try {
    const collection =
      req.query.collection || req.body.collection || "metadata";
    const type = req.query.type || "NFT";

    const metadata = req.body;

    if (type === "NFT") {
      const nftMeta = metadata;
      if (!nftMeta.name || !nftMeta.description || !nftMeta.image) {
        // return res.status(400).json({ success: false, error: "NFT metadata must include name, description, and image" });
      }
    } else if (type === "FT") {
      const ftMeta = metadata;
      if (!ftMeta.name || !ftMeta.symbol || !ftMeta.totalSupply) {
        return res.status(400).json({
          success: false,
          error: "FT metadata must include name, symbol, and totalSupply",
        });
      }
    } else if (type === "USER") {
      const userMeta = metadata;
      if (!userMeta.username || !userMeta.email) {
        return res.status(400).json({
          success: false,
          error: "USER metadata must include username and email",
        });
      }
    }

    const uri = await uploadJSONToIPFS(metadata, collection);
    return res.json({ success: true, uri });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/** ======= Fetch Metadata ======= */
export async function fetchMetadata(req, res) {
  try {
    const { cid } = req.params;
    if (!cid) return res.status(400).json({ error: "cid required" });
    const data = await fetchJSONFromCID(cid);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/** ======= Update Metadata ======= */
export async function updateMetadata(req, res) {
  try {
    const { cid } = req.params;
    const type = req.query.type || "NFT";
    const newData = req.body;

    if (!cid) return res.status(400).json({ error: "cid required" });

    if (type === "NFT") {
      const nftMeta = newData;
      if (!nftMeta.name || !nftMeta.description || !nftMeta.image)
        return res.status(400).json({
          success: false,
          error: "NFT metadata must include name, description, and image",
        });
    } else if (type === "FT") {
      const ftMeta = newData;
      if (!ftMeta.name || !ftMeta.symbol || !ftMeta.totalSupply)
        return res.status(400).json({
          success: false,
          error: "FT metadata must include name, symbol, and totalSupply",
        });
    } else if (type === "USER") {
      const userMeta = newData;
      if (!userMeta.username || !userMeta.email)
        return res.status(400).json({
          success: false,
          error: "USER metadata must include username and email",
        });
    }

    const newCID = await updateJSONOnIPFS(cid, newData);
    return res.json({ success: true, newCID });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/** ======= Update File ======= */
export async function updateFile(req, res) {
  try {
    const { cid } = req.params;
    const file = req.file;
    const collection = req.body.collection || "uploads";
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!cid) return res.status(400).json({ error: "cid required" });
    const newCID = await updateFileOnIPFS(
      cid,
      path.resolve(file.path),
      collection
    );
    return res.json({ success: true, newCID });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/** ======= Delete from IPFS ======= */
export async function deleteFromIPFSController(req, res) {
  try {
    const { cid } = req.params;
    if (!cid) return res.status(400).json({ error: "cid required" });
    const success = await deleteFromIPFS(cid);
    return res.json({ success });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
