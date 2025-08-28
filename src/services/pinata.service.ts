import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import dotenv from 'dotenv';

dotenv.config();


const PINATA_BASE = "https://api.pinata.cloud/pinning";
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT || null;


function getAuthHeaders(contentType?: string) {
    const headers: Record<string, string> = {};
    if (PINATA_JWT) {
        headers["Authorization"] = `Bearer ${PINATA_JWT}`;
    } else {
        headers["pinata_api_key"] = PINATA_API_KEY || "";
        headers["pinata_secret_api_key"] = PINATA_API_SECRET || "";
    }
    if (contentType) headers["Content-Type"] = contentType;
    return headers;
}


export async function uploadFileToIPFS(filePath: string, collection?: string): Promise<string> {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    const metadata = { name: path.basename(filePath), keyvalues: { collection: collection || "uploads" } };
    form.append("pinataMetadata", JSON.stringify(metadata));

    const headers = { ...getAuthHeaders(), ...form.getHeaders() } as any;
    const res = await axios.post(`${PINATA_BASE}/pinFileToIPFS`, form, { headers, maxContentLength: Infinity, maxBodyLength: Infinity });


    try { fs.unlinkSync(filePath); } catch {} // clean temp file
    return `ipfs://${res.data.IpfsHash}`;
}


export async function uploadJSONToIPFS(json: object, collection?: string): Promise<string> {
    const headers = getAuthHeaders("application/json");
    const res = await axios.post(`${PINATA_BASE}/pinJSONToIPFS`, json, { headers });
    return `ipfs://${res.data.IpfsHash}`;
}


export async function fetchJSONFromCID(cid: string): Promise<any> {
    const raw = cid.replace(/^ipfs:\/\//, "");
    const url = `https://gateway.pinata.cloud/ipfs/${raw}`;
    const res = await axios.get(url, { timeout: 10000 });
    return res.data;
}