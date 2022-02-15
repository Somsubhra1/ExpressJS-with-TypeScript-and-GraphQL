import { CreateUserInput, LoginInput } from "./../schema/user.schema";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../schema/user.schema";
import UserService from "../service/user.service";
import Context from "../types/context";

@Resolver() // lets graphql know this is a resolver
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User) // mutation means record updating
  createUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => String) // returns JWT token
  login(@Arg("input") input: LoginInput, @Ctx() context: Context) {
    return this.userService.login(input, context);
  }

  @Query(() => User) // query means any record fetching
  me(@Ctx() context: Context) {
    // console.log(context);

    return context.user;
  }
}
