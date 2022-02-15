import {
  CreateProductInput,
  GetProductInput,
  ProductModel,
  UpdateProductInput,
} from "../schema/product.schema";
import { User } from "../schema/user.schema";

class ProductService {
  async createProduct(input: CreateProductInput & { user: User["_id"] }) {
    return ProductModel.create(input);
  }

  async findProducts() {
    //   Pagination logic
    return ProductModel.find().lean();
  }

  async findMyProducts(user: User) {
    //   Pagination logic
    return ProductModel.find({ user: user._id }).lean();
  }

  async findSingleProduct(input: GetProductInput) {
    return ProductModel.findOne(input).lean();
  }

  async updateProduct(input: UpdateProductInput, user: User) {
    return ProductModel.findOneAndUpdate(
      {
        productId: input.productId,
        user: user._id,
      },
      input,
      { new: true }
    ).lean();
  }

  async deleteProduct(input: GetProductInput, user: User) {
    await ProductModel.deleteOne({
      productId: input.productId,
      user: user._id,
    });

    return "Successfully deleted";
  }
}

export default ProductService;
