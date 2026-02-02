import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database";
export const UserRole = sequelize.define(
  "UserRole",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    assigned_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    assigned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_roles",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "role_id"],
      },
    ],
  }
);
