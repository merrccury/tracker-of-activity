import {Request, Response} from "express";
import {Tracker} from "../models";
import {sendResponse} from './utils'
import mongoose from "mongoose";
import redis from "redis";
import {promisify} from "util";

const redisClient = redis.createClient({
    port: parseInt(process.env.redisPort),
    host: process.env.redis
})


const readCache = promisify(redisClient.get).bind(redisClient);
console.log('readCache', readCache)
const setCache = promisify(redisClient.set).bind(redisClient);
console.log('setCache', setCache)

export async function startWork(req: Request, res: Response) {
    if (req.user === undefined)
        return sendResponse(res, 'Bad request', 401)

    const previousTracker = await Tracker.count({
        employer: req.user.id,
        end: null,
    });

    if (previousTracker)
        return sendResponse(res, 'Previous state wasn\'t ended', 403)

    const now = Date.now();

    await Tracker.create({
        employer: req.user.id,
        start: now,
        end: null,
    });

    res.send({
        user: req.user.username,
        startOfWork: now
    });
}

export async function endWork(req: Request, res: Response) {
    if (req.user === undefined)
        return sendResponse(res, 'Bad request', 401)

    const now = Date.now();

    await Tracker.updateOne({
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

export async function workTime(req: Request, res: Response) {
    const dayOffset = 86399999;
    const from = req.query['from-date'];
    const to = req.query['to-date'];
    const key = `${req.user?.id}-${from}-${to}`;

    let cache = await readCache(key);

    if (cache !== null) {
        return res.send({
            totalHours: parseInt(cache, 10),
            cache: true,
        })
    }

    if (from === undefined || to === undefined)
        return sendResponse(res, 'Bad request', 401);

    const dateFrom = Date.parse(from.toString());
    const dateTo = Date.parse(to.toString()) + dayOffset;

    if (isNaN(dateFrom) || isNaN(dateTo))
        return sendResponse(res, 'Bad parameters', 400);

    const result = await Tracker.aggregate([{
        $match: {
            $and: [
                {employer: new mongoose.Types.ObjectId(req.user?.id)},
                {start: {$gte: new Date(dateFrom)}},
                {end: {$lte: new Date(dateTo)}}
            ]
        }
    }, {
        $group: {
            _id: null,
            total: {
                $sum: {$subtract: ["$end", "$start"]}
            }
        }
    }]).exec();

    let total: number = result.length === 0 ? 0 : Math.floor(result[0].total / 1000 / 60 / 60);
    await setCache(key, total.toString(10));
    res.send({
        totalHours: total,
        cache: false
    })
}