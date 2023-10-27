import { Schema, model, Types } from "mongoose";

export interface IRecipe {
    user_id: Types.ObjectId;
    product: Types.ObjectId;
    time: Date;
    recipe_name: string;
    recipe_text: string;
    total_calores: number;
    total_protein: number;
    total_portion: number;
    total_fat: number;
    avg_cost: number;
}

export const userSchema = new Schema<IRecipe>({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User"},
    product: { type: Schema.Types.ObjectId, required: true, ref: "Product"},
    time: { type: Date, default: Date.now, required: true },
    recipe_name: { type: String, required: true },
    recipe_text: { type: String, required: true },
    total_calores: { type: Number, required: true },
    total_protein: { type: Number, required: true },
    total_portion: { type: Number, required: true },
    total_fat: { type: Number, required: true },
    avg_cost: { type: Number, required: true },
});

export const RecipeModel = model<IRecipe>("Recipe", userSchema);
export default IRecipe;