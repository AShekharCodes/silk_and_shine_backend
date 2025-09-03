import express from "express";
import cors from "cors";
import "dotenv/config";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
