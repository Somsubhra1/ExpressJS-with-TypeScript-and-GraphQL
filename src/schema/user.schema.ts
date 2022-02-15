import {
  getModelForClass,
  prop,
  pre,
  ReturnModelType,
  QueryMethod,
  index,
} from "@typegoose/typegoose";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";
import { AsQueryMethod } from "@typegoose/typegoose/lib/types";

// custom db method
function findByEmail(
  this: ReturnModelType<typeof User, QueryHelpers>,
  email: User["email"]
) {
  return this.findOne({ email });
}

interface QueryHelpers {
  findByEmail: AsQueryMethod<typeof findByEmail>;
}

@pre<User>("save", async function () {
  // check if password is being modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(this.password, salt);

  this.password = hash;
})
@QueryMethod(findByEmail) // invoking our custom method to the user schema
@index({ email: 1 }) // adding index for email
@ObjectType() // lets graphql know this is an object type for a resolver
export class User {
  @Field(() => String) // this is graphql type
  _id: string; // this is typescript data type

  @Field(() => String)
  @prop({ required: true }) // this is mongodb properties
  name: string;

  @Field(() => String)
  @prop({ required: true, unique: true }) // this is mongodb properties
  email: string;

  @prop({ required: true }) // this is mongodb properties
  password: string;
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User); // automatically generates model from class along with the custom method

@InputType() // inputtype should be different than object type. graphql recommends it
export class RegisterUserInput {
  @Field(() => String)
  name: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, {
    message: "Password must be atleast 6 characters long",
  })
  @MaxLength(50, {
    message: "Password must be maximum 50 characters long",
  })
  @Field(() => String)
  password: string;
}

@InputType()
export class LoginInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
