import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ipfsRoutes from "./routes/ipfs.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Pinata service is running" });
});

app.use("/ipfs", ipfsRoutes);

if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
  const PORT = Number(process.env.PORT) || 5000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Pinata URI Service running on port ${PORT}`);
  });
}

export default app;
