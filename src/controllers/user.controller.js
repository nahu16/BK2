import { userService } from "../services/user.service.js";

class UserController{
    constructor(service){
        this.service = service;
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
            const user = await userService.getById(id);
            req.session.user = user;
            const token = this.service.generateToken(user);  
            res.cookie("token", token, { httpOnly: true });
            res.redirect('/home')
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
            const userId = req.session.user._id;
            const response = await this.service.update(userId, req.body);
            req.session.user=response; 
            res.redirect('/perfil')
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