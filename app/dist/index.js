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
const express_1 = __importDefault(require("express"));
const jwt_1 = __importDefault(require("./security /jwt"));
const body_parser_1 = __importDefault(require("body-parser"));
const models_1 = require("./models");
const passport_strategy_1 = __importDefault(require("./security /passport-strategy"));
const mongoose_1 = __importDefault(require("mongoose"));
const redisCR_1 = __importDefault(require("./models/redisCR"));
const app = express_1.default();
const redis = new redisCR_1.default();
app.use(body_parser_1.default.json());
const jwt = new jwt_1.default();
app.post('/auth', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (username === undefined || password === undefined) {
        return res.status(400).json({
            message: "Invalid parameters"
        });
    }
    try {
        const targetUser = yield models_1.User.findOne({ username: username }).exec();
        if (targetUser.password === password)
            return res.json({
                access_token: jwt.createAccessToken({ id: targetUser.id })
            });
    }
    catch (e) {
        res.status(401).json({
            message: 'Invalid credentials'
        });
    }
})));
app.use(passport_strategy_1.default.initialize());
app.use(passport_strategy_1.default.authenticate('jwt', { session: false }));
app.get('/start-work', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user !== undefined) {
        const previousTracker = yield models_1.Tracker.count({
            employer: req.user.id,
            end: null,
        });
        if (previousTracker) {
            return res.status(403).send({
                message: "Previous state wasn't ended"
            });
        }
        const now = Date.now();
        yield models_1.Tracker.create({
            employer: req.user.id,
            start: now,
            end: null,
        });
        res.send({
            user: req.user.username,
            startOfWork: now
        });
    }
    else {
        res.status(401).send({
            message: 'Bad request'
        });
    }
}));
app.get('/end-work', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user !== undefined) {
        const now = Date.now();
        yield models_1.Tracker.updateOne({
            employer: req.user.id,
            end: null,
        }, {
            end: now
        });
        res.send({
            user: req.user.username,
            endOfWork: now
        });
    }
    else {
        res.status(401).send({
            message: 'Bad request'
        });
    }
}));
app.get('/work-time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const from = req.query['from-date'];
    const to = req.query['to-date'];
    const key = `${(_a = req.user) === null || _a === void 0 ? void 0 : _a.id}-${from}-${to}`;
    let cash = yield redis.read(key);
    if (cash !== null) {
        return res.send({
            totalHours: parseInt(cash, 10),
            cash: true,
        });
    }
    if (from === undefined || to === undefined) {
        return res.status(401).send({
            message: "Bad request"
        });
    }
    const dateFrom = Date.parse(from.toString());
    const dateTo = Date.parse(to.toString()) + 86399999;
    if (isNaN(dateFrom) || isNaN(dateTo)) {
        return res.status(400).send({
            message: "Bad parameters"
        });
    }
    const result = yield models_1.Tracker.aggregate([{
            $match: {
                $and: [
                    { employer: new mongoose_1.default.Types.ObjectId((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) },
                    { start: { $gte: new Date(dateFrom) } },
                    { end: { $lte: new Date(dateTo) } }
                ]
            }
        }, {
            $group: {
                _id: null,
                total: {
                    $sum: { $subtract: ["$end", "$start"] }
                }
            }
        }]).exec();
    let total = result.length === 0 ? 0 : Math.floor(result[0].total / 1000 / 60 / 60);
    yield redis.create(key, total.toString(10));
    res.send({
        totalHours: total,
        cash: false
    });
}));
app.listen(parseInt(process.env.port));
