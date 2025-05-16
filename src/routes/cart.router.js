import { Router } from "express";
import { passportCall } from "../middlewares/passport-call.js";
import { cartController } from "../controllers/cart.controller.js";

const router = Router();

router.get(
  "/carrito",
  cartController.getUserCart
);

router.get(
  "/:id",  
  cartController.getById
);

router.post(
  "/:id",  
  cartController.getById
);

router.post(
  "/",
  cartController.create
);

router.put(
  "/:id",
  cartController.update
);

router.delete(
  "/:id",
  [passportCall("jwt", { session: false })],
  cartController.delete
);

router.post(
  "/products/:idProd",
    cartController.addProdToCart
);

router.delete(
  "/:idCart/products/:idProd",
  cartController.removeProdToCart
);

router.put(
  "/:idCart/products/:idProd",
  cartController.updateProdQuantityToCart
);

router.delete(
  "/clear/:idCart",
  cartController.clearCart
);


export default router;