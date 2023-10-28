import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import IUser, { UserModel } from "../modelsNOSQL/userMongo";
import { Model, HydratedDocument } from "mongoose";
import OpenAI from "openai";
import IRecipe, { RecipeModel } from "../modelsNOSQL/Recipe";

class ChatGptController extends AbstractController {
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }

    private readonly _openai = new OpenAI();
    private readonly _mongoModel = RecipeModel;

    // Singleton
    private static instance: ChatGptController;
    public static getInstance(): AbstractController {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ChatGptController("chatgpt");
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.post("/autocomplete", this.autocomplete.bind(this));
        this.router.post("/createRecipe", this.createRecipe.bind(this));
    }

    private async callModel(prompt: string): Promise<any> {
        const response = await this._openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo"
        });
        return response;
    }

    private extractTextFromModelResponse(response: any): string {
        return response.choices[0].message.content;
    }

    private async autocomplete(req: Request, res: Response) {
        try {
            const { prompt } = req.body;

            const response = await this.callModel(prompt);

            res.status(200).send({ response });
        } catch (error: any) {
            res.status(400).send({ code: error.code, message: error.message });
        }
    }

    private getRecipePrompt(productName: string): string {
        return `¿Cual es una receta que usa ${productName}? Incluye la `
        + `cantidad de calorias por porcion, la cantidad de proteinas por `
        + `porcion, la cantidad de grasas, la cantidad de porciones para `
        + `las que alcanza, y finalmente el precio promedio en pesos `
        + `mexicanos.`;
    }

    private getRecipeMetadataPrompt(recipe: string): string {
        return `Ejemplo 1: ### Receta: Fettuccine Alfredo\n\nIngredientes:\n- `
        + `200g de Fettuccine La Moderna\n- 100g de mantequilla\n- 1 taza de `
        + `crema para batir\n- 1 taza de queso parmesano rallado\n- Sal y `
        + `pimienta al gusto\n- Perejil picado para decorar\n\nCalorías por `
        + `porción: 600 kcal\nProteínas por porción: 15g\nGrasas por porción: `
        + `40g\nPorciones: 4 personas\nPrecio promedio: $25 pesos mexicanos\n\n`
        + `Instrucciones:\n1. Cocina el Fettuccine La Moderna siguiendo las `
        + `instrucciones del paquete. \n2. En una sartén grande, derrite la `
        + `mantequilla a fuego medio. Agrega la crema para batir y cocina `
        + `durante 2 minutos.\n3. Agrega el queso parmesano rallado y mezcla `
        + `hasta que se derrita por completo y la salsa esté suave.\n4. Añade `
        + `sal y pimienta al gusto. \n5. Escurre la pasta cocida y añádela a `
        + `la sartén con la salsa. Mezcla bien para cubrir la pasta con la `
        + `salsa.\n6. Sirve el Fettuccine Alfredo caliente, decorado con `
        + `perejil picado.\n\n¡Disfruta de este delicioso Fettuccine Alfredo `
        + `casero! Los datos de esta receta son: {\n    \"title\": \"`
        + `Fettuccine Alfredo\",\n    \"ingredients\": [\n        \"100g de `
        + `mantequilla\",\n        \"1 taza de crema para batir\",\n        \"`
        + `1 taza de queso parmesano rallado\",\n        \"Sal y pimienta al `
        + `gusto\",\n        \"Perejil picado para decorar\"\n    ],\n    \"`
        + `total_calories\": 600,\n    \"total_protein\": 15,\n    \"total_fat`
        + `\": 40,\n    \"total_portions\": 4,\n    \"avg_cost\": 25\n}\n\n###`
        + `\nEjemplo 2: ### ${recipe} Los datos de esta receta son: `;
    }

    private async createRecipe(req: Request, res: Response) {
        try {
            const { product_id } = req.body;
            const recipePrompt: string = this.getRecipePrompt(product_name);
            const responseRecipe = await this.callModel(recipePrompt);

            const recipeText: string = this.extractTextFromModelResponse(responseRecipe);
            const metadataPrompt: string = this.getRecipeMetadataPrompt(recipeText);
            const responseMetadata = await this.callModel(metadataPrompt);
            const metadataRawJson: string = this.extractTextFromModelResponse(responseMetadata);
            const metadata: any = JSON.parse(metadataRawJson);

            const recipe: HydratedDocument<IRecipe> | null = await this._mongoModel.create(
                new RecipeModel({
                    product: product_name,
                    ingredients: metadata.ingredients,
                    recipe_name: metadata.title,
                    recipe_text: recipeText,
                    total_calories: metadata.total_calories,
                    total_protein: metadata.total_protein,
                    total_fat: metadata.total_fat,
                    total_portions: metadata.total_portions,
                    avg_cost: metadata.avg_cost
                })
            );

            res.status(200).send({ recipe });
        } catch (error: any) {
            res.status(400).send({ code: error.code, message: error.message });
        }
    }
}

export default ChatGptController;
