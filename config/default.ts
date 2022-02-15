import dotenv from "dotenv";
dotenv.config();

export default {
  dbUri: process.env.dbURI,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
};
