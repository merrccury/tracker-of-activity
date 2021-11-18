import {Request, Response} from "express";
import {User} from '../models';
import bcrypt from "bcrypt";
import {sendResponse} from './utils';
import Jwt from '../security /jwt';

const jwt = new Jwt();
const saltRounds = 12;
const salt = bcrypt.genSaltSync(saltRounds);

export async function logIn(req: Request, res: Response) {
    let {username, password} = req.body;

    password = bcrypt.hashSync(password, salt);
    if (username === undefined || password === undefined)
        return sendResponse(res, 'Invalid parameters', 400)
    try {
        const targetUser = await User.findOne({username: username}).exec();
        if (targetUser.password !== password)
            return sendResponse(res, 'Invalid credentials', 401)
        return res.send({
            access_token: jwt.createAccessToken({id: targetUser.id})
        })

    } catch (e) {
        sendResponse(res, 'Invalid credentials', 401)
    }
}

export async function signUp(req: Request, res: Response) {
    let {username, password} = req.body;

    if (username === undefined || password === undefined)
        return sendResponse(res, "Invalid parameters", 400)

    const accountCheck = await User.count({
        username: username
    });

    if (accountCheck !== 0)
        return sendResponse(res, `User with username: ${username} already exist`, 400)


    const hash = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
        username: username,
        password: hash
    });

    res.send({
        access_token: jwt.createAccessToken({id: createdUser.id})
    })
}
