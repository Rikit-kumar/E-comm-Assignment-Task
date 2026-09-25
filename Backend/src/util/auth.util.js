import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const generateToken = ({ id }) => {
  const accessToken = jwt.sign({ id }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
