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
var authService_js_1 = require("../services/authService.js");
var AuthController = /** @class */ (function () {
    function AuthController() {
        var _this = this;
        this.authService = new authService_js_1.default();
        this.signup = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var _a, firstName, lastName, email, password, data, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password;
                        if (!firstName || !lastName || !email || !password) {
                            response.status(400).json({ error: "Missing required fields" });
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.authService.signup(firstName, lastName, email, password)];
                    case 2:
                        data = _b.sent();
                        response.status(201).json({ message: "User created", data: data });
                        return [2 /*return*/];
                    case 3:
                        error_1 = _b.sent();
                        if (error_1.message === "User already exists")
                            response.status(409).json({ error: error_1.message });
                        else
                            response.status(500).json({ error: error_1.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.login = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var _a, email, password, data, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, email = _a.email, password = _a.password;
                        if (!email || !password) {
                            response.status(400).json({ error: "Missing required fields" });
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.authService.login(email, password)];
                    case 2:
                        data = _b.sent();
                        response.status(200).json({ message: "User logged in", data: data });
                        return [2 /*return*/];
                    case 3:
                        error_2 = _b.sent();
                        if (error_2.message === "Invalid credentials" ||
                            error_2.message === "Email not verified")
                            response.status(401).json({ error: error_2.message });
                        else if (error_2.message === "User already logged in")
                            response.status(409).json({ error: error_2.message });
                        else
                            response.status(500).json({ error: error_2.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.logout = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var user, refreshToken, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = request.user;
                        refreshToken = request.body.refreshToken;
                        if (!refreshToken) {
                            response.status(400).json({ error: "Missing required fields" });
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.authService.logout(user.id, refreshToken)];
                    case 2:
                        _a.sent();
                        response.status(200).json({ message: "User logged out" });
                        return [2 /*return*/];
                    case 3:
                        error_3 = _a.sent();
                        if (error_3.message === "User already logged out")
                            response.status(409).json({ error: error_3.message });
                        else if (error_3.message === "Invalid token")
                            response.status(401).json({ error: error_3.message });
                        else
                            response.status(500).json({ error: error_3.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.refresh = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var user, refreshToken, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = request.user;
                        refreshToken = request.body.refreshToken;
                        if (!refreshToken) {
                            response.status(400).json({ error: "Missing required fields" });
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.authService.refresh(user.id, refreshToken)];
                    case 2:
                        data = _a.sent();
                        response.status(200).json({ message: "Token refreshed", data: data });
                        return [2 /*return*/];
                    case 3:
                        error_4 = _a.sent();
                        if (error_4.message === "Expired refresh token" ||
                            error_4.message === "Invalid token")
                            response.status(401).json({ error: error_4.message });
                        else
                            response.status(500).json({ error: error_4.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.verifyEmail = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var _a, email, token, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.query, email = _a.email, token = _a.token;
                        if (!email || !token) {
                            response.status(400).json({ error: "Missing required fields" });
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.authService.verifyEmail(email, token)];
                    case 2:
                        _b.sent();
                        response.status(200).json({ message: "Email verified" });
                        return [2 /*return*/];
                    case 3:
                        error_5 = _b.sent();
                        if (error_5.message === "User not found")
                            response.status(404).json({ error: error_5.message });
                        else if (error_5.message === "User already verified")
                            response.status(409).json({ error: error_5.message });
                        else if (error_5.message === "Invalid token")
                            response.status(401).json({ error: error_5.message });
                        else
                            response.status(500).json({ error: error_5.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.sendVerificationEmail = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var email, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = request.body.email;
                        if (!email) {
                            response.status(400).json({ error: "Missing required fields" });
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.authService.sendVerificationEmail(email)];
                    case 2:
                        _a.sent();
                        response.status(200).json({ message: "Verification email sent" });
                        return [2 /*return*/];
                    case 3:
                        error_6 = _a.sent();
                        if (error_6.message === "User not found")
                            response.status(404).json({ error: error_6.message });
                        else if (error_6.message === "User already verified")
                            response.status(409).json({ error: error_6.message });
                        else
                            response.status(500).json({ error: error_6.message });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    return AuthController;
}());
exports.default = AuthController;
