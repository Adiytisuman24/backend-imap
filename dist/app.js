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
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const imapService_1 = __importDefault(require("./services/imapService")); // ✅ Corrected import
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Default route
app.get("/", (req, res) => {
    res.send("Onebox Email API is running...");
});
// Fetch Emails Route
app.get("/fetch-emails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emails = yield (0, imapService_1.default)();
        res.json({ success: true, emails });
    }
    catch (error) {
        console.error("Error fetching emails:", error.message || error);
        res.status(500).json({ success: false, error: "Failed to fetch emails" });
    }
}));
exports.default = app;
