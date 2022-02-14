import { Query, Resolver } from "type-graphql";
import { User } from "../schema/user.schema";

@Resolver() // lets graphql know this is a resolver
export default class UserResolver {
  @Query(() => User)
  me() {
    return {
      _id: "123",
      name: "a@a.com",
      email: "a",
    };
  }
}
