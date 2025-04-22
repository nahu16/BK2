import passport from "passport";
import { Strategy as StrategyGithub } from "passport-github2";
import { userService } from "../../services/user.service.js";
import "dotenv/config.js";

const strategyConfig={
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8080/users/login",
}

const registerOrLogin = async (accessToken, refreshToken, profile, done)=>{
    console.log(profile);
    try {
        const email = profile._json.email;
        const user = await userService.getByEmail(email);
        if(user) return done(null, user);

        const newUser = await userService.create({
            first_name: profile._json.name.split(' ')[0],
            last_name: profile._json.family_name.split(' ')[1],
            email,
            age: 0,
            password: " ",
            isGithub: true,
        });
        return done(null, newUser);
    } catch (error) {
        return done(error, false, { message: error.message});
    }
};


passport.use("github", new StrategyGithub (strategyConfig, registerOrLogin));

passport.serializeUser((user, done)=>{
    try {
        done (null, user._id);
    } catch (error) {
        done(error);
    }
});

passport.deserializeUser(async(id, done)=>{
    try {
        const user = await userService.getById(id);
        return done (null, user);
    } catch (error) {
        done(error);
    }
});
