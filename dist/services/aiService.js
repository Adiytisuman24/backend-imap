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
exports.categorizeEmail = void 0;
// services/aiService.ts
const categorizeEmail = (subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    const emailText = `${subject} ${body}`.toLowerCase();
    if (emailText.includes("meeting") || emailText.includes("schedule")) {
        return "Meeting Booked";
    }
    if (emailText.includes("interested")) {
        return "Interested";
    }
    if (emailText.includes("not interested")) {
        return "Not Interested";
    }
    if (emailText.includes("out of office")) {
        return "Out of Office";
    }
    return "Spam"; // Default category
});
exports.categorizeEmail = categorizeEmail;
