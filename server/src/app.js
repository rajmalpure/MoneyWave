import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import fixedExpenseRoutes from "./routes/fixedExpenseRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// Read origins from .env
const envOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Default allowed origins
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://raj-money.vercel.app",
  "https://raj-money.vercel.app/login",
  "**","*"
];

// Final allowed origins (merge and deduplicate)
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

console.log("Allowed Origins: ", allowedOrigins);

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS: ", origin);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/", (req, res) =>
  res.json({
    message: "Money Manager API is running",
    docs: "Use /auth, /transactions, /analytics, /fixed-expenses, /groups endpoints.",
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/fixed-expenses", fixedExpenseRoutes);
app.use("/groups", groupRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
