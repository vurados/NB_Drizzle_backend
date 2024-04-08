// ////const {User} = require('../models')
// import { Strategy } from 'passport-jwt'
// const ExtractJwt = require('passport-jwt').ExtractJwt
import fs from 'fs'
import path from 'path'
import { PassportStatic } from 'passport'
import { getUserById } from '../drizzle/actions/user'
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt

import JwtPassport, { StrategyOptionsWithRequest } from 'passport-jwt'
import { User } from '../drizzle/schema/user'
const JwtStrategy = JwtPassport.Strategy
// const Strategy = require('passport-jwt').Strategy

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const pathToKey = path.join(__dirname.slice(1), 'id_rsa_pub.pem')
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8')

export type Payload = {
    sub: number,
    iat: number
}

const cookieExtractor = function(req: any) {
    // console.log('req.cookie from cookie extractor:  ',req.cookies);
    let token = null
    if (req && req.cookies['jwt']?.token) {
        token = req.cookies['jwt'].token
    }
    return token;
};

const options: StrategyOptionsWithRequest = {
    secretOrKey: PUB_KEY,
    jwtFromRequest: cookieExtractor,
    algorithms: ['RS256'],
    passReqToCallback: true
    // jsonWebTokenOptions: {user: {id:0, username: ''}}
}

export default (passport: PassportStatic) => {
    passport.use(new JwtStrategy(options, (req: any, payload: Payload, done: any) => {
        console.info("🚀 ~ file: pasport_jwt.js:31 ~ strategy ~ payload:", JSON.stringify(payload))
        getUserById(payload.sub).then((user: User) => {
            if(user){
                // req.user = user
                done(null, user)
            }else{
                done(null, false)
            }
        }).catch((err) => {
            console.error(err);
            done(err, null)})
    }))
}