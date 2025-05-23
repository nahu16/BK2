import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { __dirname } from "./utils.js";
import userRouter from "./routes/users.routers.js";
import productRouter from "./routes/product.router.js";
import mongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/view.router.js";
import { errorHandler } from "./middlewares/error.handler.js";
import passport from "passport";
import 'dotenv/config';
import './config/passport/jwt.strategy.js';
import "./config/passport/local-strategy.js";
import "./config/passport/github.strategy.js";
import { Server } from "socket.io";
import { config as configWebsocket } from "./config/websocket.config.js";
import cartRouter from "./routes/cart.router.js";
import ticketRouter from "./routes/ticket.router.js";


const app = express();
const PORT = 8080


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));




app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const sessionConfig = {
    secret: "sessionKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 120000,
    },
    store: new mongoStore({
    mongoUrl: (process.env.MONGO_URL), 
    ttl: 120,
    }),
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use('/ticket', ticketRouter)
app.use('/cart', cartRouter);
app.use('/products', productRouter);
app.use('/users', userRouter);
app.use('/', viewsRouter);
app.use(errorHandler);


const httpServer = app.listen(PORT, ()=> {
console.log(`Server running on port ${PORT}`)
})

configWebsocket(httpServer);