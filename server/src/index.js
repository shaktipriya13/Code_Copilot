import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { validate } from "./middleware/validate.js";

import {
  registerHandler,
  loginHandler,
  registerSchema,
  loginSchema,
} from "./controllers/auth.controller.js";

import { listLanguages } from "./controllers/languages.controller.js";
import { generateHandler } from "./controllers/generate.controller.js";
import { historyHandler } from "./controllers/history.controller.js";

const app = express();

const FRONTEND = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: FRONTEND }));
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// attach user if token provided
app.use(authMiddleware);

// rate limit for generate endpoint
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.get("/api/languages", listLanguages);

app.post("/api/auth/register", validate(registerSchema), registerHandler);
app.post("/api/auth/login", validate(loginSchema), loginHandler);

// generate
app.post("/api/generate", limiter, generateHandler);

// history
app.get("/api/history", historyHandler);

// health
app.get("/healthz", (req, res) => res.json({ ok: true }));

// error handler (last)
app.use(errorHandler);

// start
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
