import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    title: {
        type: String,
        require: [ true, " El nombre es obligatorio" ],
        upperCase: true,
        trim: true,
        minLength: [ 3, "El nombre debe ser mayor a 3 caracteres" ],
        maxLength: [ 20, "El nombre no puede tener más de 20 caracteres" ],
    },
    description:{
        type: String,
        require: [ true, " La descripción es obligatoria" ],
        upperCase: true,
        trim: true,
        maxLength: [ 100, "La descripción no puede tener más de 100 caracteres" ],
    },
    code:{
        type: Number,
        require: [ true, " El código es obligatorio" ],
        unique: true,
        min: [1000, "EL código debe tener al menos 5 caracteres" ],
    },
    price:{
        type: Number,
        require: [ true, " El precio es obligatorio" ],
        min: [ 1, "El precio no puede ser negativo" ],
    },
    image: { 
        type: String, 
    },
    stock:{
        type: Number,
        require: [true, "El stock es obligatorio"],
        min: [0, "El stock no puede ser negativo"],
        }
});

export const ProductModel = model("products", ProductSchema);