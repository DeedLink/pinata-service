import express from "express";
import cors from "cors";
import ipfsRoutes from "./routes/ipfs.routes";

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Pinata service is running" });
});

app.use("/ipfs", ipfsRoutes);

export default app;