import * as jwt from "jsonwebtoken";
import { sequelize } from "../../../config/database";
import { User } from "../../users/models/user.models";
import { UserRole } from "../../users/models/userRoles.models";
import { Role } from "../../users/models/roles.models";
import { ValidationError } from "../../../common/errors/ValidationError";
import { BadRequestError } from "../../../common/errors/BadRequestError";
import { serviceResponse } from "../../../common/utils/response";

interface GoogleAuthData {
  email: string;
  name: string;
  googleId: string;
  picture?: string;
}

export class GoogleAuthService {
  async googleAuth(data: GoogleAuthData) {
    const { email, name, googleId, picture } = data;

    this.validateGoogleAuthData(email, name, googleId);

    const transaction = await sequelize.transaction();

    try {
      let user = await User.findOne({ where: { email } });

      if (!user) {
        user = await User.create(
          { email, name, status: "ACTIVE" },
          { transaction }
        );

        const role = await Role.findOne({ where: { name: "USER" } });
        if (!role) {
          throw new BadRequestError("Default role not found");
        }

        await UserRole.create(
          {
            user_id: user.getDataValue("id"),
            role_id: role.getDataValue("id"),
            assigned_by: null,
          },
          { transaction }
        );
      } else {
        if (user.getDataValue("status") !== "ACTIVE") {
          throw new BadRequestError("Account is not active");
        }
      }

      const userRole = await UserRole.findOne({
        where: { user_id: user.getDataValue("id") },
      });

      const role = userRole
        ? await Role.findOne({ where: { id: userRole.getDataValue("role_id") } })
        : null;

      const token = jwt.sign(
        {
          userId: user.getDataValue("id"),
          email: user.getDataValue("email"),
          role: role?.getDataValue("name") || "USER",
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" } as jwt.SignOptions
      );

      await transaction.commit();

      return serviceResponse(
        {
          user: {
            id: user.getDataValue("id"),
            email: user.getDataValue("email"),
            name: user.getDataValue("name"),
            status: user.getDataValue("status"),
            role: role?.getDataValue("name") || "USER",
          },
          token,
        },
        "Google authentication successful"
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private validateGoogleAuthData(email: string, name: string, googleId: string) {
    const errors: string[] = [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Valid email is required");
    }

    if (!name || name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    if (!googleId) {
      errors.push("Google ID is required");
    }

    if (errors.length > 0) {
      throw new ValidationError("Validation failed", errors);
    }
  }
}
