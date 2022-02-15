import {
  RegisterUserInput,
  LoginInput,
  AuthOutput,
  UpdateProfileInput,
} from "./../schema/user.schema";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../schema/user.schema";
import UserService from "../service/user.service";
import Context from "../types/context";

@Resolver() // lets graphql know this is a resolver
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => AuthOutput) // mutation means record updating
  register(@Arg("input") input: RegisterUserInput, @Ctx() context: Context) {
    return this.userService.createUser(input, context);
  }

  @Mutation(() => AuthOutput) // returns JWT token
  login(@Arg("input") input: LoginInput, @Ctx() context: Context) {
    return this.userService.login(input, context);
  }

  @Query(() => User, { nullable: true }) // query means any record fetching
  profile(@Ctx() context: Context) {
    // console.log(context);

    return context.user;
  }

  @Authorized()
  @Mutation(() => User)
  updateProfile(
    @Arg("input") input: UpdateProfileInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.userService.updateProfile(input, user);
  }

  @Mutation(() => String)
  logout(@Ctx() context: Context) {
    context.req.cookies.accessToken = null;

    return "Logged out";
  }
}
