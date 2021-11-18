"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
class RedisCR {
    constructor() {
        this.client = redis_1.default.createClient({
            port: parseInt(process.env.redisPort),
            host: process.env.redis
        });
        this.client.on("ready", () => console.log("ready"));
        this.client.on("error", (err) => console.log(err));
        this.client.on("end", () => console.log("end"));
    }
    create(key, value) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, (error, status) => {
                if (error)
                    return reject(error);
                resolve(status);
            });
        });
    }
    read(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (error, value) => {
                if (error)
                    return reject(error);
                resolve(value);
            });
        });
    }
}
exports.default = RedisCR;
