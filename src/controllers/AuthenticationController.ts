import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import IUser, { UserModel } from "../modelsNOSQL/userMongo";
import { Model, HydratedDocument } from "mongoose";

class AuthenticationController extends AbstractController {
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }

    private readonly _model: Model<IUser> = UserModel;

    // Singleton
    private static instance: AuthenticationController;
    public static getInstance(): AbstractController {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new AuthenticationController("auth");
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.post("/signup", this.signup.bind(this));
        this.router.post("/verify", this.verify.bind(this));
        this.router.post("/signin", this.signin.bind(this));
        this.router.post("/getUser", this.getUser.bind(this));
        this.router.post("/forgotPassword", this.forgotPassword.bind(this));
        this.router.post("/confirmForgotPassword", this.changePassword.bind(this));
        this.router.post("/addPoints", this.addPoints.bind(this));
    }

    private async getUser(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const user: HydratedDocument<IUser> | null = await UserModel.findOne({
                email: email,
            });

            if (!user) {
                throw "Failed to find user";
            }
            res.status(200).send({ user });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async signin(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const login = await this.cognitoService.signInUser(email, password);

            const user: HydratedDocument<IUser> | null = await UserModel.findOne({
                email: email,
            });

            if (!user) {
                throw "Failed to find user";
            }

            res.status(200).send({ user: user });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }
    private async verify(req: Request, res: Response) {
        const { email, verify_code } = req.body;
        try {
            const userVerify = await this.cognitoService.verifyUser(email, verify_code);

            const user: HydratedDocument<IUser> | null = await UserModel.findOne({
                email: email,
            });

            if (!user) {
                throw "Failed to find user";
            }

            res.status(200).send({ user: user });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async signup(req: Request, res: Response) {
        const { email, password, first_name, last_name, gender, role } = req.body;
        try {
            const userMongo: HydratedDocument<IUser> | null = await UserModel.findOne({
                email: email,
            });

            if (userMongo) {
                throw "Email already registered";
            }

            // Crear el usuario de cognito
            const user = await this.cognitoService.signUpUser(email, password, [
                {
                    Name: "email",
                    Value: email,
                },
            ]);
            // Creación del usuario dentro de la BDNoSQL-MongoDB
            const created_user: HydratedDocument<IUser> | null =
                await this._model.create(
                    new UserModel({
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        aws_cognito: user.UserSub,
                        gender: gender,
                        role: role
                    })
                );

            if (!created_user) {
                throw "Failed to create user in MongoDB!";
            }
            res.status(201).send({ message: "ok" });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const forgotten_code = await this.cognitoService.forgotPassword(email);
            res.status(200).send({ message: forgotten_code });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async changePassword(req: Request, res: Response) {
        const { email, code, new_password } = req.body;
        try {
            const change = await this.cognitoService.confirmForgotPassword(
                email,
                code,
                new_password
            );
            res.status(200).send({ message: "Password was changed succesfully!" });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async addPoints(req: Request, res: Response) {
        const { email, points } = req.body;
        
        try {
            const user: HydratedDocument<IUser> | null = await UserModel.findOne({
                email: email,
            });

            if (!user) {
                throw "Failed to find user";
            }

            const updated_user: HydratedDocument<IUser> | null =
                await UserModel.findOneAndUpdate(
                    { email: email },
                    { points: user.points + points }
                );

            if (!updated_user) {
                throw "Failed to update user";
            }

            res.status(200).send({ message: "Points were added succesfully!" });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }
}

export default AuthenticationController;
