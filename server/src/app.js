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
];

// Final allowed origins (merge and deduplicate)
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

console.log("Allowed Origins: ", allowedOrigins);

// CRITICAL: Manual CORS headers BEFORE other middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests from allowed origins or no origin (server-to-server)
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  } else {
    console.log("Blocked by CORS: ", origin);
  }
  
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

// CORS middleware as backup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
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