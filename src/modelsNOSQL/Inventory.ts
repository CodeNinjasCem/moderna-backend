import { Schema, model, Types } from "mongoose";

export interface IInventory {
    user_id: Types.ObjectId;
    time: Date;
    values: string[];
}

export const userSchema = new Schema<IInventory>({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User"},
    time: { type: Date, default: Date.now, required: true },
    values: [{ type: String, required: true }],
});

export const InventoryModel = model<IInventory>("Inventory", userSchema);
export default IInventory;