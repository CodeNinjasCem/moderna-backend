import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import { RecipeModel } from "../modelsNOSQL/Recipe";
import ProductController from "./ProductController";
import { ProductModel } from "../modelsNOSQL/product";

class RecipeController extends AbstractController {
  protected validateBody(type: any) {
    throw new Error("Method not implemented yet.");
  }
  private static instance: RecipeController;

  public static getInstance(): AbstractController {
    if (!this.instance) {
      this.instance = new RecipeController("recipe");
    }
    return this.instance;
  }
  protected initRoutes(): void {
    this.router.get(
      "/recommended/:name",
      this.getRecommendedRecipes.bind(this)
    );
    this.router.get("/popular", this.getPopularRecipe.bind(this));
    this.router.get("/weekPlan/:days", this.getWeekPlan.bind(this));
  }
  private async getRecommendedRecipes(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      let product_name = req.params.name;
      let product = await ProductModel.find({ name: product_name });
      let id_name = product[0]._id;
      let recipes = await RecipeModel.aggregate([
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              product_id: id_name,
            },
        },
        {
          $limit:
            /**
             * Provide the number of documents to limit.
             */
            5,
        },
      ]);
      res.status(200).send({
        status: "Success",
        data: recipes,
      });
    } catch (errorMessage) {
      res.status(400).send({
        status: "Fail",
        message: errorMessage,
      });
    }
  }

  private async getPopularRecipe(_req: Request, res: Response): Promise<void> {
    try {
      const most_popular = await RecipeModel.aggregate([
        {
          $group:
            /**
             * _id: The id of the group.
             * fieldN: The first field name.
             */
            {
              _id: "$product_id",
              count: {
                $sum: 1,
              },
            },
        },
        {
          $sort:
            /**
             * Provide any number of field/order pairs.
             */
            {
              count: -1,
            },
        },
        {
          $limit:
            /**
             * Provide the number of documents to limit.
             */
            3,
        },
        {
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: "products",
              localField: "_id",
              foreignField: "_id",
              as: "products",
            },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: "$products",
            },
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              name: "$products.name",
            },
        },
      ]);

      const random_num = Math.floor(Math.random() * most_popular.length);
      let product_name = most_popular[random_num].name;
      let product = await ProductModel.find({ name: product_name });
      let id_name = product[0]._id;
      let recipes = await RecipeModel.aggregate([
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              product_id: id_name,
            },
        },
        {
          $limit:
            /**
             * Provide the number of documents to limit.
             */
            5,
        },
      ]);

      res.status(200).send({
        status: "Success",
        data: recipes,
      });
    } catch (errorMessage) {
      res.status(400).send({
        status: "Fail",
        message: errorMessage,
      });
    }
  }

  private async getWeekPlan(req: Request, res: Response): Promise<void> {
    const { days } = req.params;
    try {
      const weekPlan = [];

      for (let i = 0; i < Number(days); i++) {
        const recipes = await this.returnPopularRecipes();
        weekPlan.push(recipes);
      }


      res.status(200).send({
        status: "Success",
        data: weekPlan,
      });
    } catch (errorMessage) {
      res.status(400).send({
        status: "Fail",
        message: errorMessage,
      });
    }
  }

  private async returnPopularRecipes(){
    try {
      const most_popular = await RecipeModel.aggregate([
        {
          $group:
            /**
             * _id: The id of the group.
             * fieldN: The first field name.
             */
            {
              _id: "$product_id",
              count: {
                $sum: 1,
              },
            },
        },
        {
          $sort:
            /**
             * Provide any number of field/order pairs.
             */
            {
              count: -1,
            },
        },
        {
          $limit:
            /**
             * Provide the number of documents to limit.
             */
            3,
        },
        {
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: "products",
              localField: "_id",
              foreignField: "_id",
              as: "products",
            },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: "$products",
            },
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              name: "$products.name",
            },
        },
      ]);

      const random_num = Math.floor(Math.random() * most_popular.length);
      let product_name = most_popular[random_num].name;
      let product = await ProductModel.find({ name: product_name });
      let id_name = product[0]._id;
      let recipes = await RecipeModel.aggregate([
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              product_id: id_name,
            },
        },
        {
          $limit:
            /**
             * Provide the number of documents to limit.
             */
            5,
        },
      ]);

      return recipes;
    } catch (errorMessage) {
      return [];
    }
  }
}

export default RecipeController;
