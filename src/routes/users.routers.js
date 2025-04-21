import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import passport, { Passport } from "passport";
const router = Router();

router.post("/register", 
    passport.authenticate("register",{ failureRedirect:"/errorRegistro" }), 
    userController.create);


router.post("/login", 
    passport.authenticate("login",{ failureRedirect:"/errorLogin" }),
    userController.login);

export default router;