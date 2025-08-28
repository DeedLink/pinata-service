import { Router } from "express";
import multer from "multer";
import { uploadImage, uploadMetadata, fetchMetadata } from "../controllers/ipfs.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });


router.post("/upload/image", upload.single("file"), uploadImage);
router.post("/upload/metadata", uploadMetadata);
router.get("/fetch/:cid", fetchMetadata);


export default router;