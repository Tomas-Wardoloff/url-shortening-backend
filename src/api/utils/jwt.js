"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
var jsonwebtoken_1 = require("jsonwebtoken");
function generateToken(payload, type) {
    var secret = process.env.JWT_SECRET;
    var expiration = process.env["JWT_".concat(type.toUpperCase(), "_EXPIRATION")];
    if (!secret) {
        throw new Error("JWT secret is not defined");
    }
    else if (!expiration) {
        throw new Error("".concat(type, " expiration is not defined"));
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: parseInt(expiration, 10) });
}
function verifyToken(token) {
    var secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT secret is not defined");
    }
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        throw new Error(error.message);
    }
}
