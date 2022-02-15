import { CreateProductInput, Product } from "./../schema/product.schema";
import { Arg, Ctx, Mutation } from "type-graphql";
import ProductService from "../service/product.service";
import Context from "../types/context";

export default class ProductResolver {
  constructor(private productService: ProductService) {
    this.productService = new ProductService();
  }

  @Mutation(() => Product)
  createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() context: Context
  ) {
    const user = context.user!; // ! sign guarantees that user is not going to be null
    return this.productService.createProduct({ ...input, user: user?._id });
  }
}
