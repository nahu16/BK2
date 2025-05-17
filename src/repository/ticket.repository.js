import { ticketDaoMongo } from "../daos/mongodb/ticket-daos.js";
import CustomError from "../utils/custom.error.js";
import { cartRepository } from "./cart.repository.js";
import { productRepository } from "./product.repository.js";
import { userRepository } from "./user.repository.js";

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  generateTicket = async (user, id) => {   
    try {
      const cart = await cartRepository.getById(id);
      const userCart = await userRepository.getById(user);

      
      let amountAcc = 0;
      for (const prod of cart.products) {
        const idProd = prod.product._id;
        const priceProd = prod.product.price;


        const total = cart.products.reduce((acc, prod) => {
        return acc + prod.quantity * prod.product.price;
        }, 0);
        amountAcc += total;       
      }

      const ticket = await this.dao.create({
        code: `${Math.random() * 1000}`,
        purchase_datetime: new Date().toLocaleString(),
        amount: amountAcc,
        purchaser: userCart.email,
        
        
      });
      
      return ticket;
      await cartRepository.clearCart(idProd , user);
    } catch (error) {
      throw new Error(error);
    }
  };
}

export const ticketRepository = new TicketRepository(ticketDaoMongo);
