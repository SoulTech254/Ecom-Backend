import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import bodyParser from "body-parser";
import productRoutes from "./routes/products.routes.js";
import superAdminRoutes from "./routes/superAdmin.routes.js"
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Use CORS with options
app.use(cors(corsOptions));

dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

console.log(process.env.MONGO_URL);
mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    console.log("Database connected successfully!");
  });

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin/products", productRoutes);
app.use("/api/v1/superAdmin", superAdminRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
