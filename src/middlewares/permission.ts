import { Response, Request, NextFunction } from "express";
// Models
import IUser, { UserModel, UserRoles } from "../modelsNOSQL/userMongo";
import { HydratedDocument } from "mongoose";

export default class PermissionMiddleware {
    // Singleton
    private static instance: PermissionMiddleware;
    public static getInstance(): PermissionMiddleware {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new PermissionMiddleware();
        return this.instance;
    }

    /**
     * Verify that the current user is a contributor
     */
    public async checkIsContributor(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user: HydratedDocument<IUser> | null = await UserModel.findOne({
                awsCognito: req.aws_cognito,
            });

            if (!user) {
                throw "Failed to find user";
            }

            if (user.role === UserRoles.CONTRIBUTOR) {
                next();
            } else {
                res.status(401).send({
                    code: "UserNotContributorException",
                    message: "The logged account is not a contributor",
                });
            }
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }
}
