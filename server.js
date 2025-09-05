import express from "express";
import cors from "cors";
import "dotenv/config";
import product from "./routes/product.routes.js";
import auth from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/product", product);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
