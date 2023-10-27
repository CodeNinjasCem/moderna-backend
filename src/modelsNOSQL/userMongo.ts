import { Schema, model } from "mongoose";

export const UserRoles = {
    ADMIN: "admin",
    USER: "user",
};

export interface IUser {
    awsCognito: string;
    name: string;
    lastName: string;
    role: string;
    email: string;
    comments: string[];
}

export const userSchema = new Schema<IUser>({
    awsCognito: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: false,
        default: UserRoles.USER,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    comments: [
        {
            type: String
        },
    ],
});

export const UserModel = model<IUser>("User", userSchema);
export default IUser;
