import { Schema, model, Types } from "mongoose";

export interface IRecipe {
    product_id: Types.ObjectId;
    ingredients: string[];
    time: Date;
    recipe_name: string;
    recipe_text: string;
    total_calories: number;
    total_protein: number;
    total_portions: number;
    total_fat: number;
    avg_cost: number;
}

export const recipeSchema = new Schema<IRecipe>({
    product_id: { type: Schema.Types.ObjectId, required: true, ref: "Product"},
    ingredients: { type: [String], required: true},
    time: { type: Date, default: Date.now, required: true },
    recipe_name: { type: String, required: true },
    recipe_text: { type: String, required: true },
    total_calories: { type: Number, required: true },
    total_protein: { type: Number, required: true },
    total_portions: { type: Number, required: true },
    total_fat: { type: Number, required: true },
    avg_cost: { type: Number, required: true },
});

export const RecipeModel = model<IRecipe>("Recipe", recipeSchema);
export default IRecipe;