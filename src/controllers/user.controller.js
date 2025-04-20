import { userService } from "../services/user.service.js";

class UserController{
    constructor(service){
        this.service = service;
    }

    create = async (req, res, next) => {
        try {
            const response = await this.service.create(req.body);
            if (!response) return res.redirect("/errorRegistro");
            return res.redirect("/");
        } catch (error) {
            //next(error);
            return res.redirect("/errorRegistro");
        }
    };

    login = async (req, res) =>{
        try {
            const { email, password } = req.body;
            const user = await this.service.login(email,password);
            if (user) {
                req.session.email = email;
                req.session.password = password;
                return res.redirect("/perfil");
            }
            return res.redirect("/errorlogin");
        } catch (error) {
            //console.error("Login error:", error.message);
            return res.redirect("/errorLogin");
        }

    };
    
    getAll = async (req, res, next) => {
        try {
            const response = await this.service.getAll();
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
    
    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const response = await this.service.getById(id);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
    
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const response = await this.service.update(id, req.body);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
    
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const response = await this.service.delete(id);
            res.status(200).json(response);
        } catch (error) {
        next(error);
        }
    };    
}

export const userController = new UserController(userService);