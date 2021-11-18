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
const user_schema_1 = __importDefault(require("./user-schema"));
const tracker_schema_1 = __importDefault(require("./tracker-schema"));
const mongoose_1 = __importDefault(require("mongoose"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(`mongodb://${process.env.mongo}:${process.env.mongoPort}/trackerOfActivity`);
}))();
exports.User = mongoose_1.default.model('User', user_schema_1.default);
exports.Tracker = mongoose_1.default.model('Tracker', tracker_schema_1.default);
