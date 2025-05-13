import { productService } from "../services/product.service.js";

class ProductController{
    constructor(service){
        this.service = service;
    }

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
    
/*       create = async (req, res, next) => {
        try {
          const response = await productService.create(req.body);
          console.log(response);
          //res.status(201).json(response);
          res.render("/products/create");
        } catch (error) {
          res.status(500).json("estamos aca?");
          //next(error);
        }
      }; */
    create = async (req, res, next) => {
        try {
          const productData = {
            ...req.body,
            image: req.file?.filename || "default.png", // si no se subió imagen, usa una por defecto
          };
        const response = await productService.create(productData);
        console.log(response);
        res.redirect("/products/create"); // o donde quieras redirigir luego de crear
        } catch (error) {
        res.status(500).json({ error: error.message });
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
    
export const productController = new ProductController(productService);
