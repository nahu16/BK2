import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import passport from "passport";
import { checkRole } from "../middlewares/check.role.js";

const router = Router();

router.post("/register", 
    passport.authenticate("register",{ failureRedirect:"/errorRegistro" }), 
    userController.create);


router.post("/login", 
    passport.authenticate("login",{ failureRedirect:"/errorLogin"}),
    userController.login);

router.get(
    "/private-cookies-admin",
    passport.authenticate("jwt-cookies"),
    checkRole("admin"),
    (req, res) => res.send(req.user)
  );
export default router;