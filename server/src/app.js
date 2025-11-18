import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import fixedExpenseRoutes from "./routes/fixedExpenseRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// Read origins from .env
const envOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Default local origin
const defaultOrigins = ["http://localhost:5173"];

// Final allowed origins
const allowedOrigins = [...new Set([...envOrigins, ...defaultOrigins])];

console.log("Allowed Origins: ", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
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
    docs: "Use /auth, /transactions, /analytics, /fixed-expenses endpoints.",
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/fixed-expenses", fixedExpenseRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
