import { userRepository } from "../repository/user.repository.js";
import { cartRepository } from "../repository/cart.repository.js";

class UserController{
    constructor(repository){
        this.repository = repository;
    }

    create = async (req, res, next) => {
        try {
            const user = req.user;
            req.session.user = user;
            res.redirect('/home')
        } catch (error) {
            return res.redirect("/errorRegistro");
        }
    };

    login = async (req, res, next) =>{
        try {
            const id = req.session.passport.user;
            const user = await userRepository.getById(id);
            req.session.user = user;             
            
            const token = this.repository.generateToken(user);  
            res.cookie("token", token, { httpOnly: true });
            
        if (user.role === "admin") {
            return res.redirect("/products/create");
            } else if (user.role === "user") {
            return res.redirect("/home")};
        } catch (error) {
            return res.redirect("/errorLogin");
        }
    };
    
    githubResponse = async (req, res, next) => {
        try {
            const user = req.user;
            res.redirect('/home')
        } catch (error) {
            return res.redirect("/errorLogin");
        }
        };



    getAll = async (req, res, next) => {
        try {
            const response = await this.repository.getAll();
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
    
    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const response = await this.repository.getById(id);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
    
    update = async (req, res, next) => {       
        try {
            const userId = req.session.user._id;
            const response = await this.repository.update(userId, req.body);
            req.session.user=response; 
            res.redirect('/perfil')
        } catch (error) {
            next(error);
        }
    };
    
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const response = await this.repository.delete(id);
            res.status(200).json(response);
        } catch (error) {
        next(error);
        }
    };    

    logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Error al cerrar sesión" });
        }
        res.clearCookie("token");
        res.redirect('/');
    });
}
}

export const userController = new UserController(userRepository);