import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { __dirname } from "./utils.js";
import userRouter from "./routes/users.routers.js";
import mongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/view.router.js";
import { initMongoDB } from "./daos/mongodb/connection.js";
import { errorHandler } from "./middlewares/error.handler.js";
import passport from "passport";
import "./config/passport/local-strategy.js";

const app = express();
const PORT = 8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const sessionConfig = {
    secret: "sessionKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000,
    },
    store: new mongoStore({
    mongoUrl: 'mongodb+srv://nahuelanadon6:1234@cluster2.1boxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2',
    ttl: 60,
    }),
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

initMongoDB()
    .then(()=>console.log('Conectado a mongoDB'))
    .catch((error)=>console.log(error));

    app.use('/users', userRouter);
    app.use("/", viewsRouter);
app.use(errorHandler);

app.listen(PORT, ()=> {
console.log(`Server running on port ${PORT}`)
})