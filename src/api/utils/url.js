"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShortCode = generateShortCode;
exports.validateUrl = validateUrl;
function generateShortCode(num) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var result = "";
    if (num === 0)
        return chars[0];
    while (num > 0) {
        var rest = num % 62;
        result = chars[rest] + result;
        num = Math.floor(num / 62);
    }
    return result;
}
function validateUrl(url) {
    var urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?.*)?(#.*)?$/i;
    return urlRegex.test(url);
}
