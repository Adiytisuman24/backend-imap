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
exports.fetchEmails = fetchEmails;
const imap_simple_1 = __importDefault(require("imap-simple"));
const imapConfig_1 = __importDefault(require("../config/imapConfig"));
function fetchEmails() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield imap_simple_1.default.connect(imapConfig_1.default);
            yield connection.openBox("INBOX");
            const searchCriteria = ["ALL"];
            const fetchOptions = { bodies: ["HEADER", "TEXT"], struct: true };
            const messages = yield connection.search(searchCriteria, fetchOptions);
            const emails = messages.map((message) => {
                var _a, _b;
                const headers = message.parts.find((part) => part.which === "HEADER");
                const body = message.parts.find((part) => part.which === "TEXT");
                return {
                    from: ((_a = headers === null || headers === void 0 ? void 0 : headers.body.from) === null || _a === void 0 ? void 0 : _a[0]) || "Unknown",
                    subject: ((_b = headers === null || headers === void 0 ? void 0 : headers.body.subject) === null || _b === void 0 ? void 0 : _b[0]) || "No Subject",
                    body: (body === null || body === void 0 ? void 0 : body.body) || "No Content",
                };
            });
            console.log(emails);
            connection.end(); // Close connection
            return emails;
        }
        catch (error) {
            console.error("Error fetching emails:", error);
            return [];
        }
    });
}
