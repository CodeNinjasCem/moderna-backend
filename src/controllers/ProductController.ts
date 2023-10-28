import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import IProduct, { ProductModel } from "../modelsNOSQL/product"; 
import { Model, HydratedDocument } from "mongoose";

class ProductController extends AbstractController {
  protected validateBody(type: any) {
      throw new Error("Method not implemented.");
  }
  private static instance: ProductController;
  private readonly _model: Model<IProduct> = ProductModel;


  public static getInstance(): AbstractController {
    if (!this.instance) {
      this.instance = new ProductController("product");
    }
    return this.instance;
  }  

  protected initRoutes(): void {
    this.router.post("/register", this.registerProductRequest.bind(this));
    this.router.get("/getAll", this.getAllProducts.bind(this));
  }
  private async registerProductRequest(req: Request, res: Response): Promise<void>{
    let product: IProduct = req.body;
    try{
         await this._model.create(product);
         res.status(201).send({
          status: "Succes"
         })
    }catch(errorMessage) {
        res.status(400).send({
            status: "Fail",
            message: errorMessage
        });
    }
  }

  private async getAllProducts(_req: Request, res: Response): Promise<void> {
    try {
        const products: Array<IProduct> = await this._model.find({});
        res.status(200).send({
            status: "Success",
            results: products.length,
            data: {
                products: products
            }
        });
    }catch(errorMessage) {
        res.status(400).send({
            status: "Fail",
            message: errorMessage
        });
    }
  }

}


export default ProductController;
