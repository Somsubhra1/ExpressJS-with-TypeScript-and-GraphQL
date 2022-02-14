import { getModelForClass, prop, pre } from "@typegoose/typegoose";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";

@pre<User>("save", async function () {
  // check if password is being modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(this.password, salt);

  this.password = hash;
})
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

export const UserModel = getModelForClass(User); // automatically generates model from class

@InputType() // inputtype should be different than object type. graphql recommends it
export class CreateUserInput {
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
