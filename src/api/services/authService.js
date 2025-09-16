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
var bcrypt_1 = require("bcrypt");
var jwt_js_1 = require("../utils/jwt.js");
var emails_js_1 = require("../utils/emails.js");
var userRepository_js_1 = require("../repositories/userRepository.js");
var tokenRepository_js_1 = require("../repositories/tokenRepository.js");
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.userRepository = new userRepository_js_1.default();
        this.tokenRepository = new tokenRepository_js_1.default();
    }
    AuthService.prototype.signup = function (firstName, lastName, email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, hashedPassword, newUser, verificationToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.getOne(email)];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser)
                            throw new Error("User already exists");
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 2:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.userRepository.create(firstName, lastName, email, hashedPassword)];
                    case 3:
                        newUser = _a.sent();
                        verificationToken = (0, jwt_js_1.generateToken)({ id: newUser.id }, "verification");
                        return [4 /*yield*/, (0, emails_js_1.default)(newUser.email, verificationToken)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, {
                                user: {
                                    firstName: newUser.firstName,
                                    lastName: newUser.lastName,
                                    email: newUser.email,
                                },
                            }];
                }
            });
        });
    };
    AuthService.prototype.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isValidPassword, activeToken, accessToken, refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.getOne(email)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("Invalid credentials");
                        if (!user.isVerified)
                            throw new Error("Email not verified");
                        return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                    case 2:
                        isValidPassword = _a.sent();
                        if (!isValidPassword)
                            throw new Error("Invalid credentials");
                        return [4 /*yield*/, this.tokenRepository.getActiveToken(user.id)];
                    case 3:
                        activeToken = _a.sent();
                        if (!activeToken) return [3 /*break*/, 5];
                        activeToken.revoked = true;
                        return [4 /*yield*/, this.tokenRepository.update(activeToken.id, activeToken)];
                    case 4:
                        _a.sent(); // revoke active token
                        _a.label = 5;
                    case 5:
                        accessToken = (0, jwt_js_1.generateToken)({ id: user.id }, "access");
                        refreshToken = (0, jwt_js_1.generateToken)({ id: user.id }, "refresh");
                        return [4 /*yield*/, this.tokenRepository.create(user.id, refreshToken)];
                    case 6:
                        _a.sent(); // store new refresh token
                        return [4 /*yield*/, this.userRepository.update(user.id, { lastLogin: new Date() })];
                    case 7:
                        _a.sent(); // update login date
                        return [2 /*return*/, {
                                user: {
                                    id: user.id,
                                    email: user.email,
                                },
                                tokens: {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                },
                            }];
                }
            });
        });
    };
    AuthService.prototype.logout = function (userId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var activeToken, isValidToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tokenRepository.getActiveToken(userId)];
                    case 1:
                        activeToken = _a.sent();
                        if (!activeToken)
                            throw new Error("User already logged out");
                        return [4 /*yield*/, bcrypt_1.default.compare(token, activeToken.hashedToken)];
                    case 2:
                        isValidToken = _a.sent();
                        if (!isValidToken)
                            throw new Error("Invalid token");
                        return [4 /*yield*/, this.tokenRepository.update(activeToken.id, { revoked: true })];
                    case 3:
                        _a.sent(); // revoke active token
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.refresh = function (userId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var activeToken, isValidToken, accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tokenRepository.getActiveToken(userId)];
                    case 1:
                        activeToken = _a.sent();
                        if (!activeToken)
                            throw new Error("Expired refresh token");
                        return [4 /*yield*/, bcrypt_1.default.compare(token, activeToken.hashedToken)];
                    case 2:
                        isValidToken = _a.sent();
                        if (!isValidToken)
                            throw new Error("Invalid token");
                        accessToken = (0, jwt_js_1.generateToken)({ id: userId }, "access");
                        return [2 /*return*/, {
                                tokens: {
                                    accessToken: accessToken,
                                },
                            }];
                }
            });
        });
    };
    AuthService.prototype.verifyEmail = function (email, token) {
        return __awaiter(this, void 0, void 0, function () {
            var user, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.getOne(email)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("User not found");
                        if (user.isVerified)
                            throw new Error("User already verified");
                        payload = (0, jwt_js_1.verifyToken)(token);
                        if (payload.id != user.id)
                            throw new Error("Invalid token");
                        return [4 /*yield*/, this.userRepository.update(user.id, {
                                isVerified: true,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.sendVerificationEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, verificationToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.getOne(email)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("User not found");
                        if (user.isVerified)
                            throw new Error("User already verified");
                        verificationToken = (0, jwt_js_1.generateToken)({ id: user.id }, "verification");
                        return [4 /*yield*/, (0, emails_js_1.default)(user.email, verificationToken)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AuthService;
}());
exports.default = AuthService;
