import ProductResolver from "./product.resolver";
import UserResolver from "./user.resolver";

export const resolvers = [UserResolver, ProductResolver] as const;
