// * Planing_consumption

// user_id:
// time: 
// number_of_members:
// number_of_days:

import { Schema, model, Types } from "mongoose";

export interface IPlaningConsumption {
    user_id: Types.ObjectId;
    time: Date;
    number_of_members: number;
    number_of_days: number;
    // recipe_id: [Types.ObjectId];
}

export const userSchema = new Schema<IPlaningConsumption>({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User"},
    time: { type: Date, default: Date.now, required: true },
    number_of_members: { type: Number, required: true },
    number_of_days: { type: Number, required: true },
    // recipe_id: [{ type: [Schema.Types.ObjectId], default: [], required: true, ref: "Recipe"}],
});

export const PlaningConsumptionModel = model<IPlaningConsumption>("PlaningConsumption", userSchema);
export default IPlaningConsumption;