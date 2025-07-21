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
Object.defineProperty(exports, "__esModule", { value: true });
const categorizeEmail_1 = require("./categorizeEmail");
// Jab email fetch ho jaye, use categorize kar:
function processEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = yield (0, categorizeEmail_1.categorizeEmail)(email.subject, email.body);
        console.log(`📩 Email categorized as: ${category}`);
        // Elasticsearch me store karne ke liye modify kar:
        return Object.assign(Object.assign({}, email), { category });
    });
}
