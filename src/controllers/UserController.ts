import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import { Model, HydratedDocument } from "mongoose";
import { RequiresAttributes } from "aws-sdk/clients/ecs";
import { UserModel } from "../modelsNOSQL/userMongo";

class UserController extends AbstractController {
    protected validateBody(type: any) {
        throw new Error("Method nto implemented yet!");
    }

    private static instance: UserController;
    public static getInstance(): AbstractController {
        if(!this.instance){
            this.instance = new UserController("user");
        }
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.post("/addPoints", this.addPoints.bind(this));
        
    }
    private async addPoints(req: Request, res: Response){
        try {
            let user_id = req.body.user_id;
            let increment_points = req.body.points
            console.log(req.body);
            UserModel.updateOne({_id: user_id}, {$inc: {points: increment_points} });

            res.status(200).send({
                status: "Success",
            });

        }catch (errorMessage){
            res.status(400).send({
                status: "Fail",
                errorMessage: errorMessage
            });
        }
    }
}

export default UserController;