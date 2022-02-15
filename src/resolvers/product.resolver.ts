import {
  CreateProductInput,
  GetProductInput,
  Product,
  UpdateProductInput,
} from "./../schema/product.schema";
import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql";
import ProductService from "../service/product.service";
import Context from "../types/context";

export default class ProductResolver {
  constructor(private productService: ProductService) {
    this.productService = new ProductService();
  }

  @Authorized() // only calls this mutation if the user is authorised
  @Mutation(() => Product)
  createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() context: Context
  ) {
    const user = context.user!; // ! sign guarantees that user is not going to be null
    return this.productService.createProduct({ ...input, user: user?._id });
  }

  @Query(() => [Product])
  products() {
    return this.productService.findProducts();
  }

  @Query(() => Product)
  product(@Arg("input") input: GetProductInput) {
    return this.productService.findSingleProduct(input);
  }

  @Authorized()
  @Mutation(() => Product)
  updateProduct(
    @Arg("input") input: UpdateProductInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.productService.updateProduct(input, user);
  }

  @Authorized()
  @Mutation(() => String)
  deleteProduct(@Arg("input") input: GetProductInput, @Ctx() context: Context) {
    const user = context.user!;
    return this.productService.deleteProduct(input, user);
  }
}
