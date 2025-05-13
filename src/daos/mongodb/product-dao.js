import MongoDao from "./mongo-dao.js";
import { ProductModel } from "./models/product.model.js";

/* class ProductDaoMongo extends MongoDao{
    constructor(model) {
        super(model);
    }
} */

export default class ProductDao extends MongoDao {
    constructor(model) {
        super(model);
    }
    
    insertOne = async (data)=> {
        try {
            const product = await this.ProductModel.create(data);
            return product;
        } catch (error) {
            throw new Error(error)        
        }
    }
};

export const productDao = new ProductDao(ProductModel);