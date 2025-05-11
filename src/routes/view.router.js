import { Router } from "express";
import { isAuthentication } from "../middlewares/check.autenticate.js";


const router = Router();

router.get("/", (req, res)=>{
    res.render("login");
});

router.get("/home", (req, res)=>{
    res.render("home");
});

router.get("/carrito", isAuthentication, (req, res)=>{
    res.render("carrito");
});

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

router.get("/perfil", isAuthentication, (req, res)=>{
    const user = req.session.user;
    res.render("perfil", { user });
});

export default router;

