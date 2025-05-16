import passport from "passport";
import { Strategy } from "passport-local";
import { userRepository } from "../../repository/user.repository.js";
import { cartRepository } from "../../repository/cart.repository.js";

const strategyConfig = {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}

const register = async (req, email, password, done) => {
    try {
        const newCart = await cartRepository.create({ products: [] });
        const userData = {
            ...req.body,
            cart: newCart._id,
        };

        const newUser = await userRepository.create(userData);

        return done(null, newUser);
    } catch (error) {
        return done(error, false, { message: error.message });
    }
};

const login = async (req, email, password, done) => {
    try {
        const user = await userRepository.login(email, password);        
        if (!user) {
            return done(null, false, { message: "Credenciales incorrectas" });
        }
const role = user.role?.toLowerCase().trim();
const isAdmin = role === "admin";
const hasCart = !!user.cart;

if (!hasCart && !isAdmin) {
    const newCart = await cartRepository.create({ products: [] });
    user.cart = newCart._id;
    await user.save();
}        return done(null, user);
    } catch (error) {
        return done(error, false, { message: error.message });
    }
};

const registerStrategy = new Strategy(strategyConfig, register);
const loginStrategy = new Strategy(strategyConfig, login);

passport.use("register", registerStrategy);
passport.use("login", loginStrategy);

passport.serializeUser((user, done) => {
    try {
        done(null, user._id);
    } catch (error) {
        done(error);
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userRepository.getById(id).populate("cart");
        return done(null, user);
    } catch (error) {
        done(error);
    }
});
