import { resolvers } from "./resolvers/index";
import dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server/node_modules/apollo-server-core";
import { connectToMongo } from "./utils/mongo";
import { verifyJwt } from "./utils/jwt";
import { User } from "./schema/user.schema";
import Context from "./types/context";

async function bootstrap() {
  // Build schema
  const schema = await buildSchema({
    resolvers,
    // authChecker,
  });

  // Init express

  const app = express();

  app.use(cookieParser());

  // create the apollo server
  const server = new ApolloServer({
    schema,

    context: (ctx: Context) => {
      // console.log(ctx);

      const context = ctx;

      if (ctx.req.cookies.accessToken) {
        const user = verifyJwt<User>(ctx.req.cookies.accessToken);

        context.user = user;
      }
      return context;
    },
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault
        : ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });

  // start server

  await server.start();

  // apply middlewares
  server.applyMiddleware({ app });

  // listen app
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
  });

  // connect to db

  connectToMongo();
}

bootstrap();
