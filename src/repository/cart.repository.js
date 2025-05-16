import { cartDaoMongo } from "../daos/mongodb/cart-dao.js";
import CustomError from "../utils/custom.error.js";
import { productRepository } from "./product.repository.js";

class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    create = async (body) => {
        try {
            const response = await this.dao.create(body);
            if (!response) throw new CustomError('Error creating product', 404);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getById = async (id) => {
        try {
            const response = await this.dao.getById(id);
            if (!response) throw new CustomError("Carrito no encontrado", 404);
            return response;
        } catch (error) {
            throw error;
        }
    };

    existProdInCart = async (cartId, prodId) => {
        try {
            const response = await this.dao.existProdInCart(cartId, prodId);
            if (!response) throw new CustomError("No se encontro el producto en el carrito", 404);
            return response;
        } catch (error) {
            throw new Error(error);
        }
    };

    addProdToCart = async (cartId, prodId) => {
        try {
            const existCart = await this.getById(cartId);
            const existProd = await productRepository.getById(prodId);
            return await this.dao.addProdToCart(existCart._id, existProd._id);
        } catch (error) {
            throw new Error(error);
        }
    }

    removeProdToCart = async (cartId, prodId) => {
        
        try {
            const existCart = await this.getById(cartId);
            const realCart = existCart._id.toString();            
            const existProdInCart = await this.existProdInCart(cartId, prodId);              
            const praoductToRemove= existProdInCart.products.find(p => p.product._id.toString() === prodId);
            const realProd = praoductToRemove.product._id.toString();      
            return await this.dao.removeProdToCart(realCart, realProd);
        } catch (error) {
            throw new Error(error);
        }
    }


    updateProdQuantityToCart = async (cartId, prodId, quantity) => {
    try {
        await this.getById(cartId);
        return await this.dao.updateProdQuantityToCart(cartId, prodId, quantity);
    } catch (error) {
        throw new Error(error);
    }
}

    updateProdpriceToCart = async (cartId, prodId, price) => {
    try {
        await this.getById(cartId);
        return await this.dao.updateProdpriceToCart(cartId, prodId, price);
    } catch (error) {
        throw new Error(error);
    }
}

    clearCart = async (cartId, userId) => {
        console.log(cartId, userId);
        
        try {
            const existCart = await this.getById(cartId);
            const realCart = existCart._id.toString();
            
            return await this.dao.clearCart(realCart, userId);
        } catch (error) {
            throw new Error(error);
        }
    };

    
}

export const cartRepository = new CartRepository(cartDaoMongo);