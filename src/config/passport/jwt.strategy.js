import passport from 'passport';
import { ExtractJwt, Strategy as StrategyJWT} from 'passport-jwt';
import { userRepository } from '../../repository/user.repository.js';
import "dotenv/config.js";

const cookieExtractor = (req) => {
    return req.cookies.token;
};
  
const strategyConfigCookies = {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_SECRET
};

const verifyToken = async (jwt_payload, done) => {
    if (!jwt_payload) return done(null, false, { messages: "Invalid Token" });
    return done(null, jwt_payload);
  };

passport.use('jwt-cookies', new StrategyJWT(strategyConfigCookies, verifyToken));

passport.serializeUser((user, done) => {
    try {
      done(null, user._id);
    } catch (error) {
      done(error);
    }
});
  
passport.deserializeUser(async (id, done) => {
    try {
      const user = await userRepository.getById(id);    
      return done(null, user);
    } catch (error) {
      done(error);
    }
});