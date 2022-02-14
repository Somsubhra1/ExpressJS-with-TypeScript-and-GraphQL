import { CreateUserInput } from "./../schema/user.schema";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../schema/user.schema";
import UserService from "../service/user.service";

@Resolver() // lets graphql know this is a resolver
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User) // mutation means record updating
  createUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Query(() => User) // query means any record fetching
  me() {
    return {
      _id: "123",
      name: "a@a.com",
      email: "a",
    };
  }
}
