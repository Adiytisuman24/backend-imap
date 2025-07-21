"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const imapService_1 = require("./services/imapService"); // Import IMAP service
const elasticsearchConfig_1 = require("./config/elasticsearchConfig"); // Import Elasticsearch client
const aiService_1 = require("./services/aiService"); // Import AI categorization service
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Body parser
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("🚀 Onebox Email Service Running...");
});
// ✅ **Fetch emails every 1 minute**
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔍 Checking for new emails...");
    yield (0, imapService_1.fetchEmails)();
}), 60000);
// ✅ **Search emails in Elasticsearch**
app.post("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { query } = req.body; // Get search query from request body
        const result = yield elasticsearchConfig_1.esClient.search({
            index: "emails", // Elasticsearch index name
            body: {
                query: {
                    match: { subject: query }, // Searching in email subject
                },
            },
        });
        const hits = ((_a = result.hits) === null || _a === void 0 ? void 0 : _a.hits) || [];
        res.json(hits);
    }
    catch (error) {
        console.error("❌ Search Error:", error);
        res.status(500).send("Error searching emails");
    }
}));
// ✅ **AI-Based Email Categorization Route**
app.post("/test-categorization", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subject, body } = req.body;
        if (!subject || !body) {
            return res.status(400).json({ error: "Subject and body are required" });
        }
        const category = yield (0, aiService_1.categorizeEmail)(subject, body); // Call AI service
        res.json({ category });
    }
    catch (error) {
        console.error("❌ Categorization Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
