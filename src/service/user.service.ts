import bcrypt from "bcrypt";
import { ApolloError } from "apollo-server-express";
import {
  RegisterUserInput,
  LoginInput,
  UserModel,
  UpdateProfileInput,
  User,
} from "../schema/user.schema";
import Context from "../types/context";
import { signJwt } from "../utils/jwt";

class UserService {
  async createUser(input: RegisterUserInput, context: Context) {
    // call user model to create user

    const user = await UserModel.create(input);

    const payload = {
      name: user.name,
      email: user.email,
      _id: user._id,
    };

    // sign a jwt token
    const token = signJwt(payload);
    // set cookie for jwt
    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // return jwt
    return { ...payload, token };
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

    const payload = {
      name: user.name,
      email: user.email,
      _id: user._id,
    };

    // sign a jwt token
    const token = signJwt(payload);
    // set cookie for jwt
    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // return jwt
    return { ...payload, token };
  }

  async updateProfile(input: UpdateProfileInput, user: User) {
    return await UserModel.findOneAndUpdate({ email: user.email }, input, {
      new: true,
    })
      .select({ password: 0 })
      .lean();
  }
}

export default UserService;
