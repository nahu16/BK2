import { cartRepository } from "../repository/cart.repository.js";
import { createResponse } from "../utils.js";

class CartController {
  constructor(repository) {
    this.repository = repository;
  }

  addProdToCart = async (req, res, next) => {
    try {
      const { cart } = req.user;
      const { idProd } = req.params;
      const newProdToUserCart = await this.repository.addProdToCart(
        cart,
        idProd
      );
      createResponse(res, 200, newProdToUserCart);
    } catch (error) {
      next(error);
    }
  };

  removeProdToCart = async (req, res, next) => {
    try {
      const { idCart } = req.params;
      const { idProd } = req.params;
      const delProdToUserCart = await this.repository.removeProdToCart(
        idCart,
        idProd
      );
      createResponse(res, 200, {
        msg: `product ${delProdToUserCart._id} deleted to cart`,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProdQuantityToCart = async (req, res, next) => {   
    try {
      const { idCart } = req.params;
      const { idProd } = req.params;
      const { quantity } = req.body;
      const updateProdQuantity = await this.repository.updateProdQuantityToCart(
        idCart,
        idProd,
        quantity
      );
      
      createResponse(res, 200, updateProdQuantity);
    } catch (error) {
      next(error);
    }
  };

  clearCart = async (req, res, next) => {
    try {
      const { idCart } = req.params;
      const clearCart = await this.repository.clearCart(idCart);
      createResponse(res, 200, clearCart);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const data = await this.repository.getAll();
      createResponse(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.repository.getById(id);
      createResponse(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const data = await this.repository.create(req.body);
      createResponse(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.repository.update(id, req.body);
      createResponse(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.repository.delete(id);
      createResponse(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  getUserCart = async (req, res) => {
    try {

        const user = req.user;
        const cart = await cartRepository.getById(user.cart); // o como tengas instanciado tu servicio/repo
            if (!cart) {
            return res.status(404).send("Carrito no encontrado");
            }
        res.render("carrito", {
            user,
            cartId: cart._id.toString(), // importante para usarlo en el JS
          });
        
    } catch (error) {
        res.status(500).send("Error al obtener el carrito");
    }
}
}

export const cartController = new CartController(cartRepository)
