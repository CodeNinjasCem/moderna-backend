import { Schema, model } from "mongoose";

export enum UserRoles {
    SUBSCRIBER = "subscriber",
    CONTRIBUTOR = "contributor",
};

export enum Genders {
    MALE = "male",
    FEMALE = "female",
    NOT_DISCLOSED = "not_disclosed"
};

export interface IUser {
    aws_cognito: string;
    first_name: string;
    last_name: string;
    gender: Genders;
    role: UserRoles;
    email: string;
};

export const userSchema = new Schema<IUser>({
    aws_cognito: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: [Genders.MALE, Genders.FEMALE, Genders.NOT_DISCLOSED]
    },
    role: {
        type: String,
        required: false,
        enum: [UserRoles.CONTRIBUTOR, UserRoles.SUBSCRIBER],
        default: UserRoles.SUBSCRIBER,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

export const UserModel = model<IUser>("User", userSchema);
export default IUser;
