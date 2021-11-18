"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Jwt {
    constructor() {
        this.secretKey = 'merrccury';
        this.expiresInAccess = 3600;
        this.expiresInRefresh = 86400;
        this.algorithm = 'HS256';
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
        // console.log('this.refreshToken', this.refreshToken);
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
