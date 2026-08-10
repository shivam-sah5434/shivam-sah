/**
 * Shivam Sah Portfolio Backend
 * Node.js + Express
 *
 * Features:
 * - POST /api/contact — validates and stores contact messages
 * - Optional SMTP email notification via Nodemailer
 * - GET /api/health — health check
 * - Simple security headers, CORS and rate limiting
 *
 * Run:
 *   npm install
 *   npm start
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map(v => v.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server requests and local development without an Origin header.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "20kb" }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many messages. Please try again later." }
});

const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "messages.json");

function ensureDataFile() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]", "utf8");
}

function readMessages() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function saveMessage(message) {
  const messages = readMessages();
  messages.push(message);
  fs.writeFileSync(dataFile, JSON.stringify(messages, null, 2), "utf8");
}

function clean(value, max = 3000) {
  return String(value || "").trim().slice(0, max);
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "Shivam Sah Portfolio API",
    emailConfigured: Boolean(transporter),
    time: new Date().toISOString()
  });
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const name = clean(req.body.name, 100);
    const email = clean(req.body.email, 160);
    const message = clean(req.body.message, 3000);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required."
      });
    }

    if (!validEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    const record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    // Always keep a local copy. For production, a database can replace this JSON store.
    saveMessage(record);

    // If SMTP is configured, send the message to Shivam.
    if (transporter && process.env.CONTACT_RECEIVER) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_RECEIVER,
        replyTo: email,
        subject: `Portfolio contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`
      });
    }

    return res.status(201).json({
      success: true,
      message: transporter
        ? "Your message has been sent successfully."
        : "Your message was received successfully."
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
});

// Optional: serve the frontend from this same Node server.
// This makes the project deployable as one application on Render/Railway/etc.
app.use(express.static(path.join(__dirname)));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "API route not found." });
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Shivam Sah Portfolio running on http://localhost:${PORT}`);
});
