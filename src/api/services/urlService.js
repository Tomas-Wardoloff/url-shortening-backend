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
var tagRepository_js_1 = require("../repositories/tagRepository.js");
var urlRepository_js_1 = require("../repositories/urlRepository.js");
var url_js_1 = require("../utils/url.js");
var UrlService = /** @class */ (function () {
    function UrlService() {
        this.urlRepository = new urlRepository_js_1.default();
        this.tagRepository = new tagRepository_js_1.default();
    }
    UrlService.prototype.shortenUrl = function (userId, url, description, customAlias) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUrl, newUrl, shortCode, updateUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, url_js_1.validateUrl)(url))
                            throw new Error("Invalid URL");
                        if (!customAlias) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.urlRepository.getOne(customAlias)];
                    case 1:
                        existingUrl = _a.sent();
                        if (existingUrl)
                            throw new Error("Short code already exists"); // check if the short code already exists
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.urlRepository.create(url, userId, description)];
                    case 3:
                        newUrl = _a.sent();
                        shortCode = customAlias || (0, url_js_1.generateShortCode)(newUrl.id);
                        return [4 /*yield*/, this.urlRepository.update(newUrl.id, {
                                shortCode: shortCode,
                            })];
                    case 4:
                        updateUrl = _a.sent();
                        return [2 /*return*/, {
                                url: updateUrl.url,
                                shortCode: updateUrl.shortCode,
                                description: updateUrl.description,
                                createdAt: updateUrl.createdAt,
                            }];
                }
            });
        });
    };
    UrlService.prototype.redirectUrl = function (shortCode) {
        return __awaiter(this, void 0, void 0, function () {
            var urlToRedirect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.urlRepository.getOne(shortCode)];
                    case 1:
                        urlToRedirect = _a.sent();
                        if (!urlToRedirect)
                            throw new Error("URL not found");
                        return [4 /*yield*/, this.urlRepository.update(urlToRedirect.id, {
                                clicks: urlToRedirect.clicks + 1,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, urlToRedirect.url];
                }
            });
        });
    };
    UrlService.prototype.updateUrl = function (userId, shortCode, url, description) {
        return __awaiter(this, void 0, void 0, function () {
            var urlToUpdate, updatedUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.urlRepository.getOne(shortCode)];
                    case 1:
                        urlToUpdate = _a.sent();
                        if (!urlToUpdate)
                            throw new Error("URL not found");
                        if (urlToUpdate.userId !== userId)
                            throw new Error("Action not authorized"); // check if the user is the owner of the url to update
                        if (url && !(0, url_js_1.validateUrl)(url))
                            throw new Error("Invalid URL");
                        return [4 /*yield*/, this.urlRepository.update(urlToUpdate.id, {
                                url: url,
                                description: description,
                            })];
                    case 2:
                        updatedUrl = _a.sent();
                        return [2 /*return*/, {
                                url: updatedUrl.url,
                                shortCode: updatedUrl.shortCode,
                                description: updatedUrl.description,
                                createdAt: updatedUrl.createdAt,
                            }];
                }
            });
        });
    };
    UrlService.prototype.deleteUrl = function (userId, shortCode) {
        return __awaiter(this, void 0, void 0, function () {
            var urlToDelete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.urlRepository.getOne(shortCode)];
                    case 1:
                        urlToDelete = _a.sent();
                        if (!urlToDelete)
                            throw new Error("URL not found");
                        if (urlToDelete.userId !== userId)
                            throw new Error("Action not authorized"); // check if the user is the owner of the url to delete
                        return [4 /*yield*/, this.urlRepository.delete(shortCode)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UrlService.prototype.getUserUrls = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var urls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.urlRepository.getUserUrl(userId)];
                    case 1:
                        urls = _a.sent();
                        return [2 /*return*/, {
                                urls: urls.map(function (url) { return ({
                                    url: url.url,
                                    shortCode: url.shortCode,
                                    description: url.description,
                                    createdAt: url.createdAt,
                                    clicks: url.clicks,
                                }); }),
                            }];
                }
            });
        });
    };
    UrlService.prototype.asignTagToUrl = function (userId, shortCode, tagId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUrl, existingTag, isTagAssigned;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.urlRepository.getOne(shortCode)];
                    case 1:
                        existingUrl = _a.sent();
                        return [4 /*yield*/, this.tagRepository.getOne(tagId)];
                    case 2:
                        existingTag = _a.sent();
                        if (!existingUrl)
                            throw new Error("URL not found");
                        if (!existingTag)
                            throw new Error("Tag not found");
                        if (existingTag.creatorId !== userId || existingUrl.userId !== userId)
                            throw new Error("Action not authorized");
                        return [4 /*yield*/, this.tagRepository.isTagAssigned(tagId, existingUrl.id)];
                    case 3:
                        isTagAssigned = _a.sent();
                        if (isTagAssigned)
                            throw new Error("Tag already assigned to this URL");
                        return [4 /*yield*/, this.tagRepository.asingTagToUrl(tagId, existingUrl.id)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return UrlService;
}());
exports.default = UrlService;
