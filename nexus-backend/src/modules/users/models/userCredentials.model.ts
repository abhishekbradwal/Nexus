import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database";
import { User } from "./user.models";

export const UserCredential = sequelize.define(
  "UserCredential",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // one credential per user
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "user_credentials",
    timestamps: true,
    underscored: true,
  }
);
