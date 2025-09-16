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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var urlService_js_1 = require("../services/urlService.js");
var UrlController = /** @class */ (function () {
    function UrlController() {
        var _this = this;
        this.urlService = new urlService_js_1.default();
        this.shortenUrl = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var user, _a, url, description, customAlias, data, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = request.user;
                        _a = request.body, url = _a.url, description = _a.description, customAlias = _a.customAlias;
                        if (!url) {
                            response.status(400).json({ error: "No URL provided" });
                            return [2 /*return*/];
                        }
                        if (customAlias) {
                            if (customAlias.length > 16) {
                                response
                                    .status(400)
                                    .json({ error: "Custom alias must be less than 16 characters" });
                                return [2 /*return*/];
                            }
                            if (customAlias.length < 4) {
                                response
                                    .status(400)
                                    .json({ error: "Custom alias must be at least 4 characters" });
                                return [2 /*return*/];
                            }
                            if (customAlias.includes(" ")) {
                                response
                                    .status(400)
                                    .json({ error: "Custom alias must not contain spaces" });
                                return [2 /*return*/];
                            }
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.urlService.shortenUrl(user.id, url, description, customAlias)];
                    case 2:
                        data = _b.sent();
                        response.status(201).json({ message: "URL shortened", data: data });
                        return [2 /*return*/];
                    case 3:
                        error_1 = _b.sent();
                        if (error_1.message === "Invalid URL")
                            response.status(400).json({ error: error_1.message });
                        else if (error_1.message === "Short code already exists")
                            response.status(400).json({ error: error_1.message });
                        else
                            response.status(500).json({ error: error_1.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.redirectUrl = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var shortCode, url, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shortCode = request.params.shortCode;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.urlService.redirectUrl(shortCode)];
                    case 2:
                        url = _a.sent();
                        response.status(301).redirect(url);
                        return [2 /*return*/];
                    case 3:
                        error_2 = _a.sent();
                        if (error_2.message === "URL not found")
                            response.status(404).json({ error: error_2.message });
                        response.status(500).json({ error: error_2.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.updateUrl = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var user, shortCode, _a, url, description, data, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = request.user;
                        shortCode = request.params.shortCode;
                        _a = request.body, url = _a.url, description = _a.description;
                        if (!url && !description) {
                            response.status(400).json({ error: "No data provided" });
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.urlService.updateUrl(user.id, shortCode, url, description)];
                    case 2:
                        data = _b.sent();
                        response.status(200).json({ message: "URL updated", data: data });
                        return [2 /*return*/];
                    case 3:
                        error_3 = _b.sent();
                        if (error_3.mmessage === "URL not found")
                            response.status(404).json({ error: error_3.message });
                        else if (error_3.message === "Invalid URL")
                            response.status(400).json({ error: error_3.message });
                        else if (error_3.message === "Action not authorized")
                            response.status(403).json({ error: error_3.message });
                        else
                            response.status(500).json({ error: error_3.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.deleteUrl = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var user, shortCode, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = request.user;
                        shortCode = request.params.shortCode;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.urlService.deleteUrl(user.id, shortCode)];
                    case 2:
                        _a.sent();
                        response.status(204).json({ message: "URL deleted" });
                        return [2 /*return*/];
                    case 3:
                        error_4 = _a.sent();
                        if (error_4.message === "URL not found")
                            response.status(404).json({ error: error_4.message });
                        if (error_4.message === "Action not authorized")
                            response.status(403).json({ error: error_4.message });
                        else
                            response.status(500).json({ error: error_4.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getUserUrls = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var user, data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = request.user;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.urlService.getUserUrls(user.id)];
                    case 2:
                        data = _a.sent();
                        response.status(200).json({ message: "All user urls", data: data });
                        return [2 /*return*/];
                    case 3:
                        error_5 = _a.sent();
                        response.status(500).json({ error: error_5.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.asignTagToUrl = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var user, _a, shortCode, tagId, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = request.user;
                        _a = request.params, shortCode = _a.shortCode, tagId = _a.tagId;
                        if (isNaN(parseInt(tagId))) {
                            response.status(400).json({ error: "Invalid tag id" });
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.urlService.asignTagToUrl(user.id, shortCode, parseInt(tagId))];
                    case 2:
                        _b.sent();
                        response.status(200).json({ message: "Tag assigned to URL" });
                        return [2 /*return*/];
                    case 3:
                        error_6 = _b.sent();
                        if (error_6.message === "URL not found" ||
                            error_6.message === "Tag not found" ||
                            error_6.message === "Tag already assigned to this URL")
                            response.status(404).json({ error: error_6.message });
                        if (error_6.message === "Action not authorized")
                            response.status(403).json({ error: error_6.message });
                        else
                            response.status(500).json({ error: error_6.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    return UrlController;
}());
exports.default = UrlController;
