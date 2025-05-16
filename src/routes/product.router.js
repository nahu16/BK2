import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { checkRole } from "../middlewares/check.role.js";
import passport from "passport";
import { upload } from "../config/multer.config.js";


const router = Router();

router.get("/", productController.getAll);
router.post(
    "/create",
    (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.redirect("/errorLogin");
  },
    checkRole("admin"),
    upload.single("image"),
    productController.create
);

router.get("/create", (req, res)=>{
    res.render("products");
});
router.get("/:id", productController.getById);

router.put("/:id", 
      (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.redirect("/errorLogin");
  },
    checkRole("admin"),
    upload.single("image"),
    productController.update
);

router.delete("/:id", productController.delete);

export default router;
