import dotenv from "dotenv";
import app from "./app";

dotenv.config();

if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT) || 5000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Pinata URI Service running on port ${PORT}`);
  });
}

export default app;