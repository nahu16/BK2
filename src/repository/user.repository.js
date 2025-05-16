import CustomError from "../utils/custom.error.js";
import persistence from "../daos/persistence.js";
import { createHash, isValidPassword } from "../utils/user.utils.js";
import jwt from "jsonwebtoken";

const { userDao } = persistence;

class UserRepository { 
    constructor(dao){
        this.dao = dao;
    }

    create = async (body) => {
        try {
            const { email, password } = body;
            const existUser = await this.dao.getByEmail(email);
            if (existUser) throw new CustomError ("El usuario ya existe", 400);
            const response = await this.dao.create({
                ...body,
                password: createHash(password),
            });
            if(!response) throw new CustomError("Error al registrar el usuario", 400);
            return response;
        } catch (error) {
            throw error;
        }
        };

    login = async (email, password, role) => {
        try {
            const userExist = await this.dao.getByEmail(email);
            if (!userExist) throw new CustomError ("Credenciales incorrectas", 400);
            const passValid = isValidPassword(password, userExist.password);
            if(!passValid) throw new CustomError(" Credenciales incorrectas", 400);
            return userExist;
        } catch (error) {
            throw error;
        }
        };

    getAll = async () => {
        try {
            return await this.dao.getAll();
        } catch (error) {
            throw new Error(error);
        }
        };

    getById = async (id) => {
    try {
        const response = await this.dao.getById(id);
        if (!response) throw new CustomError('User not found', 404);
        return response;
    } catch (error) {
        throw error;
    }
    };

    getByEmail = async (email) => {
        try {
          return await this.dao.getByEmail(email);
        } catch (error) {
          throw error;
        }
    };

    update = async (id,  body) => {
    try {
        const response = await this.dao.update(id, body);
        if (!response) throw new CustomError('User not found', 404);
        return response;
    } catch (error) {
        throw error;
    }
    };

    delete = async (id) => {
        try {
            const response = await this.dao.delete(id);
        if (!response) throw new CustomError('User not found', 404);
        return response; 
        } catch (error) {
            throw error;
        }
    };

    generateToken = (user) => {
        const payload = {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          role: user.role,
          cart: user.cart,
        };
        return jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "20m",
        });  
    };
    
    
}

export const userRepository = new UserRepository(userDao);