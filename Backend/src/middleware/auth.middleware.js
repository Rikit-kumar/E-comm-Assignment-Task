import { verifyAccessToken } from "../util/auth.util.js";

export const authentication = (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      message: "Access token not found in the reqest header",
    });
  }

  try {
    const decoded = verifyAccessToken(accessToken);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized, Invalid or expire access token",
    });
  }
};
