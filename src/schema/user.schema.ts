import { prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType() // lets graphql know this is an object type for a resolver
export class User {
  @Field(() => String) // this is graphql type
  _id: string; // this is typescript data type

  @Field(() => String)
  @prop({ required: true }) // this is mongodb properties
  name: string;

  @Field(() => String)
  @prop({ required: true }) // this is mongodb properties
  email: string;

  @prop({ required: true }) // this is mongodb properties
  password: string;
}
