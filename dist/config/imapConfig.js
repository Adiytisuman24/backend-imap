"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imapConfig = {
    imap: {
        user: "helpsolar.in@gmail.com",
        password: "geun sokg bkuq uuiq",
        host: "imap.gmail.com",
        port: 993,
        tls: true, // `secure` ki jagah `tls` use hota hai
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 3000,
    },
};
exports.default = imapConfig;
