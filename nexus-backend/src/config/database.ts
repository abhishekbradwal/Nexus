import { Sequelize } from "sequelize-typescript";


export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false
});

