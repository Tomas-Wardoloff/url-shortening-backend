"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
var jwt_js_1 = require("../utils/jwt.js");
function authMiddleware(request, response, next) {
    var authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        response.status(401).json({ error: "Authentication required" });
        return;
    }
    var token = authHeader.split(" ")[1];
    if (!token) {
        response.status(401).json({ error: "Token is required" });
        return;
    }
    try {
        var payload = (0, jwt_js_1.verifyToken)(token);
        request.user = payload;
        next();
    }
    catch (error) {
        if (error.message === "Invalid token")
            response.status(401).json({ error: error.message });
        response.status(500).json({ error: error.message });
        return;
    }
}
