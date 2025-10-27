import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const PINATA_BASE = "https://api.pinata.cloud/pinning";
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT || null;

function getAuthHeaders(contentType) {
  const headers = {};
  if (PINATA_JWT) {
    headers["Authorization"] = `Bearer ${PINATA_JWT}`;
  } else {
    headers["pinata_api_key"] = PINATA_API_KEY || "";
    headers["pinata_secret_api_key"] = PINATA_API_SECRET || "";
  }
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

// ---------------- Post file/image ----------------
export async function uploadFileToIPFS(filePath, collection) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  const metadata = {
    name: path.basename(filePath),
    keyvalues: { collection: collection || "uploads" },
  };
  form.append("pinataMetadata", JSON.stringify(metadata));

  const headers = { ...getAuthHeaders(), ...form.getHeaders() };
  const res = await axios.post(`${PINATA_BASE}/pinFileToIPFS`, form, {
    headers,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  try {
    fs.unlinkSync(filePath); // clean temp file
  } catch {}

  return `ipfs://${res.data.IpfsHash}`;
}

// ---------------- Post JSON ----------------
export async function uploadJSONToIPFS(json, collection) {
  const headers = getAuthHeaders("application/json");
  const res = await axios.post(`${PINATA_BASE}/pinJSONToIPFS`, json, { headers });
  return `ipfs://${res.data.IpfsHash}`;
}

// ---------------- Get JSON ----------------
export async function fetchJSONFromCID(cid) {
  const raw = cid.replace(/^ipfs:\/\//, "");
  const url = `https://gateway.pinata.cloud/ipfs/${raw}`;
  const res = await axios.get(url, { timeout: 10000 });
  return res.data;
}

// ---------------- Update JSON ----------------
export async function updateJSONOnIPFS(oldCID, newJSON, collection) {
  const newCID = await uploadJSONToIPFS(newJSON, collection);
  if (oldCID) await deleteFromIPFS(oldCID);
  return newCID;
}

// ---------------- Update Image ----------------
export async function updateFileOnIPFS(oldCID, filePath, collection) {
  const newCID = await uploadFileToIPFS(filePath, collection);
  if (oldCID) await deleteFromIPFS(oldCID);
  return newCID;
}

// ---------------- Delete / Unpin ----------------
export async function deleteFromIPFS(cid) {
  try {
    const headers = getAuthHeaders();
    const raw = cid.replace(/^ipfs:\/\//, "");
    await axios.delete(`${PINATA_BASE}/unpin/${raw}`, { headers });
    return true;
  } catch (err) {
    console.error("Error unpinning CID:", err);
    return false;
  }
}
