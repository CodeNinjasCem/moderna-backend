import express from "express";
import cors from "cors";
import Server from "./providers/Server";
import { MONGODB_URI } from "./config";
import AuthenticationController from "./controllers/AuthenticationController";
import ProductController from "./controllers/ProductController";

const servidor = new Server({
    port: 8080,
    middlewares: [express.json(), express.urlencoded({ extended: true }), cors()],
    controllers: [
        AuthenticationController.getInstance(),
        ProductController.getInstance(),
    ],
    env: "development",
    mongoUri: MONGODB_URI,
});

declare global {
    namespace Express {
        interface Request {
            aws_cognito: string;
            token: string;
        }
    }
}

servidor.connect();

servidor.init();
