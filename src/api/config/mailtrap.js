"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = exports.mailtrapClient = void 0;
var mailtrap_1 = require("mailtrap");
if (!process.env.MAILTRAP_API_TOKEN)
    throw new Error("Mailtrap API token is not defined");
if (!process.env.MAILTRAP_SENDER_EMAIL)
    throw new Error("Mailtrap sender email is not defined");
exports.mailtrapClient = new mailtrap_1.MailtrapClient({
    token: process.env.MAILTRAP_API_TOKEN,
});
exports.sender = {
    email: process.env.MAILTRAP_SENDER_EMAIL,
    name: process.env.MAILTRAP_SENDER_NAME,
};
