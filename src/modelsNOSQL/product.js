"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = exports.productSchema = exports.UserRoles = void 0;
var mongoose_1 = require("mongoose");
exports.UserRoles = {
    ADMIN: "admin",
    USER: "user",
};
exports.productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    energetic_content: {
        type: Number,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    proteins: {
        type: Number,
        required: true,
    },
    total_fat: {
        type: Number,
        required: true,
    },
    portions_per_container: {
        type: Number,
        required: true,
    },
});
exports.ProductModel = (0, mongoose_1.model)("Product", exports.productSchema);
