import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import { HydratedDocument, Model } from "mongoose";
import IUser, { UserModel } from "../modelsNOSQL/userMongo";

class CommentController extends AbstractController {
    private readonly _commentModel: Model<IUser> = UserModel;
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }

    // Singleton
    private static instance: CommentController;
    public static getInstance(): AbstractController {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new CommentController("comment");
        return this.instance;
    }

    // Configurar las rutas del controlador
    protected initRoutes(): void {
        this.router.post(
            "/createComment",
            this.authMiddleware.verifyToken,
            this.createComment.bind(this)
        );
        this.router.get("/getComments", this.getComments.bind(this));
    }

    // Los métodos asociados a las rutas
    private async createComment(req: Request, res: Response) {
        try {
            const { comment } = req.body;

            const user: HydratedDocument<IUser> | null = await UserModel.findOne({
                awsCognito: req.aws_cognito,
            });

            if (!user) {
                throw "Failed to find user";
            }

            if (comment) {
                user.comments.push(comment);
                await user.save();
            } else {
                throw "Comment is empty";
            }

            res.status(200).send({ message: "ok" });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async getComments(req: Request, res: Response) {
        try {
            const users: Array<HydratedDocument<IUser>> | null = await UserModel.find(
                {
                    comments: { $exists: true, $ne: [] },
                }
            );

            if (!users) {
                throw "Failed to find comments";
            }

            const commentObjects = users.flatMap((user) =>
                user.comments.map((comment) => ({
                    name: user.name,
                    lastName: user.lastName,
                    comment: comment,
                }))
            );

            res.status(200).send({ commentObjects: commentObjects });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }
}

export default CommentController;
