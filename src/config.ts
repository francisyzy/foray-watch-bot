import * as dotenv from "dotenv";

dotenv.config();

const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  API_TOKEN: process.env.API_TOKEN,
  LOG_GROUP_ID: process.env.LOG_GROUP_ID,
};

export default config;
