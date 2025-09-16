"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authenticationMiddleware_js_1 = require("../middlewares/authenticationMiddleware.js");
var authController_js_1 = require("../controllers/authController.js");
var AuthRouter = /** @class */ (function () {
    function AuthRouter() {
        this.router = (0, express_1.Router)();
        this.authController = new authController_js_1.default();
        this.initializeRoutes();
    }
    AuthRouter.prototype.initializeRoutes = function () {
        this.router.post("/signup", this.authController.signup);
        this.router.post("/login", this.authController.login);
        this.router.post("/logout", authenticationMiddleware_js_1.authMiddleware, this.authController.logout);
        this.router.post("/refresh-token", authenticationMiddleware_js_1.authMiddleware, this.authController.refresh);
        this.router.get("/verify-email", this.authController.verifyEmail);
        this.router.post("/send-verification-email", this.authController.sendVerificationEmail);
    };
    AuthRouter.prototype.getRouter = function () {
        return this.router;
    };
    return AuthRouter;
}());
exports.default = AuthRouter;
