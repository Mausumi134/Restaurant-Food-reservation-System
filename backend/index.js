import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js";

// Import routes
import reservationRouter from "./routes/reservationRoute.js";
import loginRouter from "./routes/loginRoute.js";
import registerRouter from "./routes/registerRoute.js";
import logoutRouter from "./routes/logoutRoute.js";
import orderRoutes from "./routes/orderRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

const app = express();

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// CORS configuration
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use("/api/v1/auth/login", loginRouter);
app.use("/api/v1/auth/register", registerRouter);
app.use("/api/v1/auth/logout", logoutRouter);
app.use("/api/v1/reservation", reservationRouter);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/tables", tableRoutes);
app.use("/api/v1/delivery", deliveryRoutes);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully!",
    timestamp: new Date().toISOString()
  });
});

// Database connection
dbConnection();

// Error handling middleware (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🗄️  Database: Connected to MongoDB`);
});
