import { productRepository } from "../repository/product.repository.js";

class ProductController{
    constructor(repository){
        this.repository = repository;
    }

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

    create = async (req, res, next) => {
        try {
          const productData = {
            ...req.body,
            image: req.file?.filename || "default.png",
          };
        const response = await productRepository.create(productData);
        console.log(response);
        res.redirect("/products/create");
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    };
      update = async (req, res, next) => {
        try {
          const { id } = req.params;
          const updatedData = req.body;
          const result = await this.repository.update(id, updatedData);
          res.status(200).json(result);
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
}
    
export const productController = new ProductController(productRepository);
