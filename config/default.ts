import dotenv from "dotenv";
dotenv.config();

export default {
  dbUri: process.env.dbURI,
};
