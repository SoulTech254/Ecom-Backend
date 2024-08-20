import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import bodyParser from "body-parser";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.route.js";
import admUserRoutes from "./routes/admUser.route.js";
import homeRoutes from "./routes/home.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import addressRoutes from "./routes/address.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import categoryRoutes from "./routes/category.routes.js";
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
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Database connected successfully!");
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Routes
app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin/products", productRoutes);
app.use("/api/v1/admin/users", admUserRoutes);
app.use("/api/v1/admin/category", categoryRoutes);
app.use("/api/v1/products", homeRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/branch", branchRoutes);
app.use("/api/v1/orders", orderRoutes);
// app.post("/api/stocks", async (req, res, next) => {
//   try {
//     console.log("Received request to add stock level");
//     const { productId, branchId, stockLevel } = req.body;

//     // Validate and create the stock entry
//     console.log("Validating and creating the stock entry");
//     const stock = await Stock.create({
//       productId,
//       branchId,
//       stockLevel,
//     });

//     console.log("Stock level added successfully");
//     res.status(201).json({
//       success: true,
//       message: "Stock level added successfully",
//       data: stock,
//     });
//   } catch (err) {
//     console.log("Error occurred while adding stock level:", err);
//     next(err);
//   }
// });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
