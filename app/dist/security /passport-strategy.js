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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const jwt_1 = __importDefault(require("./jwt"));
const models_1 = require("../models");
const headerExtractor = function (req) {
    let token = req.header('Authorization');
    return token ? token : null;
};
const options = {
    jwtFromRequest: headerExtractor,
    secretOrKey: new jwt_1.default().getSecretKey()
};
const jwtStrategy = new passport_jwt_1.Strategy(options, ((payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.User.findById(payload.id).exec();
    return done(null, {
        username: user.username,
        id: user.id
    });
})));
passport_1.default.use(jwtStrategy);
exports.default = passport_1.default;
