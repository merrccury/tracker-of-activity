"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = require("../config/jwt-config");
class Jwt {
    constructor() {
        this.secretKey = jwt_config_1.secretKey;
        this.expiresInAccess = jwt_config_1.expiresInAccess;
        this.expiresInRefresh = jwt_config_1.expiresInRefresh;
        this.algorithm = jwt_config_1.algorithm;
        this.accessToken = null;
        this.refreshToken = null;
    }
    getSecretKey() {
        return this.secretKey;
    }
    createAccessToken(payload) {
        this.accessToken = jsonwebtoken_1.default.sign(payload, this.secretKey, {
            algorithm: this.algorithm,
            expiresIn: this.expiresInAccess,
        });
        return this.accessToken;
    }
    createRefreshToken(payload) {
        this.refreshToken = jsonwebtoken_1.default.sign(payload, this.secretKey, {
            algorithm: this.algorithm,
            expiresIn: this.expiresInRefresh,
        });
        return this.refreshToken;
    }
    parseToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, this.secretKey, (verifyError, payload) => {
                if (verifyError === null)
                    return resolve(payload || {});
                return reject(verifyError);
            });
        });
    }
}
exports.default = Jwt;
