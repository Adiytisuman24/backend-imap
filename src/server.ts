import express, { Request, Response } from "express";
import cors from "cors";  // ✅ Import CORS
import dotenv from "dotenv";
import { fetchEmails } from "./services/imapService";
import { esClient } from "./config/elasticsearchConfig";
import { categorizeEmail } from "./services/categorizeEmail";
import { sendSlackNotification, triggerWebhook } from "./services/notification"; // ✅ Import Notifications

dotenv.config();

const app = express();
app.use(express.json()); // ✅ Middleware for JSON body parsing

// ✅ Enable CORS for frontend requests
app.use(cors({
  origin: "http://127.0.0.1:5500", // ✅ Allow requests from your frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

const PORT = process.env.PORT || 3000;

let emails: any[] = []; // ✅ Store fetched emails

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Onebox Email Service Running...");
});

// ✅ API to get fetched emails
app.get("/emails", (req: Request, res: Response) => {
  res.json({ success: true, emails });
});

// ✅ Automatically fetch emails every 1 minute
setInterval(async () => {
  console.log("🔍 Checking for new emails...");
  const newEmails = await fetchEmails();
  if (Array.isArray(newEmails)) {
    emails = newEmails; // ✅ Update stored emails
  }
}, 60000);

// ✅ Email Categorization API with Notifications
app.post("/categorize-email", async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailBody } = req.body;
    if (!emailBody) {
      res.status(400).json({ error: "emailBody is required" });
      return;
    }

    const category = await categorizeEmail(emailBody);

    // ✅ Send Slack & Webhook only if email is "Interested"
    if (category.toLowerCase() === "interested") {
      await sendSlackNotification(emailBody);
      await triggerWebhook({ emailBody, category });
    }

    res.json({ category });
  } catch (error) {
    console.error("❌ Error in categorization:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Search Emails API
app.post("/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const result = await esClient.search({
      index: "emails",
      body: {
        query: {
          match: { subject: query },
        },
      },
    });

    const hits = (result as any).hits?.hits || [];
    res.json(hits);
  } catch (error) {
    console.error("❌ Search Error:", error);
    res.status(500).json({ error: "Error searching emails" });
  }
});

// ✅ Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
