import { Router } from "express";
import { isAuthentication } from "../middlewares/check.autenticate.js";
import { cartController } from "../controllers/cart.controller.js";
import { passportCall } from "../middlewares/passport-call.js";
import passport from "passport";

const router = Router();

router.get("/", (req, res)=>{
    res.render("login");
});

router.get("/home", (req, res)=>{
    res.render("home");
});

router.get(
  "/carrito",
  passportCall("jwt-cookies", { session: false }),
  cartController.getUserCart
);

router.get("/registro", (req, res)=>{
    res.render("registro");
});

router.get("/errorRegistro", (req, res)=>{
    res.render("errorRegistro");
});

router.get("/errorLogin", (req, res)=>{
    res.render("errorLogin");
});

router.get("/errorAuthentication", (req, res)=>{
    res.render("errorAuthentication");
});

router.get("/api/current-user", 
    passport.authenticate("jwt-cookies", { session: false }), 
    (req, res) => {
    res.json(req.user);
});

router.get("/perfil", isAuthentication, (req, res)=>{
    const user = req.session.user;
    res.render("perfil", { user });
});

export default router;

