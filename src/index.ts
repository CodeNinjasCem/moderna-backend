import express from "express";
import cors from "cors";
import Server from "./providers/Server";
import { MONGODB_URI } from "./config";
import AuthenticationController from "./controllers/AuthenticationController";
import ProductController from "./controllers/ProductController";
import AnalyticsController from "./controllers/AnalyticsController";
import RecipeController from "./controllers/RecipeController";
import ChatGptController from "./controllers/ChatGptController";
import UserController from "./controllers/UserController";

const servidor = new Server({
    port: 8080,
    middlewares: [express.json(), express.urlencoded({ extended: true }), cors()],
    controllers: [
        ChatGptController.getInstance(),
        AuthenticationController.getInstance(),
        ProductController.getInstance(),
        AnalyticsController.getInstance(),
        RecipeController.getInstance(),
        UserController.getInstance(),
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
