import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name:{
        type: String, 
        required: true,
    },
    last_name:{
        type: String, 
        required: true,
    },
    email:{
        type: String, 
        required: true,
        unique: true,
    },
    age:{
        type: Number,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    cart:{
        type: Schema.Types.ObjectId,
        ref: "carts",
    },
    role: {
        type: String,
        default: "user",
    },
    isGithub: {
        type: Boolean,
        default: false,
    }
});

export const UserModel = model("users", userSchema); 
