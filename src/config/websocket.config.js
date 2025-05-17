import { Server } from "socket.io";
import { productRepository } from "../repository/product.repository.js";
import { cartRepository } from "../repository/cart.repository.js";
import { ticketRepository } from "../repository/ticket.repository.js";

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
    const products = await productRepository.getAll();
    socket.emit("products-list", { products });
    
    socket.on("insert-product", async (data) => {
        try {
            await productRepository.create(data);
            const updatedProducts = await productRepository.getAll();
            socketServer.emit("products-list", { products: updatedProducts });
        } catch (error) {
            socket.emit("error-message", { message: error.message });
        }
    });

     socket.on("update-product", async({ id, productData })=>{
        try {
            await productRepository.update(id, productData);
            const updatedProducts = await productRepository.getAll();
            socketServer.emit("products-list", { products: updatedProducts });
        } catch (error) {
            socket.emit("error-message", { message: error.message });
        }
    });

    socket.on("delete-product", async ({ id }) => {
        try {
            await productRepository.delete(id);
            const updatedProducts = await productRepository.getAll();
            socketServer.emit("products-list", { products: updatedProducts });
        } catch (error) {
            socket.emit("error-message", { message: error.message });
        }
    });

    socket.on("add-product", async ({ id, productId, quantity }) => {
        try {
            await cartRepository.updateProdQuantityToCart(id, productId, quantity);
            const updatedCart = await cartRepository.getById(id);
            socketServer.emit("products-cart", { products: updatedCart.products });
        } catch (error) {
            socket.emit("error-message", { message: error.message });
        }
    });

        socket.on("update-price", async ({ id, productId, precioFinal }) => {
        try {
            await cartRepository.updateProdpriceToCart(id, productId, precioFinal);
            const updatedCart = await cartRepository.getById(id);
            socketServer.emit("products-cart", { products: updatedCart.products });
        } catch (error) {
            socket.emit("error-message", { message: error.message });
        }
    });

        socket.on("delete-product", async ({ id, productId }) => {            
        try {
            await cartRepository.removeProdToCart(id, productId);            
            const updatedCart = await cartRepository.getById(id);
            socketServer.emit("products-cart", { products: updatedCart.products });
        } catch (error) {
            socket.emit("error-message", { message: error.message });
        }
    });
        socket.on("clear-cart", async ({ id, user }) => {        
    try {
        await cartRepository.clearCart(id, user);
        console.log(id, user);
        
        const newCart = await cartRepository.create({ products: [] });
        await UserModel.findByIdAndUpdate(user, { cart: newCart._id });
        socket.emit("new-cart", { cartId: newCart._id.Server });
    } catch (error) {
        socket.emit("error-message", { message: error.message });
    }
    });
        socket.on("generate-ticket", async ({ user, id }) => {

            try {
                const ticket = await ticketRepository.generateTicket( user, id );                
                socket.emit("ticket-generated", { ticket });
            } catch (error) {
                socket.emit("error-message", { message: error.message });
            }
        });
});
};