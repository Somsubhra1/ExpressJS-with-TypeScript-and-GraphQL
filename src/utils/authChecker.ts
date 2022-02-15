import { AuthChecker } from "type-graphql";
import Context from "../types/context";

// function to tell graphql if the request is authorised or not

const authChecker: AuthChecker<Context> = ({ root, args, context, info }) => {
  return !!context.user;
};

export default authChecker;
