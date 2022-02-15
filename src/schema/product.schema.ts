import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { IsNumber, MaxLength, Min, MinLength } from "class-validator";
import { customAlphabet } from "nanoid";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./user.schema";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz12345678990", 10);

@ObjectType()
@index({ productId: 1 })
export class Product {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  description: string;

  @Field(() => String)
  @prop({ required: true })
  price: string;

  @Field(() => String)
  @prop({ required: true, default: () => `product_${nanoid()}`, unique: true })
  productId: string;
}

export const ProductModel = getModelForClass<typeof Product>(Product);

@InputType()
export class CreateProductInput {
  @Field() // return type on fields can be omitted in inputtype
  name: string;

  @MinLength(50, { message: "Description must be atleast 50 characters" })
  @MaxLength(1000, {
    message: "Description must not be more than 1000 characters",
  })
  @Field()
  description: string;

  @IsNumber()
  @Min(1)
  @Field()
  price: number;
}

@InputType()
export class GetProductInput {
  @Field()
  productId: string;
}

@InputType()
export class UpdateProductInput {
  @Field()
  productId: string;

  @Field({ nullable: true }) // return type on fields can be omitted in inputtype
  name?: string;

  @MinLength(50, { message: "Description must be atleast 50 characters" })
  @MaxLength(1000, {
    message: "Description must not be more than 1000 characters",
  })
  @Field({ nullable: true })
  description?: string;

  @IsNumber()
  @Min(1)
  @Field({ nullable: true })
  price?: number;
}
