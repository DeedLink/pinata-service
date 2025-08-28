import { Router } from "express";
import multer from "multer";
import { uploadFile, uploadMetadata, fetchMetadata, updateMetadata, updateFile, deleteFromIPFSController } from "../controllers/ipfs.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });


router.post("/upload/image", upload.single("file"), uploadFile);
router.post("/upload/metadata", uploadMetadata);
router.get("/fetch/:cid", fetchMetadata);
router.put("/update/metadata/:cid", updateMetadata);
router.put("/update/image/:cid", upload.single("file"), updateFile);
router.delete("/delete/:cid", deleteFromIPFSController);


export default router;