"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var tagController_js_1 = require("../controllers/tagController.js");
var authenticationMiddleware_js_1 = require("../middlewares/authenticationMiddleware.js");
var TagRouter = /** @class */ (function () {
    function TagRouter() {
        this.router = (0, express_1.Router)();
        this.tagController = new tagController_js_1.default();
        this.initializeRoutes();
    }
    TagRouter.prototype.initializeRoutes = function () {
        this.router.post("/", authenticationMiddleware_js_1.authMiddleware, this.tagController.createTag);
        this.router.get("/my-tags", authenticationMiddleware_js_1.authMiddleware, this.tagController.getUserTags);
        this.router.delete("/:tagId", authenticationMiddleware_js_1.authMiddleware, this.tagController.deleteTag);
    };
    TagRouter.prototype.getRouter = function () {
        return this.router;
    };
    return TagRouter;
}());
exports.default = TagRouter;
