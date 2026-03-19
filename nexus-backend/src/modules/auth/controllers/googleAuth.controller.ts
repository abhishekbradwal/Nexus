import { Request, Response } from "express";
import { google } from "googleapis";
import { googleConfig } from "../../../config/google.config";
import { GoogleAuthService } from "../services/googleAuth.service";
import { successResponse } from "../../../common/utils/response";
import { STATUS_CODES } from "../../../config/constants";
import { BadRequestError } from "../../../common/errors/BadRequestError";

const googleAuthService = new GoogleAuthService();

const oauth2Client = new google.auth.OAuth2(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.callbackURL
);

export const googleAuthUrl = async (req: Request, res: Response) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  return successResponse(
    res,
    { authUrl },
    "Google auth URL generated",
    STATUS_CODES.OK
  );
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    throw new BadRequestError("Authorization code is required");
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  if (!data.email || !data.name) {
    throw new BadRequestError("Failed to retrieve user information from Google");
  }

  const result = await googleAuthService.googleAuth({
    email: data.email,
    name: data.name,
    googleId: data.id!,
    picture: data.picture || undefined,
  });

  return successResponse(res, result.data, result.message, STATUS_CODES.OK);
};
