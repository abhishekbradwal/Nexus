import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../models/user.models";
import { UserCredential } from "../models/userCredentials.model";
import { UserRole } from "../models/userRoles.models";
import { Role } from "../models/roles.models";
import { ValidationError } from "../../../common/errors/ValidationError";
import { BadRequestError } from "../../../common/errors/BadRequestError";
import { serviceResponse } from "../../../common/utils/response";

interface LoginData {
  email: string;
  password: string;
}

export class LoginService {
  async login(data: LoginData) {
    const { email, password } = data;

    this.validateLoginData(email, password);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    if (user.getDataValue("status") !== "ACTIVE") {
      throw new BadRequestError("Account is not active");
    }

    const credential = await UserCredential.findOne({
      where: { user_id: user.getDataValue("id") },
    });

    if (!credential) {
      throw new BadRequestError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      credential.getDataValue("password_hash")
    );

    if (!isPasswordValid) {
      throw new BadRequestError("Invalid email or password");
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
      "Login successful"
    );
  }

  private validateLoginData(email: string, password: string) {
    const errors: string[] = [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Valid email is required");
    }

    if (!password) {
      errors.push("Password is required");
    }

    if (errors.length > 0) {
      throw new ValidationError("Validation failed", errors);
    }
  }
}
