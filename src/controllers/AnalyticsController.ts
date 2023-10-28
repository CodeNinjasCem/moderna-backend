import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import { Model, HydratedDocument } from "mongoose";
import { ProductModel } from "../modelsNOSQL/product";
import { RecipeModel } from "../modelsNOSQL/Recipe";

class AnalyticsController extends AbstractController {
    protected validateBody(type: any) {
        throw new Error("Method not implementes.");
    }
    private static instance: AnalyticsController;

    public static getInstance(): AbstractController {
        if(!this.instance) {
            this.instance = new AnalyticsController("analytics");
        }
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.get("/product/popular", this.getMostPopularProduct.bind(this));
        this.router.get("/product/unpopular", this.getLessPopularProduct.bind(this));
    }
    private async getMostPopularProduct(_req: Request, res: Response): Promise<void>{
        try {
            const result = await RecipeModel.aggregate([
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
                    4,
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
                      img_link: "$products.img_link"
                    },
                },

              ]);
              res.status(200).send({
                status: "Success",
                data: result
              })

        }catch(errorMessage){
            res.status(400).send({
                status: "Fail",
                message: errorMessage
            });
        }

    }

    private async getLessPopularProduct(_req: Request, res: Response): Promise<void>{
         try {
            const result = await RecipeModel.aggregate([
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
                      count: 1,
                    },
                },
                {
                  $limit:
                    /**
                     * Provide the number of documents to limit.
                     */
                    4,
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
                      img_link: "$products.img_link"
                    },
                },
              ]);
              res.status(200).send({
                status: "Success",
                data: result
              })



        }catch(errorMessage){
            res.status(400).send({
                status: "Fail askjfkasd",
                message: errorMessage
            });
        }
    }
}


export default AnalyticsController;