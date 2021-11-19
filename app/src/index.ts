import express from 'express';
import bodyParser from "body-parser";
import passportJWT from './security /passport-strategy';

import {logIn, signUp} from './controllers/auth-conroller'
import {startWork, workTime, endWork} from './controllers/work-controller'

console.log(process.env)

const app = express();
app.use(bodyParser.json());


app.post('/auth', logIn)
app.post('/signup', signUp)

app.use(passportJWT.initialize());
app.use(passportJWT.authenticate('jwt', {session: false}))

app.get('/start-work', startWork);


app.get('/end-work', endWork);
app.get('/work-time', workTime);

app.listen(parseInt(process.env.port));