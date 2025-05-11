import { userDao as userDaoMongo } from "./mongodb/user-dao.js";
import { productDao as productDaoMongo } from "./mongodb/product-dao.js";
import { initMongoDB } from "./mongodb/connection.js";

let productDao = null;
let userDao = null;

let persistence = process.argv[2];

switch (persistence) {
    case "mongo":
        initMongoDB()
            .then(()=>console.log('Conectado a mongoDB'))
            .catch((error)=>console.log(error));
        productDao = productDaoMongo;
        userDao = userDaoMongo;
        break;
    default:
        initMongoDB()
            .then(()=>console.log('Conectado a mongoDB'))
            .catch((error)=>console.log(error));
        productDao = productDaoMongo;
        userDao = userDaoMongo;
        break;
}

export default { productDao, userDao };