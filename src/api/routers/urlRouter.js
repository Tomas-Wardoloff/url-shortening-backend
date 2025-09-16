"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authenticationMiddleware_js_1 = require("../middlewares/authenticationMiddleware.js");
var urlController_js_1 = require("../controllers/urlController.js");
var UrlRouter = /** @class */ (function () {
    function UrlRouter() {
        this.router = (0, express_1.Router)();
        this.urlController = new urlController_js_1.default();
        this.initializeRoutes();
    }
    UrlRouter.prototype.initializeRoutes = function () {
        this.router.post("/shorten", authenticationMiddleware_js_1.authMiddleware, this.urlController.shortenUrl);
        this.router.get("/:shortCode", this.urlController.redirectUrl);
        this.router.put("/:shortCode", authenticationMiddleware_js_1.authMiddleware, this.urlController.updateUrl);
        this.router.delete("/:shortCode", authenticationMiddleware_js_1.authMiddleware, this.urlController.deleteUrl);
        this.router.get("/user", authenticationMiddleware_js_1.authMiddleware, this.urlController.getUserUrls);
        this.router.post("/:shortCode/tag/:tagId", authenticationMiddleware_js_1.authMiddleware, this.urlController.asignTagToUrl);
    };
    UrlRouter.prototype.getRouter = function () {
        return this.router;
    };
    return UrlRouter;
}());
exports.default = UrlRouter;
