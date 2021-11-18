import {Request} from 'express';
import {Strategy} from 'passport-jwt';
import passport from 'passport';
import Jwt from './jwt';
import {User} from "../models";

const headerExtractor = function (req: Request) {
    let token = req.header('Authorization');
    return token ? token : null;
}

const options = {
    jwtFromRequest: headerExtractor,
    secretOrKey: new Jwt().getSecretKey()
};


const jwtStrategy = new Strategy(options, (async (payload, done) => {
    const user = await User.findById(payload.id).exec();
    return done(null, {
        username: user.username,
        id: user.id
    });
}));

passport.use(jwtStrategy);

export default passport;
