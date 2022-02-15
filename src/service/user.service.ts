import bcrypt from "bcrypt";
import { ApolloError } from "apollo-server-express";
import { CreateUserInput, LoginInput, UserModel } from "../schema/user.schema";
import Context from "../types/context";
import { signJwt } from "../utils/jwt";

class UserService {
  async createUser(input: CreateUserInput) {
    // call user model to create user

    return UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
    const e = "Invalid email or password";
    // get the user by email
    const user = await UserModel.find().findByEmail(input.email).lean();

    if (!user) {
      throw new ApolloError(e);
    }

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new ApolloError(e);
    }

    // sign a jwt token
    const token = signJwt(user);
    // set cookie for jwt
    context.res.cookie("accessToken", {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // return jwt
    return token;
  }
}

export default UserService;
