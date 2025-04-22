import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import passport from "passport";
import { checkRole } from "../middlewares/check.role.js";
import { passportCall } from "../middlewares/passport-call.js";

const router = Router();

router.post("/register", 
    passport.authenticate("register",{ failureRedirect:"/errorRegistro" }), 
    userController.create);

router.get("/register-github",
    passportCall("github", { scope: ["user:email"] })
);

router.post("/login", 
    passport.authenticate("login",{ failureRedirect:"/errorLogin"}),
    userController.login);

router.get("/login", 
    passportCall("github",{ scope: ["user:email"] }),
    userController.login);

router.get(
    "/private-cookies-admin",
    passport.authenticate("jwt-cookies"),
    checkRole("admin"),
    (req, res) => res.send(req.user)
  );
export default router;