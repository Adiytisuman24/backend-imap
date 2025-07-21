import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fetchEmails from "./services/imapService"; // ✅ Corrected import

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Default route
app.get("/", (req, res) => {
  res.send("Onebox Email API is running...");
});

// Fetch Emails Route
app.get("/fetch-emails", async (req, res) => {
  try {
    const emails = await fetchEmails();
    res.json({ success: true, emails });
  } catch (error: any) {
    console.error("Error fetching emails:", error.message || error);
    res.status(500).json({ success: false, error: "Failed to fetch emails" });
  }
});

export default app;
