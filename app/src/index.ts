import express from 'express';
import Jwt from './security /jwt'
import bodyParser from "body-parser";
import {User, Tracker} from "./models";
import passportJWT from './security /passport-strategy';
import mongoose, {Schema} from "mongoose";
import RedisCR from './models/redisCR'


const app = express();
const redis = new RedisCR();

app.use(bodyParser.json());

const jwt = new Jwt();

app.post('/auth', (async (req, res) => {

    const {username, password} = req.body;

    if (username === undefined || password === undefined) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }
    try {
        const targetUser = await User.findOne({username: username}).exec();
        if (targetUser.password === password)
            return res.json({
                access_token: jwt.createAccessToken({id: targetUser.id})
            })
    } catch (e) {
        res.status(401).json({
            message: 'Invalid credentials'
        })
    }
}))

app.use(passportJWT.initialize());
app.use(passportJWT.authenticate('jwt', {session: false}))

app.get('/start-work', async (req, res) => {
    if (req.user !== undefined) {
        const previousTracker = await Tracker.count({
            employer: req.user.id,
            end: null,
        });

        if(previousTracker){
            return res.status(403).send({
                message: "Previous state wasn't ended"
            })
        }

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
    } else {
        res.status(401).send({
            message: 'Bad request'
        });
    }
});
app.get('/end-work', async (req, res) => {
    if (req.user !== undefined) {
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
    } else {
        res.status(401).send({
            message: 'Bad request'
        });
    }
});
app.get('/work-time', async (req, res) => {
    const from = req.query['from-date'];
    const to = req.query['to-date'];

    const key =`${req.user?.id}-${from}-${to}`;

    let cash = await redis.read(key);
    if (cash !== null) {
        return res.send({
            totalHours: parseInt(cash, 10),
            cash: true,
        })
    }

    if (from === undefined || to === undefined) {
        return res.status(401).send({
            message: "Bad request"
        })
    }
    const dateFrom = Date.parse(from.toString());
    const dateTo = Date.parse(to.toString()) + 86399999;

    if (isNaN(dateFrom) || isNaN(dateTo)) {
        return res.status(400).send({
            message: "Bad parameters"
        })
    }

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
    await redis.create(key, total.toString(10));
    res.send({
        totalHours: total,
        cash: false
    })
});

app.listen(parseInt(process.env.port));