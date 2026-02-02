import * as bcrypt from "bcrypt";
import { sequelize } from "../../../config/database";
import { User } from "../models/user.models";
import { UserCredential } from "../models/userCredentials.model";
import { UserRole } from "../models/userRoles.models";
import { Role } from "../models/roles.models";
import { ValidationError } from "../../../common/errors/ValidationError";
import { BadRequestError } from "../../../common/errors/BadRequestError";
import { serviceResponse } from "../../../common/utils/response";

interface SignupData {
  email: string;
  name: string;
  password: string;
  roleName?: string;
}

export class UserService {
  async signup(data: SignupData) {
    const { email, name, password, roleName = "USER" } = data;

    this.validateSignupData(email, name, password);

    const transaction = await sequelize.transaction();

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new BadRequestError("Email already registered");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create(
        { email, name, status: "ACTIVE" },
        { transaction }
      );

      await UserCredential.create(
        { user_id: user.getDataValue("id"), password_hash: passwordHash },
        { transaction }
      );

      const role = await Role.findOne({ where: { name: roleName } });
      if (!role) {
        throw new BadRequestError(`Role ${roleName} not found`);
      }

      await UserRole.create(
        {
          user_id: user.getDataValue("id"),
          role_id: role.getDataValue("id"),
          assigned_by: null,
        },
        { transaction }
      );

      await transaction.commit();

      return serviceResponse(
        {
          id: user.getDataValue("id"),
          email: user.getDataValue("email"),
          name: user.getDataValue("name"),
          status: user.getDataValue("status"),
        },
        "User registered successfully"
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private validateSignupData(email: string, name: string, password: string) {
    const errors: string[] = [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Valid email is required");
    }

    if (!name || name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    if (!password || password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (errors.length > 0) {
      throw new ValidationError("Validation failed", errors);
    }
  }
}
